import AppBar from '@/components/defaultLayout/AppBar';
import useUserStore from '@/lib/store';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getJwtCookie } from '@/lib/cookies';
import { Box } from '@mui/material';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

function DefaultLayout({ children }: DefaultLayoutProps) {
  const { user, updateUser } = useUserStore((state) => ({
    user: state.user,
    updateUser: state.updateUser,
  }));
  const router = useRouter();

  useEffect(() => {
    updateUser(getJwtCookie()).then((res) => {
      if (!res.loginState) {
        console.log('pushing from default layout');
        router.push('/login');
      }
    });
  }, []);

  if (!user.loginState) return <div />;

  return (
    <>
      <AppBar />

      <Box sx={{ padding: '40px 0px' }}>
        {children}
      </Box>

      <Box sx={{ backgroundColor: 'primary.main', color: 'white', margin: 0, padding: 2 }}>
        An app built by
        <ul>
          <li>Asher</li>
          <li>Ezekiel</li>
          <li>Glenn</li>
          <li>Zhikai</li>
        </ul>
      </Box>
    </>
  );
}

export default DefaultLayout;
