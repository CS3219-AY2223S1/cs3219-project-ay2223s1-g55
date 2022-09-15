import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import Link from 'next/link';
import router from 'next/router';

const UnauthorizedDialog = () => {
  return (
    <Dialog open onClose={(e) => router.push('/login')}>
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

export default UnauthorizedDialog;
