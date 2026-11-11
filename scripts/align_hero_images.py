"""Align the hero cursor-lens portraits so they share one canvas and line up exactly.

Measures how far hero-reveal.webp (the cyborg portrait) is displaced from hero-top.webp
(the base photo) on the half of the face and hair that is the same photo in both, warps the
reveal onto the base, crops both to one shared box, and feathers the bottom and the left and
right edges to transparent so the shoulder cuts disappear. The base is never resampled.
Re-running on already-aligned files prints "already aligned" and writes nothing.

Usage (from the repo root): python scripts/align_hero_images.py [overlay-check.png]
Requires: pip install pillow numpy
"""
import io
import sys
from pathlib import Path

import numpy as np
from numpy.lib.stride_tricks import sliding_window_view
from PIL import Image

BASE = Path("public/assets/hero-top.webp")
REVEAL = Path("public/assets/hero-reveal.webp")
# Comparable region as fractions of the image (valid before and after the crop): the viewer's right half of face and hair.
REGION = (0.52, 0.12, 0.70, 0.50)
PATCH, STEP, SEARCH, MIN_PEAK, MIN_PATCHES = 56, 40, 30, 0.85, 8
SCALE_TOLERANCE, OUTLIER = 0.003, 2.0
TOP_MARGIN = 8
FEATHER_BOTTOM, FEATHER_SIDE = 0.20, 0.06
MAX_EDGE_ALPHA, MAX_RESIDUAL = 8, 1.0


def gray(image: Image.Image) -> np.ndarray:
    return np.asarray(image.convert("RGB"), np.float32) @ np.array([0.299, 0.587, 0.114], np.float32)


def opaque_box(image: Image.Image) -> tuple[int, int, int, int]:
    """(left, top, right, bottom) of the alpha > 128 area, right and bottom exclusive."""
    mask = np.asarray(image)[..., 3] > 128
    cols, rows = np.flatnonzero(mask.any(axis=0)), np.flatnonzero(mask.any(axis=1))
    return int(cols[0]), int(rows[0]), int(cols[-1]) + 1, int(rows[-1]) + 1


def subpixel(minus: float, peak: float, plus: float) -> float:
    denominator = minus - 2 * peak + plus
    return 0.0 if denominator == 0 else 0.5 * (minus - plus) / denominator


def measure(base: Image.Image, reveal: Image.Image) -> np.ndarray:
    """Rows of (centre x, centre y, dx, dy, peak) per patch: the reveal point matching base point c is c + (dx, dy)."""
    base_gray, reveal_gray = gray(base), gray(reveal)
    width, height = base.size
    x0, y0, x1, y1 = (round(f * s) for f, s in zip(REGION, (width, height, width, height)))
    rows = []
    for y in range(max(y0, SEARCH), min(y1, height - SEARCH) - PATCH + 1, STEP):
        for x in range(max(x0, SEARCH), min(x1, width - SEARCH) - PATCH + 1, STEP):
            template = base_gray[y:y + PATCH, x:x + PATCH].ravel()
            template = template - template.mean()
            template_norm = np.sqrt((template ** 2).sum())
            if template_norm < 1e-3 * PATCH * PATCH:
                continue
            windows = sliding_window_view(
                reveal_gray[y - SEARCH:y + PATCH + SEARCH, x - SEARCH:x + PATCH + SEARCH], (PATCH, PATCH)
            ).reshape(-1, PATCH * PATCH)
            windows = windows - windows.mean(axis=1, keepdims=True)
            denominator = np.sqrt((windows ** 2).sum(axis=1)) * template_norm
            scores = np.divide(windows @ template, denominator, out=np.zeros(len(windows), np.float32), where=denominator > 0)
            scores = scores.reshape(2 * SEARCH + 1, 2 * SEARCH + 1)
            j, i = np.unravel_index(scores.argmax(), scores.shape)
            peak = float(scores[j, i])
            if peak < MIN_PEAK:
                continue
            dx, dy = i - SEARCH, j - SEARCH
            if 0 < i < 2 * SEARCH:
                dx += subpixel(scores[j, i - 1], peak, scores[j, i + 1])
            if 0 < j < 2 * SEARCH:
                dy += subpixel(scores[j - 1, i], peak, scores[j + 1, i])
            rows.append((x + PATCH / 2, y + PATCH / 2, dx, dy, peak))
    return np.array(rows, np.float64).reshape(-1, 5)


def residual(base: Image.Image, reveal: Image.Image) -> tuple[float, float, int]:
    """Median |dx|, |dy| of the comparable patches and how many patches matched."""
    patches = measure(base, reveal)
    if len(patches) < MIN_PATCHES:
        return float("inf"), float("inf"), len(patches)
    return abs(float(np.median(patches[:, 2]))), abs(float(np.median(patches[:, 3]))), len(patches)


def edges_clear(image: Image.Image) -> bool:
    alpha = np.asarray(image)[..., 3]
    return all(line.max() <= MAX_EDGE_ALPHA for line in (alpha[:, 0], alpha[:, -1], alpha[-1, :]))


def fit(patches: np.ndarray) -> tuple[float, float, float, int]:
    """Similarity (scale, tx, ty) with reveal = scale * base + t, refitted without patches that miss by over OUTLIER px.
    Translation only when the scale is within tolerance of 1. Also returns how many patches the fit kept."""
    keep = np.ones(len(patches), bool)
    for _ in range(5):
        cx, cy, dx, dy = patches[keep, 0], patches[keep, 1], patches[keep, 2], patches[keep, 3]
        ones, zeros = np.ones_like(cx), np.zeros_like(cx)
        design = np.vstack([np.column_stack([cx, ones, zeros]), np.column_stack([cy, zeros, ones])])
        scale, tx, ty = np.linalg.lstsq(design, np.concatenate([cx + dx, cy + dy]), rcond=None)[0]
        miss = np.hypot(
            scale * patches[:, 0] + tx - patches[:, 0] - patches[:, 2],
            scale * patches[:, 1] + ty - patches[:, 1] - patches[:, 3],
        )
        kept = miss <= OUTLIER
        if (kept == keep).all() or kept.sum() < MIN_PATCHES:
            break
        keep = kept
    if abs(scale - 1) <= SCALE_TOLERANCE:
        return 1.0, float(np.median(dx)), float(np.median(dy)), int(keep.sum())
    return float(scale), float(tx), float(ty), int(keep.sum())


def warp(reveal: Image.Image, scale: float, tx: float, ty: float) -> Image.Image:
    # PIL samples at pixel centres (+0.5), so fold that into the offsets; premultiplied alpha keeps the rim from darkening.
    coefficients = (scale, 0, tx + 0.5 - 0.5 * scale, 0, scale, ty + 0.5 - 0.5 * scale)
    return reveal.convert("RGBa").transform(reveal.size, Image.AFFINE, coefficients, Image.BICUBIC).convert("RGBA")


def smoothstep(t: np.ndarray) -> np.ndarray:
    t = np.clip(t, 0, 1)
    return t * t * (3 - 2 * t)


def feather(image: Image.Image) -> Image.Image:
    """Multiply alpha by a mask that is 0 on the outermost bottom, left and right pixel lines and 1 inside the ramps."""
    width, height = image.size
    x, y = np.arange(width, dtype=np.float64), np.arange(height, dtype=np.float64)
    side = FEATHER_SIDE * width
    mask = (
        smoothstep((height - 1 - y) / (FEATHER_BOTTOM * height))[:, None]
        * smoothstep(x / side)[None, :]
        * smoothstep((width - 1 - x) / side)[None, :]
    )
    pixels = np.asarray(image).copy()
    pixels[..., 3] = np.round(pixels[..., 3] * mask).astype(np.uint8)
    return Image.fromarray(pixels, "RGBA")


def encode(image: Image.Image) -> bytes:
    buffer = io.BytesIO()
    image.save(buffer, "WEBP", quality=86, method=6)
    return buffer.getvalue()


def overlay(base: Image.Image, reveal: Image.Image) -> Image.Image:
    backdrop = Image.new("RGBA", base.size, (128, 128, 128, 255))
    return Image.blend(Image.alpha_composite(backdrop, base), Image.alpha_composite(backdrop, reveal), 0.5).convert("RGB")


def main(overlay_path: Path | None) -> int:
    """Returns the process exit code."""
    base, reveal = Image.open(BASE).convert("RGBA"), Image.open(REVEAL).convert("RGBA")
    if base.size == reveal.size and edges_clear(base) and edges_clear(reveal):
        dx, dy, _ = residual(base, reveal)
        if dx <= MAX_RESIDUAL and dy <= MAX_RESIDUAL:
            print("already aligned")
            return 0

    sizes_before = (BASE.stat().st_size, REVEAL.stat().st_size)
    patches = measure(base, reveal)
    if len(patches) < MIN_PATCHES:
        print(f"FAIL: only {len(patches)} patches matched (need {MIN_PATCHES})")
        return 1
    scale, tx, ty, kept = fit(patches)
    print(f"patches {len(patches)} (fit kept {kept})  scale {scale:.5f}  translation ({tx:.2f}, {ty:.2f})")
    reveal = warp(reveal, scale, tx, ty)

    (bl, bt, br, bb), (rl, rt, rr, rb) = opaque_box(base), opaque_box(reveal)
    box = (max(bl, rl), max(0, min(bt, rt) - TOP_MARGIN), min(br, rr), min(bb, rb))
    print("crop box", box, "size", (box[2] - box[0], box[3] - box[1]))
    base_bytes, reveal_bytes = encode(feather(base.crop(box))), encode(feather(reveal.crop(box)))

    base, reveal = Image.open(io.BytesIO(base_bytes)).convert("RGBA"), Image.open(io.BytesIO(reveal_bytes)).convert("RGBA")
    dx, dy, matched = residual(base, reveal)
    print("size before/after bytes: top", sizes_before[0], len(base_bytes), " reveal", sizes_before[1], len(reveal_bytes))
    print(f"size {base.size} vs {reveal.size}; edges clear {edges_clear(base)}/{edges_clear(reveal)}; "
          f"residual dx {dx:.2f} dy {dy:.2f} over {matched} patches")
    if overlay_path:
        overlay(base, reveal).save(overlay_path)
    if base.size != reveal.size or not (edges_clear(base) and edges_clear(reveal)) or max(dx, dy) > MAX_RESIDUAL:
        print("FAIL (files left unchanged)")
        return 1
    BASE.write_bytes(base_bytes)
    REVEAL.write_bytes(reveal_bytes)
    print("OK")
    return 0


if __name__ == "__main__":
    if len(sys.argv) > 2:
        sys.exit("usage: python scripts/align_hero_images.py [overlay-check.png]")
    sys.exit(main(Path(sys.argv[1]) if len(sys.argv) == 2 else None))
