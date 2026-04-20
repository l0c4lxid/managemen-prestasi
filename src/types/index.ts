// ─── User & Auth ─────────────────────────────────────────────────────────────
export type UserRole =
  | 'super_admin'
  | 'admin_prestasi'
  | 'admin_lomba'
  | 'admin_perencanaan'
  | 'mahasiswa';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  nim?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  position?: string | null;
  unit?: string | null;
  location?: string | null;
  bio?: string | null;
  faculty?: string | null;
  major?: string | null;
  year?: string | null;
  created_at: string;
}

// ─── Competitions ─────────────────────────────────────────────────────────────
export type CompetitionCategory = 'lomba' | 'pkm' | 'p2mw';
export type CompetitionLevel = 'kampus' | 'nasional' | 'internasional';
export type CompetitionStatus = 'active' | 'expired';

export interface Competition {
  id: string;
  title: string;
  description?: string | null;
  category: CompetitionCategory;
  level: CompetitionLevel;
  deadline: string;
  link?: string | null;
  poster_url?: string | null;
  status: CompetitionStatus;
  created_by?: string | null;
  created_at: string;
  organizer?: string | null;
  prize?: string | null;
  syarat_ketentuan?: string | null;
  cara_pendaftaran?: string | null;
  tingkat?: string | null;
  kategori?: string | null;
  tanggal_mulai?: string | null;
  hadiah_detail?: string | null;
}

// ─── Achievements ─────────────────────────────────────────────────────────────
export type AchievementStatus = 'pending' | 'verified' | 'rejected';

export interface Achievement {
  id: string;
  user_id: string;
  competition_id?: string | null;
  title: string;
  description?: string | null;
  proof_url?: string | null;
  status: AchievementStatus;
  verified_by?: string | null;
  created_at: string;
  category?: string | null;
  competition_level?: string | null;
  // Joined fields
  users?: { name: string; email: string; nim?: string | null } | null;
  competitions?: { title: string } | null;
  verifier?: { name: string } | null;
}

// ─── Events ──────────────────────────────────────────────────────────────────
export interface Event {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  end_date?: string | null;
  time?: string | null;
  mentor?: string | null;
  mentor_role?: string | null;
  quota: number;
  created_by?: string | null;
  created_at: string;
  type?: string | null;
  location?: string | null;
  category?: string | null;
  poster_url?: string | null;
  fee?: string | null;
  tags?: string[] | null;
  syarat_ketentuan?: string | null;
  cara_pendaftaran?: string | null;
  link_pendaftaran?: string | null;
  institusi_narasumber?: string | null;
  status?: string | null;
}

// ─── Registrations ───────────────────────────────────────────────────────────
export type RegistrationStatus = 'registered' | 'attended' | 'cancelled';

export interface Registration {
  id: string;
  user_id?: string | null;
  event_id?: string | null;
  competition_id?: string | null;
  status: RegistrationStatus;
  created_at: string;
  nama_tim?: string | null;
  catatan?: string | null;
}

// ─── Bookmarks ───────────────────────────────────────────────────────────────
export interface Bookmark {
  id: string;
  user_id?: string | null;
  competition_id?: string | null;
  created_at: string;
  competitions?: Competition | null;
}

// ─── Notifications ───────────────────────────────────────────────────────────
export interface Notification {
  id: string;
  user_id?: string | null;
  type: string;
  title: string;
  body?: string | null;
  href?: string | null;
  is_read?: boolean | null;
  created_at?: string | null;
}

// ─── Programs ────────────────────────────────────────────────────────────────
export type ProgramStatus = 'pending' | 'ongoing' | 'completed';

export interface Program {
  id: string;
  title: string;
  description?: string | null;
  start_date: string;
  end_date: string;
  created_by?: string | null;
  created_at: string;
  program_status: string;
}

export interface ProgramTimeline {
  id: string;
  program_id?: string | null;
  title: string;
  deadline: string;
  status: ProgramStatus;
  created_at: string;
  order_index?: number | null;
}

// ─── System Settings ─────────────────────────────────────────────────────────
export interface SystemSetting {
  key: string;
  value: Record<string, unknown>;
  updated_at: string;
}
