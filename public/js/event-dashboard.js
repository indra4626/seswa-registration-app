if (!localStorage.getItem("loggedIn")) {
  window.location.href = "rep-login.html";
}

document.getElementById("logoutBtn").onclick = () => {
  localStorage.removeItem("loggedIn");
  window.location.href = "rep-login.html";
};

/*
Data format expected in localStorage:

participants = [
 {
   id: "EVT001",
   lunch: true,
   dinner: false,
   accommodation: true
 }
]
*/

const participants = JSON.parse(localStorage.getItem("participants")) || [];

const total = participants.length;
const lunch = participants.filter(p => p.lunch).length;
const dinner = participants.filter(p => p.dinner).length;
const accommodation = participants.filter(p => p.accommodation).length;

document.getElementById("totalParticipants").textContent = total;
document.getElementById("lunchCount").textContent = lunch;
document.getElementById("dinnerCount").textContent = dinner;
document.getElementById("accommodationCount").textContent = accommodation;
