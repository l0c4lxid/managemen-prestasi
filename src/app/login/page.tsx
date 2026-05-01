import React, { Suspense } from 'react';
import AuthPage from '@/components/auth/AuthPage';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Masuk',
};

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <AuthPage initialMode="login" />
    </Suspense>
  );
}