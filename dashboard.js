import { auth, db, storage } from './firebase.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { doc, getDoc, updateDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import { ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js";

const userSections = ["dash","kyc","history"];
function showSection(id){
  userSections.forEach(s=>document.getElementById(s).classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}
window.showSection = showSection;

onAuthStateChanged(auth, async user=>{
  if(!user) location.href="index.html";
  const snap = await getDoc(doc(db,"users",user.uid));
  const data = snap.data();
  document.getElementById("name").innerText = data.name;
  document.getElementById("balance").innerText = data.balance;
  window.currentUser = user;
  window.userData = data;
});

window.action = async (type)=>{
  const amt = prompt(`Enter ${type} amount`);
  if(!amt) return;
  const txRef = await addDoc(collection(db,"transactions"),{
    userId: window.currentUser.uid,
    type,
    amount:+amt,
    status:"pending",
    createdAt:new Date()
  });
  alert(`Send payment to: ${window.userData.paymentAddress}`);
};

window.uploadKYC = async ()=>{
  const file = document.getElementById("passport").files[0];
  if(!file) return alert("Upload passport");
  const storageRef = ref(storage, `kyc/${window.currentUser.uid}.jpg`);
  await uploadBytes(storageRef,file);
  const url = await getDownloadURL(storageRef);
  await updateDoc(doc(db,"users",window.currentUser.uid),{
    kyc:{status:"pending",passport:url,address:document.getElementById("address").value}
  });
  alert("KYC submitted, awaiting admin approval");
};

window.logout = ()=> signOut(auth).then(()=>location.href="index.html");
