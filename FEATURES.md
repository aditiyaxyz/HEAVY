# HEAVY SHIT - User Account & E-commerce Features

## Overview

This document describes the newly implemented user account management and e-commerce features for the HEAVY SHIT platform.

## Features Implemented

### 1. User Authentication System

#### Registration
- Users can register with the following information:
  - Full Name (required)
  - Email (required)
  - Phone (required)
  - Instagram handle (optional)
- Upon registration, users are automatically logged in with a session token
- Session tokens are stored in HTTP-only cookies for security
- Sessions last for 7 days

#### Login/Logout
- Session-based authentication using JWT tokens
- Automatic session restoration on page reload
- Secure logout that clears session cookies
- User greeting displayed in navbar when logged in

### 2. Register Interest Feature

The "REGISTER YOUR INTEREST NOW" button now has intelligent behavior:

#### For Unauthenticated Users:
- Displays a registration form with fields:
  - Full Name
  - Email
  - Phone
  - Instagram (optional)
- Upon submission:
  - Creates a new user account
  - Automatically logs the user in
  - Registers their interest for the current drop
  - Displays success message

#### For Authenticated Users:
- Displays a confirmation dialog showing:
  - Logged-in email
  - Product name (e.g., PHANTOM BOMBER)
  - Confirmation that interest will be recorded
- One-click registration for the drop
- Success confirmation

### 3. Data Storage

#### User Data (`data/users.json`)
Stores user account information:
```json
{
  "id": "uuid",
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+1234567890",
  "instagram": "@username",
  "createdAt": "ISO timestamp"
}
```

#### Drop Interest Registry (`data/drops.json`)
Stores all drop interest registrations:
```json
{
  "id": "drop_timestamp",
  "username": "Full Name",
  "email": "email@example.com",
  "phone": "+1234567890",
  "details": "PHANTOM BOMBER",
  "timestamp": "ISO timestamp"
}
```

### 4. Admin Features

#### View All Drop Registrations (JSON)
```
GET http://localhost:3001/api/admin/drops
```

Returns JSON array of all drop interest registrations.

#### Export Drop Registrations (CSV)
```
GET http://localhost:3001/api/admin/export-drops
```

Downloads a CSV file with columns:
- ID
- Username
- Email
- Phone
- Details (product name)
- Timestamp

## Running the Application

### Prerequisites
```bash
npm install
```

### Development Mode

You need to run both the API server and the Vite dev server:

#### Terminal 1 - API Server:
```bash
npm run dev:api
```

#### Terminal 2 - Vite Dev Server:
```bash
npm run dev
```

#### Or run both together (Unix/Mac):
```bash
npm run dev:all
```

### Access the Application
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001

## API Endpoints

### Public Endpoints

#### Register User
```
POST /api/users/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "instagram": "@johndoe"  // optional
}
```

#### Get Current User (Session Check)
```
GET /api/auth/me
```

#### Logout
```
POST /api/auth/logout
```

#### Register Drop Interest (Authenticated)
```
POST /api/users/register-drop
Content-Type: application/json

{
  "details": "PHANTOM BOMBER"
}
```

### Admin Endpoints

#### Get All Drop Registrations (JSON)
```
GET /api/admin/drops
```

#### Export Drop Registrations (CSV)
```
GET /api/admin/export-drops
```

## Security Features

1. **HTTP-Only Cookies**: Session tokens stored in HTTP-only cookies to prevent XSS attacks
2. **JWT Tokens**: Secure token-based authentication with 7-day expiration
3. **CORS Protection**: Configured to only accept requests from the frontend origin
4. **Secure Dependencies**: All dependencies checked for vulnerabilities and updated to secure versions
5. **File-Based Storage**: User data stored in JSON files with proper error handling

## Data Privacy

- User data is stored locally in the `data/` directory
- Session tokens are signed with JWT_SECRET from environment variables
- Passwords are NOT stored (passwordless authentication approach)
- All user data includes minimal required fields

## UI/UX Highlights

- **Consistent Theme**: All new UI elements match the existing HEAVY SHIT aesthetic
- **Smooth Animations**: Modal transitions using Framer Motion
- **User Feedback**: Clear success/error messages
- **Responsive Design**: Works on all screen sizes
- **Smart Button Behavior**: Context-aware "Register Interest" button

## Environment Variables

Create or update `.env.local`:

```env
# JWT secret for signing tokens
JWT_SECRET=your_long_random_secret_here

# Email configuration (for future magic link feature)
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Base URL for the application
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# MongoDB connection string (for future use)
MONGODB_URI=your_mongodb_uri_here
```

## Future Enhancements

- [ ] Password-based authentication option
- [ ] User profile page with order history
- [ ] Address management
- [ ] Order tracking
- [ ] Email notifications for drops
- [ ] Admin dashboard UI
- [ ] Payment integration
- [ ] Wishlist functionality

## Testing

The implementation has been tested for:
- ✅ User registration flow
- ✅ Session persistence
- ✅ Logout functionality
- ✅ Unauthenticated user "Register Interest" flow
- ✅ Authenticated user "Register Interest" flow
- ✅ Data persistence in JSON files
- ✅ Admin export endpoints (JSON and CSV)
- ✅ UI theme consistency

## Support

For issues or questions, please refer to the main repository documentation.
