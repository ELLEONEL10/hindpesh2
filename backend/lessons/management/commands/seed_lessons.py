"""
Management command to seed initial lesson data
Usage: python manage.py seed_lessons
"""
from django.core.management.base import BaseCommand
from lessons.models import Lesson


class Command(BaseCommand):
    help = 'Seeds the database with initial lesson data'

    def handle(self, *args, **options):
        lessons_data = [
            {
                'number': 1,
                'title': 'مقدمة في الأساسيات',
                'description': 'تعرف على الحروف العربية وكيفية نطقها بشكل صحيح مع أمثلة بسيطة.',
                'youtube_id': 'dQw4w9WgXcQ',
                'audio_file_id': 'audio_001',
                'pdf_file_id': 'pdf_001',
                'duration': '10:00',
            },
            {
                'number': 2,
                'title': 'فهم المفاهيم الأساسية',
                'description': 'شرح قواعد النحو البسيطة وتكوين الجمل الاسمية والفعلية.',
                'youtube_id': 'M7lc1UVf-VE',
                'audio_file_id': 'audio_002',
                'pdf_file_id': 'pdf_002',
                'duration': '15:30',
            },
            {
                'number': 3,
                'title': 'التطبيق العملي',
                'description': 'تمارين عملية على القراءة والكتابة لتعزيز المهارات المكتسبة.',
                'youtube_id': 'ScMzIvxBSi4',
                'audio_file_id': 'audio_003',
                'pdf_file_id': 'pdf_003',
                'duration': '12:45',
            },
            {
                'number': 4,
                'title': 'حل المشاكل المتقدمة',
                'description': 'استراتيجيات متقدمة لفهم النصوص المعقدة وتحليلها.',
                'youtube_id': 'L_jWHffIx5E',
                'audio_file_id': 'audio_004',
                'pdf_file_id': 'pdf_004',
                'duration': '20:00',
            },
            {
                'number': 5,
                'title': 'المراجعة والتقييم',
                'description': 'مراجعة شاملة لجميع الدروس السابقة مع اختبار قصير.',
                'youtube_id': 'tgbNymZ7vqY',
                'audio_file_id': 'audio_005',
                'pdf_file_id': 'pdf_005',
                'duration': '08:15',
            },
        ]

        created_count = 0
        updated_count = 0

        for lesson_data in lessons_data:
            lesson, created = Lesson.objects.update_or_create(
                number=lesson_data['number'],
                defaults=lesson_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Created lesson: {lesson.title}')
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Updated lesson: {lesson.title}')
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\nSuccessfully processed {len(lessons_data)} lessons '
                f'({created_count} created, {updated_count} updated)'
            )
        )

