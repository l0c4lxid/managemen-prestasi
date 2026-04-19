import React from 'react';
import { CalendarDays, MapPin, Users, ArrowRight } from 'lucide-react';
import AppImage from '@/components/ui/AppImage';

const events = [
{ id: 'event-001', nama: 'Workshop Penulisan Proposal PKM', tipe: 'Workshop', tanggal: '26 Apr 2026', lokasi: 'Aula Rektorat Lt. 3', mentor: 'Dr. Haris Setiawan, M.Pd.', peserta: 45, kapasitas: 60, img: "https://img.rocket.new/generatedImages/rocket_gen_img_14a5ca983-1763300171126.png", color: 'bg-indigo-600' },
{ id: 'event-002', nama: 'Seminar Kewirausahaan Digital 2026', tipe: 'Seminar', tanggal: '3 Mei 2026', lokasi: 'Gedung Serbaguna Kampus A', mentor: 'Budi Santoso (CEO Tokopangan)', peserta: 112, kapasitas: 150, img: "https://img.rocket.new/generatedImages/rocket_gen_img_14a5ca983-1763300171126.png", color: 'bg-emerald-600' },
{ id: 'event-003', nama: 'Pelatihan Desain UI/UX Figma Advanced', tipe: 'Pelatihan', tanggal: '10 Mei 2026', lokasi: 'Lab Komputer Teknik', mentor: 'Anisa Rahmawati (Lead Designer)', peserta: 28, kapasitas: 30, img: "https://img.rocket.new/generatedImages/rocket_gen_img_121098063-1772349218498.png", color: 'bg-cyan-600' },
{ id: 'event-004', nama: 'Coaching Clinic Lomba Nasional', tipe: 'Coaching', tanggal: '17 Mei 2026', lokasi: 'Online via Zoom', mentor: 'Tim Kemahasiswaan', peserta: 67, kapasitas: 100, img: "https://img.rocket.new/generatedImages/rocket_gen_img_14bc62962-1776598832013.png", color: 'bg-purple-600' }];


export default function EventSection({ initialData = [] }: { initialData?: any[] }) {
  const mappedData = initialData.map(item => ({
    id: item.id,
    nama: item.title,
    tipe: item.type || 'Event',
    tanggal: new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    lokasi: item.location || 'Online',
    mentor: item.mentor || 'Kampus',
    peserta: 0,
    kapasitas: item.quota || 100,
    img: item.poster_url || "https://img.rocket.new/generatedImages/rocket_gen_img_14a5ca983-1763300171126.png",
    color: 'bg-indigo-600'
  }));

  return (
    <section id="event" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-700 text-xs font-semibold mb-3">
              <CalendarDays size={13} />
              Event & Pelatihan
            </div>
            <h2 className="section-header">Kegiatan Mendatang</h2>
            <p className="text-slate-500 mt-2 text-sm">Workshop, seminar, dan coaching untuk tingkatkan kemampuanmu.</p>
          </div>
        </div>

        {mappedData.length > 0 ? (
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin lg:grid lg:grid-cols-4 lg:overflow-visible lg:pb-0">
            {mappedData.map((event) => {
              const fillPct = Math.round((event.peserta / event.kapasitas) * 100);
              const isAlmostFull = fillPct >= 90;

              return (
                <div
                  key={event.id}
                  className="flex-shrink-0 w-72 lg:w-auto card overflow-hidden hover:-translate-y-1 transition-all duration-200 group"
                >
                  {/* Image */}
                  <div className="relative h-36 overflow-hidden">
                    <AppImage
                      src={event.img}
                      alt={`Banner event ${event.nama} di ${event.lokasi}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 1024px) 288px, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-1 rounded-lg text-white text-[11px] font-bold ${event.color}`}>
                        {event.tipe}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white">
                      <CalendarDays size={13} />
                      <span className="text-xs font-semibold">{event.tanggal}</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-2">{event.nama}</h3>
                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2 text-xs text-slate-500">
                        <MapPin size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        <span className="truncate">{event.lokasi}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Users size={13} className="text-slate-400 flex-shrink-0" />
                        <span>{event.mentor}</span>
                      </div>
                    </div>
                    {/* Capacity bar */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-slate-500 font-medium">Kapasitas</span>
                        <span className={`text-[11px] font-bold ${isAlmostFull ? 'text-red-600' : 'text-slate-700'}`}>
                          {event.peserta}/{event.kapasitas}
                          {isAlmostFull && ' — Hampir Penuh!'}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${isAlmostFull ? 'bg-red-500' : 'bg-indigo-500'}`}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </div>
                    <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 active:scale-95 transition-all duration-150">
                      Daftar Sekarang
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-100">
            <CalendarDays size={40} className="mx-auto text-slate-200 mb-4" />
            <h3 className="text-slate-500 font-bold">Belum Ada Event Terdekat</h3>
            <p className="text-slate-400 text-sm mt-1">Nantikan workshop dan seminar menarik lainnya.</p>
          </div>
        )}
      </div>
    </section>
  );
}