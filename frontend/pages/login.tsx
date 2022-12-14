import { useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import router from 'next/router';
import useUserStore from '@/lib/store';
import DefaultLayout from '@/layouts/DefaultLayout';
import { getJwtCookie, saveJwtCookie } from '@/lib/cookies';
import AuthLayout from '@/layouts/AuthLayout';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMsg, setDialogMsg] = useState('');

  const setSuccessDialog = (msg: string) => {
    setIsDialogOpen(true);
    setDialogTitle('Success');
    setDialogMsg(msg);
  };

  const setErrorDialog = (msg: string) => {
    setIsDialogOpen(true);
    setDialogTitle('Error');
    setDialogMsg(msg);
  };
  const { user, loginUser } = useUserStore((state) => ({
    user: state.user,
    loginUser: state.loginUser,
  }));
  const handleLogin = async () => {
    const currToken = getJwtCookie() as string;
    const { error, ...res } = await loginUser(username, password, currToken);
    if (error) {
      setErrorDialog(error);
      return;
    }
    setSuccessDialog('Successfully logged in!');
    saveJwtCookie(res.token);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    if (dialogTitle === 'Success') {
      router.push('/dashboard');
    }
  };

  const handleSignupClick = () => router.push('/signup');

  return (
    <AuthLayout>
      <Box display='flex' flexDirection='column'>
        <Typography variant='h2' marginBottom='2rem'>
          Leet Warriors
        </Typography>
        <Typography variant='h3' marginBottom='2rem'>
          Log In
        </Typography>
        <TextField
          label='Username'
          variant='standard'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ marginBottom: '1rem' }}
          autoFocus
        />
        <TextField
          label='Password'
          variant='standard'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: '2rem' }}
        />
        <Box display='flex' flexDirection='row' justifyContent='flex-end'>
          <Button variant='outlined' onClick={handleLogin}>
            Log in
          </Button>
        </Box>

        <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogMsg}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>

      <Box display='flex' flexDirection='row' justifyContent='flex-start'>
        <Button onClick={handleSignupClick}>No account? Create one here!</Button>
      </Box>
    </AuthLayout>
  );
}

export default LoginPage;
