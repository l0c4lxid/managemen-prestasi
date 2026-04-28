import React, { Suspense } from 'react';
import AuthPage from '@/components/auth/AuthPage';

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <AuthPage initialMode="register" />
    </Suspense>
  );
}
