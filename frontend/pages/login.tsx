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
import { STATUS_CODE_LOGIN_FAILED, STATUS_CODE_LOGGED_IN } from '@/lib/constants';
import { useSession } from '@/contexts/session.context';
import DefaultLayout from '@/layouts/DefaultLayout';
import { useRouter } from 'next/router';

function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMsg, setDialogMsg] = useState('');
  const { login } = useSession();

  const handleLogin = async () => {
    try {
      const res = await login(username, password);
      if (res && res.status === STATUS_CODE_LOGGED_IN) {
        setSuccessDialog('Successfully logged in!');
      }
    } catch (err: any) {
      if (err.response.status === STATUS_CODE_LOGIN_FAILED) {
        setErrorDialog('Failed to login user');
      } else {
        setErrorDialog('Please try again later');
      }
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    if (dialogTitle === 'Success') {
      router.push('/dashboard');
    }
  };

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

  return (
    <DefaultLayout>
      <Box display="flex" flexDirection="column" width="30%">
        <Typography variant="h3" marginBottom="2rem">
          Log In
        </Typography>
        <TextField
          label="Username"
          variant="standard"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          sx={{ marginBottom: '1rem' }}
          autoFocus
        />
        <TextField
          label="Password"
          variant="standard"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ marginBottom: '2rem' }}
        />
        <Box display="flex" flexDirection="row" justifyContent="flex-end">
          <Button variant="outlined" onClick={handleLogin}>
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
    </DefaultLayout>
  );
}

export default LoginPage;
