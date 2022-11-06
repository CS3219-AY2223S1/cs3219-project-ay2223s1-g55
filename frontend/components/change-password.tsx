import DefaultLayout from '@/layouts/DefaultLayout';
import { Button, TextField, Container } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import router from 'next/router';
import { URL_USER_SVC } from '@/lib/configs';
import { STATUS_CODE_CONFLICT, STATUS_CODE_SUCCESS } from '@/lib/constants';
import { getJwtCookie } from '@/lib/cookies';
import useUserStore from '@/lib/store';
import { validatePassword } from '@/lib/helpers';

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [oldPasswordError, setOldPasswordErr] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const handlePasswordChange = async (e: any) => {
    e.preventDefault();
    const token = getJwtCookie();
    const res = await axios
      .put(
        URL_USER_SVC,
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .catch((err) => {
        if (err.response.status === STATUS_CODE_CONFLICT) {
          setOldPasswordErr(true);
        } else {
          setOldPasswordErr(false);
        }
      });
    if (res && res.status === STATUS_CODE_SUCCESS) {
      setOldPasswordErr(false);
      router.push('/dashboard');
    }
  };

  const handleValidation = (e: any) => {
    const passwordInputValue = e.target.value.trim();
    const passwordInputFieldName = e.target.name;

    // Only bother validating the newPassword field
    if (passwordInputFieldName === 'newPassword') {
      const errMsg = validatePassword(passwordInputValue);
      setPasswordError(errMsg);
    }

    // When handling either new or confirmNew password validation,
    // we check if both matches whenever confirmNewPassword.length > 0
    if (confirmNewPassword.length > 0) {
      setConfirmPasswordError(confirmNewPassword !== newPassword);
    }
  };

  return (
    <Container sx={{ height: '100%' }}>
      <div className='change-password-page'>
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <TextField
            error={oldPasswordError}
            helperText={oldPasswordError ? 'Old Password does not match' : ''}
            style={{ width: '200px', margin: '5px' }}
            type='password'
            label='Old Password'
            value={oldPassword}
            name='oldPassword'
            onChange={(e) => setOldPassword(e.target.value)}
            onKeyUp={handleValidation}
            variant='filled'
          />
          <br />
          <TextField
            error={passwordError.length > 0}
            helperText={passwordError ?? ''}
            style={{ width: '200px', margin: '5px', marginTop: '30px' }}
            type='password'
            label='New Password'
            variant='outlined'
            name='newPassword'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyUp={handleValidation}
          />
          <br />
          <TextField
            error={confirmPasswordError}
            helperText={confirmPasswordError ? 'Password does not match' : ''}
            style={{ width: '200px', margin: '5px', marginTop: '15px' }}
            type='password'
            label='Confirm New Password'
            variant='outlined'
            name='confirmNewPassword'
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            onKeyUp={handleValidation}
          />
          <br />
          <Button
            disabled={
              confirmPasswordError ||
              passwordError !== '' ||
              newPassword === '' ||
              confirmNewPassword === ''
            }
            variant='contained'
            color='primary'
            type='submit'
          >
            Change Password
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default ChangePasswordPage;
