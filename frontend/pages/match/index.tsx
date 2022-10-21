import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
  CircularProgress,
  Card,
  ButtonBase,
  Container,
  Stack,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { URL_MATCHING_CANCEL, URL_MATCHING_REQUEST, URI_MATCHING_SVC } from '@/lib/configs';
import axios from 'axios';
import { useRouter } from 'next/router';
import { styled } from '@mui/material/styles';
import useUserStore from '@/lib/store';
import DefaultLayout from '@/layouts/DefaultLayout';
import { io } from 'socket.io-client';
import { EMIT_EVENT, ON_EVENT } from '@/lib/constants';

const SendMessageButton = styled(Button)({
  backgroundColor: '#3f51b5',
  color: 'white',
  '&:hover': {
    backgroundColor: 'grey',
    color: 'black',
  },
  '&:active': {
    backgroundColor: 'green',
  },
});

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

const CancelButton = styled(LoadingButton)(({ theme }) => ({
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

interface callbackInterface {
  (message: string): void;
}
const initialMessages = [] as string[];

// backend port used for socket.io
const socket = io(URI_MATCHING_SVC, {
  transports: ['websocket'],
});

// catch-all listener for development
socket.onAny((event, ...args) => {
  console.log('Logging Listener: ', event, args);
  console.log(event, args);
});

const sendMatchRequest = async (username: string, difficulty: string, roomSocketID: string) => {
  console.log('sendMatchRequest called with ', username, difficulty, roomSocketID);
  try {
    const res = await axios.get(URL_MATCHING_REQUEST, {
      headers: {
        username,
        difficulty,
        roomSocketID,
      },
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
  const [socketID, setSocketID] = useState(socket.id);
  const [messages, setMessages] = useState(initialMessages);

  const [room, setRoom] = useState('');
  const [matchRoomID, setMatchRoomID] = useState('');
  const [message, setMessage] = useState('');
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

  // Set up Socket listeners
  useEffect(() => {
    const onConnectionCallback = () => {
      console.log('socket id in connectionCallback is ', socket.id);
      console.log('user is: ', user);
      setSocketID(socket.id);
    };
    const handleIncomingMessages = (payload) => setMessages(payload.content);

    socket.on(ON_EVENT.CONNECT, onConnectionCallback);
    socket.on(ON_EVENT.RECEIVE_MESSAGE, handleIncomingMessages);

    return () => {
      socket.off(ON_EVENT.CONNECT, onConnectionCallback);
      socket.off(ON_EVENT.RECEIVE_MESSAGE, handleIncomingMessages);
    };
  }, [socket]);

  /** * HANDLERS ** */
  const handleDifficultyChange = (e: SelectChangeEvent<string>) => {
    setDifficulty(e.target.value);
  };

  // join Room when match is successful and room is created
  const handleJoinRoom = async () => {
    setRoom(matchRoomID);
    socket.emit(EMIT_EVENT.JOIN_ROOM, { username, matchRoomID }, (callback: callbackInterface) => {
      console.log('callback: ', callback);
    });
  };

  // Send message with sepcific matchRoomID to the server if there is
  const handleSendSocketMessage = async () => {
    const payload = {
      content: [...messages, message] ?? `hello from client ${username}`,
      sender: socketID ?? '',
      roomId: room === '' ? matchRoomID : room,
      chatName: 'private chat',
    };
    socket.emit(EMIT_EVENT.SEND_MESSAGE, payload);
    setMessages([...messages, message]);
  };

  const handleMatchFound = async (payload: any) => {
    const { matchRoomID } = payload;
    setCountdownSeconds(5);

    setTimeout(() => {
      // After 3 seconds redirect
      const url = `/match/session/${payload.matchRoomID}`;
      router.push(url);
    }, 5000);

    setInterval(() => setCountdownSeconds((p) => (p < 0 ? 3 : p - 1)), 1000);

    setMatchRoomID(payload.matchRoomID);
    setRoom(matchRoomID);
    await handleJoinRoom();
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
      const res = await sendMatchRequest(username, difficulty, socketID);
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

        <Stack>
          <TextField
            label="Message"
            variant="standard"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ marginBottom: '1rem' }}
            autoFocus
          />

          <SendMessageButton onClick={() => handleSendSocketMessage()}>
            Send Message
          </SendMessageButton>

          <Box display="flex" justifyContent="flex-start" flexDirection="column">
            <Typography>Messages</Typography>
            <List>
              {messages.map((msg, index) => (
                <ListItem key={index}>
                  <ListItemText primary={msg} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Stack>
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
