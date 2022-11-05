import { Box, Toolbar, IconButton, Typography, AppBar as MuiAppBar } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import Link from 'next/link';
import ProfileAvatarButton from './ProfileAvatarButton';

const AppBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <MuiAppBar position='static'>
        <Toolbar>
          <Link href='/dashboard'>
            <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
              <HomeIcon />
            </IconButton>
          </Link>

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
