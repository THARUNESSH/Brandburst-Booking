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
      const docRef = await bookingsRef.add({
        name,
        email,
        contact,
        service,
        date,
        timestamp: new Date()
      });

      message.innerHTML = `Appointment booked for <strong>${date}</strong>!`;
      message.style.color = "lightgreen";
      document.getElementById("bookingForm").reset();

      // WhatsApp confirmation
      const phone = "60124810802"; // Replace with your WhatsApp number
      const text = `Hi Brandburst, I just booked an appointment (ID: ${docRef.id}) for ${date} for ${service}. My name is ${name}, and my contact number is ${contact}.`;
      const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    }
  } catch (error) {
    console.error("Firebase error:", error);
    message.innerHTML = "Something went wrong. Try again.";
    message.style.color = "red";
  }
});

// Chatbot
function toggleChat() {
  const chat = document.getElementById("chatbot");
  chat.style.display = chat.style.display === "flex" ? "none" : "flex";
}

function sendMessage() {
  const input = document.getElementById("userInput");
  const msg = input.value.trim();
  if (!msg) return;

  const chatBody = document.getElementById("chatBody");

  chatBody.innerHTML += `<div><strong>You:</strong> ${msg}</div>`;
  const reply = getBotReply(msg.toLowerCase());
  chatBody.innerHTML += `<div><strong>Bot:</strong> ${reply}</div>`;

  input.value = "";
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotReply(message) {
  if (message.includes("hello") || message.includes("hi")) return "Hi there! How can I assist you?";
  if (message.includes("book")) return "Please fill out the form to book your slot.";
  if (message.includes("service")) return "We offer Laptop Repair and Graphic Design services.";
  if (message.includes("contact")) return "You can contact us using your number or email in the form.";
  if (message.includes("location")) return "We're based at SMK Taman Inderawasih.";
  return "Sorry, I didn't understand. Try asking about booking, services, or contact info.";
}
