import { MouseEvent as ReactMouseEvent, useState } from 'react';
import { Box, Button, Select, SelectChangeEvent } from '@mui/material';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import DefaultLayout from '@/layouts/DefaultLayout';
import { STATUS_CODE_LOGGED_OUT } from '@/lib/constants';
import router from 'next/router';
import useUserStore from '@/lib/store';
import { clearJwt, getJwtCookie } from '@/lib/cookies';
import UnauthorizedDialog from '@/components/UnauthorizedDialog';
import ProfileAvatarButton from '@/components/defaultLayout/ProfileAvatarButton';
import QuestionList from '@/components/QuestionList/QuestionList';

function Dashboard() {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const handleMatching = async () => {
    router.push('/match');
  };

  if (!user.loginState) return <UnauthorizedDialog />;

  return (
    <DefaultLayout>
      <Box
        justifySelf="center"
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
      >
        <Button
          id="matching_button"
          variant="contained"
          onClick={handleMatching}
          sx={{ height: '100%' }}
        >
          Match
        </Button>
      </Box>

      <QuestionList />
    </DefaultLayout>
  );
}

export default Dashboard;
