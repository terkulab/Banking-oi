import { auth, db } from './firebase.js';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// USER LOGIN
if(document.getElementById('loginBtn')){
  const loginBtn = document.getElementById('loginBtn');
  loginBtn.onclick = async () => {
    const emailVal = document.getElementById('email').value.trim();
    const passVal = document.getElementById('password').value.trim();
    try {
      const userCred = await signInWithEmailAndPassword(auth, emailVal, passVal);
      const snap = await getDoc(doc(db,"users",userCred.user.uid));
      if(!snap.exists()){alert("User not found"); return;}
      const role = snap.data().role;
      if(role === "admin"){
        window.location.href="admin-panel.html";
      }else{
        window.location.href="dashboard.html";
      }
    } catch(e){
      alert("Login failed: " + e.message);
    }
  };
}

// ADMIN LOGIN
if(document.getElementById('adminLoginBtn')){
  const adminLoginBtn = document.getElementById('adminLoginBtn');
  adminLoginBtn.onclick = async () => {
    const emailVal = document.getElementById('adminEmail').value.trim();
    const passVal = document.getElementById('adminPassword').value.trim();
    try {
      const userCred = await signInWithEmailAndPassword(auth, emailVal, passVal);
      const snap = await getDoc(doc(db,"users",userCred.user.uid));
      if(snap.data().role !== 'admin'){alert("Not authorized"); return;}
      window.location.href = "admin-panel.html";
    } catch(e){
      alert("Admin login failed: " + e.message);
    }
  };
}
