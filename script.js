const API = "http://localhost:3000/reservations";

/**
 * Load event summary
 */
async function loadSummary() {
  const res = await fetch(API);
  const data = await res.json();

  document.getElementById("summary").innerText =
    `Available Seats: ${data.availableSeats}
Total Seats: ${data.totalSeats}
Reservations: ${data.reservationCount}
Version: ${data.version}`;
}

/**
 * Reserve seats
 */
async function reserveSeats() {
  const partnerId = document.getElementById("partnerId").value;
  const seats = Number(document.getElementById("seats").value);

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ partnerId, seats })
  });

  const data = await res.json();

  document.getElementById("reserveResult").innerText =
    res.status === 201
      ? `Success! Reservation ID: ${data.reservationId}`
      : data.error;

  loadSummary();
}

/**
 * Cancel reservation (FULL or PARTIAL)
 */
async function cancelReservation() {
  const id = document.getElementById("reservationId").value;
  const seats = document.getElementById("cancelSeats").value;

  const res = await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: seats ? JSON.stringify({ seats: Number(seats) }) : null
  });

  if (res.status === 204) {
    document.getElementById("cancelResult").innerText =
      "Reservation fully cancelled";
  } else {
    const data = await res.json();
    document.getElementById("cancelResult").innerText =
      data.message || data.error;
  }

  loadSummary();
}

// Initial load
loadSummary();
