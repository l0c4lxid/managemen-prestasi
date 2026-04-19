import React, { useState, useEffect } from 'react';
import { X, Save, Shield, User, Mail, Hash, KeyRound } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editData?: any | null;
}

export default function UserFormModal({ isOpen, onClose, onSuccess, editData }: UserFormModalProps) {
  const supabase = createClient();
  const isEdit = !!editData;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    nim: '',
    role: 'mahasiswa',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEdit) {
        setFormData({
          name: editData.name || '',
          email: editData.email || '',
          nim: editData.nim || '',
          role: editData.role || 'mahasiswa',
          password: '', // blank password for edit means don't change
        });
      } else {
        setFormData({
          name: '',
          email: '',
          nim: '',
          role: 'mahasiswa',
          password: '',
        });
      }
    }
  }, [isOpen, editData, isEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isEdit) {
        // Create new user using RPC
        if (!formData.password) {
          toast.error('Password wajib diisi untuk pengguna baru');
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.rpc('admin_create_user', {
          email: formData.email,
          password: formData.password,
          name: formData.name,
          role: formData.role,
          nim: formData.nim || null,
        });

        if (error || data?.error) {
          throw new Error(error?.message || data?.error || 'Gagal membuat pengguna');
        }

        toast.success('Pengguna berhasil ditambahkan!');
      } else {
        // Edit existing user
        // Update public.users
        const { error: publicError } = await supabase
          .from('users')
          .update({
            name: formData.name,
            role: formData.role,
            nim: formData.nim || null,
          })
          .eq('id', editData.id);

        if (publicError) throw publicError;

        // If email or password changed, call RPC to update auth
        if ((formData.email !== editData.email) || formData.password) {
          const { data, error: authError } = await supabase.rpc('admin_update_user_auth', {
            target_user_id: editData.id,
            new_email: formData.email !== editData.email ? formData.email : null,
            new_password: formData.password || null,
          });

          if (authError || data?.error) {
            toast.error('Data profil diperbarui, tetapi gagal memperbarui Auth (Email/Password). ' + (authError?.message || data?.error));
          } else {
            toast.success('Data profil dan kredensial berhasil diperbarui!');
          }
        } else {
          toast.success('Data pengguna berhasil diperbarui!');
        }
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Terjadi kesalahan sistem');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800">
            {isEdit ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap *</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                required
                type="text" 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="Masukkan nama lengkap"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                required
                type="email" 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder="email@contoh.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Password {isEdit && <span className="text-xs text-slate-400 font-normal">(Kosongkan jika tidak ingin mengubah)</span>} {!isEdit && '*'}
            </label>
            <div className="relative">
              <KeyRound size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="password" 
                required={!isEdit}
                value={formData.password} 
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                placeholder={isEdit ? "Masukkan password baru" : "Buat password"}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Role *</label>
              <div className="relative">
                <Shield size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <select 
                  value={formData.role} 
                  onChange={e => setFormData({ ...formData, role: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm appearance-none"
                >
                  <option value="mahasiswa">Mahasiswa</option>
                  <option value="admin_lomba">Admin Lomba</option>
                  <option value="admin_prestasi">Admin Prestasi</option>
                  <option value="admin_perencanaan">Admin Perencanaan</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                NIM <span className="text-xs text-slate-400 font-normal">(Opsional)</span>
              </label>
              <div className="relative">
                <Hash size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  value={formData.nim} 
                  onChange={e => setFormData({ ...formData, nim: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  placeholder="Misal: 19.12.1111"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Simpan
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
