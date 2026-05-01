import React, { Suspense } from 'react';
import AuthPage from '@/components/auth/AuthPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Daftar',
};

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <AuthPage initialMode="register" />
    </Suspense>
  );
}
