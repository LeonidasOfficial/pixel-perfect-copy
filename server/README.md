# Booking Management API

This is a simple Express.js API server for managing bookings for La Maison Du Lavoir Vert.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm run server
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

### GET /api/bookings
Get all bookings.

**Response:**
```json
[
  {
    "id": "1234567890",
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

### POST /api/bookings
Create a new booking.

**Request Body:**
```json
{
  "startDate": "2026-06-15T00:00:00.000Z",
  "endDate": "2026-06-22T00:00:00.000Z",
  "guestName": "John Doe",
  "guestEmail": "john@example.com",
  "status": "confirmed"
}
```

### PUT /api/bookings/:id
Update an existing booking.

**Request Body:**
```json
{
  "status": "cancelled"
}
```

### DELETE /api/bookings/:id
Delete a booking.

## Data Storage

Bookings are stored in `server/bookings.json`. This file is automatically created when the server starts.

## Booking Rules

- All bookings are weekly, from Saturday to Saturday
- Start dates must be Saturdays
- The booking period is from June 15, 2026 to September 15, 2026

## Managing Bookings

To manually manage bookings, you can:

1. Edit `server/bookings.json` directly (server must be restarted)
2. Use the API endpoints programmatically
3. Use a tool like Postman or curl to interact with the API

Example curl commands:

```bash
# Get all bookings
curl http://localhost:3001/api/bookings

# Create a booking
curl -X POST http://localhost:3001/api/bookings \
  -H "Content-Type: application/json" \
  -d '{
    "startDate": "2026-06-15T00:00:00.000Z",
    "endDate": "2026-06-22T00:00:00.000Z",
    "guestName": "John Doe",
    "guestEmail": "john@example.com",
    "status": "confirmed"
  }'

# Update a booking
curl -X PUT http://localhost:3001/api/bookings/1234567890 \
  -H "Content-Type: application/json" \
  -d '{"status": "cancelled"}'

# Delete a booking
curl -X DELETE http://localhost:3001/api/bookings/1234567890
```

