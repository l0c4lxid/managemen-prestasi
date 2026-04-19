'use client';
import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardBento from './components/DashboardBento';
import DashboardCharts from './components/DashboardCharts';
import PendingVerifikasiTable from './components/PendingVerifikasiTable';
import RecentActivity from './components/RecentActivity';
import { useAuth } from '@/contexts/AuthContext';

export default function DashboardPage() {
  const { profile, role } = useAuth();

  const greetings: Record<string, string> = {
    super_admin: 'Selamat datang, Super Admin. Berikut ringkasan sistem hari ini.',
    admin_prestasi: 'Selamat datang. Tinjau dan verifikasi prestasi mahasiswa di bawah.',
    admin_lomba: 'Selamat datang. Kelola lomba dan hibah aktif kampus.',
    admin_perencanaan: 'Selamat datang. Monitor program dan timeline strategis kampus.',
    mahasiswa: 'Selamat datang! Temukan lomba dan kelola prestasi Anda.',
  };

  return (
    <AppLayout activePath="/dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            {role ? greetings[role] : `Selamat datang, ${profile?.name || 'Pengguna'}.`}
          </p>
        </div>

        <DashboardBento />
        <DashboardCharts />

        {role !== 'mahasiswa' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2">
              <PendingVerifikasiTable />
            </div>
            <div>
              <RecentActivity />
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}