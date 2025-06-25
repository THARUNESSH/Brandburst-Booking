// Booking form logic
document.getElementById("bookingForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const contact = document.getElementById("contact").value.trim();
  const service = document.getElementById("service").value;
  const date = document.getElementById("date").value;
  const message = document.getElementById("message");

  if (!name || !email || !contact || !service || !date) {
    message.innerHTML = "Please fill in all fields.";
    message.style.color = "orange";
    return;
  }

  try {
    const bookingsRef = db.collection("appointments");
    const existing = await bookingsRef.where("date", "==", date).get();

    if (!existing.empty) {
      message.innerHTML = `Sorry, <strong>${date}</strong> is already booked.`;
      message.style.color = "red";
    } else {
      await bookingsRef.add({
  name,
  email,
  contact,
  service,
  date,
  timestamp: new Date()
});

message.innerHTML = `Appointment booked for <strong>${date}</strong>!`;
message.style.color = "lightgreen";

// Optional: Auto-open WhatsApp with confirmation
const phone = "60124810802"; // ← Replace with your WhatsApp number (e.g. +60 for Malaysia)
const text = `Hi Brandburst, I just booked an appointment for ${date} for ${service}. My name is ${name}, and my contact number is ${contact}.`;
const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;

window.open(url, "_blank");

document.getElementById("bookingForm").reset();

    }
  } catch (error) {
    console.error("Error saving to Firebase:", error);
    message.innerHTML = "Something went wrong. Try again.";
    message.style.colo
