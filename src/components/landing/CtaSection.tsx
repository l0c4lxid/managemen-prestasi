import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CtaSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-12 lg:p-16 text-center">
          {/* Decorative blobs */}
          <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/10 blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/10 blur-3xl translate-x-1/3 translate-y-1/3" />

          <div className="relative">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-xs font-semibold mb-6 border border-white/30">
              <Sparkles size={13} />
              Bergabung Sekarang — Gratis
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
              Mulai Catat Prestasimu <br className="hidden sm:block" />
              Hari Ini
            </h2>

            <p className="text-white/80 text-base lg:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Bergabung dengan lebih dari 1.200 mahasiswa yang sudah memanfaatkan SiBerkas
              untuk mendapatkan pengakuan resmi atas kerja keras mereka.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white text-indigo-700 text-sm font-bold
                  hover:bg-indigo-50 active:scale-95 transition-all duration-150 shadow-lg"
              >
                Daftar Gratis
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-white/60 text-white text-sm font-semibold
                  hover:bg-white/10 active:scale-95 transition-all duration-150"
              >
                Sudah punya akun? Masuk
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}