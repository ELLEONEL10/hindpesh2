export interface AudioFile {
  id: number;
  title: string;
  google_drive_link: string;
  order: number;
  created_at: string;
}

export interface PDFFile {
  id: number;
  title: string;
  google_drive_link: string;
  order: number;
  created_at: string;
}

export interface Choice {
  id: number;
  text: string;
  is_correct: boolean;
  order: number;
}

export interface Question {
  id: number;
  text: string;
  order: number;
  choices: Choice[];
}

export interface LessonFAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface Lesson {
  id: string | number;
  number: number;
  title: string;
  description: string;
  youtubeId: string; // The video ID, not full URL
  duration: string;
  thumbnail?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  audioFiles: AudioFile[];
  pdfFiles: PDFFile[];
  questions?: Question[];
  faqs?: LessonFAQ[];
}

// API response format (snake_case)
export interface AudioFileAPIResponse {
  id: number;
  title: string;
  google_drive_link: string;
  order: number;
  created_at: string;
}

export interface PDFFileAPIResponse {
  id: number;
  title: string;
  google_drive_link: string;
  order: number;
  created_at: string;
}

export interface LessonAPIResponse {
  id: number;
  number: number;
  title: string;
  description: string;
  youtube_id: string;
  duration: string;
  thumbnail?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  audio_files: AudioFileAPIResponse[];
  pdf_files: PDFFileAPIResponse[];
  questions?: Question[];
  faqs?: LessonFAQ[];
}

export interface Breadcrumb {
  label: string;
  path?: string;
}