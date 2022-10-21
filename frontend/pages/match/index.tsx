import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  CircularProgress,
  Card,
  ButtonBase,
  Container,
  Grid,
} from '@mui/material';
import { URL_MATCHING_CANCEL, URL_MATCHING_REQUEST } from '@/lib/configs';
import axios from 'axios';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useUserStore from '@/lib/store';
import DefaultLayout from '@/layouts/DefaultLayout';
import { v4 as uuidv4 } from 'uuid';

const MatchButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  border: '2px solid black',
  borderRadius: '50%',
  height: 150,
  width: 150,
  backgroundColor: theme.palette.primary.light,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    opacity: 0.8,
  },
  color: 'black',
  fontSize: 16,
}));

const CancelButton = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  border: '2px solid black',
  borderRadius: '50%',
  height: 150,
  width: 150,
  backgroundColor: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.main,
    opacity: 0.8,
  },
  color: 'black',
  fontSize: 16,
}));

const sendMatchRequest = async (username: string, difficulty: string, requestId: string) => {
  console.log('sendMatchRequest called with ', username, difficulty, requestId);
  try {
    const res = await axios.post(URL_MATCHING_REQUEST, {
      username,
      difficulty,
      requestId,
    });
    console.log('res from sendMatchRequest: ', res.data);
    return res;
  } catch (err: any) {
    console.log('error message is: ', err.response.data.message);
    console.log(err.message);
    throw err;
  }
};

const cancelMatchRequest = async (username: string, difficulty: string) => {
  try {
    const res = await axios.post(URL_MATCHING_CANCEL, {
      username,
      difficulty,
    });
    return res;
  } catch (err: any) {
    console.log('error message is: ', err.response.data.message);
    console.log(err.message);
    throw err;
  }
};

function Matching() {
  const router = useRouter();
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));
  const username = user?.username;

  const [difficulty, setDifficulty] = useState('');
  const [requestId, setRequestId] = useState('');

  const [room, setRoom] = useState('');
  const [matchRoomId, setMatchRoomId] = useState('');
  const [pendingMatchRequest, setPendingMatchRequest] = useState(false);
  // dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMsg, setDialogMsg] = useState('');
  const [countdownSeconds, setCountdownSeconds] = useState<number>(-1);
  const closeDialog = () => setIsDialogOpen(false);

  const setErrorDialog = (msg: string) => {
    setIsDialogOpen(true);
    setDialogTitle('Error');
    setDialogMsg(msg);
  };

  useEffect(() => {
    setRequestId(uuidv4());
  }, []);

  /** * HANDLERS ** */
  const handleDifficultyChange = (e: SelectChangeEvent<string>) => {
    setDifficulty(e.target.value);
  };

  const handleMatchFound = async (payload: any) => {
    const { message, username1, user1RequestId, username2, user2RequestId, matchRoomId } = payload;
    setCountdownSeconds(5);

    setTimeout(() => {
      // After 3 seconds redirect
      const url = `/match/session/${payload.matchRoomId}`;
      router.push(url);
    }, 5000);

    setInterval(() => setCountdownSeconds((p) => (p < 0 ? 3 : p - 1)), 1000);

    setMatchRoomId(payload.matchRoomId);
    setRoom(matchRoomId);
    // socket.emit('match-found', { username, difficulty, matchRoomId, requestId: requestId });
  };

  // send match request to server
  // instant find, if no match, insert this match request into database
  // if match found, socket server will inform user from someone else
  const handleSendMatchRequest = async () => {
    if (!username) {
      setErrorDialog('Username not found');
      return;
    }

    if (!difficulty) {
      setErrorDialog('Plase select a difficulty');
      return;
    }

    try {
      setPendingMatchRequest(true);
      const res = await sendMatchRequest(username, difficulty, requestId);
      console.log('sendMatchRequest res: ', res.data);
      if (res.status === 201 || res.status === 200) {
        await handleMatchFound(res.data);
        return res;
      }
    } catch (err: any) {
      setPendingMatchRequest(false);
      if (err.response.data.status === 500) {
        setErrorDialog('Failed to find a match');
      } else {
        setErrorDialog('Please try again later');
      }
    }
  };

  const handleCancelMatchRequest = async () => {
    try {
      setPendingMatchRequest(false);
      await cancelMatchRequest(username, difficulty);
    } catch (err: any) {
      console.log('Error in cancelling match request: ', err);
    }
  };

  return (
    <DefaultLayout>
      <Container maxWidth="md" sx={{ padding: 10 }}>
        <Box display="flex" justifyContent="center">
          <Card sx={{ width: '50%', padding: 10 }}>
            <Grid container justifyContent="center" rowSpacing={5}>
              <Grid container item xs={12} justifyContent="center" alignItems="center" spacing={2}>
                {pendingMatchRequest && countdownSeconds < 0 && (
                  <Grid item>
                    <CircularProgress value={2} />
                  </Grid>
                )}
                <Grid item>
                  <h1 style={{ textAlign: 'center' }}>
                    {pendingMatchRequest ? 'Finding A Match...' : 'Find A Match'}
                  </h1>
                </Grid>
              </Grid>

              <Grid container justifyContent="center">
                {pendingMatchRequest ? (
                  <CancelButton onClick={handleCancelMatchRequest} disabled={countdownSeconds >= 0}>
                    {countdownSeconds >= 0 ? countdownSeconds : 'Cancel Search'}
                  </CancelButton>
                ) : (
                  <MatchButton onClick={handleSendMatchRequest}>Match</MatchButton>
                )}
              </Grid>

              <Grid container item xs={4} justifyContent="center">
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    disabled={pendingMatchRequest}
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
              </Grid>
              <Grid container justifyContent="center">
                {pendingMatchRequest && (
                  <p style={{ textAlign: 'center' }}>Please do not refresh or leave the page...</p>
                )}
              </Grid>
            </Grid>
          </Card>
        </Box>
      </Container>

      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="xl">
        <Box flexDirection="column" width="50%" justifyContent="center" alignSelf="center">
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText flexDirection="column">{dialogMsg}</DialogContentText>
          </DialogContent>
          <Button onClick={closeDialog}>OK</Button>
        </Box>
      </Dialog>
    </DefaultLayout>
  );
}

export default Matching;
