# Backend Server Setup Guide

## ⚠️ IMPORTANT: Backend Server Required

The booking management system requires a backend server to be running. Without it, you cannot create, edit, or manage bookings.

## Quick Start

### Step 1: Install Dependencies

Make sure you have all dependencies installed:
```bash
npm install
```

### Step 2: Start the Backend Server

Open a **separate terminal** and run:
```bash
npm run server
```

You should see:
```
Booking API server running on http://localhost:3001
```

### Step 3: Start the Frontend (in another terminal)

```bash
npm run dev
```

## Troubleshooting

### Error: `ERR_CONNECTION_REFUSED`

This means the backend server is not running. 

**Solution:**
1. Open a new terminal window
2. Navigate to your project directory
3. Run: `npm run server`
4. Keep that terminal open while using the admin dashboard

### Error: Port 3001 already in use

Another process is using port 3001.

**Solution:**
1. Find what's using the port:
   ```bash
   lsof -i :3001
   ```
2. Kill that process or change the port in `server/index.js`:
   ```javascript
   const PORT = process.env.PORT || 3002; // Change to 3002
   ```
3. Update `src/services/bookingApi.ts`:
   ```typescript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002/api';
   ```

### Backend server keeps stopping

Make sure you keep the terminal window open. The server runs in the foreground.

**Solution:** Use a process manager like `pm2` or run in background:
```bash
npm run server &
```

## Verifying Backend is Running

Test the backend API:
```bash
curl http://localhost:3001/api/bookings
```

You should get a JSON response (empty array `[]` if no bookings).

## Data Storage

Bookings are stored in `server/bookings.json`. This file is automatically created when the server starts.

## Production Deployment

For production, you'll need to:
1. Deploy the backend server (Express.js)
2. Update `VITE_API_URL` environment variable to point to your production API
3. Ensure CORS is properly configured
4. Use a proper database instead of JSON file storage

