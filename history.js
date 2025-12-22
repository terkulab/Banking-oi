import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'
const supabase = createClient(
  "https://aaljhxyrqnewvhejtoik.supabase.co",
  "sb_publishable_52hZQtxrDZB4k_fLi8S0GQ_j5wma9lz"
);

let currentUser = JSON.parse(localStorage.getItem('currentUser'));
if(!currentUser) location.href='index.html';

export async function loadTransactions(){
  const { data } = await supabase.from('transactions')
    .select('*')
    .eq('user_id', currentUser.id)
    .order('created_at', { ascending:false });

  const tbody = document.getElementById('txTable');
  tbody.innerHTML='';
  data.forEach(tx=>{
    let statusClass = tx.status==='Completed'?'status-completed':
                      tx.status==='Pending'?'status-pending':'status-reversed';
    tbody.innerHTML += `
      <tr>
        <td>${tx.type}</td>
        <td>$${Number(tx.amount).toLocaleString()}</td>
        <td class="${statusClass}">${tx.status}</td>
        <td>${new Date(tx.created_at).toLocaleString()}</td>
      </tr>
    `;
  });
}