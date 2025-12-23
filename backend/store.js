// Event data (seeded on startup)
const event = {
  eventId: "node-meetup-2025",
  name: "Node.js Meet-up",
  totalSeats: 500,
  availableSeats: 500,
  version: 0
};

// Store reservations
const reservations = new Map();

module.exports = { event, reservations };
