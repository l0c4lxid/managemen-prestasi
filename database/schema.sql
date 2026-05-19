-- ==========================================
-- PrestasiKampus - Full Database Schema
-- ==========================================
-- Gunakan script ini di SQL Editor Supabase 
-- untuk setup database baru (Production/Local)
-- ==========================================

-- 1. Create Custom Enums
CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin_prestasi', 'admin_lomba', 'admin_perencanaan', 'mahasiswa');
CREATE TYPE public.competition_category AS ENUM ('lomba', 'pkm', 'p2mw');
CREATE TYPE public.competition_level AS ENUM ('kampus', 'nasional', 'internasional');
CREATE TYPE public.competition_status AS ENUM ('active', 'expired');
CREATE TYPE public.achievement_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE public.program_status AS ENUM ('pending', 'ongoing', 'completed');
CREATE TYPE public.registration_status AS ENUM ('registered', 'attended', 'cancelled');

-- 2. Create Users Table
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role public.user_role DEFAULT 'mahasiswa'::public.user_role,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    avatar_url TEXT,
    nim TEXT,
    phone TEXT,
    position TEXT,
    unit TEXT,
    location TEXT,
    bio TEXT,
    faculty TEXT,
    major TEXT,
    year TEXT
);

-- 3. Create Competitions Table
CREATE TABLE public.competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category public.competition_category NOT NULL,
    level public.competition_level NOT NULL,
    deadline TIMESTAMP WITH TIME ZONE NOT NULL,
    link TEXT,
    poster_url TEXT,
    status public.competition_status DEFAULT 'active'::public.competition_status,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    organizer TEXT,
    prize TEXT,
    syarat_ketentuan TEXT,
    cara_pendaftaran TEXT,
    tingkat TEXT,
    kategori TEXT,
    tanggal_mulai TEXT,
    hadiah_detail TEXT
);

-- 4. Create Achievements Table
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES public.competitions(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    proof_url TEXT,
    status public.achievement_status DEFAULT 'pending'::public.achievement_status,
    verified_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    category TEXT DEFAULT 'Akademik',
    competition_level TEXT DEFAULT 'nasional',
    rank TEXT DEFAULT '0',
    document_url TEXT,
    year TEXT
);

-- 5. Create Programs Table
CREATE TABLE public.programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    program_status TEXT DEFAULT 'pending'
);

-- 6. Create Program Timelines Table
CREATE TABLE public.program_timelines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID REFERENCES public.programs(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    deadline DATE NOT NULL,
    status public.program_status DEFAULT 'pending'::public.program_status,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    order_index INTEGER DEFAULT 0
);

-- 7. Create Events Table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    date TIMESTAMP WITH TIME ZONE NOT NULL,
    mentor TEXT,
    quota INTEGER DEFAULT 0,
    created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    type TEXT,
    end_date TIMESTAMP WITH TIME ZONE,
    time TEXT,
    location TEXT,
    mentor_role TEXT,
    category TEXT,
    poster_url TEXT,
    fee TEXT,
    tags TEXT[],
    syarat_ketentuan TEXT,
    cara_pendaftaran TEXT,
    link_pendaftaran TEXT,
    institusi_narasumber TEXT,
    status TEXT DEFAULT 'upcoming'
);

-- 8. Create Registrations Table
CREATE TABLE public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
    status public.registration_status DEFAULT 'registered'::public.registration_status,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    nama_tim TEXT,
    catatan TEXT
);

-- 9. Create Bookmarks Table
CREATE TABLE public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    competition_id UUID REFERENCES public.competitions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 10. Create Notifications Table
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    href TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 11. Create System Settings Table
CREATE TABLE public.system_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 12. Create Wall of Fame Posters Table
CREATE TABLE public.wall_of_fame_posters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 13. Enable Row Level Security (RLS) on ALL Tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_timelines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wall_of_fame_posters ENABLE ROW LEVEL SECURITY;

-- Catatan:
-- Setelah meng-enable RLS, tabel tidak dapat diakses secara default oleh client (anon/authenticated).
-- Silakan buat Policy (CREATE POLICY) di Supabase Dashboard (Authentication -> Policies) 
-- sesuai dengan kebutuhan aplikasi.
