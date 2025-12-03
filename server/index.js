import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'bookings.json');

// Middleware
app.use(cors());
app.use(express.json());

// Ensure data file exists
async function ensureDataFile() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    // File doesn't exist, create it with empty array
    await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
  }
}

// Read bookings from file
async function readBookings() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading bookings:', error);
    return [];
  }
}

// Write bookings to file
async function writeBookings(bookings) {
  try {
    await fs.writeFile(DATA_FILE, JSON.stringify(bookings, null, 2));
  } catch (error) {
    console.error('Error writing bookings:', error);
    throw error;
  }
}

// GET /api/bookings - Get all bookings
app.get('/api/bookings', async (req, res) => {
  try {
    const bookings = await readBookings();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// POST /api/bookings - Create a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const bookings = await readBookings();
    const newBooking = {
      id: Date.now().toString(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    bookings.push(newBooking);
    await writeBookings(bookings);
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// PUT /api/bookings/:id - Update a booking
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const bookings = await readBookings();
    const index = bookings.findIndex(b => b.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    bookings[index] = {
      ...bookings[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    await writeBookings(bookings);
    res.json(bookings[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// DELETE /api/bookings/:id - Delete a booking
app.delete('/api/bookings/:id', async (req, res) => {
  try {
    const bookings = await readBookings();
    const filtered = bookings.filter(b => b.id !== req.params.id);
    
    if (filtered.length === bookings.length) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await writeBookings(filtered);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// Start server
async function startServer() {
  await ensureDataFile();
  app.listen(PORT, () => {
    console.log(`Booking API server running on http://localhost:${PORT}`);
  });
}

startServer();

