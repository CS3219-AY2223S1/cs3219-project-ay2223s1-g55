import { MouseEvent as ReactMouseEvent, useState } from 'react';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import DefaultLayout from '@/layouts/DefaultLayout';
import { STATUS_CODE_LOGGED_OUT } from '@/lib/constants';
import router from 'next/router';
import { useUserStore } from '@/lib/store';
import { clearJwt, getJwtCookie } from '@/lib/cookies';

const Dashboard = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleAvatarClick = (event: ReactMouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleAvatarMenuClose = () => {
    setAnchorEl(null);
  };

  const [difficulty, setDifficulty] = useState('');

  const { user, logout } = useUserStore((state) => ({
    user: state.user,
    logout: state.logoutUser,
  }));

  const handleDifficultyChange = (e: SelectChangeEvent<string>) => {
    setDifficulty(e.target.value);
  };

  const handleLogout = async () => {
    const currToken = getJwtCookie() as string;
    const res = await logout(currToken);
    if (res?.status === STATUS_CODE_LOGGED_OUT) {
      router.push('/login');
      clearJwt();
    }
  };

  return user.loginState ? (
    <DefaultLayout>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={6}>
          <div id="difficulty_selector" style={{ width: '30%' }}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={difficulty}
                label="Difficulty"
                onChange={handleDifficultyChange}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Grid>
        <Grid
          item
          xs={6}
          justifySelf="flex-end"
          sx={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleAvatarClick}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {user?.username.charAt(0).toLocaleUpperCase()}
              </Avatar>
            </IconButton>
          </Tooltip>
        </Grid>
      </Grid>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
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
        <MenuItem onClick={() => router.push('/settings')}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </DefaultLayout>
  ) : (
    <Dialog open={true} onClose={(e) => router.push('/login')}>
      <DialogTitle>{'Error!'}</DialogTitle>
      <DialogContent>
        <DialogContentText>{'Log in to continue'}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Link href="/login">
          <Button>Log in</Button>
        </Link>
      </DialogActions>
    </Dialog>
  );
};

export default Dashboard;
