'use client';
import React, { useState, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import { User, Mail, Phone, Building, MapPin, Calendar, Camera, Save, CheckCircle, Lock, Eye, EyeOff, Shield, Award, BookOpen, X, Upload, Star, TrendingUp,  } from 'lucide-react';

interface ProfileForm {
  namaLengkap: string;
  email: string;
  telepon: string;
  jabatan: string;
  unit: string;
  lokasi: string;
  tanggalGabung: string;
  bio: string;
  nim?: string;
  fakultas?: string;
  prodi?: string;
  angkatan?: string;
}

interface PasswordForm {
  passwordLama: string;
  passwordBaru: string;
  konfirmasiPassword: string;
}

function SaveButton({ loading, saved, label = 'Simpan Perubahan' }: { loading: boolean; saved: boolean; label?: string }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60 shadow-sm"
    >
      {loading ? (
        <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Menyimpan...</>
      ) : saved ? (
        <><CheckCircle size={16} />Tersimpan!</>
      ) : (
        <><Save size={16} />{label}</>
      )}
    </button>
  );
}

const statCards = [
  { label: 'Prestasi Dicatat', value: '24', icon: <Award size={20} />, color: 'from-amber-400 to-orange-500' },
  { label: 'Lomba Diikuti', value: '12', icon: <Star size={20} />, color: 'from-indigo-500 to-violet-600' },
  { label: 'Event Dihadiri', value: '8', icon: <BookOpen size={20} />, color: 'from-cyan-500 to-teal-600' },
  { label: 'Poin Prestasi', value: '1.240', icon: <TrendingUp size={20} />, color: 'from-rose-500 to-pink-600' },
];

export default function ProfilPage() {
  const [activeTab, setActiveTab] = useState<'info' | 'keamanan'>('info');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProfileForm>({
    namaLengkap: 'Rizky Admin',
    email: 'admin@prestasikampus.id',
    telepon: '081234567890',
    jabatan: 'Admin Kemahasiswaan',
    unit: 'Biro Kemahasiswaan',
    lokasi: 'Surakarta, Jawa Tengah',
    tanggalGabung: 'Januari 2024',
    bio: 'Pengelola platform prestasi mahasiswa kampus. Bertanggung jawab atas verifikasi dan pengelolaan data prestasi mahasiswa.',
    nim: '20210001',
    fakultas: 'Teknik',
    prodi: 'Teknik Informatika',
    angkatan: '2021',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formSaved, setFormSaved] = useState(false);

  const [pwForm, setPwForm] = useState<PasswordForm>({ passwordLama: '', passwordBaru: '', konfirmasiPassword: '' });
  const [showPw, setShowPw] = useState({ lama: false, baru: false, konfirmasi: false });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadLoading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarPreview(ev.target?.result as string);
      setUploadLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
      setFormSaved(true);
      setTimeout(() => setFormSaved(false), 2500);
    }, 900);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.passwordBaru !== pwForm.konfirmasiPassword) {
      setPwError('Password baru dan konfirmasi tidak cocok.');
      return;
    }
    if (pwForm.passwordBaru.length < 8) {
      setPwError('Password baru minimal 8 karakter.');
      return;
    }
    setPwLoading(true);
    setTimeout(() => {
      setPwLoading(false);
      setPwSaved(true);
      setPwForm({ passwordLama: '', passwordBaru: '', konfirmasiPassword: '' });
      setTimeout(() => setPwSaved(false), 2500);
    }, 900);
  };

  const initials = form.namaLengkap
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden">
          {/* Cover */}
          <div className="h-28 bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-500 relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
          </div>

          <div className="px-6 pb-6">
            {/* Avatar row */}
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-10">
              <div className="flex items-end gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl border-4 border-white shadow-md overflow-hidden bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Foto profil" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-2xl font-bold">{initials}</span>
                    )}
                  </div>
                  {uploadLoading && (
                    <div className="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-white hover:bg-indigo-700 transition-colors shadow-sm"
                    title="Ganti foto profil"
                  >
                    <Camera size={13} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                </div>

                <div className="pb-1">
                  <h1 className="text-xl font-bold text-slate-800">{form.namaLengkap}</h1>
                  <p className="text-sm text-slate-500">{form.jabatan} · {form.unit}</p>
                  <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-400">
                    <MapPin size={12} />
                    <span>{form.lokasi}</span>
                    <span className="mx-1">·</span>
                    <Calendar size={12} />
                    <span>Bergabung {form.tanggalGabung}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 hover:border-indigo-300 hover:text-indigo-600 transition-all self-start sm:self-auto"
              >
                <Upload size={15} />
                Upload Foto
              </button>
            </div>

            {/* Bio */}
            {form.bio && (
              <p className="mt-4 text-sm text-slate-600 leading-relaxed max-w-2xl">{form.bio}</p>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow-soft border border-slate-100 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white flex-shrink-0`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-500 leading-tight">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-soft border border-slate-100">
          <div className="flex border-b border-slate-100 px-6 pt-4 gap-1">
            {[
              { id: 'info' as const, label: 'Informasi Pribadi', icon: <User size={16} /> },
              { id: 'keamanan' as const, label: 'Keamanan', icon: <Shield size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl border-b-2 transition-all duration-150 -mb-px
                  ${activeTab === tab.id
                    ? 'border-indigo-600 text-indigo-700 bg-indigo-50/50' :'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {/* Info Tab */}
            {activeTab === 'info' && (
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Lengkap</label>
                    <div className="relative">
                      <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={form.namaLengkap}
                        onChange={(e) => setForm((p) => ({ ...p, namaLengkap: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                        placeholder="Nama lengkap"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
                    <div className="relative">
                      <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                        placeholder="Email"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nomor Telepon</label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={form.telepon}
                        onChange={(e) => setForm((p) => ({ ...p, telepon: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                        placeholder="Nomor telepon"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jabatan</label>
                    <div className="relative">
                      <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={form.jabatan}
                        onChange={(e) => setForm((p) => ({ ...p, jabatan: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                        placeholder="Jabatan"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Unit / Divisi</label>
                    <input
                      value={form.unit}
                      onChange={(e) => setForm((p) => ({ ...p, unit: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                      placeholder="Unit atau divisi"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Lokasi</label>
                    <div className="relative">
                      <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        value={form.lokasi}
                        onChange={(e) => setForm((p) => ({ ...p, lokasi: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                        placeholder="Kota, Provinsi"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">NIM (jika mahasiswa)</label>
                    <input
                      value={form.nim}
                      onChange={(e) => setForm((p) => ({ ...p, nim: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                      placeholder="Nomor Induk Mahasiswa"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Angkatan</label>
                    <input
                      value={form.angkatan}
                      onChange={(e) => setForm((p) => ({ ...p, angkatan: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                      placeholder="Tahun angkatan"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Fakultas</label>
                    <input
                      value={form.fakultas}
                      onChange={(e) => setForm((p) => ({ ...p, fakultas: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                      placeholder="Nama fakultas"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Program Studi</label>
                    <input
                      value={form.prodi}
                      onChange={(e) => setForm((p) => ({ ...p, prodi: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                      placeholder="Program studi"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bio</label>
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all resize-none"
                      placeholder="Ceritakan sedikit tentang diri Anda..."
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <SaveButton loading={formLoading} saved={formSaved} />
                </div>
              </form>
            )}

            {/* Keamanan Tab */}
            {activeTab === 'keamanan' && (
              <form onSubmit={handlePasswordSubmit} className="space-y-5 max-w-md">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <Lock size={16} className="text-indigo-500" />
                    Ubah Password
                  </h3>

                  {pwError && (
                    <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                      <X size={15} className="flex-shrink-0" />
                      {pwError}
                    </div>
                  )}

                  <div className="space-y-4">
                    {[
                      { key: 'passwordLama' as const, label: 'Password Lama', showKey: 'lama' as const },
                      { key: 'passwordBaru' as const, label: 'Password Baru', showKey: 'baru' as const },
                      { key: 'konfirmasiPassword' as const, label: 'Konfirmasi Password Baru', showKey: 'konfirmasi' as const },
                    ].map(({ key, label, showKey }) => (
                      <div key={key}>
                        <label className="block text-xs font-semibold text-slate-600 mb-1.5">{label}</label>
                        <div className="relative">
                          <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type={showPw[showKey] ? 'text' : 'password'}
                            value={pwForm[key]}
                            onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                            className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
                            placeholder={label}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw((p) => ({ ...p, [showKey]: !p[showKey] }))}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                          >
                            {showPw[showKey] ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-xs font-semibold text-slate-600 mb-2">Persyaratan password:</p>
                  <ul className="space-y-1">
                    {[
                      'Minimal 8 karakter',
                      'Mengandung huruf besar dan kecil',
                      'Mengandung angka atau simbol',
                    ].map((req) => (
                      <li key={req} className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <SaveButton loading={pwLoading} saved={pwSaved} label="Ubah Password" />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
