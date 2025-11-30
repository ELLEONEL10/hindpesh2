# HindPesh Backend API

Django REST Framework backend for the HindPesh educational platform.

## Setup Instructions

1. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

2. **Activate the virtual environment:**
   - Windows: `venv\Scripts\activate`
   - Linux/Mac: `source venv/bin/activate`

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and set your `SECRET_KEY` (generate a secure key for production).

5. **Run migrations:**
   ```bash
   python manage.py migrate
   ```

6. **Create a superuser (admin account with hashed password):**
   ```bash
   python manage.py createsuperuser
   ```
   Follow the prompts to create an admin user. Django will automatically hash the password.

7. **Run the development server:**
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`

## API Endpoints

### Public Endpoints (No Authentication Required)
- `GET /api/lessons/` - List all active lessons
- `GET /api/lessons/{id}/` - Get lesson details
- `POST /api/lessons/login/` - Login and get authentication token

### Protected Endpoints (Authentication Required)
- `POST /api/lessons/` - Create a new lesson
- `PUT /api/lessons/{id}/` - Update a lesson
- `PATCH /api/lessons/{id}/` - Partially update a lesson
- `DELETE /api/lessons/{id}/` - Delete a lesson
- `GET /api/lessons/me/` - Get current user info

## Authentication

1. **Login to get token:**
   ```bash
   POST /api/lessons/login/
   Body: {
     "username": "admin",
     "password": "your_password"
   }
   Response: {
     "token": "abc123...",
     "user_id": 1,
     "username": "admin"
   }
   ```

2. **Use token in requests:**
   Add header: `Authorization: Token abc123...`

## Admin Panel

Access Django admin at: `http://localhost:8000/admin/`

Login with the superuser credentials you created. Django automatically handles password hashing using PBKDF2.

## Database

By default, uses SQLite (`db.sqlite3`). For production, configure PostgreSQL or MySQL in `settings.py`.

