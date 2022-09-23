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
  Backdrop,
  CircularProgress,
} from '@mui/material';
import { URL_MATCHING_REQUEST } from '@/lib/configs';
import axios from 'axios';

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

const SocketMessageOutput = styled('h2')({
  fontSize: '20px',
  padding: '5px',
  color: 'black',
  justifyContent: 'center',
});

interface callbackInterface {
  (message: string): void;
}
const initialMessagesState = {
  general: [],
  random: [],
};

const initialMessages = [] as string[];

// backend port used for socket.io
const socket = io('http://localhost:8001', {
  transports: ['websocket'],
  // autoConnect: false,
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
      // username,
      // difficulty,
      headers: {
        username,
        difficulty,
        roomSocketID,
      },
    });
    console.log('res from sendMatchRequest: ', res.data);
    // { message, username1, username1socketID, username2, username2socketID, matchRoomID }
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

function Matching() {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));
  const [difficulty, setDifficulty] = useState('');
  const [socketMessage, setSocketMessage] = useState('');
  const [socketID, setSocketID] = useState('');
  const [messages, setMessages] = useState(initialMessages);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [matchRoomID, setMatchRoomID] = useState('');
  const [message, setMessage] = useState('');
  const [pendingMatchRequest, setPendingMatchRequest] = useState(false);
  // dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMsg, setDialogMsg] = useState('');
  const [isBackdropOpen, setIsBackdropOpen] = useState(false);
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
  // user undefined from useSession
  useEffect(() => {
    console.log('user is: ', user);
    setUsername(user?.username);
    handleConnectToSocket();
  }, []);

  // socket connection established
  socket.on(ON_EVENT.CONNECT, () => {
    console.log('socket id is ', socket.id);
    setUsername(user?.username);
    setSocketID(socket.id);
  });

  const handleConnectToSocket = () => {
    setUsername(user?.username);
    console.log('username: ', user?.username);
    socket.auth = { username };
    socket.connect();
  };

  socket.on(ON_EVENT.MESSAGE, (payload) => {
    console.log('socket id in client: ', socket.id);
    console.log('message from socket: ', payload);
  });

  // join Room when match is successful and room is created

  const handleJoinRoom = async () => {
    setRoom(matchRoomID);
    socket.emit(EMIT_EVENT.JOIN_ROOM, { username, matchRoomID }, (callback: callbackInterface) => {
      console.log('callback: ', callback);
    });
  };

  const handleLeaveRoom = () => {
    socket.emit(EMIT_EVENT.LEAVE_ROOM, { username, room }, (callback: callbackInterface) => {
      console.log('callback: ', callback);
      setRoom('');
    });
  };

  socket.on(ON_EVENT.JOIN_ROOM_SUCCESS, (payload) => {
    const { username, id, matchRoomID } = payload;
    console.log('join-room-success:', payload);
    // setRoom(matchRoomID);
  });

  socket.on(ON_EVENT.LEAVE_ROOM, ({ leaveRoomMessage, leaveRoomUsername }) => {
    console.log('message from server for: ', leaveRoomMessage);
  });

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

  socket.on(ON_EVENT.RECEIVE_MESSAGE, (payload) => {
    const { content, sender, roomId, chatName } = payload;
    console.log('message from sendMessage socket: ', payload.content);
    // sender is now new receiver to reply using same room ID
    setMessages(payload.content);
  });

  const handleMatchFound = async (payload: any) => {
    const { message, username1, username1socketID, username2, username2socketID, matchRoomID } =
      payload;
    setPendingMatchRequest(false);
    setSuccessDialog(
      `Found Match! \n ${message} \n ${payload.matchRoomID} \n Click Join Room to join`
    );
    setMatchRoomID(payload.matchRoomID);
    setRoom(matchRoomID);
    await handleJoinRoom();
    // socket.emit('match-found', { username, difficulty, matchRoomID, roomSocketID: socketID });
  };

  const handleDifficultyChange = (e: SelectChangeEvent<string>) => {
    setDifficulty(e.target.value);
  };

  // send match request to server
  // instant find, if no match, insert this match request into database
  // if match found, socket server will inform user from someone else
  const handleSendMatchRequest = async () => {
    console.log('difficulty: ', difficulty);
    console.log('username: ', username);
    try {
      if (!username || !difficulty) {
        console.log('Please enter a username and difficulty');
        throw new Error('Please select a difficulty');
      }
    } catch (err: any) {
      console.log('Error: ', err);
      setErrorDialog(err.message);
    }

    if (username && difficulty) {
      try {
        setPendingMatchRequest(true);
        const res = await sendMatchRequest(username, difficulty, socketID);
        // console.log('sendMatchRequest res: ', res);
        if (res.status === 201 || res.status === 200) {
          await handleMatchFound(res.data);
          console.log(res.data);
          return res;
        }
      } catch (err: any) {
        setPendingMatchRequest(false);
        if (err) {
          console.log('Error: ', err);
          setErrorDialog('Error occured when finding match');
        } else if (err.response.data.status === 500) {
          setErrorDialog('Failed to find a match');
        } else {
          setErrorDialog('Please try again later');
        }
      }
    }
  };

  return (
    <DefaultLayout>
      <Box display="flex" flexDirection="column" width="80%">
        <Box display="flex" flexDirection="column" width="inherit">
          <Typography variant="h5" marginBottom="1rem">
            My socket id: {socketID}
          </Typography>
          <Typography variant="h5" marginBottom=".5rem">
            Current Room {room}
          </Typography>
          <Typography variant="h5" marginBottom=".5rem">
            Match Room ID {matchRoomID}
          </Typography>
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
          <TextField
            label="Room"
            variant="standard"
            value={matchRoomID}
            onChange={(e) => setMatchRoomID(e.target.value)}
            sx={{ marginBottom: '2rem' }}
          />
          <Button variant="outlined" onClick={() => handleJoinRoom()}>
            Join Room
          </Button>
          <Button variant="outlined" onClick={() => handleLeaveRoom()}>
            Leave Room
          </Button>

          <Button variant="outlined" onClick={() => handleConnectToSocket()}>
            Connect
          </Button>
          {/* // TODO: Add cancel match UI element as well as backend implementation, 
              // TODO: but have to be able to stop current request being sent which is not possible unless 
              // TODO: separate backend calls into single calls, and frontend do the interval calls 
            */}

          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={pendingMatchRequest}
            onClick={() => {
              console.log('backdrop clicked');
            }}
          >
            <CircularProgress color="inherit" value={10} />
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
        </Box>
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
      </Box>
    </DefaultLayout>
  );
}

export default Matching;
