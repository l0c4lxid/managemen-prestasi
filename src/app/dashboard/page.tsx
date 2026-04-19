import React from 'react';
import AppLayout from '@/components/AppLayout';
import DashboardBento from './components/DashboardBento';
import DashboardCharts from './components/DashboardCharts';
import PendingVerifikasiTable from './components/PendingVerifikasiTable';
import RecentActivity from './components/RecentActivity';

export default function DashboardPage() {
  return (
    <AppLayout activePath="/dashboard">
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Selamat datang kembali, Rizky. Berikut ringkasan aktivitas platform hari ini.</p>
        </div>

        <DashboardBento />
        <DashboardCharts />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <PendingVerifikasiTable />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}