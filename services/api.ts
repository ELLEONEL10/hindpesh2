import { Lesson, LessonAPIResponse, AudioFile, AudioFileAPIResponse, PDFFile, PDFFileAPIResponse } from '../types';

// Use environment variable or default to relative path (works with Vite proxy)
// In production, set VITE_API_URL to your API domain
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Get authentication token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to convert API response (snake_case) to frontend format (camelCase)
const mapAudioFileFromAPI = (apiAudio: AudioFileAPIResponse): AudioFile => {
  return {
    id: apiAudio.id,
    title: apiAudio.title,
    google_drive_link: apiAudio.google_drive_link,
    order: apiAudio.order,
    created_at: apiAudio.created_at,
  };
};

const mapPDFFileFromAPI = (apiPDF: PDFFileAPIResponse): PDFFile => {
  return {
    id: apiPDF.id,
    title: apiPDF.title,
    google_drive_link: apiPDF.google_drive_link,
    order: apiPDF.order,
    created_at: apiPDF.created_at,
  };
};

const mapLessonFromAPI = (apiLesson: LessonAPIResponse): Lesson => {
  return {
    id: apiLesson.id.toString(),
    number: apiLesson.number,
    title: apiLesson.title,
    description: apiLesson.description,
    youtubeId: apiLesson.youtube_id || '',
    duration: apiLesson.duration,
    thumbnail: apiLesson.thumbnail,
    is_active: apiLesson.is_active,
    created_at: apiLesson.created_at,
    updated_at: apiLesson.updated_at,
    audioFiles: (apiLesson.audio_files || []).map(mapAudioFileFromAPI),
    pdfFiles: (apiLesson.pdf_files || []).map(mapPDFFileFromAPI),
  };
};

// Helper function for API requests
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Token ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    
    // Handle authentication errors specifically
    if (response.status === 401) {
      // Clear invalid token
      localStorage.removeItem('authToken');
      throw new Error(error.detail || error.error || 'Invalid token. Please login again.');
    }
    
    throw new Error(error.error || error.detail || `HTTP error! status: ${response.status}`);
  }

  // Handle empty responses (like DELETE)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  return response.json();
};

// Authentication API
export const authAPI = {
  login: async (username: string, password: string): Promise<{ token: string; user_id: number; username: string }> => {
    return apiRequest('/lessons/login/', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  },

  getCurrentUser: async (): Promise<{ user_id: number; username: string; is_staff: boolean }> => {
    return apiRequest('/lessons/me/');
  },
};

// Lessons API
export const lessonsAPI = {
  // Get all lessons (public)
  getAll: async (): Promise<Lesson[]> => {
    const response = await apiRequest<{ results?: LessonAPIResponse[] } | LessonAPIResponse[]>('/lessons/');
    const lessons = Array.isArray(response) ? response : (response.results || []);
    return lessons.map(mapLessonFromAPI);
  },

  // Get a single lesson by ID (public)
  getById: async (id: string): Promise<Lesson> => {
    const apiLesson = await apiRequest<LessonAPIResponse>(`/lessons/${id}/`);
    return mapLessonFromAPI(apiLesson);
  },

  // Create a new lesson (authenticated)
  create: async (lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at' | 'is_active' | 'audioFiles' | 'pdfFiles'>): Promise<Lesson> => {
    const apiLesson = await apiRequest<LessonAPIResponse>('/lessons/', {
      method: 'POST',
      body: JSON.stringify({
        number: lesson.number,
        title: lesson.title,
        description: lesson.description,
        youtube_id: lesson.youtubeId,
        duration: lesson.duration,
        thumbnail: lesson.thumbnail,
        is_active: true,
      }),
    });
    return mapLessonFromAPI(apiLesson);
  },

  // Update a lesson (authenticated)
  update: async (id: string, lesson: Partial<Lesson>): Promise<Lesson> => {
    const updateData: any = {};
    if (lesson.number !== undefined) updateData.number = lesson.number;
    if (lesson.title !== undefined) updateData.title = lesson.title;
    if (lesson.description !== undefined) updateData.description = lesson.description;
    if (lesson.youtubeId !== undefined) updateData.youtube_id = lesson.youtubeId;
    if (lesson.duration !== undefined) updateData.duration = lesson.duration;
    if (lesson.thumbnail !== undefined) updateData.thumbnail = lesson.thumbnail;
    if (lesson.is_active !== undefined) updateData.is_active = lesson.is_active;

    const apiLesson = await apiRequest<LessonAPIResponse>(`/lessons/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
    return mapLessonFromAPI(apiLesson);
  },

  // Add audio file to lesson
  addAudioFile: async (lessonId: string, audioFile: { title: string; google_drive_link: string; order?: number }): Promise<AudioFile> => {
    return apiRequest<AudioFileAPIResponse>(`/lessons/${lessonId}/add_audio/`, {
      method: 'POST',
      body: JSON.stringify({
        title: audioFile.title,
        google_drive_link: audioFile.google_drive_link,
        order: audioFile.order || 0,
      }),
    });
  },

  // Add PDF file to lesson
  addPDFFile: async (lessonId: string, pdfFile: { title: string; google_drive_link: string; order?: number }): Promise<PDFFile> => {
    return apiRequest<PDFFileAPIResponse>(`/lessons/${lessonId}/add_pdf/`, {
      method: 'POST',
      body: JSON.stringify({
        title: pdfFile.title,
        google_drive_link: pdfFile.google_drive_link,
        order: pdfFile.order || 0,
      }),
    });
  },

  // Delete audio file
  deleteAudioFile: async (audioFileId: number): Promise<void> => {
    await apiRequest(`/audio-files/${audioFileId}/`, {
      method: 'DELETE',
    });
  },

  // Delete PDF file
  deletePDFFile: async (pdfFileId: number): Promise<void> => {
    await apiRequest(`/pdf-files/${pdfFileId}/`, {
      method: 'DELETE',
    });
  },

  // Delete a lesson (authenticated)
  delete: async (id: string): Promise<void> => {
    await apiRequest(`/lessons/${id}/`, {
      method: 'DELETE',
    });
  },
};

