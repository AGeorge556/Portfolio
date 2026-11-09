"""Render the Certificates Room image sizes from each certificate PDF.

For every `name.pdf` that already has a `name.webp` (the 800px wall image), writes
`name-1600.webp` (lightbox) and `name-400.webp` (phone wall thumbnail).

Usage: python scripts/render_certificate_images.py public/assets/certificates
Requires: pip install pymupdf pillow
"""
import io
import sys
from pathlib import Path

import pymupdf
from PIL import Image


def main(folder: Path) -> int:
    """Returns how many certificates were rendered."""
    rendered = 0
    for pdf in sorted(folder.glob("*.pdf")):
        if not pdf.with_suffix(".webp").exists():
            print("skip (no matching .webp):", pdf.name)
            continue
        page = pymupdf.open(pdf)[0]
        zoom = 1600 / page.rect.width
        pix = page.get_pixmap(matrix=pymupdf.Matrix(zoom, zoom), alpha=False)
        image = Image.open(io.BytesIO(pix.tobytes("png"))).convert("RGB")
        image.save(pdf.with_name(f"{pdf.stem}-1600.webp"), "WEBP", quality=80, method=6)
        small = image.resize((400, round(400 * image.height / image.width)), Image.LANCZOS)
        small.save(pdf.with_name(f"{pdf.stem}-400.webp"), "WEBP", quality=78, method=6)
        print(pdf.stem, image.size, small.size)
        rendered += 1
    return rendered


if __name__ == "__main__":
    if len(sys.argv) != 2:
        sys.exit("usage: python scripts/render_certificate_images.py <certificates folder>")
    count = main(Path(sys.argv[1]))
    print(f"rendered {count} certificate(s)")
    if count == 0:
        sys.exit("nothing rendered: no PDF in that folder has a matching .webp")
