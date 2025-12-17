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
import { collection, getDocs, updateDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Show pending transactions
async function refreshTransactions(){
  const container = document.getElementById("txContainer");
  container.innerHTML = "";
  const snap = await getDocs(collection(db,"transactions"));
  snap.forEach(async d=>{
    const tx = d.data();
    if(tx.status === "pending"){
      const userSnap = await getDoc(doc(db,"users",tx.userId));
      const user = userSnap.data();
      const div = document.createElement("div");
      div.innerHTML = `<b>${user.name}</b> | ${tx.type} $${tx.amount} 
        <button onclick="approveTx('${d.id}', '${tx.userId}', ${tx.amount}, '${tx.type}')">Approve</button>
        <button onclick="rejectTx('${d.id}')">Reject</button>`;
      container.appendChild(div);
    }
  });
}
refreshTransactions();

// Approve Transaction
window.approveTx = async (txId, userId, amount, type)=>{
  const userRef = doc(db,"users",userId);
  const userSnap = await getDoc(userRef);
  const user = userSnap.data();

  let newBalance = user.balance;
  const fee = 50; // example fee $50
  if(type === "Deposit") newBalance += amount - fee;
  if(type === "Withdrawal" || type === "Transfer") newBalance -= (amount + fee);

  await updateDoc(userRef,{balance: newBalance});
  await updateDoc(doc(db,"transactions",txId),{status:"approved"});
  alert(`Transaction approved. Fee applied: $${fee}`);
  refreshTransactions();
};

// Reject Transaction
window.rejectTx = async (txId)=>{
  await updateDoc(doc(db,"transactions",txId),{status:"rejected"});
  alert("Transaction rejected");
  refreshTransactions();
};
