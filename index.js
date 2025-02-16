  import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider,
signInWithPopup} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, collection, addDoc, getDocs, doc, setDoc, query, where, onSnapshot, deleteDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// **Firebase Config**
const firebaseConfig = {
  apiKey: "AIzaSyDqKU-Ycbp_nlFD4OhcUlZZ0sUNZkk1C9w",
  authDomain: "attendancemanagement-e2d24.firebaseapp.com",
  projectId: "attendancemanagement-e2d24",
  storageBucket: "attendancemanagement-e2d24.appspot.com",
  messagingSenderId: "725859119077",
  appId: "1:725859119077:web:29a614489c5aa47e33c90c"
};

// **Initialize Firebase**
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let user = null;

function AuthStateChanged() {
  onAuthStateChanged(auth, (u) => {
    user = u;
    if (u) {
      console.log("User logged in:", u.email);
      if (window.location.href == "https://anuj2025.github.io/AttandanceSys/Login.html")
      { window.location.href = "https://anuj2025.github.io/AttandanceSys/";
      }
    } else {
      console.log("No user logged in.");
      if (window.location.href == "https://anuj2025.github.io/AttandanceSys/")
      { window.location.href = "https://anuj2025.github.io/AttandanceSys/Login.html";
      }
    }
  });
}

// login with Google 

async function GoogleCreateAccount() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    user = result.user;
  } catch (e) {
   alert(e.message)
  }
}

// **Generate a Random ID**
function generateID(length = 10) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join("");
}

// **Add Student to Firestore**
async function addUser() {
  if (!user) {
    alert("Please log in first.");
    return;
  }

  const name = document.querySelector("#name").value.trim();
  const status = document.querySelector("#status").value.trim();
  
  if (!name) {
    alert("Please enter a name.");
    return;
  }
  const formattedDate = new Date().toISOString().split("T")[0];

  const userCollection = `${user.email.split("@")[0]}/students/${formattedDate}`;
  const studentID = generateID();

  try {
    await setDoc(doc(db, userCollection, studentID), {
      name: name,
      date: new Date().toISOString(),
      stat: status,
    });

    alert("Student added successfully!");
    document.querySelector("#name").value = "";
    updateList(); // Refresh the list after adding
  } catch (e) {
    alert("Error adding student: " + e.message);
  }
}

// **Retrieve & Display Students for Specific User**//
function updateList() {
  if (!user) {
    console.log("No user logged in.");
    return;
  }

  const formattedDate = new Date().toISOString().split("T")[0];
  const userCollection = `${user.email.split("@")[0]}/students/${formattedDate}`;
  const table = document.getElementById("table");

  table.innerHTML = "<h3>Student List</h3>";

  // Use Firestore real-time listener
  const studentsRef = collection(db, userCollection);
  onSnapshot(studentsRef, (snapshot) => {
    table.innerHTML = "<h3>Student List</h3>"; // Clear previous data

    if (snapshot.empty) {
      table.innerHTML += "<p>No students found.</p>";
    } else {
      snapshot.forEach((doc) => {
        const student = doc.data();
        table.innerHTML += `
          <div class="table-content">
            <h3>${student.name}</h3>
            <div class="table-Date">${new Date(student.date).toLocaleString()}</div>
            <div class="status">${student.stat}</div>
          </div>
        `;
      });
    }
  }, (error) => {
    alert("Error fetching students: " + error.message);
    table.innerHTML = `Nothing Found`
  });
}



// **Mark Attendance**
async function markAttendance(studentID, status) {
  if (!user) return;
  const formattedDate = new Date().toISOString().split("T")[0];

  const userCollection = `${user.email.split("@")[0]}/students/${formattedDate}/${StudentId}`;
  try {
    const ref = doc(db, userCollection, StudentId);
    await updateDoc(ref, {
      attendance: status,
      })
    alert("status added")
    updateList();
  } catch (e) {
    alert("Error updating attendance: " + e.message);
  }
}

// **Sign In User**
async function signUser(email, password) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    alert("Login successful!");
    window.location.pathname = "/";
  } catch (error) {
    alert(error.message);
  }
}

// **Sign Up User**
async function signUpUser(email, password) {
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("Account created successfully!");
    window.location.pathname = "/";
  } catch (error) {
    alert(error.message);
  }
}

// **Get Form Data for Login**
function getFormData(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const { email, password } = Object.fromEntries(formData.entries());
  signUpUser(email, password);
}

// **Event Listeners**
window.onload = () => {
  const addUserBtn = document.getElementById("AddUser");
  const loginForm = document.querySelector("#LoginForm");
 const presentBtn = document.querySelector("#present")
 const absentBtn = document.querySelector("#absent")
 const GoogleLogin = document.querySelector("#GoogleLogin")
 
 if (user) {
   loginForm.innerText = "userFound";
 }
 
 
 if (presentBtn) presentBtn.addEventListener("click", () => {
   const studentID = button.getAttribute("data-id");
  const status = button.getAttribute("data-type");
  console.log(studentID, status)
    markAttendance(studentID, status)
 })

if (GoogleLogin) GoogleLogin.addEventListener("click", GoogleCreateAccount)

  if (addUserBtn) addUserBtn.addEventListener("click", addUser);

  if (loginForm) loginForm.addEventListener("submit", getFormData);
  AuthStateChanged();
  setTimeout(function() {
    updateList();
  }, 3000);
};
