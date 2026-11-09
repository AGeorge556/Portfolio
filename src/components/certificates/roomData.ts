import { certifications, type CertificationGroup } from "../../data";

/** One framed certificate on a wall. Built from `certifications` in data.ts. */
export type RoomCertificate = {
  id: string;
  title: string;
  issuer: string;
  date: string;
  /** Full-res image, loaded only in the lightbox. */
  image: string;
  /** Wall thumbnail (800px) and its phone-sized sibling (400px). */
  thumb: string;
  thumbSmall: string;
  credentialUrl?: string;
  honors: boolean;
  /** The program certificate is hung larger, in the centre of its wall. */
  featured: boolean;
};

export type RoomWall = {
  id: string;
  label: string;
  program: string;
  issuer: string;
  credentialUrl?: string;
  certificates: RoomCertificate[];
};

export const certificateAlt = (cert: RoomCertificate) => `${cert.title} certificate from ${cert.issuer}`;

/** Width / height of every certificate image (800×618 and 1600×1237). */
export const CERT_ASPECT = 800 / 618;

const variant = (image: string, size: 400 | 1600) => image.replace(/\.webp$/, `-${size}.webp`);

function toWall(group: CertificationGroup): RoomWall {
  const courses: RoomCertificate[] = group.courses.map((course) => ({
    id: course.pdf,
    title: course.title,
    issuer: group.issuer,
    date: course.date,
    image: variant(course.image, 1600),
    thumb: course.image,
    thumbSmall: variant(course.image, 400),
    credentialUrl: course.verify,
    honors: course.honors,
    featured: false,
  }));

  if (!group.image) return wallOf(group, courses);

  const program: RoomCertificate = {
    id: group.id,
    title: group.program,
    issuer: group.issuer,
    date: group.date,
    image: variant(group.image, 1600),
    thumb: group.image,
    thumbSmall: variant(group.image, 400),
    credentialUrl: group.credential,
    honors: false,
    featured: true,
  };
  // The program certificate leads the list (first in the phone gallery and the lightbox).
  return wallOf(group, [program, ...courses]);
}

function wallOf(group: CertificationGroup, certificates: RoomCertificate[]): RoomWall {
  return {
    id: group.id,
    label: group.wall,
    program: group.program,
    issuer: group.issuer,
    credentialUrl: group.credential,
    certificates,
  };
}

export const walls: RoomWall[] = certifications.map(toWall);
