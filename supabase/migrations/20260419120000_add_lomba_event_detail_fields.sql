-- Add syarat_ketentuan and cara_pendaftaran to competitions (lomba)
ALTER TABLE public.competitions
ADD COLUMN IF NOT EXISTS syarat_ketentuan TEXT,
ADD COLUMN IF NOT EXISTS cara_pendaftaran TEXT,
ADD COLUMN IF NOT EXISTS tingkat TEXT,
ADD COLUMN IF NOT EXISTS kategori TEXT,
ADD COLUMN IF NOT EXISTS tanggal_mulai TEXT,
ADD COLUMN IF NOT EXISTS hadiah_detail TEXT;

-- Add syarat_ketentuan and cara_pendaftaran to events
ALTER TABLE public.events
ADD COLUMN IF NOT EXISTS syarat_ketentuan TEXT,
ADD COLUMN IF NOT EXISTS cara_pendaftaran TEXT,
ADD COLUMN IF NOT EXISTS link_pendaftaran TEXT,
ADD COLUMN IF NOT EXISTS institusi_narasumber TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'upcoming';

-- Add competition_id to registrations for lomba registration support
ALTER TABLE public.registrations
ADD COLUMN IF NOT EXISTS competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS nama_tim TEXT,
ADD COLUMN IF NOT EXISTS catatan TEXT;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_registrations_competition_id ON public.registrations(competition_id);
CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_competitions_status ON public.competitions(status);
CREATE INDEX IF NOT EXISTS idx_events_status ON public.events(status);

-- RLS policies for competitions (public read, admin write)
DROP POLICY IF EXISTS "public_read_competitions" ON public.competitions;
CREATE POLICY "public_read_competitions"
ON public.competitions FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_competitions" ON public.competitions;
CREATE POLICY "admin_manage_competitions"
ON public.competitions FOR ALL TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- RLS policies for events (public read, admin write)
DROP POLICY IF EXISTS "public_read_events" ON public.events;
CREATE POLICY "public_read_events"
ON public.events FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "admin_manage_events" ON public.events;
CREATE POLICY "admin_manage_events"
ON public.events FOR ALL TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

-- RLS policies for registrations
DROP POLICY IF EXISTS "users_manage_own_registrations" ON public.registrations;
CREATE POLICY "users_manage_own_registrations"
ON public.registrations FOR ALL TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "admin_view_all_registrations" ON public.registrations;
CREATE POLICY "admin_view_all_registrations"
ON public.registrations FOR SELECT TO authenticated
USING (true);

-- Mock data for competitions
DO $$
DECLARE
    admin_user_id UUID;
    comp1_id UUID := gen_random_uuid();
    comp2_id UUID := gen_random_uuid();
    comp3_id UUID := gen_random_uuid();
BEGIN
    SELECT id INTO admin_user_id FROM public.users LIMIT 1;

    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.competitions (id, title, description, category, level, deadline, link, status, created_by, organizer, prize, syarat_ketentuan, cara_pendaftaran, tingkat, kategori, tanggal_mulai)
        VALUES
            (comp1_id, 'PKM (Program Kreativitas Mahasiswa) 2026', 'Program kreativitas mahasiswa bidang kewirausahaan tingkat nasional yang diselenggarakan oleh Kemendikbudristek setiap tahun.', 'pkm', 'nasional', now() + interval '30 days', 'https://simbelmawa.kemdikbud.go.id', 'active', admin_user_id, 'Kemendikbudristek', 'Rp 50.000.000',
            '1. Mahasiswa aktif S1/D4 minimal semester 2
2. IPK minimal 2.50
3. Belum pernah menjadi ketua tim PKM yang lolos PIMNAS
4. Satu mahasiswa hanya boleh menjadi ketua di 1 judul PKM
5. Anggota tim maksimal 5 orang dari program studi yang sama atau berbeda
6. Proposal ditulis sesuai panduan PKM terbaru',
            '1. Buat akun di simbelmawa.kemdikbud.go.id
2. Login dan pilih menu Pengajuan PKM
3. Isi formulir pendaftaran tim
4. Upload proposal sesuai format yang ditentukan
5. Submit proposal sebelum deadline
6. Tunggu pengumuman seleksi administrasi',
            'Nasional', 'Kewirausahaan', '1 Mar 2026'),
            (comp2_id, 'GEMASTIK XVIII — Animasi & Multimedia', 'Kompetisi animasi dan multimedia tingkat nasional untuk mahasiswa aktif perguruan tinggi di Indonesia.', 'lomba', 'nasional', now() + interval '60 days', 'https://gemastik.kemdikbud.go.id', 'active', admin_user_id, 'Pusat Prestasi Nasional', 'Rp 30.000.000',
            '1. Mahasiswa aktif S1/D3/D4 di perguruan tinggi Indonesia
2. Tim terdiri dari 1-3 orang mahasiswa
3. Karya merupakan karya original dan belum pernah dipublikasikan
4. Karya dibuat menggunakan software animasi profesional
5. Durasi animasi 3-5 menit
6. Tema sesuai dengan tema GEMASTIK tahun berjalan',
            '1. Daftar di portal gemastik.kemdikbud.go.id
2. Verifikasi email dan lengkapi profil
3. Buat tim dan undang anggota
4. Upload karya animasi dalam format MP4 (max 500MB)
5. Isi formulir deskripsi karya
6. Submit sebelum batas waktu yang ditentukan',
            'Nasional', 'Teknologi', '15 Mar 2026'),
            (comp3_id, 'Olimpiade Sains Mahasiswa — Matematika', 'Olimpiade sains mahasiswa bidang matematika tingkat nasional yang diselenggarakan oleh Dirjen Dikti.', 'lomba', 'nasional', now() + interval '15 days', 'https://osm.kemdikbud.go.id', 'active', admin_user_id, 'Direktorat Jenderal Pendidikan Tinggi', 'Beasiswa + Sertifikat',
            '1. Mahasiswa aktif S1 semester 1-6
2. IPK minimal 3.00
3. Belum pernah menjuarai OSM tingkat nasional
4. Direkomendasikan oleh dosen pembimbing
5. Membawa kartu mahasiswa dan KTP saat pelaksanaan
6. Mengikuti seleksi tingkat perguruan tinggi terlebih dahulu',
            '1. Hubungi bagian kemahasiswaan untuk mendaftar seleksi internal
2. Ikuti seleksi tingkat perguruan tinggi
3. Bagi yang lolos, daftarkan diri di portal OSM
4. Upload dokumen persyaratan (KTM, transkrip nilai, surat rekomendasi)
5. Konfirmasi kehadiran setelah dinyatakan lolos seleksi
6. Hadir pada waktu dan tempat yang ditentukan',
            'Nasional', 'Akademik', '10 Feb 2026')
        ON CONFLICT (id) DO NOTHING;

        -- Mock registrations for competitions
        INSERT INTO public.registrations (id, user_id, competition_id, status, nama_tim)
        VALUES
            (gen_random_uuid(), admin_user_id, comp1_id, 'registered', 'Tim Inovasi Kampus'),
            (gen_random_uuid(), admin_user_id, comp2_id, 'registered', 'Animasi Kreatif')
        ON CONFLICT (id) DO NOTHING;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;

-- Mock data for events
DO $$
DECLARE
    admin_user_id UUID;
    evt1_id UUID := gen_random_uuid();
    evt2_id UUID := gen_random_uuid();
BEGIN
    SELECT id INTO admin_user_id FROM public.users LIMIT 1;

    IF admin_user_id IS NOT NULL THEN
        INSERT INTO public.events (id, title, description, date, mentor, quota, created_by, type, location, mentor_role, status, syarat_ketentuan, cara_pendaftaran, link_pendaftaran, institusi_narasumber)
        VALUES
            (evt1_id, 'Workshop Penulisan Proposal PKM 2026', 'Workshop intensif penulisan proposal PKM untuk mahasiswa yang ingin mengikuti PIMNAS. Dipandu oleh dosen berpengalaman.', now() + interval '7 days', 'Dr. Haris Setiawan, M.Pd.', 60, admin_user_id, 'Workshop', 'Aula Rektorat Lt. 3', 'Dosen Pembimbing PKM UNS', 'upcoming',
            '1. Mahasiswa aktif S1/D4 minimal semester 2
2. Membawa laptop dengan Microsoft Word terinstall
3. Sudah memiliki ide dasar untuk proposal PKM
4. Hadir tepat waktu (toleransi keterlambatan 15 menit)
5. Membawa ATK (alat tulis kantor)
6. Berpakaian rapi dan sopan',
            '1. Klik tombol Daftar Sekarang di halaman ini
2. Isi formulir pendaftaran dengan data yang benar
3. Upload bukti status mahasiswa aktif
4. Tunggu konfirmasi email dalam 1x24 jam
5. Hadir pada hari H sesuai jadwal yang tertera
6. Tunjukkan email konfirmasi kepada panitia',
            'https://bit.ly/pkm-workshop-2026', 'UNS Surakarta'),
            (evt2_id, 'Seminar Kewirausahaan Digital 2026', 'Seminar kewirausahaan digital bersama praktisi bisnis sukses. Dapatkan insight langsung dari CEO startup terkemuka.', now() + interval '14 days', 'Budi Santoso', 150, admin_user_id, 'Seminar', 'Gedung Serbaguna Kampus A', 'CEO Tokopangan', 'upcoming',
            '1. Terbuka untuk seluruh mahasiswa aktif
2. Tidak dipungut biaya (GRATIS)
3. Membawa kartu mahasiswa
4. Hadir 15 menit sebelum acara dimulai
5. Berpakaian rapi (tidak diperkenankan memakai sandal)
6. Dilarang meninggalkan ruangan sebelum acara selesai',
            '1. Isi formulir pendaftaran online melalui link yang tersedia
2. Masukkan NIM dan nama lengkap sesuai KTM
3. Pilih sesi yang tersedia (pagi/siang)
4. Submit formulir dan simpan nomor registrasi
5. Tunjukkan nomor registrasi saat check-in
6. Dapatkan e-sertifikat setelah mengisi absensi digital',
            'https://bit.ly/seminar-wirausaha-2026', 'CEO Tokopangan')
        ON CONFLICT (id) DO NOTHING;

        -- Mock registrations for events
        INSERT INTO public.registrations (id, user_id, event_id, status)
        VALUES
            (gen_random_uuid(), admin_user_id, evt1_id, 'registered'),
            (gen_random_uuid(), admin_user_id, evt2_id, 'registered')
        ON CONFLICT (id) DO NOTHING;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Mock data insertion failed: %', SQLERRM;
END $$;
