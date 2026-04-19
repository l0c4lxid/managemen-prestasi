'use client';
import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ShieldCheck, Zap, Globe } from 'lucide-react';

const faqs = [
  {
    question: "Apa itu PrestasiSolo?",
    answer: "PrestasiSolo adalah platform resmi pendataan dan manajemen prestasi mahasiswa. Di sini kamu bisa menemukan informasi lomba terbaru, mendaftar event pengembangan diri, hingga memverifikasi sertifikat prestasimu secara digital untuk keperluan SKPI."
  },
  {
    question: "Bagaimana cara mendaftarkan prestasi saya?",
    answer: "1. Login ke akun mahasiswa Anda.\n2. Buka menu 'Prestasi Saya'.\n3. Klik 'Tambah Prestasi'.\n4. Isi detail kompetisi (nama, tingkat, kategori) dan unggah bukti sertifikat/foto.\n5. Tunggu verifikasi admin (maksimal 3 hari kerja)."
  },
  {
    question: "Apa keuntungan verifikasi prestasi di sini?",
    answer: "Prestasi yang terverifikasi akan otomatis tercatat dalam Sistem Kredit Poin Mahasiswa dan akan muncul di Surat Keterangan Pendamping Ijazah (SKPI) saat Anda lulus nanti."
  },
  {
    question: "Siapa yang bisa mengakses platform ini?",
    answer: "Seluruh mahasiswa aktif di lingkungan kampus dapat login menggunakan akun portal akademik masing-masing. Informasi lomba dan event dapat diakses secara publik."
  },
  {
    question: "Bagaimana jika data lomba belum ada?",
    answer: "Jika Anda mengikuti lomba yang belum terdaftar di sistem, Anda tetap bisa mengajukan 'Prestasi Mandiri' dengan mengunggah bukti surat tugas atau undangan lomba tersebut."
  },
  {
    question: "Pusat Bantuan & Kendala Teknis?",
    answer: "Jika mengalami kendala login atau verifikasi yang tertunda lama, silakan hubungi Biro Kemahasiswaan di Gedung Rektorat Lt. 2 atau kirim pesan melalui fitur 'Bantuan' di dashboard."
  }
];

export default function AboutSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold mb-6">
              <HelpCircle size={14} />
              Informasi & FAQ
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6 leading-tight">
              Segala Hal yang Perlu Kamu Ketahui Tentang <span className="text-indigo-600">PrestasiSolo</span>
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Kami hadir untuk memudahkan mahasiswa dalam meniti karir kompetitif dan mendokumentasikan setiap pencapaian berharga selama masa perkuliahan.
            </p>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex gap-4 p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Terverifikasi</h4>
                  <p className="text-xs text-slate-500 mt-1">Data prestasi dijamin valid dan resmi.</p>
                </div>
              </div>
              <div className="flex gap-4 p-4 rounded-2xl bg-white shadow-sm border border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                  <Globe size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Terpusat</h4>
                  <p className="text-xs text-slate-500 mt-1">Satu portal untuk semua info lomba.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index} 
                  className={`group bg-white rounded-2xl border transition-all duration-300 ${isOpen ? 'border-indigo-200 shadow-md ring-1 ring-indigo-50' : 'border-slate-100 hover:border-slate-200 shadow-sm'}`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left"
                  >
                    <span className={`font-bold transition-colors ${isOpen ? 'text-indigo-700' : 'text-slate-800'}`}>
                      {faq.question}
                    </span>
                    <ChevronDown 
                      size={20} 
                      className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} 
                    />
                  </button>
                  <div 
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-4">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
