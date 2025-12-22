import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabase = createClient(
  "https://aaljhxyrqnewvhejtoik.supabase.co",
  "sb_publishable_52hZQtxrDZB4k_fLi8S0GQ_j5wma9lz"
);

export let currentUser = JSON.parse(localStorage.getItem('currentUser'));
if(!currentUser) location.href='index.html';

export function renderDashboard(){
  document.getElementById('name').textContent = currentUser.name;
  document.getElementById('acct').textContent = currentUser.acct;
  document.getElementById('balance').textContent = '$'+Number(currentUser.balance).toLocaleString();
  document.getElementById('photo').src = currentUser.photo || 'https://via.placeholder.com/100';
}

export function locked(){
  alert('Account restricted 🔐 contact support');
}

export async function refreshUser(){
  const { data } = await supabase.from('users').select('*').eq('id', currentUser.id).single();
  if(data){ currentUser=data; localStorage.setItem('currentUser', JSON.stringify(currentUser)); renderDashboard(); }
}

export function logout(){
  localStorage.removeItem('currentUser');
  location.href='index.html';
}