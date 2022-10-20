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
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  Backdrop,
  CircularProgress,
} from '@mui/material';
import {
  URL_MATCHING_CANCEL,
  URL_MATCHING_REQUEST,
  URI_MATCHING_SVC,
  URL_MATCHING_SVC,
} from '@/lib/configs';
import axios from 'axios';
import { useRouter } from 'next/router';

import { styled } from '@mui/material/styles';
import useUserStore from '@/lib/store';
import DefaultLayout from '@/layouts/DefaultLayout';
import { io } from 'socket.io-client';
import { EMIT_EVENT, ON_EVENT } from '@/lib/constants';
import Link from 'next/link';
import { v4 as uuidv4 } from 'uuid';

const sendMatchRequest = async (username: string, difficulty: string, requestId: string) => {
  console.log('sendMatchRequest called with ', username, difficulty, requestId);
  try {
    const res = await axios.get(URL_MATCHING_REQUEST, {
      headers: {
        username,
        difficulty,
        requestId,
      },
    });
    console.log('res from sendMatchRequest: ', res.data);
    // { message, username1, user1RequestId, username2, user1RequestId, matchRoomID }
    if (res.status === 200 || res.status === 201) {
      console.log('match request sent');
      // contains json of mongodbID, username, difficulty, createdAt, message
      return res;
    }
    if (res.status === 400 || res.status === 404) {
      console.log('match request failed');
      return res;
    }
    console.log('match request failed');
    return res;
  } catch (err: any) {
    console.log('error message is: ', err.response.data.message);
    console.log(err.message);
    throw err;
  }
};

const cancelMatchRequest = async (username: string, difficulty: string) => {
  console.log('cancelMatchRequest called with ', username, difficulty);
  try {
    const res = await axios.post(URL_MATCHING_CANCEL, {
      username,
      difficulty,
    });
    console.log('res from cancelMatchRequest: ', res.data);
    // { message, username1, user1RequestId, username2, user1RequestId, matchRoomID }
    if (res.status === 200 || res.status === 201) {
      console.log('cancel match request sent');
      // contains json of mongodbID, username, difficulty, createdAt, message
      return res;
    }
    if (res.status === 400 || res.status === 404) {
      console.log('cancel match request failed');
      return res;
    }
    console.log('cancel match request failed');
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
  const [difficulty, setDifficulty] = useState('');
  const [requestId, setRequestId] = useState('');
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [matchRoomID, setMatchRoomID] = useState('');
  const [pendingMatchRequest, setPendingMatchRequest] = useState(false);
  // dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMsg, setDialogMsg] = useState('');
  const [countdownSeconds, setCountdownSeconds] = useState(5);
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

  useEffect(() => {
    if (user) {
      setUsername(user.username);
    }
    setRequestId(uuidv4());
  }, []);

  const handleMatchFound = async (payload: any) => {
    const { message, username1, user1RequestId, username2, user2RequestId, matchRoomID } = payload;
    setPendingMatchRequest(false);
    const timeId = setTimeout(() => {
      // After 3 seconds redirect
      const url = `/match/session/${payload.matchRoomID}`;
      router.push(url);
    }, 5000);
    setInterval(() => setCountdownSeconds(countdownSeconds - 1), 1000);
    setSuccessDialog(
      `Found Match! \n ${message} \n ${payload.matchRoomID} \n Redirecting in ${countdownSeconds}`
    );
    setMatchRoomID(payload.matchRoomID);
    setRoom(matchRoomID);
    // socket.emit('match-found', { username, difficulty, matchRoomID, requestId: requestId });
  };

  const handleDifficultyChange = (e: SelectChangeEvent<string>) => {
    setDifficulty(e.target.value);
  };

  // send match request to server
  // instant find, if no match, insert this match request into database
  // if match found, socket server will inform user from someone else
  const handleSendMatchRequest = async () => {
    console.log('difficulty: ', difficulty);
    console.log('username: ', user.username);
    try {
      if (!user.username || !difficulty) {
        console.log('Please enter a username and difficulty');
        throw new Error('Please select a difficulty');
      }
    } catch (err: any) {
      console.log('Error: ', err);
      setErrorDialog(err.message);
    }

    if (user.username && difficulty) {
      try {
        setPendingMatchRequest(true);
        const res = await sendMatchRequest(user.username, difficulty, requestId);
        console.log('sendMatchRequest res: ', res.data);
        if (res.status === 201 || res.status === 200) {
          await handleMatchFound(res.data);
          console.log(res.data);
          return res;
        }
      } catch (err: any) {
        setPendingMatchRequest(false);
        if (err.response.data.message === 'Match request is cancelled') {
          setErrorDialog('Match Request successfully cancelled');
        } else if (err.response.data.status === 500) {
          setErrorDialog('Failed to find a match');
        } else {
          setErrorDialog('Please try again later');
        }
      }
    }
  };

  const handleCancelMatchRequest = async () => {
    if (username && difficulty) {
      try {
        setPendingMatchRequest(false);
        const res = await cancelMatchRequest(username, difficulty);
        if (res.status === 200) {
          console.log('cancelMatchRequest res: ', res);
        }
      } catch (err: any) {
        console.log('Error in cancelling match request: ', err);
      }
    }
    if (!username || !difficulty) {
      console.log('Please enter a username and difficulty');
      throw new Error('Please select a difficulty');
    }
  };

  return (
    <DefaultLayout>
      <Box display="flex" flexDirection="column" width="80%">
        <Box display="flex" flexDirection="column" width="inherit">
          <Typography variant="h5" marginBottom="1rem">
            username: {user.username}
          </Typography>
          <Typography variant="h5" marginBottom="1rem">
            My request id: {requestId}
          </Typography>
          <Typography variant="h5" marginBottom=".5rem">
            Current Room {room}
          </Typography>
          <Typography variant="h5" marginBottom=".5rem">
            Match Room ID {matchRoomID}
          </Typography>
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={pendingMatchRequest}
            onClick={() => {
              console.log('backdrop clicked');
            }}
          >
            <CircularProgress color="inherit" value={10} />

            <Button variant="contained" onClick={() => handleCancelMatchRequest()}>
              Cancel Request
            </Button>
          </Backdrop>

          <Dialog open={isDialogOpen} onClose={closeDialog} maxWidth="xl">
            <Box flexDirection="column" width="50%" justifyContent="center" alignSelf="center">
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogContent>
                <DialogContentText flexDirection="column">{dialogMsg}</DialogContentText>
              </DialogContent>
              <Button onClick={closeDialog}>OK</Button>
            </Box>
          </Dialog>
          <Box marginTop="1rem">
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
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
          </Box>
          <Button variant="outlined" onClick={() => handleSendMatchRequest()}>
            Look for Match
          </Button>

          <Link href="/session">
            <Button variant="outlined">Session</Button>
          </Link>
        </Box>
      </Box>
    </DefaultLayout>
  );
}

export default Matching;
