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
import Link from 'next/link';
import router from 'next/router';
import AuthLayout from '@/layouts/AuthLayout';
import { validatePassword } from '@/lib/helpers';
import { signUpUser } from 'api';

function SignupPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMsg, setDialogMsg] = useState('');
  const [isSignupSuccess, setIsSignupSuccess] = useState(false);
  const [passwordValidationError, setPasswordValidationError] = useState('');

  const handleSignup = async () => {
    setIsSignupSuccess(false);
    try {
      const res = await signUpUser(username, password);
      if (!res) {
        throw new Error('Failed to signup');
      }
      setSuccessDialog('Account successfully created');
      setIsSignupSuccess(true);
    } catch (err) {
      setErrorDialog('This username already exists');
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

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    const err = validatePassword(e.target.value);
    setPasswordValidationError(err);
  };

  const handleLoginClick = () => router.push('/login');
  return (
    <AuthLayout>
      <Box display='flex' flexDirection='column'>
        <Typography variant='h2' marginBottom='2rem'>
          Leet Warriors
        </Typography>
        <Typography variant='h3' marginBottom='2rem'>
          Sign Up
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
          error={passwordValidationError.length > 0}
          helperText={passwordValidationError}
          value={password}
          onChange={handlePasswordChange}
          sx={{ marginBottom: '2rem' }}
        />
        <Box display='flex' flexDirection='row' justifyContent='flex-end'>
          <Button
            variant='outlined'
            onClick={handleSignup}
            disabled={password.length === 0 || passwordValidationError.length > 0}
          >
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
              <Link href='/login' passHref>
                <Button>Log in</Button>
              </Link>
            ) : (
              <Button onClick={closeDialog}>Done</Button>
            )}
          </DialogActions>
        </Dialog>
      </Box>

      <Box display='flex' flexDirection='row' justifyContent='flex-start'>
        <Button onClick={handleLoginClick}>Have an account? Login here!</Button>
      </Box>
    </AuthLayout>
  );
}

export default SignupPage;
