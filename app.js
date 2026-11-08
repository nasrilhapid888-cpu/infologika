// Infologika: Supabase-connected PWA
const SUPABASE_URL = "https://ggyfiozewkeysbxoitlh.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_gFyjY-5WTZWZDIxWdvBZFA_eag23yaQ";
const STORAGE_KEY = "infologika_articles_v1";
const categories = ["Semua", "Karier", "Bisnis", "Teknologi", "Tutorial"];
const starterArticles = [
  {id:"sample-1",title:"Cara Menyusun CV yang Jelas dan Menarik",category:"Karier",read:"3 menit",date:"2026-11-01",excerpt:"Panduan sederhana menyusun CV agar pengalaman, keterampilan, dan informasi penting mudah dipahami perekrut.",content:"CV yang baik tidak harus penuh desain atau tulisan panjang. Hal terpenting adalah informasi tersusun rapi, mudah dibaca, dan sesuai dengan pekerjaan yang dilamar.\n\n1. Cantumkan identitas dan kontak yang aktif.\n2. Tulis profil singkat yang relevan dengan posisi.\n3. Jelaskan pengalaman menggunakan tugas dan kontribusi yang benar-benar pernah dilakukan.\n4. Pilih keterampilan yang sesuai dengan pekerjaan.\n5. Periksa ejaan, nomor telepon, dan alamat email sebelum mengirim.\n\nSesuaikan CV untuk setiap lowongan. Jangan menambahkan pengalaman atau kemampuan yang tidak kamu miliki."},
  {id:"sample-2",title:"Mulai Usaha Kecil dengan Perencanaan Sederhana",category:"Bisnis",read:"4 menit",date:"2026-11-02",excerpt:"Kenali calon pembeli, hitung modal, dan uji produk dalam skala kecil sebelum mengembangkan usaha.",content:"Usaha kecil bisa dimulai dengan langkah yang terukur. Jangan terburu-buru membeli banyak stok sebelum mengetahui kebutuhan calon pembeli.\n\n1. Amati masalah atau kebutuhan di lingkungan sekitar.\n2. Tentukan produk dan siapa calon pembelinya.\n3. Hitung biaya bahan, kemasan, transportasi, dan biaya lain.\n4. Uji penjualan dalam jumlah kecil.\n5. Catat pemasukan, pengeluaran, dan keuntungan secara terpisah.\n\nEvaluasi hasil penjualan secara rutin. Angka keuntungan harus dihitung setelah seluruh biaya diperhitungkan."},
  {id:"sample-3",title:"Lindungi Akun Digital dengan Kebiasaan Aman",category:"Teknologi",read:"3 menit",date:"2026-11-03",excerpt:"Langkah dasar untuk mengurangi risiko akun diretas, mulai dari kata sandi unik hingga verifikasi dua langkah.",content:"Akun email dan media sosial sering terhubung dengan layanan lain. Karena itu, menjaga keamanan akun utama sangat penting.\n\nGunakan kata sandi yang panjang dan berbeda untuk setiap layanan. Aktifkan autentikasi dua faktor bila tersedia. Jangan membagikan kode OTP atau tautan pemulihan kepada siapa pun.\n\nWaspadai pesan yang mendesak kamu mengklik tautan atau memasukkan data pribadi. Buka aplikasi atau situs resmi secara langsung untuk memeriksa informasi."},
  {id:"sample-4",title:"Cara Membuat Anggaran Bulanan yang Realistis",category:"Bisnis",read:"5 menit",date:"2026-11-04",excerpt:"Catat pemasukan dan pengeluaran agar kamu lebih mudah menentukan prioritas keuangan setiap bulan.",content:"Anggaran membantu kita memahami ke mana uang digunakan. Mulailah dengan mencatat seluruh pemasukan bersih dan pengeluaran rutin.\n\nKelompokkan pengeluaran menjadi kebutuhan pokok, kewajiban, tabungan, dan keinginan. Sisihkan dana untuk kebutuhan penting terlebih dahulu. Jika pengeluaran lebih besar daripada pemasukan, cari pos yang bisa dikurangi tanpa mengabaikan kebutuhan dasar.\n\nEvaluasi anggaran setiap minggu agar rencana tetap realistis."},
  {id:"sample-5",title:"Mengenal Penyimpanan Cloud dan Manfaatnya",category:"Teknologi",read:"4 menit",date:"2026-11-05",excerpt:"Penyimpanan cloud membantu menyimpan dan mengakses file melalui internet dari beberapa perangkat.",content:"Cloud storage adalah layanan penyimpanan file pada server yang dapat diakses melalui internet. Contohnya layanan penyimpanan dokumen, foto, dan berkas kerja.\n\nManfaatnya antara lain memudahkan akses lintas perangkat, berbagi file, dan memiliki salinan cadangan. Namun, tetap gunakan kata sandi kuat, aktifkan verifikasi dua langkah, dan periksa pengaturan berbagi.\n\nUntuk dokumen penting, pertimbangkan memiliki salinan cadangan lain yang tidak hanya tersimpan di satu akun."},
  {id:"sample-6",title:"Langkah Awal Belajar Keterampilan Digital",category:"Tutorial",read:"3 menit",date:"2026-11-06",excerpt:"Pilih satu keterampilan, buat jadwal latihan, dan bangun portofolio kecil untuk melihat perkembangan.",content:"Belajar keterampilan digital akan lebih mudah jika fokus pada satu bidang terlebih dahulu. Misalnya desain sederhana, pengolahan dokumen, pengeditan video, atau dasar pembuatan website.\n\nTentukan hasil yang ingin dibuat. Pelajari materi dasar, praktikkan dengan proyek kecil, lalu minta masukan. Simpan hasil terbaik sebagai portofolio.\n\nKonsistensi latihan lebih penting daripada mencoba terlalu banyak hal sekaligus."}
];
const $ = id => document.getElementById(id);
let supabaseClient = null, currentUser = null, articles = [...starterArticles];
let activeCategory = "Semua", deferredInstallPrompt = null;

function escapeHTML(value=""){return String(value).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function formatDate(date){try{return new Date(date+"T00:00:00").toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});}catch(e){return date||"";}}
function categoryIcon(cat){return ({Karier:"↗",Bisnis:"◈",Teknologi:"⌘",Tutorial:"✦"})[cat]||"i";}
function estimateRead(content){return Math.max(1,Math.ceil((content||"").trim().split(/\s+/).length/200))+" menit";}
function mapRow(row){return {id:row.id,title:row.title,slug:row.slug,category:row.category,read:estimateRead(row.content),date:(row.created_at||"").slice(0,10),excerpt:row.excerpt||"",content:row.content||"",published:row.published};}
function status(message,isError=false){$("formStatus").textContent=message;$("formStatus").style.color=isError?"#b42318":"";}
async function loadPublicArticles(){
  if(!supabaseClient)return;
  const {data,error}=await supabaseClient.from("articles").select("*").eq("published",true).order("created_at",{ascending:false});
  if(error){console.error(error);return;}
  if(data && data.length){articles=data.map(mapRow);renderArticles();}
}
function renderCategories(){
  $("categoryRow").innerHTML=categories.map(c=>`<button class="category-chip ${activeCategory===c?"selected":""}" data-category="${c}">${c}</button>`).join("");
  $("categoryRow").querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{activeCategory=btn.dataset.category;renderCategories();renderArticles();}));
}
function renderArticles(){
  const q=$("searchInput").value.trim().toLowerCase();
  const filtered=articles.filter(a=>(activeCategory==="Semua"||a.category===activeCategory)&&[a.title,a.excerpt,a.content,a.category].join(" ").toLowerCase().includes(q));
  $("articleGrid").innerHTML=filtered.map((a,i)=>`<article class="article-card" tabindex="0" role="button" data-id="${escapeHTML(a.id)}" aria-label="Baca ${escapeHTML(a.title)}"><div class="card-visual visual-${(i%6)+1}"><span class="visual-symbol">${categoryIcon(a.category)}</span></div><div class="card-content"><div class="card-meta"><span class="tag">${escapeHTML(a.category)}</span><span>${formatDate(a.date)}</span><span>· ${escapeHTML(a.read)}</span></div><h3>${escapeHTML(a.title)}</h3><p>${escapeHTML(a.excerpt)}</p><span class="read-link">Baca selengkapnya →</span></div></article>`).join("");
  $("emptyState").hidden=filtered.length!==0;
  $("articleGrid").querySelectorAll(".article-card").forEach(card=>{const open=()=>openArticle(card.dataset.id);card.addEventListener("click",open);card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});});
}
function openArticle(id){const a=articles.find(x=>x.id===id);if(!a)return;$("modalMeta").innerHTML=`<span class="tag">${escapeHTML(a.category)}</span><span>${formatDate(a.date)}</span><span>· ${escapeHTML(a.read)}</span>`;$("modalTitle").textContent=a.title;$("modalLead").textContent=a.excerpt;$("modalBody").textContent=a.content;showModal("articleModal");}
function showModal(id){$(id).hidden=false;document.body.style.overflow="hidden";}
function hideModal(id){$(id).hidden=true;if($("articleModal").hidden&&$("adminModal").hidden)document.body.style.overflow="";}
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>hideModal(b.dataset.close)));
document.querySelectorAll(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)hideModal(m.id);}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){hideModal("articleModal");hideModal("adminModal");}});
$("searchInput").addEventListener("input",renderArticles);$("year").textContent=new Date().getFullYear();

function resetForm(){$("articleForm").reset();$("articleId").value="";status("");}
function switchTab(tab){document.querySelectorAll(".tab-btn").forEach(b=>b.classList.toggle("selected",b.dataset.tab===tab));["editor","manage","backup"].forEach(t=>$("tab-"+t).hidden=t!==tab);if(tab==="manage")renderManageList();}
function renderManageList(){
  $("manageList").innerHTML=articles.length?articles.map(a=>`<div class="manage-item"><div><strong>${escapeHTML(a.title)}</strong><small>${escapeHTML(a.category)} · ${formatDate(a.date)} ${a.published===false?"· Draft":""}</small></div><div class="manage-actions"><button class="small-action" data-edit="${escapeHTML(a.id)}">Edit</button><button class="small-action delete" data-delete="${escapeHTML(a.id)}">Hapus</button></div></div>`).join(""):"<p>Belum ada artikel.</p>";
  $("manageList").querySelectorAll("[data-edit]").forEach(b=>b.addEventListener("click",()=>editArticle(b.dataset.edit)));
  $("manageList").querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>deleteArticle(b.dataset.delete)));
}
function editArticle(id){const a=articles.find(x=>x.id===id);if(!a)return;$("articleId").value=a.id;$("articleTitle").value=a.title;$("articleCategory").value=a.category;$("articleRead").value=a.read;$("articleExcerpt").value=a.excerpt;$("articleContent").value=a.content;$("articlePublished").checked=a.published!==false;switchTab("editor");status("Mode edit: ubah isi lalu simpan.");$("tab-editor").scrollIntoView({behavior:"smooth",block:"start"});}
async function refreshAdminArticles(){
  const {data,error}=await supabaseClient.from("articles").select("*").order("created_at",{ascending:false});
  if(error){status("Gagal memuat artikel admin: "+error.message,true);return;}
  articles=(data||[]).map(mapRow);renderArticles();renderManageList();
}
async function deleteArticle(id){
  const a=articles.find(x=>x.id===id);if(!a||!confirm(`Hapus artikel "${a.title}" dari database?`))return;
  const {error}=await supabaseClient.from("articles").delete().eq("id",id);
  if(error){status("Gagal menghapus: "+error.message,true);return;}
  await refreshAdminArticles();status("Artikel berhasil dihapus.");
}
$("articleForm").addEventListener("submit",async e=>{
  e.preventDefault();if(!currentUser){status("Silakan login sebagai admin terlebih dahulu.",true);return;}
  const title=$("articleTitle").value.trim(),content=$("articleContent").value.trim();
  const slug=title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")+"-"+Date.now().toString().slice(-6);
  const payload={title,slug,category:$("articleCategory").value,excerpt:$("articleExcerpt").value.trim(),content,published:$("articlePublished").checked,updated_at:new Date().toISOString()};
  const id=$("articleId").value;
  let result=id?await supabaseClient.from("articles").update(payload).eq("id",id):await supabaseClient.from("articles").insert(payload);
  if(result.error){status("Gagal menyimpan artikel: "+result.error.message,true);return;}
  await refreshAdminArticles();resetForm();status("Artikel berhasil disimpan ke database online.");
});
$("resetFormBtn").addEventListener("click",resetForm);
$("openAdminBtn").addEventListener("click",()=>{showModal("adminModal");updateAuthUI();});
document.querySelectorAll(".tab-btn").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
function updateAuthUI(){
  $("loginPanel").hidden=!!currentUser;$("adminWorkspace").hidden=!currentUser;
  $("adminUserLabel").textContent=currentUser?`Login sebagai ${currentUser.email}`:"";
  $("logoutBtn").hidden=!currentUser;
}
$("loginForm").addEventListener("submit",async e=>{
  e.preventDefault();$("loginStatus").textContent="Memeriksa akun...";
  const {data,error}=await supabaseClient.auth.signInWithPassword({email:$("loginEmail").value.trim(),password:$("loginPassword").value});
  if(error){$("loginStatus").textContent="Login gagal. Periksa email dan password.";return;}
  currentUser=data.user;$("loginPassword").value="";updateAuthUI();await refreshAdminArticles();$("loginStatus").textContent="Login berhasil.";
});
$("logoutBtn").addEventListener("click",async()=>{await supabaseClient.auth.signOut();currentUser=null;articles=[...starterArticles];renderArticles();updateAuthUI();$("loginStatus").textContent="Kamu sudah logout.";});
$("exportBtn").addEventListener("click",()=>{const blob=new Blob([JSON.stringify(articles,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="infologika-backup.json";a.click();URL.revokeObjectURL(url);$("backupStatus").textContent="Cadangan berhasil diunduh.";});
$("importInput").addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{const parsed=JSON.parse(await file.text());if(!Array.isArray(parsed)||!parsed.every(a=>a.title&&a.category&&a.content))throw new Error("Format tidak sesuai");$("backupStatus").textContent="Impor JSON hanya tersedia untuk cadangan lokal. Tambahkan artikel melalui formulir admin."; }catch(err){$("backupStatus").textContent="Gagal membaca file JSON.";}e.target.value="";});
$("restoreBtn").addEventListener("click",()=>{$("backupStatus").textContent="Artikel contoh tidak diunggah otomatis. Buat artikel baru melalui formulir admin.";});

renderCategories();renderArticles();
if(window.supabase && window.supabase.createClient){
  supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
  supabaseClient.auth.getSession().then(async({data})=>{currentUser=data.session?.user||null;updateAuthUI();if(currentUser)await refreshAdminArticles();else await loadPublicArticles();});
  supabaseClient.auth.onAuthStateChange((_event,session)=>{currentUser=session?.user||null;updateAuthUI();});
}else{console.error("Supabase JS belum termuat.");}
if("serviceWorker" in navigator && location.protocol.startsWith("http"))window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(err=>console.log("SW:",err)));
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e;$("installBtn").hidden=false;});
$("installBtn").addEventListener("click",async()=>{if(!deferredInstallPrompt)return;deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;$("installBtn").hidden=true;});
window.addEventListener("appinstalled",()=>{$("installBtn").hidden=true;});
