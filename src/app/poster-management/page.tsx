'use client';

import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2, Eye, EyeOff, Image as ImageIcon, Loader2 } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';

interface Poster {
  id: string;
  title: string;
  image_url: string;
  is_active: boolean;
  order_index: number;
  created_at: string;
}

export default function PosterManagementPage() {
  const [posters, setPosters] = useState<Poster[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    fetchPosters();
  }, []);

  const fetchPosters = async () => {
    try {
      const { data, error } = await supabase
        .from('wall_of_fame_posters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosters(data || []);
    } catch (error) {
      console.error('Error fetching posters:', error);
      toast.error('Gagal memuat data poster');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      if (!newTitle) {
        setNewTitle(file.name.split('.')[0]);
      }
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !newTitle) {
      toast.error('Judul dan gambar harus diisi');
      return;
    }

    setUploading(true);
    try {
      // 1. Upload file to Supabase Storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('posters')
        .upload(filePath, selectedFile);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('posters')
        .getPublicUrl(filePath);

      // 3. Insert into Database
      const { error: dbError } = await supabase
        .from('wall_of_fame_posters')
        .insert({
          title: newTitle,
          image_url: publicUrl,
          is_active: true
        });

      if (dbError) throw dbError;

      toast.success('Poster berhasil ditambahkan');
      setIsModalOpen(false);
      setNewTitle('');
      setSelectedFile(null);
      setPreviewUrl(null);
      fetchPosters();

    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Terjadi kesalahan saat mengunggah');
    } finally {
      setUploading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('wall_of_fame_posters')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;
      setPosters(posters.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
      toast.success(`Poster berhasil ${!currentStatus ? 'ditampilkan' : 'disembunyikan'}`);
    } catch (error) {
      toast.error('Gagal mengubah status poster');
    }
  };

  const deletePoster = async (id: string, imageUrl: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus poster ini?')) return;
    
    try {
      // Delete from DB
      const { error: dbError } = await supabase
        .from('wall_of_fame_posters')
        .delete()
        .eq('id', id);

      if (dbError) throw dbError;

      // Optional: Delete from storage
      try {
        const urlParts = imageUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        if (fileName) {
          await supabase.storage.from('posters').remove([fileName]);
        }
      } catch (e) {
        console.error('Failed to delete storage file', e);
      }

      setPosters(posters.filter(p => p.id !== id));
      toast.success('Poster berhasil dihapus');
    } catch (error) {
      toast.error('Gagal menghapus poster');
    }
  };

  return (
    <AppLayout activePath="/poster-management">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Poster</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola galeri poster Wall of Fame untuk halaman utama.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={16} />
          Tambah Poster
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-indigo-500" size={32} />
        </div>
      ) : posters.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4">
            <ImageIcon size={24} className="text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Belum Ada Poster</h3>
          <p className="text-slate-500 text-sm mb-6">Tambahkan poster pertama Anda untuk ditampilkan di Wall of Fame.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 text-sm font-semibold hover:bg-indigo-100 transition-colors"
          >
            <Plus size={16} /> Upload Sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posters.map((poster) => (
            <div key={poster.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden group">
              <div className="relative aspect-[1/1.4] bg-slate-50">
                <AppImage
                  src={poster.image_url}
                  alt={poster.title}
                  fill
                  className={`object-contain transition-all duration-300 ${!poster.is_active ? 'opacity-50 grayscale' : ''}`}
                />
                <div className="absolute top-3 right-3 flex gap-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur-md ${
                    poster.is_active ? 'bg-green-500/90 text-white' : 'bg-slate-500/90 text-white'
                  }`}>
                    {poster.is_active ? 'Aktif' : 'Nonaktif'}
                  </span>
                </div>
                
                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                  <button
                    onClick={() => toggleStatus(poster.id, poster.is_active)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-indigo-600 hover:scale-110 transition-all shadow-lg"
                    title={poster.is_active ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {poster.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    onClick={() => deletePoster(poster.id, poster.image_url)}
                    className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-700 hover:text-red-600 hover:scale-110 transition-all shadow-lg"
                    title="Hapus Poster"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-4 border-t border-slate-50">
                <h3 className="font-semibold text-slate-800 truncate" title={poster.title}>{poster.title}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ditambahkan {new Date(poster.created_at).toLocaleDateString('id-ID')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-800">Tambah Poster Baru</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <form onSubmit={handleUpload} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">Judul Poster</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Juara 1 Gemastik 2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">File Gambar (PNG/JPG/PDF)</label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-2xl hover:border-indigo-400 transition-colors bg-slate-50 relative overflow-hidden group">
                    {previewUrl ? (
                      <div className="absolute inset-0 w-full h-full">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <p className="text-white text-sm font-semibold">Klik untuk mengubah</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 text-center">
                        <ImageIcon className="mx-auto h-10 w-10 text-slate-400" />
                        <div className="text-sm text-slate-600">
                          <span className="font-semibold text-indigo-600 hover:text-indigo-500">Upload file</span> atau seret kesini
                        </div>
                        <p className="text-xs text-slate-500">PNG, JPG, max 5MB</p>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={uploading || !selectedFile}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-60"
                  >
                    {uploading ? (
                      <><Loader2 size={16} className="animate-spin" /> Mengunggah...</>
                    ) : (
                      <><Plus size={16} /> Simpan Poster</>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
