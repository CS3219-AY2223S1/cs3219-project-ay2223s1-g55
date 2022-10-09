import AppBar from '@/components/defaultLayout/AppBar';
import useUserStore from '@/lib/store';
import React from 'react';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  const user = useUserStore((state) => state.user);

  return (
    <>
      <AppBar />

      {children}
    </>
  );
}

export default DefaultLayout;
