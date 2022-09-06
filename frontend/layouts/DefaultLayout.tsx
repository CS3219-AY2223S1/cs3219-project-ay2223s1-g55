import { useSession } from '@/contexts/session.context';
import { Container } from '@mui/material';
import Head from 'next/head';
import React from 'react';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  const { user } = useSession();

  return (
    <Container>
      <Head>
        <title>Leet Deez Nutz</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>

      <div>{user?.username ?? 'Not logged in'}</div>
      {children}
    </Container>
  );
}

export default DefaultLayout;
