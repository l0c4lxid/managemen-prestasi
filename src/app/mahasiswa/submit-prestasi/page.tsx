'use client';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Send, Upload, Trophy, Globe, Tag, CheckCircle } from 'lucide-react';
import type { Competition } from '@/types';

const CATEGORIES = ['Teknologi', 'Akademik', 'Kewirausahaan', 'Sains', 'Seni & Budaya', 'Olahraga', 'Lainnya'];
const LEVELS = ['kampus', 'nasional', 'internasional'];

export default function SubmitPrestasiPage() {
  const { profile } = useAuth();
  const supabase = createClient();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    competition_id: '',
    category: '',
    competition_level: 'nasional',
    proof_url: '',
  });

  useEffect(() => {
    const fetchComps = async () => {
      const { data } = await supabase.from('competitions').select('id, title, kategori').eq('status', 'active').order('created_at', { ascending: false });
      setCompetitions((data || []) as Competition[]);
    };
    fetchComps();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.id) { toast.error('Anda perlu login terlebih dahulu'); return; }
    if (!form.title) { toast.error('Judul prestasi wajib diisi'); return; }
    if (!form.category) { toast.error('Pilih kategori prestasi'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.from('achievements').insert({
        user_id: profile.id,
        title: form.title,
        description: form.description || null,
        competition_id: form.competition_id || null,
        category: form.category,
        competition_level: form.competition_level,
        proof_url: form.proof_url || null,
        status: 'pending',
      });
      if (error) throw error;

      // Create notification
      await supabase.from('notifications').insert({
        user_id: profile.id,
        type: 'submit',
        title: 'Prestasi Disubmit',
        body: `Prestasi "${form.title}" berhasil disubmit dan sedang menunggu verifikasi admin.`,
        href: '/mahasiswa/riwayat',
      });

      setSubmitted(true);
      toast.success('Prestasi berhasil disubmit! Menunggu verifikasi admin.');
      setForm({ title: '', description: '', competition_id: '', category: '', competition_level: 'nasional', proof_url: '' });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Gagal submit prestasi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout activePath="/mahasiswa/submit-prestasi">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Submit Prestasi</h1>
          <p className="text-slate-500 text-sm mt-1">Daftarkan pencapaian Anda untuk diverifikasi secara resmi oleh admin kampus.</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Form */}
          <div className="xl:col-span-2">
            {submitted && (
              <div className="card p-6 bg-emerald-50 border-emerald-200 flex items-start gap-4 mb-6">
                <CheckCircle size={24} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-emerald-800">Prestasi Berhasil Disubmit!</p>
                  <p className="text-sm text-emerald-700 mt-0.5">Tim admin akan meninjau submisi Anda. Pantau statusnya di halaman Riwayat Prestasi.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-3 text-sm font-semibold text-emerald-700 hover:underline">Submit prestasi lain →</button>
                </div>
              </div>
            )}
            <form onSubmit={handleSubmit} className="card p-6 space-y-5">
              <div>
                <label className="label-text">Judul Prestasi *</label>
                <input name="title" value={form.title} onChange={handleChange} type="text" placeholder="Contoh: Juara 1 Hackathon Nasional 2025" className="input-field" required />
              </div>
              <div>
                <label className="label-text">Deskripsi</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Jelaskan pencapaian Anda secara singkat…" className="input-field resize-none" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-text">Kategori Prestasi *</label>
                  <select name="category" value={form.category} onChange={handleChange} className="input-field" required>
                    <option value="">— Pilih kategori —</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-text">Tingkat Kompetisi</label>
                  <select name="competition_level" value={form.competition_level} onChange={handleChange} className="input-field">
                    {LEVELS.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="label-text">Lomba Terkait <span className="text-slate-400 font-normal">(opsional)</span></label>
                <select name="competition_id" value={form.competition_id} onChange={handleChange} className="input-field">
                  <option value="">— Pilih lomba jika ada —</option>
                  {competitions.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div>
                <label className="label-text">Link Bukti / Sertifikat *</label>
                <div className="relative">
                  <Upload size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input name="proof_url" value={form.proof_url} onChange={handleChange} type="url" placeholder="https://drive.google.com/… atau link sertifikat" className="input-field pl-9" />
                </div>
                <p className="text-xs text-slate-400 mt-1.5">Lampirkan link Google Drive, Dropbox, atau URL langsung ke sertifikat/bukti.</p>
              </div>
              <div className="pt-2">
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3">
                  {loading ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" /> Mengirim…</span>
                  ) : (
                    <><Send size={16} /> Submit Prestasi</>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Info Panel */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Trophy size={16} className="text-amber-500" /> Panduan Submit</h3>
              <ul className="space-y-2.5 text-sm text-slate-600">
                {[
                  'Pastikan judul prestasi jelas dan spesifik',
                  'Sertakan link bukti/sertifikat yang valid dan dapat diakses',
                  'Pilih kategori dan tingkat yang sesuai',
                  'Admin akan meninjau dalam 1-3 hari kerja',
                  'Notifikasi akan dikirim setelah verifikasi',
                ].map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">{i + 1}</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Tag size={16} className="text-indigo-500" /> Kategori</h3>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map(c => (
                  <span key={c} className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-medium">{c}</span>
                ))}
              </div>
            </div>
            <div className="card p-5">
              <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2"><Globe size={16} className="text-cyan-500" /> Tingkat</h3>
              <div className="space-y-2">
                {[
                  { level: 'Kampus', desc: 'Kompetisi internal kampus' },
                  { level: 'Nasional', desc: 'Lingkup seluruh Indonesia' },
                  { level: 'Internasional', desc: 'Lintas negara / luar negeri' },
                ].map(item => (
                  <div key={item.level} className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-700">{item.level}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
