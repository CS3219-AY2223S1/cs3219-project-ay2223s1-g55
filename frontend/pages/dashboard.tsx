import { SetStateAction, useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  Link,
  MenuItem,
  Select,
  SelectChangeEvent,
} from '@mui/material';
import DefaultLayout from '@/layouts/DefaultLayout';
import { STATUS_CODE_LOGGED_OUT, STATUS_CODE_DELETED } from '@/lib/constants';
import router from 'next/router';
import { useUserStore } from '@/lib/store';
import { clearJwt, getJwtCookie } from '@/lib/cookies';

const Dashboard = () => {
  const [difficulty, setDifficulty] = useState('');
  const [deleted, setDeleted] = useState<boolean>(false);
  const { user, logout, deleteUser } = useUserStore((state) => ({
    user: state.user,
    logout: state.logoutUser,
    deleteUser: state.deleteUser,
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

  const handleDeleteUser = async () => {
    const currToken = getJwtCookie() as string;
    const res = await deleteUser(currToken);
    if (res?.status === STATUS_CODE_DELETED) {
      setDeleted(true);
      router.push('/signup');
      clearJwt();
    }
  };

  return user.loginState || deleted ? (
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
          container
          item
          xs={6}
          justifySelf="flex-end"
          sx={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Grid
            item
            xs={12}
            justifySelf="center"
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              id="logout_button"
              variant="contained"
              onClick={handleLogout}
              sx={{ height: '100%' }}
            >
              LOG OUT
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            justifySelf="center"
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              id="delete_account_button"
              variant="contained"
              onClick={handleDeleteUser}
              sx={{ height: '100%' }}
            >
              DELETE
            </Button>
          </Grid>
        </Grid>
      </Grid>
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
