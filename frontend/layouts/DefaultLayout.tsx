import AppBar from '@/components/defaultLayout/AppBar';
import useUserStore from '@/lib/store';
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { getJwtCookie } from '@/lib/cookies';
import { Box, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import GitHubIcon from '@mui/icons-material/GitHub';

interface DefaultLayoutProps {
  children: React.ReactNode;
}

const Footer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  margin: 0,
  padding: 10
}));

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

      <Footer>
        <Grid container>
          <Grid item xs={2}>
            An app built by
            <ul>
              <li>Asher</li>
              <li>Ezekiel</li>
              <li>Glenn</li>
              <li>Zhikai</li>
            </ul>
          </Grid>
          <Grid container item xs={4} alignItems='center' gap={2}>
            <GitHubIcon />
            <a href='https://github.com/CS3219-AY2223S1/cs3219-project-ay2223s1-g55'>Github Repository</a>
          </Grid>

        </Grid>
      </Footer>
    </>
  );
}

export default DefaultLayout;
