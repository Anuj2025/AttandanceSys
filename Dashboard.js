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
async function getTotalStudentsCount() {
  if (!user) return;

  const formattedDate = new Date().toISOString().split("T")[0];
  const userCollection = `${user.email.split("@")[0]}/students/${formattedDate}`;

  try {
    // Get total number of students
    const allStudentsQuery = collection(db, userCollection);
    const allStudentsSnapshot = await getDocs(allStudentsQuery);
    const totalStudents = allStudentsSnapshot.size; // ✅ Count all students

    // Get number of students marked as "present"
    const presentQuery = query(collection(db, userCollection), where("attendance", "==", "present"));
    const presentSnapshot = await getDocs(presentQuery);
    const totalPresent = presentSnapshot.size; // ✅ Count present students

    console.log(`Total Students: ${totalStudents}, Present: ${totalPresent}`);

    // Update UI
    const totalStudentsElement = document.getElementById("totalStudents");
    const totalPresentElement = document.getElementById("totalPresent");

    if (totalStudentsElement) totalStudentsElement.innerText = `Total Students: ${totalStudents}`;
    if (totalPresentElement) totalPresentElement.innerText = `Total Present: ${totalPresent}`;

  } catch (error) {
    console.error("Error getting student counts: ", error);
  }
}
// **Monitor Authentication State**
function AuthStateChanged() {
  onAuthStateChanged(auth, (u) => {
    user = u;
    if (u) {
      console.log("User logged in:", u.email);
      getTotalStudentsCount();
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


// **Call function after authentication**
window.onload = () => {
  AuthStateChanged();
  getTotalStudentsCount()
};
