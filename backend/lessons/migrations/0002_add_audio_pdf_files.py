# Generated migration for AudioFile and PDFFile models
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('lessons', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='lesson',
            name='audio_file_id',
        ),
        migrations.RemoveField(
            model_name='lesson',
            name='pdf_file_id',
        ),
        migrations.CreateModel(
            name='AudioFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(blank=True, help_text='Optional title for the audio file', max_length=200)),
                ('google_drive_link', models.URLField(help_text='Full Google Drive shareable link to the audio file')),
                ('order', models.PositiveIntegerField(default=0, help_text='Order of display (lower numbers appear first)')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('lesson', models.ForeignKey(help_text='The lesson this audio file belongs to', on_delete=django.db.models.deletion.CASCADE, related_name='audio_files', to='lessons.lesson')),
            ],
            options={
                'verbose_name': 'Audio File',
                'verbose_name_plural': 'Audio Files',
                'ordering': ['lesson', 'order', 'created_at'],
            },
        ),
        migrations.CreateModel(
            name='PDFFile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(help_text='Title/name of the PDF file', max_length=200)),
                ('google_drive_link', models.URLField(help_text='Full Google Drive shareable link to the PDF file')),
                ('order', models.PositiveIntegerField(default=0, help_text='Order of display (lower numbers appear first)')),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('lesson', models.ForeignKey(help_text='The lesson this PDF file belongs to', on_delete=django.db.models.deletion.CASCADE, related_name='pdf_files', to='lessons.lesson')),
            ],
            options={
                'verbose_name': 'PDF File',
                'verbose_name_plural': 'PDF Files',
                'ordering': ['lesson', 'order', 'created_at'],
            },
        ),
    ]

