export type GalleryPhoto = { id: number; image_url: string; description: string; };
export type ProjectItem = { id: number; title: string; description: string; image_url: string; roles: string; tools: string; year: string; link?: string; github_url?: string; figma_url?: string; };

export type ExperienceItem = { id: number; company: string; role: string; start_date: string; end_date: string; description: string; };
export type EducationItem = { id: number; institution: string; degree: string; start_year: string; end_year: string; description: string; logo?: string; };
export type CertificateItem = { id: number; title: string; issuer: string; date: string; image_url: string; credential_id: string; };