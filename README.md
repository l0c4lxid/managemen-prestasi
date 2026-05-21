# SiBerkas — Universitas BSI Kampus Solo

**SiBerkas** adalah platform manajemen prestasi mahasiswa terpadu yang dirancang khusus untuk Universitas BSI Kampus Solo. Sistem ini bertujuan untuk mendokumentasikan, merayakan, dan memverifikasi setiap pencapaian mahasiswa dalam satu wadah profesional yang terintegrasi.

## 🚀 Fitur Utama

- **Premium Landing Page** - Tampilan modern dengan *Achievement Galaxy* dan *Elite Wall of Fame* yang interaktif.
- **Role-Based Dashboard** - Dashboard khusus untuk Mahasiswa, Admin Prestasi, Admin Lomba, dan Super Admin.
- **Elite Wall of Fame** - Galeri prestasi mahasiswa terverifikasi dengan fitur filter tahun dan kategori (Akademik, Teknologi, Seni, dll).
- **Manajemen Event & Lomba** - Sistem pendaftaran dan monitoring kegiatan workshop, seminar, serta kompetisi nasional/internasional.
- **Verified Student ID** - Setiap prestasi divalidasi oleh bagian kemahasiswaan untuk menjamin keaslian data.
- **Poster Glory Feed** - Marquee interaktif yang menampilkan poster-poster kegiatan dan pencapaian terbaru.
- **Sistem Notifikasi** - Pemberitahuan real-time untuk status verifikasi dan pengumuman lomba baru.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context API
- **Toasts**: [Sonner](https://sonner.emilkowal.ski/)

## ⚙️ Instalasi Lokal

1. **Clone repository**:
   ```bash
   git clone <repository-url>
   cd siberkas
   ```

2. **Install dependencies**:
   ```bash
   npm install
   # atau menggunakan pnpm (direkomendasikan)
   pnpm install
   ```

3. **Konfigurasi Database (Supabase) - Siap Prod / Lokal Baru**:
   Proyek ini menggunakan Supabase. Untuk setup di environment baru, gunakan skrip SQL yang sudah disiapkan:
   - Buat project baru di [Supabase](https://supabase.com/).
   - Masuk ke menu **SQL Editor**.
   - Copy dan paste seluruh isi file `database/schema.sql` (terdapat di folder database) lalu klik **Run** untuk membuat seluruh enum, tabel, serta relasinya.
   - *Penting: RLS (Row Level Security) telah diaktifkan secara otomatis. Anda perlu mengatur Policies di menu Authentication -> Policies sesuai hak akses aplikasi.*

4. **Konfigurasi Environment Variables**:
   Buat file `.env` di root directory dan masukkan kredensial Supabase Anda:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

5. **Jalankan Development Server**:
   ```bash
   npm run dev
   # atau
   pnpm dev
   ```
   Buka [http://localhost:4028](http://localhost:4028) untuk melihat aplikasi.

## 📁 Struktur Proyek Utama

- `src/app/` - Routing aplikasi dan halaman utama.
- `src/components/` - Komponen UI reusable (Landing, Dashboard, Auth).
- `src/contexts/` - Logika autentikasi dan global state.
- `src/lib/` - Konfigurasi Supabase dan utilitas lainnya.
- `src/types/` - Definisi TypeScript interfaces.
- `src/styles/` - Konfigurasi Tailwind dan styling global.
- `database/schema.sql` - Full SQL DDL untuk inisialisasi database di Supabase (Production/Local setup).

## 📱 Role & Akses

- **Mahasiswa**: Mendaftarkan prestasi, mencari lomba, dan melihat riwayat sertifikasi.
- **Admin Prestasi**: Memverifikasi pengajuan prestasi mahasiswa.
- **Admin Lomba**: Mengelola data kompetisi dan event yang tersedia.
- **Super Admin**: Kendali penuh atas user, poster, dan seluruh konfigurasi sistem.

---
Dikembangkan dengan ❤️ untuk kemajuan prestasi mahasiswa **Universitas BSI Kampus Solo**.