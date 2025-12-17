kyc: {
  status: "not_submitted | pending | approved | rejected",
  address: "",
  passportUrl: ""
}

import { storage, db } from './app.js';
import { ref, uploadBytes, getDownloadURL } 
from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-storage.js';
import { updateDoc } 
from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';

submitKyc.onclick = async () => {
  const file = passport.files[0];
  if(!file) return alert('Upload passport');

  const imgRef = ref(storage, `kyc/${user.uid}.jpg`);
  await uploadBytes(imgRef, file);
  const url = await getDownloadURL(imgRef);

  await updateDoc(doc(db,'users',user.uid),{
    kyc:{
      status:'pending',
      address:kycAddress.value,
      passportUrl:url
    }
  });

  kycStatus.innerText = 'KYC submitted, awaiting approval';
};

{
  userId: "uid",
  type: "Deposit | Transfer | Withdrawal",
  amount: 5000,
  status: "pending | approved | rejected",
  proofUrl: "",
  createdAt: timestamp
}

async function startTransaction(type){
  const amount = prompt(`Enter ${type} amount`);
  if(!amount) return;

  const txRef = await addDoc(collection(db,'transactions'),{
    userId:user.uid,
    type,
    amount:Number(amount),
    status:'pending',
    createdAt:new Date()
  });

  alert(`Send payment to: ${userData.paymentAddress}`);
}

const proofRef = ref(storage, `proofs/${txId}.jpg`);
await uploadBytes(proofRef, proofFile);
const proofUrl = await getDownloadURL(proofRef);

await updateDoc(doc(db,'transactions',txId),{
  proofUrl
});

const usersSnap = await getDocs(collection(db,'users'));
usersSnap.forEach(doc=>{
  const u = doc.data();
  // render user row
});

await updateDoc(doc(db,'users',uid),{
  'kyc.status':'approved'
});

await updateDoc(doc(db,'transactions',txId),{
  status:'approved'
});

await updateDoc(doc(db,'users',uid),{
  balance: increment(-amount)
});

rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {

    match /users/{uid} {
      allow read: if request.auth.uid == uid;
      allow write: if request.auth != null &&
        get(/databases/$(db)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }

    match /transactions/{id} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
  }
}
