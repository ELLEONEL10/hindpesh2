export interface Lesson {
  id: string | number;
  number: number;
  title: string;
  description: string;
  youtubeId: string; // The video ID, not full URL
  audioFileId: string; // ID for backend stream
  pdfFileId: string; // ID for download
  duration: string;
  thumbnail?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

// API response format (snake_case)
export interface LessonAPIResponse {
  id: number;
  number: number;
  title: string;
  description: string;
  youtube_id: string;
  audio_file_id: string;
  pdf_file_id: string;
  duration: string;
  thumbnail?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Breadcrumb {
  label: string;
  path?: string;
}