import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { collection, setDoc, doc, getDocs } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

async function refreshUsers(){
  const container = document.getElementById("usersContainer");
  container.innerHTML = "";
  const snap = await getDocs(collection(db,"users"));
  snap.forEach(d=>{
    const u = d.data();
    const div = document.createElement("div");
    div.innerHTML = `<b>${u.name}</b> | Balance: $${u.balance} | KYC: ${u.kyc?.status||'Not Submitted'}`;
    container.appendChild(div);
  });
}
refreshUsers();

document.getElementById("addUserBtn").onclick = async ()=>{
  const name = document.getElementById("newName").value;
  const email = document.getElementById("newEmail").value;
  const pass = document.getElementById("newPass").value;
  const balance = Number(document.getElementById("newBalance").value);
  const accountNumber = document.getElementById("newAccount").value;
  const paymentAddress = document.getElementById("newPayment").value;

  const cred = await createUserWithEmailAndPassword(auth,email,pass);
  await setDoc(doc(db,"users",cred.user.uid),{
    name,email,balance,role:"user",accountNumber,paymentAddress,kyc:{status:"not_submitted"}
  });
  alert("User added successfully");
  refreshUsers();
};
