import DefaultLayout from '@/layouts/DefaultLayout';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import { useState } from 'react';
import router from 'next/router';
import { URL_USER_CHANGE_PASSWORD } from '@/lib/configs';
import { STATUS_CODE_CONFLICT, STATUS_CODE_SUCCESS } from '@/lib/constants';
import { getJwtCookie, useSession } from '@/contexts/session.context';

function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [oldPasswordError, setOldPasswordErr] = useState(false);
  const [passwordError, setPasswordErr] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const { user } = useSession();

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const token = getJwtCookie();
    const res = await axios
      .put(
        URL_USER_CHANGE_PASSWORD,
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

  const handleValidation = (e) => {
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
        errMsg = 'At least one Special Characters';
      } else if (!minLengthPassword) {
        errMsg = 'At least minumum 8 characters';
      } else {
        errMsg = '';
      }
      setPasswordErr(errMsg);
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
    <DefaultLayout>
      <div className="change-password-page">
        <h2>Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <TextField
            style={{ width: '200px', margin: '5px' }}
            type="password"
            label="Old Password"
            variant="outlined"
            value={oldPassword}
            name="oldPassword"
            onChange={(e) => setOldPassword(e.target.value)}
            onKeyUp={handleValidation}
          />
          <br />
          {oldPasswordError && <p className="text-danger">Old Password does not match</p>}
          <TextField
            style={{ width: '200px', margin: '5px' }}
            type="password"
            label="New Password"
            variant="outlined"
            name="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            onKeyUp={handleValidation}
          />
          {passwordError && <p className="text-danger">{passwordError}</p>}
          <br />
          <TextField
            style={{ width: '200px', margin: '5px' }}
            type="password"
            label="Confirm New Password"
            variant="outlined"
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            onKeyUp={handleValidation}
          />
          <br />
          {confirmPasswordError && <p className="text-danger">Password do not match</p>}
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
  );
}

export default ChangePasswordPage;
