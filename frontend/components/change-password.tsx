import DefaultLayout from '@/layouts/DefaultLayout';
import { Button, TextField, Container } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import router from 'next/router';
import { URL_USER_SVC } from '@/lib/configs';
import { STATUS_CODE_CONFLICT, STATUS_CODE_SUCCESS } from '@/lib/constants';
import { getJwtCookie } from '@/lib/cookies';
import useUserStore from '@/lib/store';

const ChangePasswordPage = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [oldPasswordError, setOldPasswordErr] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const { updateUser } = useUserStore((state) => ({
    updateUser: state.updateUser,
  }));
  const handlePasswordChange = async (e: any) => {
    e.preventDefault();
    const token = getJwtCookie();
    const res = await updateUser(token, oldPassword, newPassword);
    if (res && res.status === STATUS_CODE_SUCCESS) {
      setOldPasswordErr(false);
      router.push('/dashboard');
    } else {
      setOldPasswordErr(true);
    }
  };

  const handleValidation = (e: any) => {
    const passwordInputValue = e.target.value.trim();
    const passwordInputFieldName = e.target.name;
    // for password
    if (passwordInputFieldName === 'newPassword') {
      const uppercaseRegExp = /(?=.*?[A-Z])/;
      const lowercaseRegExp = /(?=.*?[a-z])/;
      const digitsRegExp = /(?=.*?[0-9])/;
      const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
      const minLengthRegExp = /.{8,}/;
      const passwordLength = passwordInputValue.length;
      const uppercasePassword = uppercaseRegExp.test(passwordInputValue);
      const lowercasePassword = lowercaseRegExp.test(passwordInputValue);
      const digitsPassword = digitsRegExp.test(passwordInputValue);
      const specialCharPassword = specialCharRegExp.test(passwordInputValue);
      const minLengthPassword = minLengthRegExp.test(passwordInputValue);
      const isDifferentPassword = newPassword !== oldPassword;

      let errMsg = '';
      if (passwordLength === 0) {
        errMsg = 'Password is empty';
      } else if (!uppercasePassword) {
        errMsg = 'At least one Uppercase';
      } else if (!lowercasePassword) {
        errMsg = 'At least one Lowercase';
      } else if (!digitsPassword) {
        errMsg = 'At least one digit';
      } else if (!specialCharPassword) {
        errMsg = 'At least one Special Character';
      } else if (!minLengthPassword) {
        errMsg = 'A minimum of 8 characters is required';
      } else if (!isDifferentPassword) {
        errMsg = 'New password cannot be same as the old password';
      } else {
        errMsg = '';
      }
      setPasswordError(errMsg);
    }
    // for confirm password
    if (
      passwordInputFieldName === 'confirmNewPassword' ||
      (passwordInputFieldName === 'newPassword' && confirmNewPassword.length > 0)
    ) {
      if (confirmNewPassword !== newPassword) {
        setConfirmPasswordError(true);
      } else {
        setConfirmPasswordError(false);
      }
    }
  };
  return (
    <Container sx={{ height: '100%' }}>
      <DefaultLayout>
        <div className="change-password-page">
          <h2>Change Password</h2>
          <form onSubmit={handlePasswordChange}>
            <TextField
              error={oldPasswordError}
              helperText={oldPasswordError ? 'Old Password does not match' : ''}
              style={{ width: '200px', margin: '5px' }}
              type="password"
              label="Old Password"
              value={oldPassword}
              name="oldPassword"
              onChange={(e) => setOldPassword(e.target.value)}
              onKeyUp={handleValidation}
              variant="filled"
            />
            <br />
            <TextField
              error={passwordError.length > 0}
              helperText={passwordError ?? ''}
              style={{ width: '200px', margin: '5px', marginTop: '30px' }}
              type="password"
              label="New Password"
              variant="outlined"
              name="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onKeyUp={handleValidation}
            />
            <br />
            <TextField
              error={confirmPasswordError}
              helperText={confirmPasswordError ? 'Password does not match' : ''}
              style={{ width: '200px', margin: '5px', marginTop: '15px' }}
              type="password"
              label="Confirm New Password"
              variant="outlined"
              name="confirmNewPassword"
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
              variant="contained"
              color="primary"
              type="submit"
            >
              Change Password
            </Button>
          </form>
        </div>
      </DefaultLayout>
    </Container>
  );
};

export default ChangePasswordPage;
