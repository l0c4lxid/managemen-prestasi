'use client';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  User, Bell, Shield, Palette, Globe, Database, Save, Eye, EyeOff,
  CheckCircle, Camera, Mail, Phone, Building, Lock, Key, ToggleLeft, ToggleRight,
  ChevronRight, AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

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
  const { profile, setProfile } = useAuth();
  const supabase = createClient();
  const [form, setForm] = useState({ 
    nama: profile?.name || '', 
    email: profile?.email || '', 
    telepon: '081234567890', 
    jabatan: profile?.role || 'User', 
    unit: 'Universitas', 
    bio: '' 
  });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm(prev => ({
        ...prev,
        nama: profile.name,
        email: profile.email,
        jabatan: profile.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      }));
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    if (profile?.id) {
      const { error } = await supabase.from('users').update({ name: form.nama }).eq('id', profile.id);
      if (error) {
        toast.error('Gagal menyimpan profil');
      } else {
        toast.success('Profil berhasil diperbarui');
        if (setProfile) setProfile({ ...profile, name: form.nama });
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white text-2xl font-bold uppercase">
            {form.nama.split(' ').map(n => n[0]).slice(0, 2).join('')}
          </div>
          <button type="button" className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors shadow-sm">
            <Camera size={13} />
          </button>
        </div>
        <div>
          <p className="font-semibold text-slate-800">{form.nama}</p>
          <p className="text-sm text-slate-500 capitalize">{form.jabatan}</p>
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
            <input type="email" value={form.email} disabled className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm focus:outline-none cursor-not-allowed" />
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
          <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jabatan / Role</label>
          <div className="relative">
            <Building size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={form.jabatan} disabled className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm focus:outline-none capitalize cursor-not-allowed" />
          </div>
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
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPass !== form.confirmPass) return;
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: form.newPass });
    if (error) {
      toast.error('Gagal memperbarui password');
    } else {
      toast.success('Password berhasil diperbarui');
      setSaved(true);
      setForm({ oldPass: '', newPass: '', confirmPass: '' });
      setTimeout(() => setSaved(false), 2500);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl p-5 space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-700">Ubah Password</h3>
          <p className="text-xs text-slate-400 mt-0.5">Pastikan password baru minimal 8 karakter</p>
        </div>
        {[
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
                required
                minLength={8}
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
    </div>
  );
}

function TampilanTab() {
  const [theme, setTheme] = useState('light');
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
      </div>
      <div className="flex justify-end"><SaveButton loading={loading} saved={saved} /></div>
    </form>
  );
}

export default function PengaturanPage() {
  const [activeTab, setActiveTab] = useState<SettingTab>('profil');

  const tabContent: Record<SettingTab, React.ReactNode> = {
    profil: <ProfilTab />,
    notifikasi: <NotifikasiTab />,
    keamanan: <KeamananTab />,
    tampilan: <TampilanTab />,
    sistem: <div className="p-6 text-center text-slate-500">Fitur ini hanya tersedia untuk Super Admin.</div>,
  };

  return (
    <AppLayout activePath="/pengaturan">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Pengaturan</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola profil, preferensi, dan keamanan akun Anda.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
              {tabs.filter(t => t.id !== 'sistem').map(tab => (
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

          <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            {tabContent[activeTab]}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
