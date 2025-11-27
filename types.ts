export interface Lesson {
  id: string;
  number: number;
  title: string;
  description: string;
  youtubeId: string; // The video ID, not full URL
  audioFileId: string; // ID for backend stream
  pdfFileId: string; // ID for download
  duration: string;
  thumbnail?: string;
}

export interface Breadcrumb {
  label: string;
  path?: string;
}