# HindPesh - Educational Platform

Arabic learning platform with dynamic lesson management, audio files, and PDF resources.

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup

```bash
npm install
npm run dev
```

## Features

- Dynamic lesson management with database storage
- Multiple audio files per lesson (Google Drive integration)
- Multiple PDF files per lesson (Google Drive integration)
- YouTube video integration
- Secure admin panel with token authentication
- Responsive design with dark mode support

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **Backend:** Django + Django REST Framework
- **Database:** SQLite (development)

## Admin Access

- Django Admin: `http://localhost:8000/admin/` (for managing lessons, audio files, and PDFs)
- API: `http://localhost:8000/api/`
