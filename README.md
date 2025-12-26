# HEAVY SHIT - E-commerce Platform

A modern e-commerce platform for streetwear drops with user authentication and interest registration.

## Quick Start

### Prerequisites
```bash
npm install
```

### Environment Setup
1. Copy `.env.example` to `.env.local`
2. Generate a secure JWT_SECRET (minimum 32 characters)
3. Update configuration as needed

### Running the Application

**Development (requires 2 terminals):**

Terminal 1 - API Server:
```bash
npm run dev:api
```

Terminal 2 - Frontend:
```bash
npm run dev
```

**Or run both together (Unix/Mac):**
```bash
npm run dev:all
```

### Access
- **Frontend**: http://localhost:5173
- **API**: http://localhost:3001

## Features

### 🔐 User Authentication
- Passwordless registration (name, email, phone, Instagram)
- Session-based authentication with JWT
- Secure HTTP-only cookies
- 7-day session duration

### 🎯 Smart Interest Registration
- **Unauthenticated users**: Complete registration form
- **Authenticated users**: One-click interest confirmation
- Automatic account creation + drop registration

### 👔 Admin Tools
- View all registrations: `GET /api/admin/drops`
- Export to CSV: `GET /api/admin/export-drops`

### 🛡️ Security
- Rate limiting (100 req/15min general, 20 req/15min auth)
- CORS protection
- Secure JWT tokens
- Vulnerability-free dependencies

## Documentation

- **[FEATURES.md](FEATURES.md)** - Complete feature documentation with API endpoints
- **[SECURITY.md](SECURITY.md)** - Security measures and production recommendations
- **[.env.example](.env.example)** - Environment configuration template

## Tech Stack

- **Frontend**: React, Vite, Framer Motion, Tailwind CSS
- **Backend**: Express.js, Node.js
- **Authentication**: JWT, HTTP-only cookies
- **Storage**: File-based JSON (users.json, orders.json, drops.json)
- **Security**: express-rate-limit, CORS

## API Endpoints

### Public
- `POST /api/users/register` - Register new user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout
- `POST /api/users/register-drop` - Register interest (authenticated)

### Admin
- `GET /api/admin/drops` - Get all registrations (JSON)
- `GET /api/admin/export-drops` - Export registrations (CSV)

## Production Checklist

Before deploying to production:
- [ ] Set strong JWT_SECRET (min 32 chars)
- [ ] Configure FRONTEND_URL to production domain
- [ ] Add authentication to admin endpoints
- [ ] Enable HTTPS
- [ ] Implement CSRF protection
- [ ] Set up monitoring/alerting
- [ ] Regular security audits

See [SECURITY.md](SECURITY.md) for detailed recommendations.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

Private - All rights reserved
