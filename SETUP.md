# HindPesh Setup Guide

This guide will help you set up both the frontend and backend for the HindPesh educational platform.

## Prerequisites

- Python 3.8+ installed
- Node.js 16+ and npm installed
- Git installed

## Backend Setup (Django)

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create `.env` file:**
   Create a `.env` file in the `backend` directory with:
   ```
   SECRET_KEY=your-secret-key-here-change-in-production
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   ```

6. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

7. **Create a superuser (admin account with hashed password):**
   ```bash
   python manage.py createsuperuser
   ```
   Follow the prompts to create an admin user. Django automatically hashes passwords using PBKDF2.

8. **Start the Django server:**
   ```bash
   python manage.py runserver
   ```
   The API will be available at `http://localhost:8000/api/`

## Frontend Setup (React + Vite)

1. **Navigate to the project root:**
   ```bash
   cd ..  # if you're in the backend directory
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file (optional):**
   Create a `.env` file in the root directory:
   ```
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:3000` (or the port shown in terminal)

## Using the Application

### Admin Panel Access

1. Navigate to `/login` in your browser
2. Login with the superuser credentials you created
3. You'll be redirected to `/hind-admin-portal` (the admin panel)

### Creating Lessons

1. In the admin panel, click "درس جديد" (New Lesson)
2. Fill in the lesson details:
   - Lesson number (must be unique)
   - Title (in Arabic)
   - Description (in Arabic)
   - YouTube Video ID
   - Google Drive Audio File ID
   - Google Drive PDF File ID
   - Duration (format: MM:SS or HH:MM:SS)
   - Optional thumbnail URL
3. Click "حفظ وإنشاء QR" (Save and Generate QR)
4. A QR code will be generated automatically for printing in books

### Managing Lessons

- **Edit:** Click the edit icon (pencil) next to any lesson
- **Delete:** Click the delete icon (trash) next to any lesson
- All changes are saved to the database immediately

## API Endpoints

### Public Endpoints
- `GET /api/lessons/` - List all active lessons
- `GET /api/lessons/{id}/` - Get lesson details
- `POST /api/lessons/login/` - Login and get token

### Protected Endpoints (Require Authentication)
- `POST /api/lessons/` - Create a new lesson
- `PATCH /api/lessons/{id}/` - Update a lesson
- `DELETE /api/lessons/{id}/` - Delete a lesson
- `GET /api/lessons/me/` - Get current user info

## Authentication

The backend uses Django's built-in authentication system with:
- **Password Hashing:** Django automatically hashes passwords using PBKDF2 with SHA256
- **Token Authentication:** REST Framework tokens for API access
- **Session Authentication:** For Django admin panel

## Database

By default, the project uses SQLite (`db.sqlite3`). For production:
1. Update `DATABASES` in `backend/hindpesh_backend/settings.py`
2. Configure PostgreSQL or MySQL
3. Run migrations: `python manage.py migrate`

## Troubleshooting

### CORS Errors
If you see CORS errors, make sure:
- Django server is running on port 8000
- Frontend is configured to use the correct API URL
- CORS settings in `settings.py` include your frontend URL

### Authentication Errors
- Make sure you created a superuser with `python manage.py createsuperuser`
- Check that the token is being stored in localStorage
- Verify the API URL is correct

### Database Errors
- Run migrations: `python manage.py migrate`
- Check that `db.sqlite3` has write permissions
- For production, ensure your database is properly configured

## Production Deployment

### Security Checklist
- [ ] Change `SECRET_KEY` in `.env`
- [ ] Set `DEBUG=False` in production
- [ ] Configure proper `ALLOWED_HOSTS`
- [ ] Use PostgreSQL or MySQL instead of SQLite
- [ ] Set up proper CORS origins
- [ ] Use HTTPS
- [ ] Configure static files serving
- [ ] Set up proper logging

### Django Admin
Access Django admin at: `http://your-domain.com/admin/`

Login with your superuser credentials to manage lessons directly from Django admin.

