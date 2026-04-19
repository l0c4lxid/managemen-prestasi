import React from 'react';
import AppLayout from '@/components/AppLayout';
import PrestasiTable from './components/PrestasiTable';

export default function PrestasiManagementPage() {
  return (
    <AppLayout activePath="/prestasi-management">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Prestasi</h1>
            <p className="text-slate-500 text-sm mt-1">Kelola, verifikasi, dan pantau seluruh submisi prestasi mahasiswa.</p>
          </div>
        </div>
        <PrestasiTable />
      </div>
    </AppLayout>
  );
}