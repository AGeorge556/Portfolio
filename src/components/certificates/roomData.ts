import { certifications, type CertificationGroup } from "../../data";

/** One framed certificate on the wall. Built from `certifications` in data.ts. */
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
  /** Program certificates are hung larger than course certificates. */
  featured: boolean;
};

export const certificateAlt = (cert: RoomCertificate) => `${cert.title} certificate from ${cert.issuer}`;

/** Width / height of every certificate image (800×618 and 1600×1237). */
export const CERT_ASPECT = 800 / 618;

const variant = (image: string, size: 400 | 1600) => image.replace(/\.webp$/, `-${size}.webp`);

function programCertificate(group: CertificationGroup, image: string): RoomCertificate {
  return {
    id: group.id,
    title: group.program,
    issuer: group.issuer,
    date: group.date,
    image: variant(image, 1600),
    thumb: image,
    thumbSmall: variant(image, 400),
    credentialUrl: group.credential,
    honors: false,
    featured: true,
  };
}

function courseCertificates(group: CertificationGroup): RoomCertificate[] {
  return group.courses.map((course) => ({
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
}

/** Every certificate: each program's certificate (when it has one), then its courses. */
export const certificates: RoomCertificate[] = certifications.flatMap((group) => [
  ...(group.image ? [programCertificate(group, group.image)] : []),
  ...courseCertificates(group),
]);
