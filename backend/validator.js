// Validate seat count
function isValidSeats(seats) {
  return Number.isInteger(seats) && seats > 0 && seats <= 10;
}

module.exports = { isValidSeats };
