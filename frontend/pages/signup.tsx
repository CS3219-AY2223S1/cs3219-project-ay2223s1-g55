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
import { useState } from 'react';
import axios from 'axios';
import { URL_USER_SVC } from '@/lib/configs';
import { STATUS_CODE_CONFLICT, STATUS_CODE_CREATED } from '@/lib/constants';
import Link from 'next/link';
import DefaultLayout from '@/layouts/DefaultLayout';
import router from 'next/router';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMsg, setDialogMsg] = useState('');
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);

  const handleSignup = async () => {
    setIsSignupSuccess(false);
    const res = await axios.post(URL_USER_SVC, { username, password }).catch((err) => {
      if (err.response.status === STATUS_CODE_CONFLICT) {
        setErrorDialog('This username already exists');
      } else {
        setErrorDialog('Please try again later');
      }
    });
    if (res && res.status === STATUS_CODE_CREATED) {
      setSuccessDialog('Account successfully created');
      setIsSignupSuccess(true);
    }
  };

  const closeDialog = () => setIsDialogOpen(false);

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

  const handleLoginClick = () => router.push('/login');
  return (
    <DefaultLayout>
      <Box display="flex" flexDirection="column" width="30%">
        <Typography variant="h3" marginBottom="2rem">
          Sign Up
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
          <Button variant="outlined" onClick={handleSignup}>
            Sign up
          </Button>
        </Box>

        <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogMsg}</DialogContentText>
          </DialogContent>
          <DialogActions>
            {isSignupSuccess ? (
              <Link href="/login" passHref>
                <Button>Log in</Button>
              </Link>
            ) : (
              <Button onClick={closeDialog}>Done</Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>

      <Box display="flex" flexDirection="row" justifyContent="flex-start">
        <Button onClick={handleLoginClick}>Have an account? Login here!</Button>
      </Box>
    </DefaultLayout>
  );
};

export default SignupPage;
