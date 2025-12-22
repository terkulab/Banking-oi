import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'
const supabase = createClient(
  "https://aaljhxyrqnewvhejtoik.supabase.co",
  "sb_publishable_52hZQtxrDZB4k_fLi8S0GQ_j5wma9lz"
);

let user = JSON.parse(localStorage.getItem('currentUser'));
if(!user) location.href='index.html';

export async function loadKYC(){
  const { data } = await supabase.from('users').select('kyc_status').eq('id', user.id).single();
  document.getElementById('kycStatus').innerHTML = `<div class="status ${data.kyc_status}">KYC Status: ${data.kyc_status}</div>`;
}

export async function submitKYC(fullName,address,idType,file){
  if(!fullName||!address||!idType||!file) throw new Error('All fields required');
  const filePath = `${user.id}/${Date.now()}_${file.name}`;
  const { error:uploadErr } = await supabase.storage.from('kyc-documents').upload(filePath, file);
  if(uploadErr) throw new Error(uploadErr.message);
  const { data:urlData } = supabase.storage.from('kyc-documents').getPublicUrl(filePath);
  await supabase.from('kyc').upsert({
    user_id: user.id,
    full_name: fullName,
    address,
    id_type: idType,
    id_url: urlData.publicUrl,
    status: 'Pending'
  });
  await supabase.from('users').update({ kyc_status:'Pending' }).eq('id', user.id);
  loadKYC();
}