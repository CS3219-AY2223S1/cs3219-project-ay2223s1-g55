import { Box, Toolbar, IconButton, Typography, Button, AppBar as MuiAppBar } from '@mui/material';
import Link from 'next/link';
import ProfileAvatarButton from './ProfileAvatarButton';

const AppBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <MuiAppBar position='static'>
        <Toolbar>
          <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }} />

          <Link href='/dashboard'>
            <Typography variant='h6' component='div' sx={{ flexGrow: 1, cursor: 'pointer' }}>
              Leet Warriors
            </Typography>
          </Link>

          <ProfileAvatarButton />
        </Toolbar>
      </MuiAppBar>
    </Box>
  );
};

export default AppBar;
