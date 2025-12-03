# How to Manage Bookings from the Backend

This guide explains how to add, edit, or delete bookings so they appear in the frontend calendar.

## 🎯 Easiest Method: Admin Dashboard (Recommended)

**The easiest way to manage bookings is through the visual admin dashboard!**

### Step 1: Start Both Servers

**Terminal 1** - Backend server:
```bash
npm run server
```

**Terminal 2** - Frontend dev server:
```bash
npm run dev
```

### Step 2: Access the Admin Dashboard

1. Open your browser and go to: `http://localhost:8080/admin`
2. You'll see a visual dashboard with:
   - **Calendar overview** showing all booked dates in red
   - **List of all bookings** with guest information
   - **Add/Edit/Delete buttons** for easy management

### Step 3: Manage Bookings

- **Add Booking**: Click "Add New Booking" → Select a Saturday date → Fill in guest info → Click "Create Booking"
- **Edit Booking**: Click "Edit" on any booking → Modify details → Click "Update Booking"
- **Delete Booking**: Click "Delete" on any booking → Confirm deletion

That's it! Changes appear immediately in the frontend calendar.

---

## Alternative Methods (For Advanced Users)

### Method 1: Direct JSON File Editing

## Method 1: Direct JSON File Editing (Easiest)

### Location
Edit the file: `server/bookings.json`

### Format
Each booking must follow this structure:

```json
[
  {
    "id": "1735689600000",
    "startDate": "2026-06-15T00:00:00.000Z",
    "endDate": "2026-06-22T00:00:00.000Z",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "status": "confirmed",
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
]
```

### Important Rules

1. **Start dates MUST be Saturdays** (the calendar only allows Saturday-to-Saturday bookings)
2. **End date is always 7 days after start date** (one week)
3. **Valid date range**: June 15, 2026 to September 15, 2026
4. **ID format**: Use timestamp (e.g., `Date.now().toString()`)

### Example: Adding a Booking

Let's say you want to mark June 22, 2026 (a Saturday) as booked:

```json
[
  {
    "id": "1719014400000",
    "startDate": "2026-06-22T00:00:00.000Z",
    "endDate": "2026-06-29T00:00:00.000Z",
    "guestName": "Jane Smith",
    "guestEmail": "jane@example.com",
    "status": "confirmed",
    "createdAt": "2026-01-15T00:00:00.000Z",
    "updatedAt": "2026-01-15T00:00:00.000Z"
  }
]
```

### Saturday Dates in Your Range

Here are all the Saturdays from June 15 to September 15, 2026:

- **June 15, 2026** → `2026-06-15T00:00:00.000Z`
- **June 22, 2026** → `2026-06-22T00:00:00.000Z`
- **June 29, 2026** → `2026-06-29T00:00:00.000Z`
- **July 6, 2026** → `2026-07-06T00:00:00.000Z`
- **July 13, 2026** → `2026-07-13T00:00:00.000Z`
- **July 20, 2026** → `2026-07-20T00:00:00.000Z`
- **July 27, 2026** → `2026-07-27T00:00:00.000Z`
- **August 3, 2026** → `2026-08-03T00:00:00.000Z`
- **August 10, 2026** → `2026-08-10T00:00:00.000Z`
- **August 17, 2026** → `2026-08-17T00:00:00.000Z`
- **August 24, 2026** → `2026-08-24T00:00:00.000Z`
- **August 31, 2026** → `2026-08-31T00:00:00.000Z`
- **September 7, 2026** → `2026-09-07T00:00:00.000Z`
- **September 14, 2026** → `2026-09-14T00:00:00.000Z`

### Steps to Edit

1. **Stop the backend server** (Ctrl+C in the terminal)
2. **Edit `server/bookings.json`** with your bookings
3. **Restart the backend server**: `npm run server`
4. **Refresh the frontend** - the calendar will show red boxes for booked dates

## Method 2: Using API Endpoints (No Restart Needed)

You can add/edit bookings without restarting the server using HTTP requests.

### Get All Current Bookings

```bash
curl http://localhost:3001/api/bookings
```

### Add a New Booking

```bash
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2026-06-22T00:00:00.000Z",
    "endDate": "2026-06-29T00:00:00.000Z",
    "guestName": "Jane Smith",
    "guestEmail": "jane@example.com",
    "status": "confirmed"
  }'
```

### Update a Booking

```bash
curl -X PUT http://localhost:3001/api/bookings/1735689600000 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "cancelled"
  }'
```

### Delete a Booking

```bash
curl -X DELETE http://localhost:3001/api/bookings/1735689600000
```

## Method 3: Using a REST Client (Recommended)

Use tools like:
- **Postman** (https://www.postman.com/)
- **Insomnia** (https://insomnia.rest/)
- **Thunder Client** (VS Code extension)

### Example Postman Setup

1. **GET Request** - View all bookings
   - URL: `http://localhost:3001/api/bookings`
   - Method: GET

2. **POST Request** - Add a booking
   - URL: `http://localhost:3001/api/bookings`
   - Method: POST
   - Headers: `Content-Type: application/json`
   - Body (JSON):
   ```json
   {
     "startDate": "2026-07-06T00:00:00.000Z",
     "endDate": "2026-07-13T00:00:00.000Z",
     "guestName": "Test Guest",
     "guestEmail": "test@example.com",
     "status": "confirmed"
   }
   ```

## Visual Result

- **Green boxes** = Available Saturdays (no booking exists)
- **Red boxes** = Booked Saturdays (booking exists in `bookings.json`)

## Troubleshooting

### Dates not showing as booked?
1. Make sure the backend server is running
2. Check that `startDate` is a Saturday (day 6 of the week)
3. Verify the date format is ISO 8601: `YYYY-MM-DDTHH:mm:ss.sssZ`
4. Refresh the frontend page

### Server not starting?
1. Make sure you ran `npm install` first
2. Check if port 3001 is already in use
3. Verify Node.js is installed: `node --version`

### Frontend not connecting?
1. Check browser console for errors
2. Verify `VITE_API_URL` in `.env` is set to `http://localhost:3001/api`
3. Make sure CORS is enabled (it should be by default)

## Quick Reference: Date Conversion

To convert a date to the required format, use JavaScript:

```javascript
// For June 22, 2026 (Saturday)
const date = new Date('2026-06-22');
date.toISOString(); // "2026-06-22T00:00:00.000Z"
```

Or use an online converter: https://www.epochconverter.com/

