const tableBody = document.querySelector("#appointmentsTable tbody");

db.collection("appointments")
  .orderBy("date", "asc")
  .get()
  .then(snapshot => {
    snapshot.forEach(doc => {
      const data = doc.data();
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${data.name}</td>
        <td>${data.service}</td>
        <td>${data.date}</td>
        <td>${new Date(data.timestamp?.seconds * 1000).toLocaleString()}</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch(error => {
    console.error("Error loading bookings:", error);
  });
