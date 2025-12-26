# HEAVY SHIT - Setup Guide

This guide will help you set up the HEAVY SHIT e-commerce platform with full authentication and account management features.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)
- A text editor (VS Code, Sublime, etc.)

## Quick Setup (5 minutes)

### 1. Clone the Repository

```bash
git clone https://github.com/aditiyaxyz/HEAVY.git
cd HEAVY
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
# Copy the example environment file
cp .env.example .env.local

# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it into `.env.local` as the `JWT_SECRET` value.

Your `.env.local` should look like:
```env
JWT_SECRET=c47424c4d10492d8d7bc8f943651819a7949a23cb4bd17746b2ed4778a16afa2
FRONTEND_URL=http://localhost:5173
PORT=3001
```

### 4. Start the Application

You need to run TWO servers: the API server and the frontend.

#### Option A: Two Terminals (Recommended for Development)

**Terminal 1 - API Server:**
```bash
npm run dev:api
```
You should see: `🚀 HEAVY API Server running on http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
You should see: `➜ Local: http://localhost:5173/`

#### Option B: Single Command (Unix/Mac/Linux)

```bash
npm run dev:all
```

### 5. Access the Application

- **Main Site**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/admin
- **API**: http://localhost:3001

## First-Time Usage

### For Regular Users

1. Open http://localhost:5173
2. Click the entry screen to enter the site
3. Click "Login / Register" in the top-right header
4. Create an account with:
   - Full Name
   - Email
   - Phone
   - Instagram (optional)
5. You'll be automatically logged in
6. Test the "REGISTER YOUR INTEREST NOW" button
7. Access your account via the user dropdown menu

### For Admins

1. Navigate to http://localhost:5173/admin
2. View all drop interest registrations
3. Use search and filter to find specific entries
4. Export data to CSV

## Project Structure

```
HEAVY/
├── src/
│   ├── App.jsx                 # Main application component
│   ├── main.jsx                # React entry point with routing
│   ├── pages/
│   │   └── AdminDashboard.jsx  # Admin interface
│   └── index.css               # Global styles
├── lib/
│   └── users.js                # User data management functions
├── api-server.js               # Express backend server
├── data/                       # Auto-created data directory
│   ├── users.json              # User accounts (auto-created)
│   ├── drops.json              # Drop registrations (auto-created)
│   └── orders.json             # Orders (auto-created)
├── .env.local                  # Your local environment variables (DO NOT COMMIT)
├── .env.example                # Template for environment variables
└── package.json                # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start frontend development server (Vite)
- `npm run dev:api` - Start backend API server (Express)
- `npm run dev:all` - Start both servers (Unix/Mac only)
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build

## API Endpoints

### Public Endpoints

- `POST /api/users/register` - Register new user
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/me` - Get current user session
- `POST /api/auth/logout` - Logout user
- `POST /api/users/register-drop` - Register interest (requires auth)

### Admin Endpoints

- `GET /api/admin/drops` - Get all drop registrations (JSON)
- `GET /api/admin/export-drops` - Export registrations (CSV)

### Protected Endpoints

- `PUT /api/users/profile` - Update user profile
- `GET /api/users/orders` - Get user's orders

## Testing the Features

### Test Authentication Flow

1. **Registration**:
   - Click "Login / Register"
   - Fill out the registration form
   - Submit and verify you're logged in

2. **Login**:
   - Logout from the user dropdown
   - Click "Login / Register" again
   - Enter your email and login

3. **Session Persistence**:
   - Refresh the page
   - Verify you're still logged in

### Test Drop Interest Feature

1. **Logged Out**:
   - Logout if logged in
   - Click "REGISTER YOUR INTEREST NOW"
   - Fill out the full registration form
   - Verify account is created and drop registered

2. **Logged In**:
   - Login to your account
   - Click "REGISTER YOUR INTEREST NOW"
   - See the quick confirmation dialog
   - Confirm and verify success

### Test Account Dashboard

1. Click the user dropdown in the header
2. Select "Profile" - edit your information
3. Select "Order History" - view orders (empty initially)
4. Select "Addresses" - placeholder for addresses

### Test Admin Dashboard

1. Navigate to http://localhost:5173/admin
2. View the registration you just created
3. Try the search functionality
4. Change sorting options
5. Export to CSV

## Troubleshooting

### API Server Won't Start

**Error**: `JWT_SECRET environment variable is not set`

**Solution**: Make sure you've created `.env.local` with a JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output to `.env.local` as `JWT_SECRET=<your_secret>`

### Port Already in Use

**Error**: `Port 3001 is already in use`

**Solution**: Either:
1. Kill the process using port 3001: `lsof -ti:3001 | xargs kill -9` (Unix/Mac)
2. Or change the port in `.env.local`: `PORT=3002`

### Frontend Can't Connect to API

**Error**: Network errors or CORS issues

**Solution**: Verify:
1. API server is running on http://localhost:3001
2. Frontend is running on http://localhost:5173
3. `.env.local` has `FRONTEND_URL=http://localhost:5173`

### Data Not Persisting

**Issue**: Users/registrations disappear after restart

**Solution**: Check that the `data/` directory is being created. It should be auto-created by the API server. If not, manually create it:
```bash
mkdir -p data
```

## Security Considerations

### Development

- `.env.local` is in `.gitignore` - don't commit it
- The `data/` directory is in `.gitignore` - don't commit user data
- JWT secrets are for development only - generate new ones for production

### Production Deployment

Before deploying to production:

1. **Generate a Strong JWT Secret**:
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Update Environment Variables**:
   - Set `NODE_ENV=production`
   - Use HTTPS for `FRONTEND_URL`
   - Configure proper CORS origins

3. **Add Admin Authentication**:
   - The admin dashboard currently has no authentication
   - Implement admin login before deploying

4. **Use a Real Database**:
   - Replace file-based storage with MongoDB or PostgreSQL
   - The codebase is ready to switch (see `MONGODB_URI` in `.env.example`)

5. **Enable HTTPS**:
   - Use SSL certificates
   - Update cookie settings to `secure: true`

6. **Add CSRF Protection**:
   - Implement CSRF tokens for state-changing operations

## Support

For issues or questions:
- Check existing issues on GitHub
- Create a new issue with details
- Include error messages and steps to reproduce

## Next Steps

Now that you have the system running:

1. Explore the codebase
2. Customize the UI to your brand
3. Add more products to the inventory
4. Implement payment integration
5. Add email notifications
6. Deploy to production

Happy coding! 🚀
