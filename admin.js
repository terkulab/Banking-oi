import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'
const supabase = createClient(
  "https://aaljhxyrqnewvhejtoik.supabase.co",
  "sb_publishable_52hZQtxrDZB4k_fLi8S0GQ_j5wma9lz"
);

let adminUser = JSON.parse(localStorage.getItem('currentUser'));
if(!adminUser || adminUser.role!=='admin') location.href='index.html';

export function logout(){ localStorage.removeItem('currentUser'); location.href='index.html'; }

export async function loadUsers(){
  const { data: users } = await supabase.from('users').select('*').order('name');
  const tbody = document.getElementById('userTable');
  tbody.innerHTML='';
  users.forEach(user=>{
    let statusClass = user.is_frozen?'status-Frozen':'status-Active';
    tbody.innerHTML += `
      <tr>
        <td>${user.name}</td>
        <td>${user.username}</td>
        <td>${user.acct}</td>
        <td>$${Number(user.balance).toLocaleString()}</td>
        <td class="status-${user.kyc_status}">${user.kyc_status}</td>
        <td class="${statusClass}">${user.is_frozen?'Frozen':'Active'}</td>
        <td>
          <button onclick="adjustBalance('${user.id}', true)">Add</button>
          <button onclick="adjustBalance('${user.id}', false)">Deduct</button>
          <button onclick="toggleFreeze('${user.id}', ${user.is_frozen})">${user.is_frozen?'Unfreeze':'Freeze'}</button>
          <button onclick="handleKYC('${user.id}', 'Approved')">Approve KYC</button>
          <button onclick="handleKYC('${user.id}', 'Rejected')">Reject KYC</button>
        </td>
      </tr>
    `;
  });
}

export async function adjustBalance(userId, isAdd){
  let amount = parseFloat(prompt(`Enter amount to ${isAdd?'add':'deduct'}:`));
  if(isNaN(amount)||amount<=0){ alert('Invalid amount'); return; }
  const { data:user } = await supabase.from('users').select('*').eq('id', userId).single();
  let newBalance = isAdd?user.balance+amount:user.balance-amount;
  if(newBalance<0){ alert('Insufficient funds'); return; }
  await supabase.from('users').update({ balance:newBalance }).eq('id', userId);
  await supabase.from('transactions').insert({
    user_id:userId, admin_id:adminUser.id,
    type:isAdd?'Admin Credit':'Admin Debit', amount, status:'Completed'
  });
  loadUsers();
}

export async function toggleFreeze(userId,isFrozen){
  await supabase.from('users').update({ is_frozen:!isFrozen }).eq('id', userId);
  loadUsers();
}

export async function handleKYC(userId,action){
  await supabase.from('users').update({ kyc_status: action }).eq('id', userId);
  await supabase.from('kyc').update({ status: action }).eq('user_id', userId);
  loadUsers();
}