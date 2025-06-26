// Simple password prompt
const allowedPassword = "admin123"; // You can change this
const userInput = prompt("Enter admin password:");

if (userInput !== allowedPassword) {
  document.body.innerHTML = "<h2>🚫 Access Denied</h2>";
  throw new Error("Unauthorized access");
}

// Load Firestore bookings
const tableBody = document.getElementById("tableBody");
const searchInput = document.getElementById("searchInput");

function renderRow(doc) {
  const data = doc.data();
  return `
    <tr>
      <td>${data.name}</td>
      <td>${data.email}</td>
      <td>${data.contact}</td>
      <td>${data.service}</td>
      <td>${data.date}</td>
    </tr>
  `;
}

function loadBookings(filter = "") {
  db.collection("appointments")
    .orderBy("date")
    .get()
    .then(snapshot => {
      tableBody.innerHTML = "";
      snapshot.forEach(doc => {
        const data = doc.data();
        const searchMatch = filter === "" || 
          data.name.toLowerCase().includes(filter) || 
          data.date.includes(filter);
        if (searchMatch) {
          tableBody.innerHTML += renderRow(doc);
        }
      });
    });
}

// Initial load
loadBookings();

// Search handler
searchInput.addEventListener("input", () => {
  const filter = searchInput.value.trim().toLowerCase();
  loadBookings(filter);
});
