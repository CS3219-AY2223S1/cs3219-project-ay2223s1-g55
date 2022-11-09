import React, { useState } from 'react';
import { clearJwt } from '@/lib/cookies';
import { Settings, Logout, Route } from '@mui/icons-material';
import { Menu, MenuItem, ListItemIcon, Avatar, Grid, IconButton, Tooltip } from '@mui/material';
import router from 'next/router';
import useUserStore from '@/lib/store';
import Link from 'next/link';

const ProfileAvatarButton = () => {
  const { user, logout } = useUserStore((state) => ({
    logout: state.logoutUser,
    user: state.user,
  }));

  const handleLogout = async () => {
    const res = await logout();
    if (res) {
      router.push('/login');
      clearJwt();
    }
  };

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAvatarMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title='Account settings'>
        <IconButton
          onClick={handleAvatarClick}
          size='small'
          sx={{ ml: 2 }}
          aria-controls={open ? 'account-menu' : undefined}
          aria-haspopup='true'
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 32, height: 32 }}>
            {user?.username.charAt(0).toLocaleUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>
      {user?.username}

      <Menu
        anchorEl={anchorEl}
        id='account-menu'
        open={open}
        onClose={handleAvatarMenuClose}
        onClick={handleAvatarMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Link href='/learning-pathway' passHref>
          <MenuItem>
            <ListItemIcon>
              <Route fontSize='small' />
            </ListItemIcon>
            My Learning Pathway
          </MenuItem>
        </Link>

        <Link href='/settings' passHref>
          <MenuItem>
            <ListItemIcon>
              <Settings fontSize='small' />
            </ListItemIcon>
            Settings
          </MenuItem>
        </Link>

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize='small' />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default ProfileAvatarButton;
