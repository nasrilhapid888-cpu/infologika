# Infologika — MVP PWA

Infologika adalah prototipe aplikasi informasi dengan kategori Karier, Bisnis, Teknologi, dan Tutorial.

## Fitur versi pertama
- Tampilan responsif untuk laptop dan Android.
- Pencarian dan filter kategori.
- Detail artikel.
- Dashboard admin sederhana: tambah, edit, hapus artikel.
- Ekspor/impor cadangan artikel JSON.
- PWA: dapat dipasang ke layar utama dan memiliki cache offline dasar.

## Cara menjalankan di laptop

PWA dan service worker memerlukan localhost atau HTTPS. Jangan hanya membuka `index.html` dengan klik dua kali.

### Opsi A — Visual Studio Code
1. Ekstrak ZIP ini.
2. Buka folder `infologika` di Visual Studio Code.
3. Pasang ekstensi **Live Server**.
4. Klik kanan `index.html` → **Open with Live Server**.
5. Browser akan membuka alamat seperti `http://127.0.0.1:5500`.

### Opsi B — Python
Jika Python sudah terpasang, buka terminal di folder ini dan jalankan:
```bash
python -m http.server 8000
```
Buka `http://localhost:8000`.

## Cara mencoba di Android
1. Untuk pengujian lokal, laptop dan Android harus berada di jaringan Wi-Fi yang sama.
2. Jalankan server lokal di laptop dan cari alamat IP lokal laptop (contoh `192.168.1.10`).
3. Di Android, buka `http://IP-LAPTOP:8000` atau alamat port Live Server.
4. Untuk instalasi PWA yang stabil, unggah ke hosting HTTPS seperti GitHub Pages.
5. Buka alamat HTTPS dari Chrome Android → menu ⋮ → **Tambahkan ke layar utama** atau **Instal aplikasi**.

## Publikasi gratis dengan GitHub Pages
1. Buat akun GitHub.
2. Buat repository baru, misalnya `infologika`.
3. Unggah semua file dan folder dari ZIP ini ke root repository.
4. Buka **Settings → Pages**.
5. Pada bagian Build and deployment pilih **Deploy from a branch**, pilih `main` dan folder `/root`, lalu Save.
6. Tunggu proses selesai dan buka URL yang diberikan GitHub Pages.

## Penting: batasan dashboard admin saat ini
Ini adalah MVP front-end. Artikel disimpan di `localStorage` browser/perangkat yang digunakan. Artinya:
- Artikel yang kamu buat di laptop tidak otomatis muncul di HP atau perangkat pengunjung.
- Tombol Admin belum memiliki login dan tidak aman untuk dibuka ke publik.
- Jangan memasukkan data pribadi atau informasi rahasia.
- Untuk aplikasi publik sungguhan, dashboard perlu dilindungi autentikasi dan konten disimpan di backend/database (misalnya Supabase atau Firebase). Setelah itu semua pengunjung dapat melihat artikel yang sama.

Sebelum dipublikasikan luas, langkah berikutnya adalah menghubungkan backend, membuat login admin, menambahkan halaman kebijakan privasi/kontak yang nyata, dan menguji keamanan.

## Monetisasi
- Versi PWA/web dapat mengajukan Google AdSense setelah situs memiliki konten orisinal, navigasi jelas, halaman penting, dan memenuhi kebijakan Google. Persetujuan tidak dijamin.
- Google AdMob ditujukan untuk aplikasi mobile yang memenuhi persyaratan AdMob. PWA tidak otomatis dapat memasang SDK AdMob.
- Jangan klik iklan sendiri, meminta orang mengklik iklan, atau membuat klik/tayangan tidak valid.
- Versi ini belum memasang iklan. Jangan menambahkan unit iklan sebelum akun dan situs/aplikasi memenuhi ketentuan jaringan iklan.

## Struktur folder
```text
infologika/
├── index.html
├── styles.css
├── app.js
├── manifest.webmanifest
├── service-worker.js
├── README.md
└── assets/
    ├── icon.svg
    ├── icon-192.png
    └── icon-512.png
```


## Koneksi Supabase (versi online)
File `app.js` sudah dikonfigurasi memakai Project URL dan Publishable Key project Infologika. Publishable key memang boleh berada di frontend; jangan pernah menaruh `sb_secret_` atau `service_role` key di file website.

Fitur online:
- Artikel publik dimuat dari tabel `public.articles` hanya jika `published = true`.
- Admin login memakai Supabase Authentication dengan email dan password.
- Admin dapat membuat, mengedit, menghapus, dan menerbitkan artikel.
- Hak akses admin dibatasi oleh RLS berdasarkan User ID admin yang telah disiapkan di database.

Catatan:
- Perlu koneksi internet untuk login dan sinkronisasi artikel.
- Pastikan akun admin yang dibuat di Supabase memiliki User ID yang sama dengan ID yang dipakai pada policy RLS.
- Jangan menonaktifkan RLS.
- Jika publishable key yang terpasang tidak valid, ganti nilai `SUPABASE_PUBLISHABLE_KEY` di bagian atas `app.js` dengan Publishable Key yang benar dari Supabase.
