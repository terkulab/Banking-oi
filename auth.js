import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabase = createClient(
  "https://aaljhxyrqnewvhejtoik.supabase.co",
  "sb_publishable_52hZQtxrDZB4k_fLi8S0GQ_j5wma9lz"
);

export async function login(username, password){
  const { data, error } = await supabase.from('users').select('*').eq('username', username).single();
  if(error || !data) throw new Error('Invalid username');
  if(password !== data.password) throw new Error('Invalid password');
  localStorage.setItem('currentUser', JSON.stringify(data));
  return data;
}

export async function signup(name, username, password){
  const { data:exists } = await supabase.from('users').select('*').eq('username', username).single();
  if(exists) throw new Error('Username exists');
  const { data, error } = await supabase.from('users').insert({
    name, username, password, acct:'ACCT'+Math.floor(Math.random()*1000000), balance:0
  }).select().single();
  if(error) throw new Error(error.message);
  localStorage.setItem('currentUser', JSON.stringify(data));
  return data;
}