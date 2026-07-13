# Website Resmi SDN Tulungrejo 03

Website profil & informasi sekolah yang **dinamis** dan **100% gratis** biaya operasional. Konten (berita, agenda, guru, galeri, profil, PPDB) dapat diubah sendiri oleh guru/admin tanpa menyentuh kode melalui **Decap CMS**.

## 🧱 Tech Stack

| Bagian            | Teknologi                                  | Biaya |
| ----------------- | ------------------------------------------ | ----- |
| Framework         | [Astro](https://astro.build) (SSG)         | Gratis |
| Styling           | Tailwind CSS v4                            | Gratis |
| CMS (kelola data) | [Decap CMS](https://decapcms.org)          | Gratis |
| Penyimpanan data  | GitHub (file Markdown/JSON)                | Gratis |
| Hosting & Deploy  | [Vercel](https://vercel.com) (Hobby tier)  | Gratis |
| Login Admin       | GitHub OAuth (via serverless function Vercel) | Gratis |

Semua konten disimpan sebagai file di dalam repo ini — tidak ada database, tidak ada biaya bulanan.

## 📁 Struktur Proyek

```
├── api/                      # Serverless function OAuth (login CMS) — dijalankan Vercel
│   ├── auth.js               #   memulai login GitHub
│   └── callback.js           #   menukar kode → token
├── public/
│   ├── admin/                # Panel admin Decap CMS
│   │   ├── index.html
│   │   └── config.yml        # Konfigurasi koleksi CMS
│   ├── uploads/              # Media (foto) hasil upload dari CMS
│   └── favicon.svg
├── src/
│   ├── content/              # ⬅️ SEMUA DATA DINAMIS DI SINI
│   │   ├── berita/           #   berita (.md)
│   │   ├── guru/             #   data guru (.md)
│   │   ├── agenda/           #   agenda (.md)
│   │   ├── galeri/           #   album galeri (.md)
│   │   └── settings/         #   site.json, profil.json, ppdb.json
│   ├── components/           # Header, Footer, kartu, dll.
│   ├── layouts/              # BaseLayout (SEO, font, dll.)
│   ├── pages/                # Halaman: /, /profil, /berita, /guru, /agenda, /galeri, /ppdb, /kontak
│   └── content.config.ts     # Skema/validasi konten
└── astro.config.mjs
```

## 🚀 Cara Deploy (Langkah demi Langkah)

### 1. Push kode ke GitHub
Repo ini sudah berisi seluruh kode. Pastikan sudah ter-push ke GitHub Anda.

### 2. Deploy ke Vercel
1. Buka [vercel.com](https://vercel.com) → login dengan GitHub → **Add New… → Project**.
2. Import repository ini. Vercel otomatis mendeteksi **Astro** — biarkan pengaturan default, klik **Deploy**.
3. Setelah selesai, Anda mendapat domain, mis. `https://sdn-tulungrejo-03.vercel.app`.

### 3. Buat GitHub OAuth App (untuk login admin)
1. GitHub → **Settings → Developer settings → OAuth Apps → New OAuth App**.
2. Isi:
   - **Application name:** `CMS SDN Tulungrejo 03`
   - **Homepage URL:** `https://<domain-vercel-anda>`
   - **Authorization callback URL:** `https://<domain-vercel-anda>/api/callback`
3. **Register**, lalu **Generate a new client secret**. Catat **Client ID** & **Client Secret**.

### 4. Set Environment Variables di Vercel
Project Vercel → **Settings → Environment Variables**, tambahkan:

| Name                         | Value                     |
| ---------------------------- | ------------------------- |
| `OAUTH_GITHUB_CLIENT_ID`     | *(Client ID dari GitHub)* |
| `OAUTH_GITHUB_CLIENT_SECRET` | *(Client Secret)*         |

Lalu **Redeploy** agar variabel aktif.

### 5. Sesuaikan domain di dua file
Ganti `https://sdn-tulungrejo-03.vercel.app` dengan domain Anda pada:
- `public/admin/config.yml` → `base_url`
- `astro.config.mjs` → variabel `SITE` (atau set env `SITE_URL` di Vercel)

> Catatan: `config.yml` juga memakai `branch: claude/sdn-tulungrejo-school-site-ed2jbg`. Setelah di-merge ke `main`, ubah menjadi `branch: main`.

### 6. Selesai — Kelola Konten
Buka `https://<domain-vercel-anda>/admin/` → **Login with GitHub**. Guru/admin kini bisa menambah berita, agenda, foto, dan mengubah profil sekolah langsung dari browser. Setiap perubahan otomatis memicu build ulang Vercel dan langsung tayang.

## 💻 Menjalankan di Lokal

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # build produksi ke folder dist/
npm run preview  # pratinjau hasil build
```

> Login CMS via `/admin` hanya berfungsi setelah dideploy ke Vercel (butuh serverless function OAuth). Konten tetap bisa diedit manual sebagai file di `src/content/` saat pengembangan lokal.

## ✏️ Mengedit Konten Tanpa CMS

Cukup edit file di `src/content/`:
- **Berita** → tambah file `.md` baru di `src/content/berita/`.
- **Guru** → `src/content/guru/`.
- **Agenda** → `src/content/agenda/`.
- **Galeri** → `src/content/galeri/`.
- **Info sekolah / profil / PPDB** → `src/content/settings/*.json`.

## ⚡ Catatan Performa (sesuai design.md)
- Astro menghasilkan HTML statis (zero-JS default) → skor PageSpeed tinggi.
- Font dimuat dengan `display=swap`.
- Kartu memakai `aspect-ratio` tetap → tanpa layout shift (CLS).
- Gambar `loading="lazy"` + fallback gradient bila belum diupload.
