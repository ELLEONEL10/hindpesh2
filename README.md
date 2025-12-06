# HindPesh - Interactive Arabic Learning Platform

HindPesh is a comprehensive educational platform designed to accompany printed Arabic learning materials. It features dynamic lesson management, audio streaming, video integration, and downloadable PDF resources.

## 🌟 Features

- **Interactive Lessons**: Dynamic content with video, audio, and text.
- **Progress Tracking**: Users can track their completed lessons.
- **Media Integration**: Seamless playback of YouTube videos and Google Drive audio/PDFs.
- **Responsive Design**: Fully optimized for mobile and desktop with Dark Mode support.
- **Secure Authentication**: User accounts and progress saving.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Framer Motion
- **Backend**: Django, Django REST Framework
- **Database**: SQLite (Development) / PostgreSQL (Production ready)

## 🚀 Quick Start

### Prerequisites

- Node.js (v16+)
- Python (v3.9+)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\Activate  # Windows
   # source venv/bin/activate  # Mac/Linux
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## 👤 Credits

**Developed by Fadi Abbara**

## 📄 License

Copyright © 2025 HindPesh. All Rights Reserved.

This project is proprietary software. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited. See [LICENSE](LICENSE) for details.
