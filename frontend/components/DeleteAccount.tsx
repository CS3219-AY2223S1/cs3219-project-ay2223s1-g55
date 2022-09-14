import { STATUS_CODE_DELETED } from '@/lib/constants';
import { getJwtCookie, clearJwt } from '@/lib/cookies';
import { useUserStore } from '@/lib/store';
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';

const DeleteAccount = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isValidInput, setIsValidInput] = useState<boolean>(false);
  const { user, deleteUser } = useUserStore((state) => ({
    user: state.user,
    deleteUser: state.deleteUser,
  }));
  const router = useRouter();
  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const handleDeleteUser = async () => {
    if (isValidInput) {
      const currToken = getJwtCookie();
      const res = await deleteUser(currToken);
      if (res?.status === STATUS_CODE_DELETED) {
        router.push('/signup');
        clearJwt();
        return;
      }
    }
  };

  const checkValidInput = (input: string) => {
    const isValid = input === `${user.username}-delete`;
    setIsValidInput(isValid);
  };

  return (
    <Container sx={{ height: '100%' }}>
      <Typography variant="h5">Are you sure you want to delete your account?</Typography>
      <Button onClick={() => setIsDialogOpen(true)}>I'm sure</Button>
      <Button onClick={router.reload}>No it was a mistake!</Button>
      <Dialog open={isDialogOpen} onClose={closeDialog}>
        <DialogTitle>Are you very sure?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This action is <b>irreversible</b>.<br></br> If you wish to continue, please input{' '}
            <b>{`${user.username}-delete`}</b> in the field below.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            variant="standard"
            onChange={(e) => checkValidInput(e.target.value)}
          ></TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteUser}>Delete</Button>
          <Button onClick={closeDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DeleteAccount;
