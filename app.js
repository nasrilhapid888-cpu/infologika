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
let articles = loadArticles();
let activeCategory = "Semua";
let deferredInstallPrompt = null;
const $ = id => document.getElementById(id);

function loadArticles(){
  try { const saved = localStorage.getItem(STORAGE_KEY); return saved ? JSON.parse(saved) : [...starterArticles]; }
  catch(e){ return [...starterArticles]; }
}
function saveArticles(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(articles)); }
function escapeHTML(value=""){ return String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
function formatDate(date){ try{return new Date(date+"T00:00:00").toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});}catch(e){return date;} }
function categoryIcon(cat){return ({Karier:"↗",Bisnis:"◈",Teknologi:"⌘",Tutorial:"✦"})[cat]||"i";}
function renderCategories(){
  $("categoryRow").innerHTML = categories.map(c=>`<button class="category-chip ${activeCategory===c?"selected":""}" data-category="${c}">${c}</button>`).join("");
  $("categoryRow").querySelectorAll("button").forEach(btn=>btn.addEventListener("click",()=>{activeCategory=btn.dataset.category;renderCategories();renderArticles();}));
}
function renderArticles(){
  const q=$("searchInput").value.trim().toLowerCase();
  const filtered=articles.filter(a=>(activeCategory==="Semua"||a.category===activeCategory)&&[a.title,a.excerpt,a.content,a.category].join(" ").toLowerCase().includes(q));
  $("articleGrid").innerHTML=filtered.map((a,i)=>`<article class="article-card" tabindex="0" role="button" data-id="${escapeHTML(a.id)}" aria-label="Baca ${escapeHTML(a.title)}"><div class="card-visual visual-${(i%6)+1}"><span class="visual-symbol">${categoryIcon(a.category)}</span></div><div class="card-content"><div class="card-meta"><span class="tag">${escapeHTML(a.category)}</span><span>${formatDate(a.date)}</span><span>· ${escapeHTML(a.read)}</span></div><h3>${escapeHTML(a.title)}</h3><p>${escapeHTML(a.excerpt)}</p><span class="read-link">Baca selengkapnya →</span></div></article>`).join("");
  $("emptyState").hidden=filtered.length!==0;
  $("articleGrid").querySelectorAll(".article-card").forEach(card=>{
    const open=()=>openArticle(card.dataset.id);
    card.addEventListener("click",open);card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();open();}});
  });
}
function openArticle(id){
  const a=articles.find(x=>x.id===id);if(!a)return;
  $("modalMeta").innerHTML=`<span class="tag">${escapeHTML(a.category)}</span><span>${formatDate(a.date)}</span><span>· ${escapeHTML(a.read)}</span>`;
  $("modalTitle").textContent=a.title;$("modalLead").textContent=a.excerpt;$("modalBody").textContent=a.content;
  showModal("articleModal");
}
function showModal(id){$(id).hidden=false;document.body.style.overflow="hidden";}
function hideModal(id){$(id).hidden=true;if(!$("articleModal").hidden===false && !$("adminModal").hidden===false){} if($("articleModal").hidden&&$("adminModal").hidden)document.body.style.overflow="";}
document.querySelectorAll("[data-close]").forEach(b=>b.addEventListener("click",()=>hideModal(b.dataset.close)));
document.querySelectorAll(".modal-backdrop").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)hideModal(m.id);}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"){hideModal("articleModal");hideModal("adminModal");}});
$("searchInput").addEventListener("input",renderArticles);
$("year").textContent=new Date().getFullYear();

function resetForm(){
  $("articleForm").reset();$("articleId").value="";$("formStatus").textContent="";
}
function switchTab(tab){
  document.querySelectorAll(".tab-btn").forEach(b=>b.classList.toggle("selected",b.dataset.tab===tab));
  ["editor","manage","backup"].forEach(t=>$("tab-"+t).hidden=t!==tab);
  if(tab==="manage")renderManageList();
}
function renderManageList(){
  $("manageList").innerHTML=articles.length?articles.map(a=>`<div class="manage-item"><div><strong>${escapeHTML(a.title)}</strong><small>${escapeHTML(a.category)} · ${formatDate(a.date)}</small></div><div class="manage-actions"><button class="small-action" data-edit="${escapeHTML(a.id)}">Edit</button><button class="small-action delete" data-delete="${escapeHTML(a.id)}">Hapus</button></div></div>`).join(""):"<p>Belum ada artikel.</p>";
  $("manageList").querySelectorAll("[data-edit]").forEach(b=>b.addEventListener("click",()=>editArticle(b.dataset.edit)));
  $("manageList").querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>deleteArticle(b.dataset.delete)));
}
function editArticle(id){
  const a=articles.find(x=>x.id===id);if(!a)return;
  $("articleId").value=a.id;$("articleTitle").value=a.title;$("articleCategory").value=a.category;$("articleRead").value=a.read;$("articleExcerpt").value=a.excerpt;$("articleContent").value=a.content;
  switchTab("editor");$("formStatus").textContent="Mode edit: ubah isi lalu simpan.";
  $("tab-editor").scrollIntoView({behavior:"smooth",block:"start"});
}
function deleteArticle(id){
  const a=articles.find(x=>x.id===id);if(!a||!confirm(`Hapus artikel "${a.title}"?`))return;
  articles=articles.filter(x=>x.id!==id);saveArticles();renderArticles();renderManageList();
}
$("articleForm").addEventListener("submit",e=>{
  e.preventDefault();
  const id=$("articleId").value||"article-"+Date.now();
  const old=articles.find(a=>a.id===id);
  const item={id,title:$("articleTitle").value.trim(),category:$("articleCategory").value,read:$("articleRead").value,date:old?.date||new Date().toISOString().slice(0,10),excerpt:$("articleExcerpt").value.trim(),content:$("articleContent").value.trim()};
  if(old)articles=articles.map(a=>a.id===id?item:a);else articles.unshift(item);
  saveArticles();renderArticles();resetForm();$("formStatus").textContent="Artikel berhasil disimpan di browser ini.";
});
$("resetFormBtn").addEventListener("click",resetForm);
$("openAdminBtn").addEventListener("click",()=>{switchTab("editor");showModal("adminModal");});
document.querySelectorAll(".tab-btn").forEach(b=>b.addEventListener("click",()=>switchTab(b.dataset.tab)));
$("exportBtn").addEventListener("click",()=>{
  const blob=new Blob([JSON.stringify(articles,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="infologika-backup.json";a.click();URL.revokeObjectURL(url);$("backupStatus").textContent="Cadangan berhasil diunduh.";
});
$("importInput").addEventListener("change",async e=>{
  const file=e.target.files[0];if(!file)return;
  try{const parsed=JSON.parse(await file.text());if(!Array.isArray(parsed)||!parsed.every(a=>a.title&&a.category&&a.content))throw new Error("Format tidak sesuai");articles=parsed;saveArticles();renderArticles();$("backupStatus").textContent="Data berhasil diimpor."; }
  catch(err){$("backupStatus").textContent="Gagal mengimpor. Pastikan file JSON berasal dari Infologika.";}e.target.value="";
});
$("restoreBtn").addEventListener("click",()=>{
  if(!confirm("Pulihkan artikel contoh? Artikel yang ada saat ini akan diganti."))return;
  articles=[...starterArticles];saveArticles();renderArticles();renderManageList();$("backupStatus").textContent="Artikel contoh dipulihkan.";
});
renderCategories();renderArticles();

if("serviceWorker" in navigator && location.protocol.startsWith("http")){
  window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(err=>console.log("SW:",err)));
}
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();deferredInstallPrompt=e;$("installBtn").hidden=false;});
$("installBtn").addEventListener("click",async()=>{
  if(!deferredInstallPrompt)return;
  deferredInstallPrompt.prompt();await deferredInstallPrompt.userChoice;deferredInstallPrompt=null;$("installBtn").hidden=true;
});
window.addEventListener("appinstalled",()=>{$("installBtn").hidden=true;});
