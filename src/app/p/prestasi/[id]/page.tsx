import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import AppImage from '@/components/ui/AppImage';
import LandingNav from '@/components/landing/LandingNav';
import LandingFooter from '@/components/landing/LandingFooter';
import { ArrowLeft, Trophy, Calendar, User, Tag, ShieldCheck, Download, ExternalLink, Share2 } from 'lucide-react';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from('achievements').select('title').eq('id', id).single();
  return {
    title: data?.title || 'Detail Prestasi',
  };
}

export default async function PublicAchievementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  
  const { data: achievement, error } = await supabase
    .from('achievements')
    .select('*, users:user_id(name, nim, avatar_url, role), competitions:competition_id(title, organizer)')
    .eq('id', id)
    .single();

  if (error || !achievement) {
    notFound();
  }

  const isVerified = achievement.status === 'verified';

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <LandingNav />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-6 flex items-center justify-between">
            <Link href="/#wall-of-fame" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors">
              <ArrowLeft size={16} />
              Kembali ke Wall of Fame
            </Link>
            <div className="flex items-center gap-2">
               <button className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                 <Share2 size={16} />
               </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-soft-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
              
              {/* Left Side: Media/Image */}
              <div className="p-4 bg-slate-50/50 flex flex-col items-center justify-center min-h-[300px]">
                <div className="relative w-full aspect-[3/4] max-w-[320px] rounded-2xl overflow-hidden shadow-soft-lg group bg-slate-100">
                   {achievement.proof_url ? (
                     <AppImage 
                       src={achievement.proof_url} 
                       alt={`Bukti prestasi ${achievement.title}`}
                       fill
                       style={{ objectFit: 'contain' }}
                       className="group-hover:scale-[1.02] transition-transform duration-500"
                     />
                   ) : (
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-cyan-500 flex flex-col items-center justify-center text-white p-6 text-center">
                        <Trophy size={64} className="mb-4 opacity-50" />
                        <p className="font-bold text-lg">Sertifikat / Bukti Prestasi</p>
                        <p className="text-xs opacity-70 mt-2 text-white/80">Gambar bukti tidak tersedia atau bersifat privat.</p>
                     </div>
                   )}
                   {isVerified && (
                     <div className="absolute top-4 right-4 z-10">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg">
                           <ShieldCheck size={14} />
                           Verified
                        </div>
                     </div>
                   )}
                </div>
                {achievement.proof_url && (
                  <a 
                    href={achievement.proof_url} 
                    target="_blank" 
                    rel="noreferrer"
                    className="mt-6 flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                  >
                    <ExternalLink size={14} />
                    Lihat Dokumen Lengkap
                  </a>
                )}
              </div>

              {/* Right Side: Details */}
              <div className="p-8 md:p-10">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-widest mb-4">
                    <Trophy size={12} />
                    Pencapaian Mahasiswa
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 leading-tight mb-2">
                    {achievement.title}
                  </h1>
                  <p className="text-slate-500 text-sm italic">
                    {achievement.competitions?.title || 'Kompetisi Mandiri'}
                  </p>
                </div>

                <div className="space-y-6">
                  {/* Achiever Info */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
                      <AppImage 
                        src={achievement.users?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(achievement.users?.name || 'M')}&background=random`}
                        alt={achievement.users?.name || 'Avatar'}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{achievement.users?.name}</p>
                      <p className="text-[11px] text-slate-500 font-medium">NIM: {achievement.users?.nim || '-'}</p>
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Tag size={10} /> Kategori
                      </p>
                      <p className="text-sm font-semibold text-slate-700">{achievement.category || 'Akademik'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <ShieldCheck size={10} /> Tingkat
                      </p>
                      <p className="text-sm font-semibold text-slate-700 capitalize">{achievement.competition_level || 'Nasional'}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Calendar size={10} /> Tanggal
                      </p>
                      <p className="text-sm font-semibold text-slate-700">
                        {new Date(achievement.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    {achievement.competitions?.organizer && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                          <User size={10} /> Penyelenggara
                        </p>
                        <p className="text-sm font-semibold text-slate-700 truncate">{achievement.competitions.organizer}</p>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  {achievement.description && (
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Deskripsi Tambahan</p>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {achievement.description}
                      </p>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="pt-8 flex flex-col gap-3">
                     <Link 
                       href="/mahasiswa/submit-prestasi"
                       className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95"
                     >
                       <Trophy size={18} />
                       Submit Prestasi Anda
                     </Link>
                     <p className="text-center text-[11px] text-slate-400">
                       Jadilah bagian dari Wall of Fame kami. Submit prestasimu sekarang!
                     </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
