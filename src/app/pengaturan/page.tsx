'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  User, Bell, Shield, Palette, Globe, Database, Save, Eye, EyeOff,
  CheckCircle, Camera, Mail, Phone, Building, Lock, Key, ToggleLeft, ToggleRight,
  ChevronRight, AlertTriangle,
} from 'lucide-react';

type SettingTab = 'profil' | 'notifikasi' | 'keamanan' | 'tampilan' | 'sistem';

const tabs: { id: SettingTab; label: string; icon: React.ReactNode }[] = [
  { id: 'profil', label: 'Profil', icon: <User size={18} /> },
  { id: 'notifikasi', label: 'Notifikasi', icon: <Bell size={18} /> },
  { id: 'keamanan', label: 'Keamanan', icon: <Shield size={18} /> },
  { id: 'tampilan', label: 'Tampilan', icon: <Palette size={18} /> },
  { id: 'sistem', label: 'Sistem', icon: <Database size={18} /> },
];

function SaveButton({ loading, saved }: { loading: boolean; saved: boolean }) {
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
        <><Save size={16} />Simpan Perubahan</>
      )}
    </button>
  );
}

function ProfilTab() {
  const [form, setForm] = useState({ nama: 'Rizky Admin', email: 'admin@prestasikampus.id', telepon: '081234567890', jabatan: 'Admin Kemahasiswaan', unit: 'Biro Kemahasiswaan', bio: 'Pengelola platform prestasi mahasiswa kampus.' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 2500); }, 900);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold">RA</div>
          <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors shadow-sm">
            <Camera size={13} />
          </button>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{form.nama}</p>
          <p className="text-sm text-slate-500">{form.jabatan}</p>
          <button type="button" className="text-xs text-indigo-600 font-semibold mt-1 hover:underline">Ganti foto profil</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nama Lengkap</label>
          <div className="relative">
            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={form.nama} onChange={e => setForm(p => ({ ...p, nama: e.target.value }))} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Email</label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Nomor Telepon</label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={form.telepon} onChange={e => setForm(p => ({ ...p, telepon: e.target.value }))} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jabatan</label>
          <div className="relative">
            <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={form.jabatan} onChange={e => setForm(p => ({ ...p, jabatan: e.target.value }))} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
          </div>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Unit / Divisi</label>
          <input value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300" />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bio</label>
          <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} rows={3} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none" />
        </div>
      </div>
      <div className="flex justify-end"><SaveButton loading={loading} saved={saved} /></div>
    </form>
  );
}

function NotifikasiTab() {
  const [settings, setSettings] = useState({
    emailPrestasi: true, emailLomba: true, emailEvent: false, emailSistem: true,
    pushPrestasi: true, pushLomba: false, pushEvent: true, pushSistem: false,
    digestHarian: true, digestMingguan: false,
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggle = (key: keyof typeof settings) => setSettings(p => ({ ...p, [key]: !p[key] }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 2500); }, 700);
  };

  const Toggle = ({ k }: { k: keyof typeof settings }) => (
    <button type="button" onClick={() => toggle(k)} className={`flex-shrink-0 transition-colors ${settings[k] ? 'text-indigo-600' : 'text-slate-300'}`}>
      {settings[k] ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
    </button>
  );

  const Row = ({ label, desc, k }: { label: string; desc: string; k: keyof typeof settings }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-slate-700">{label}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
      <Toggle k={k} />
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-1">Notifikasi Email</h3>
        <p className="text-xs text-slate-400 mb-4">Terima pembaruan melalui email</p>
        <Row label="Prestasi Baru" desc="Saat ada prestasi baru yang diajukan" k="emailPrestasi" />
        <Row label="Lomba Aktif" desc="Pengumuman lomba dan deadline" k="emailLomba" />
        <Row label="Event Kemahasiswaan" desc="Informasi event dan kegiatan" k="emailEvent" />
        <Row label="Notifikasi Sistem" desc="Pembaruan dan pemeliharaan sistem" k="emailSistem" />
      </div>
      <div className="bg-slate-50 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-1">Notifikasi Push</h3>
        <p className="text-xs text-slate-400 mb-4">Notifikasi langsung di browser</p>
        <Row label="Prestasi Baru" desc="Saat ada prestasi baru yang diajukan" k="pushPrestasi" />
        <Row label="Lomba Aktif" desc="Pengumuman lomba dan deadline" k="pushLomba" />
        <Row label="Event Kemahasiswaan" desc="Informasi event dan kegiatan" k="pushEvent" />
        <Row label="Notifikasi Sistem" desc="Pembaruan dan pemeliharaan sistem" k="pushSistem" />
      </div>
      <div className="bg-slate-50 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-1">Ringkasan Berkala</h3>
        <p className="text-xs text-slate-400 mb-4">Laporan ringkas aktivitas platform</p>
        <Row label="Digest Harian" desc="Ringkasan aktivitas setiap hari pukul 08.00" k="digestHarian" />
        <Row label="Digest Mingguan" desc="Ringkasan aktivitas setiap Senin pagi" k="digestMingguan" />
      </div>
      <div className="flex justify-end"><SaveButton loading={loading} saved={saved} /></div>
    </form>
  );
}

function KeamananTab() {
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ oldPass: '', newPass: '', confirmPass: '' });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [twoFA, setTwoFA] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPass !== form.confirmPass) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); setSaved(true); setForm({ oldPass: '', newPass: '', confirmPass: '' }); setTimeout(() => setSaved(false), 2500); }, 900);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-700">Ubah Password</h3>
          <p className="text-xs text-slate-400 mt-0.5">Pastikan password baru minimal 8 karakter</p>
        </div>
        {[
          { label: 'Password Lama', key: 'oldPass' as const, show: showOld, toggle: () => setShowOld(p => !p) },
          { label: 'Password Baru', key: 'newPass' as const, show: showNew, toggle: () => setShowNew(p => !p) },
          { label: 'Konfirmasi Password Baru', key: 'confirmPass' as const, show: showConfirm, toggle: () => setShowConfirm(p => !p) },
        ].map(field => (
          <div key={field.key}>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">{field.label}</label>
            <div className="relative">
              <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type={field.show ? 'text' : 'password'}
                value={form[field.key]}
                onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
                placeholder="••••••••"
              />
              <button type="button" onClick={field.toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {field.show ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
        ))}
        {form.newPass && form.confirmPass && form.newPass !== form.confirmPass && (
          <p className="text-xs text-red-500 flex items-center gap-1.5"><AlertTriangle size={13} />Password tidak cocok</p>
        )}
        <div className="flex justify-end"><SaveButton loading={loading} saved={saved} /></div>
      </form>

      <div className="bg-slate-50 rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-700">Autentikasi Dua Faktor (2FA)</h3>
            <p className="text-xs text-slate-400 mt-0.5">Tambahkan lapisan keamanan ekstra ke akun Anda</p>
          </div>
          <button type="button" onClick={() => setTwoFA(p => !p)} className={`transition-colors ${twoFA ? 'text-indigo-600' : 'text-slate-300'}`}>
            {twoFA ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
          </button>
        </div>
        {twoFA && (
          <div className="mt-4 p-3 rounded-xl bg-indigo-50 border border-indigo-100">
            <p className="text-xs text-indigo-700 font-medium">2FA aktif. Kode verifikasi akan dikirim ke email Anda saat login.</p>
          </div>
        )}
      </div>

      <div className="bg-slate-50 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-slate-700 mb-3">Sesi Aktif</h3>
        {[
          { device: 'Chrome — Windows 11', lokasi: 'Surakarta, Indonesia', waktu: 'Sekarang (sesi ini)', current: true },
          { device: 'Safari — iPhone 15', lokasi: 'Surakarta, Indonesia', waktu: '2 jam lalu', current: false },
        ].map((sesi, idx) => (
          <div key={idx} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${sesi.current ? 'bg-emerald-500' : 'bg-slate-300'}`} />
              <div>
                <p className="text-sm font-medium text-slate-700">{sesi.device}</p>
                <p className="text-xs text-slate-400">{sesi.lokasi} · {sesi.waktu}</p>
              </div>
            </div>
            {!sesi.current && (
              <button className="text-xs text-red-500 font-semibold hover:underline">Akhiri</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TampilanTab() {
  const [theme, setTheme] = useState('light');
  const [density, setDensity] = useState('normal');
  const [lang, setLang] = useState('id');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); setSaved(true); setTimeout(() => setSaved(false), 2500); }, 700);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-50 rounded-2xl p-5 space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-3">Tema Tampilan</label>
          <div className="grid grid-cols-3 gap-3">
            {[
              { id: 'light', label: 'Terang', preview: 'bg-white border-slate-200' },
              { id: 'dark', label: 'Gelap', preview: 'bg-slate-800 border-slate-700' },
              { id: 'system', label: 'Sistem', preview: 'bg-gradient-to-br from-white to-slate-800 border-slate-300' },
            ].map(t => (
              <button key={t.id} type="button" onClick={() => setTheme(t.id)} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${theme === t.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <div className={`w-full h-12 rounded-lg border ${t.preview}`} />
                <span className={`text-xs font-semibold ${theme === t.id ? 'text-indigo-700' : 'text-slate-600'}`}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-3">Kepadatan Tampilan</label>
          <div className="flex gap-3">
            {[{ id: 'compact', label: 'Kompak' }, { id: 'normal', label: 'Normal' }, { id: 'comfortable', label: 'Luas' }].map(d => (
              <button key={d.id} type="button" onClick={() => setDensity(d.id)} className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${density === d.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 text-slate-600 hover:border-slate-300'}`}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bahasa</label>
          <div className="relative">
            <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <select value={lang} onChange={e => setLang(e.target.value)} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white">
              <option value="id">Bahasa Indonesia</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
      <div className="flex justify-end"><SaveButton loading={loading} saved={saved} /></div>
    </form>
  );
}

function SistemTab() {
  return (
    <div className="space-y-5">
      <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-700">Informasi Sistem</h3>
        {[
          { label: 'Versi Aplikasi', value: 'v2.4.1' },
          { label: 'Terakhir Diperbarui', value: '15 April 2026' },
          { label: 'Database', value: 'PostgreSQL 15.2' },
          { label: 'Total Data Prestasi', value: '1.247 entri' },
          { label: 'Total Pengguna', value: '3.891 akun' },
          { label: 'Kapasitas Penyimpanan', value: '12.4 GB / 50 GB' },
        ].map(item => (
          <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
            <span className="text-sm text-slate-500">{item.label}</span>
            <span className="text-sm font-semibold text-slate-700">{item.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-slate-50 rounded-2xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-slate-700">Manajemen Data</h3>
        {[
          { label: 'Backup Data Sekarang', desc: 'Buat backup manual database', color: 'text-indigo-600 hover:bg-indigo-50', icon: <Database size={16} /> },
          { label: 'Ekspor Semua Data', desc: 'Unduh seluruh data dalam format CSV', color: 'text-emerald-600 hover:bg-emerald-50', icon: <Key size={16} /> },
        ].map(action => (
          <button key={action.label} className={`w-full flex items-center justify-between p-3.5 rounded-xl border border-slate-200 bg-white ${action.color} transition-colors`}>
            <div className="flex items-center gap-3">
              {action.icon}
              <div className="text-left">
                <p className="text-sm font-semibold">{action.label}</p>
                <p className="text-xs text-slate-400">{action.desc}</p>
              </div>
            </div>
            <ChevronRight size={16} className="text-slate-400" />
          </button>
        ))}
      </div>

      <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
        <h3 className="text-sm font-bold text-red-700 mb-1 flex items-center gap-2"><AlertTriangle size={16} />Zona Berbahaya</h3>
        <p className="text-xs text-red-500 mb-4">Tindakan berikut bersifat permanen dan tidak dapat dibatalkan.</p>
        <button className="px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors">
          Reset Semua Data Demo
        </button>
      </div>
    </div>
  );
}

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState<SettingTab>('profil');

  const tabContent: Record<SettingTab, React.ReactNode> = {
    profil: <ProfilTab />,
    notifikasi: <NotifikasiTab />,
    keamanan: <KeamananTab />,
    tampilan: <TampilanTab />,
    sistem: <SistemTab />,
  };

  return (
    <AppLayout activePath="/pengaturan">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pengaturan</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola profil, preferensi, dan konfigurasi sistem.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar tabs */}
          <div className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0 lg:flex-shrink w-full text-left
                    ${activeTab === tab.id ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'}`}
                >
                  <span className={activeTab === tab.id ? 'text-indigo-600' : 'text-slate-400'}>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            {tabContent[activeTab]}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
