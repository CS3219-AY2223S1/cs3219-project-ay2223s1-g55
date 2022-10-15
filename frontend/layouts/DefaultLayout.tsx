import AppBar from '@/components/defaultLayout/AppBar';
import useUserStore from '@/lib/store';
import React from 'react';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      <AppBar />

      {children}
    </>
  );
}

export default DefaultLayout;
