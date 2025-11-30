import { Lesson, LessonAPIResponse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Get authentication token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Helper function to convert API response (snake_case) to frontend format (camelCase)
const mapLessonFromAPI = (apiLesson: LessonAPIResponse): Lesson => {
  return {
    id: apiLesson.id.toString(),
    number: apiLesson.number,
    title: apiLesson.title,
    description: apiLesson.description,
    youtubeId: apiLesson.youtube_id || '',
    audioFileId: apiLesson.audio_file_id || '',
    pdfFileId: apiLesson.pdf_file_id || '',
    duration: apiLesson.duration,
    thumbnail: apiLesson.thumbnail,
    is_active: apiLesson.is_active,
    created_at: apiLesson.created_at,
    updated_at: apiLesson.updated_at,
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
  create: async (lesson: Omit<Lesson, 'id' | 'created_at' | 'updated_at' | 'is_active'>): Promise<Lesson> => {
    const apiLesson = await apiRequest<LessonAPIResponse>('/lessons/', {
      method: 'POST',
      body: JSON.stringify({
        number: lesson.number,
        title: lesson.title,
        description: lesson.description,
        youtube_id: lesson.youtubeId,
        audio_file_id: lesson.audioFileId,
        pdf_file_id: lesson.pdfFileId,
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
    if (lesson.audioFileId !== undefined) updateData.audio_file_id = lesson.audioFileId;
    if (lesson.pdfFileId !== undefined) updateData.pdf_file_id = lesson.pdfFileId;
    if (lesson.duration !== undefined) updateData.duration = lesson.duration;
    if (lesson.thumbnail !== undefined) updateData.thumbnail = lesson.thumbnail;
    if (lesson.is_active !== undefined) updateData.is_active = lesson.is_active;

    const apiLesson = await apiRequest<LessonAPIResponse>(`/lessons/${id}/`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
    return mapLessonFromAPI(apiLesson);
  },

  // Delete a lesson (authenticated)
  delete: async (id: string): Promise<void> => {
    await apiRequest(`/lessons/${id}/`, {
      method: 'DELETE',
    });
  },
};

