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
  ButtonBase,
  Container,
  Grid,
  DialogActions,
} from '@mui/material';
import { URL_MATCHING_CANCEL, URL_MATCHING_REQUEST } from '@/lib/configs';
import axios from 'axios';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useUserStore from '@/lib/store';
import DefaultLayout from '@/layouts/DefaultLayout';
import { v4 as uuidv4 } from 'uuid';
import ProgressIndicator from '@/components/match/ProgressIndicator';
import { cancelMatchRequest, sendMatchRequest } from 'api';

const MatchButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  border: '2px solid grey',
  borderRadius: '50%',
  height: 150,
  width: 150,
  boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
  // backgroundColor: '#2196f3',
  backgroundColor: theme.palette.primary.light,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
    opacity: 0.9,
  },
  color: 'white',
  fontSize: 18,
  fontWeight: 900,
}));

const CancelButton = styled(Button)(({ theme }) => ({
  position: 'relative',
  border: '2px solid grey',
  borderRadius: '50%',
  height: 150,
  width: 150,
  boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
  backgroundColor: theme.palette.error.main,
  '&:hover': {
    backgroundColor: theme.palette.error.main,
    opacity: 0.9,
  },
  color: 'white',
  fontSize: 18,
  fontWeight: 900,
}));

const FoundButtonDisplay = styled(ButtonBase)(({ theme }) => ({
  position: 'relative',
  border: '2px solid grey',
  borderRadius: '50%',
  height: 150,
  width: 150,
  textShadow: '0 1px 3px rgba(0,0,0,0.5)',
  backgroundColor: theme.palette.success.light,
  color: 'white',
  fontWeight: '900',
  fontSize: 40,
}));

function Matching() {
  const router = useRouter();
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));
  const username = user?.username;

  const [difficulty, setDifficulty] = useState('');
  const [requestId, setRequestId] = useState('');

  const [pendingMatchRequest, setPendingMatchRequest] = useState(false);
  const [matchFound, setMatchFound] = useState(false);

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

  const setSuccessDialog = (msg: string) => {
    setIsDialogOpen(true);
    setDialogTitle('Success');
    setDialogMsg(msg);
  };

  const setNoticeDialog = (msg: string) => {
    setIsDialogOpen(true);
    setDialogTitle('Notice');
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
    // const { message, username1, user1RequestId, username2, user2RequestId, matchRoomId } = payload;
    setMatchFound(true);
    setCountdownSeconds(5);

    setTimeout(() => {
      // After 3 seconds redirect
      const url = `/match/session/${payload.matchRoomId}`;
      router.push(url);
    }, 4500);

    setInterval(() => setCountdownSeconds((p) => (p < 0 ? 5 : p - 1)), 1000);
  };

  const handleSendMatchRequest = async () => {
    if (!username) {
      setErrorDialog('Please refresh and try again');
      return;
    }

    if (!difficulty) {
      setErrorDialog('Plase select a difficulty');
      return;
    }

    try {
      setPendingMatchRequest(true);
      const res = await sendMatchRequest(username, difficulty, requestId);
      if (res) {
        await handleMatchFound(res);
      }
    } catch (err: any) {
      setPendingMatchRequest(false);
      if (err.response.data.message === 'Match request is cancelled') {
        setSuccessDialog('Match request is cancelled');
        return;
      }
      if (err.response.data.message === 'Could not find match!') {
        setNoticeDialog('Could not find match');
        return;
      }
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
      setErrorDialog('Failed to cancel match request. Please refresh page');
    }
  };

  const requestTitle = () => {
    if (matchFound) {
      return 'Match Found! Redirecting...';
    }
    if (pendingMatchRequest) {
      return 'Finding a Match...';
    }
    return 'Find Match';
  };

  const requestButton = () => {
    if (matchFound) {
      return (
        <FoundButtonDisplay disabled={countdownSeconds >= 0}>
          {countdownSeconds >= 0 ? countdownSeconds : '5'}
        </FoundButtonDisplay>
      );
    }
    if (pendingMatchRequest) {
      return (
        <CancelButton onClick={handleCancelMatchRequest} disabled={countdownSeconds >= 0}>
          Cancel
        </CancelButton>
      );
    }
    return <MatchButton onClick={handleSendMatchRequest}>Start</MatchButton>;
  };

  return (
    <DefaultLayout>
      <Container maxWidth='xl' sx={{ padding: 10 }}>
        <Box display='flex' justifyContent='center'>
          <Grid container justifyContent='center' rowSpacing={5} position='fixed'>
            <Grid container item xs={12} justifyContent='center' alignItems='center' spacing={2}>
              {pendingMatchRequest && countdownSeconds < 0 && (
                <Grid item>
                  <ProgressIndicator />
                </Grid>
              )}
              <Grid item>
                <h1 style={{ textAlign: 'center', whiteSpace: 'pre-line' }}>{requestTitle()}</h1>
              </Grid>
            </Grid>

            <Grid container justifyContent='center'>
              {requestButton()}
            </Grid>

            <Grid container item xs={4} justifyContent='center'>
              <FormControl sx={{ width: '25ch' }}>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  disabled={pendingMatchRequest}
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={difficulty}
                  label='Difficulty'
                  onChange={handleDifficultyChange}
                >
                  <MenuItem value='Easy'>Easy</MenuItem>
                  <MenuItem value='Medium'>Medium</MenuItem>
                  <MenuItem value='Hard'>Hard</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid container justifyContent='center'>
              {pendingMatchRequest && (
                <p style={{ textAlign: 'center' }}>Please do not refresh or leave the page...</p>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>

      <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth='xl'>
        <Box
          flexDirection='column'
          justifyContent='center'
          alignSelf='center'
          justifyItems='center'
        >
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText flexDirection='column'>{dialogMsg}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>OK</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </DefaultLayout>
  );
}

export default Matching;
