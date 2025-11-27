import { Lesson } from './types';

// Mock data to simulate Backend API responses
export const MOCK_LESSONS: Lesson[] = [
  {
    id: '1',
    number: 1,
    title: 'مقدمة في الأساسيات',
    description: 'تعرف على الحروف العربية وكيفية نطقها بشكل صحيح مع أمثلة بسيطة.',
    youtubeId: 'dQw4w9WgXcQ', // Placeholder ID
    audioFileId: 'audio_001',
    pdfFileId: 'pdf_001',
    duration: '10:00',
  },
  {
    id: '2',
    number: 2,
    title: 'فهم المفاهيم الأساسية',
    description: 'شرح قواعد النحو البسيطة وتكوين الجمل الاسمية والفعلية.',
    youtubeId: 'M7lc1UVf-VE',
    audioFileId: 'audio_002',
    pdfFileId: 'pdf_002',
    duration: '15:30',
  },
  {
    id: '3',
    number: 3,
    title: 'التطبيق العملي',
    description: 'تمارين عملية على القراءة والكتابة لتعزيز المهارات المكتسبة.',
    youtubeId: 'ScMzIvxBSi4',
    audioFileId: 'audio_003',
    pdfFileId: 'pdf_003',
    duration: '12:45',
  },
  {
    id: '4',
    number: 4,
    title: 'حل المشاكل المتقدمة',
    description: 'استراتيجيات متقدمة لفهم النصوص المعقدة وتحليلها.',
    youtubeId: 'L_jWHffIx5E',
    audioFileId: 'audio_004',
    pdfFileId: 'pdf_004',
    duration: '20:00',
  },
  {
    id: '5',
    number: 5,
    title: 'المراجعة والتقييم',
    description: 'مراجعة شاملة لجميع الدروس السابقة مع اختبار قصير.',
    youtubeId: 'tgbNymZ7vqY',
    audioFileId: 'audio_005',
    pdfFileId: 'pdf_005',
    duration: '08:15',
  },
];

export const APP_NAME_AR = "هندبيش";
export const APP_NAME_EN = "HindPesh";
export const SLOGAN = "منصتك التفاعلية لتعلم العربية";
