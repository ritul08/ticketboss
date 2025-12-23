const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { event, reservations } = require("./store");
const { isValidSeats } = require("./validator");

const router = express.Router();

/**
 * POST /reservations
 * Reserve seats
 */
router.post("/", (req, res) => {
  const { partnerId, seats } = req.body;

  if (!isValidSeats(seats)) {
    return res.status(400).json({ error: "Seats must be between 1 and 10" });
  }

  if (event.availableSeats < seats) {
    return res.status(409).json({ error: "Not enough seats left" });
  }

  const reservationId = uuidv4();

  event.availableSeats -= seats;
  event.version += 1;

  reservations.set(reservationId, {
    reservationId,
    partnerId,
    seats
  });

  return res.status(201).json({
    reservationId,
    seats,
    status: "confirmed"
  });
});

/**
 * DELETE /reservations/:id
 * Supports FULL or PARTIAL cancellation
 */
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  const seatsToCancel = req.body?.seats;

  if (!reservations.has(id)) {
    return res.status(404).json({ error: "Reservation not found" });
  }

  const reservation = reservations.get(id);

  // FULL cancellation (no seats provided)
  if (seatsToCancel === undefined) {
    event.availableSeats += reservation.seats;
    event.version += 1;
    reservations.delete(id);
    return res.status(204).send();
  }

  // Validate partial cancellation
  if (
    !Number.isInteger(seatsToCancel) ||
    seatsToCancel <= 0 ||
    seatsToCancel > reservation.seats
  ) {
    return res.status(400).json({
      error: "Invalid seats to cancel"
    });
  }

  // PARTIAL cancellation
  reservation.seats -= seatsToCancel;
  event.availableSeats += seatsToCancel;
  event.version += 1;

  // If all seats cancelled, remove reservation
  if (reservation.seats === 0) {
    reservations.delete(id);
  } else {
    reservations.set(id, reservation);
  }

  return res.status(200).json({
    message: "Cancellation successful",
    remainingSeats: reservation.seats || 0
  });
});

/**
 * GET /reservations
 * Event summary
 */
router.get("/", (req, res) => {
  return res.json({
    eventId: event.eventId,
    name: event.name,
    totalSeats: event.totalSeats,
    availableSeats: event.availableSeats,
    reservationCount: event.totalSeats - event.availableSeats,
    version: event.version
  });
});

module.exports = router;
