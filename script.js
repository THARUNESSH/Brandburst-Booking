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
    return;
  }

  try {
    const bookingsRef = db.collection("appointments");
    const existing = await bookingsRef.where("date", "==", date).get();

    if (!existing.empty) {
      message.innerHTML = `❌ ${date} is already booked. Please choose another date.`;
      return;
    }

    const docRef = await bookingsRef.add({
      name, email, contact, service, date,
      timestamp: new Date()
    });

    const address = "📍 7, Lengkok Kikik 7, Taman Inderawasih, 13600, Perai, Pulau Pinang";
    message.innerHTML = `✅ Booking confirmed for ${date}!<br>${address}`;

    // WhatsApp confirmation
    const phone = "60123456789";
    const text = `Hi Brandburst, I just booked (ID: ${docRef.id}) for ${date} - ${service}. My name is ${name}, contact: ${contact}. Please note the address: ${address}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");

    document.getElementById("bookingForm").reset();
  } catch (error) {
    console.error(error);
    message.innerHTML = "⚠️ Something went wrong.";
  }
});

// Chatbot
function toggleChat() {
  const chat = document.getElementById("chatbot");
  chat.style.display = chat.style.display === "flex" ? "none" : "flex";
}

async function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;

  const chatBody = document.getElementById("chatBody");
  chatBody.innerHTML += `<div><strong>You:</strong> ${msg}</div>`;

  let reply = "Sorry, I didn’t understand. Try asking about services or dates.";

  if (msg.toLowerCase().includes("service")) {
    reply = "We offer Laptop Repair and Graphic Design.";
  } else if (msg.toLowerCase().includes("date") || msg.toLowerCase().includes("available")) {
    reply = await getAvailableDateReply();
  } else if (msg.toLowerCase().includes("hi") || msg.toLowerCase().includes("hello")) {
    reply = "Hi there! How can I help you today?";
  }

  chatBody.innerHTML += `<div><strong>Bot:</strong> ${reply}</div>`;
  input.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;
}

async function getAvailableDateReply() {
  const bookingsRef = db.collection("appointments");
  const today = new Date();
  for (let i = 1; i <= 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);
    const formatted = checkDate.toISOString().split("T")[0];

    const existing = await bookingsRef.where("date", "==", formatted).get();
    if (existing.empty) {
      return `✅ ${formatted} is available for booking.`;
    }
  }
  return "⚠️ All dates are booked for the next 30 days.";
}
