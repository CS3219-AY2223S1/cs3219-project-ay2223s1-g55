import AppBar from '@/components/defaultLayout/AppBar';
import useUserStore from '@/lib/store';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  useEffect(() => {
    if (!user.loginState) {
      router.push('/login');
    }
  }, []);

  if (!user.loginState) return <></>;

  return (
    <>
      <AppBar />

      {children}
    </>
  );
}

export default DefaultLayout;
