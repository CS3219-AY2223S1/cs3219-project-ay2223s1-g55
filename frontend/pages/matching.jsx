import { SetStateAction, useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
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
  TextareaAutosize,
  TextField,
  Typography,
  Backdrop,
  CircularProgress,
} from '@mui/material';

import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { styled } from '@mui/material/styles';
import { useSession } from '@/contexts/session.context';
import DefaultLayout from '@/layouts/DefaultLayout';
import router from 'next/router';
import { io } from 'socket.io-client';

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

const SocketMessageOutputContainer = styled('div')({
  height: '100px',
  width: '100px',
  fontSize: '20px',
  padding: '5px',
  backgroundColor: 'white',
  color: 'black',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid black',
  '&:hover': {
    backgroundColor: 'grey',
    color: 'black',
  },
});

const SocketMessageOutput = styled('h2')({
  fontSize: '20px',
  padding: '5px',
  color: 'black',
  justifyContent: 'center',
});

const initialMessagesState = {
  general: [],
  random: [],
};

const initialMessages = [];

// backend port used for socket.io
const socket = io('http://localhost:8001', {
  transports: ['websocket'],
  // autoConnect: false,
});

// console.log('user is', user?.username);
// catch-all listener for development
socket.onAny((event, ...args) => {
  console.log('Logging Listener: ', event, args);
  console.log(event, args);
});

// socket.on('users', (users) => {
//   users.forEach((user) => {
//     console.log(user);
//     user.self = user.userID === socket.id;
//     // initReactiveProperties(user);
//   });
// });

// socket.on('connect', () => {
//   console.log('connected: ', socket.id);
//   setUsername(user?.username);
//   setSocketID(socket.id);
// });

socket.on('connect_error', (err) => {
  console.log('connect_error: ', err);
});

socket.on('joinRoom', (payload) => {
  console.log(payload.message);
});

const Matching = () => {
  const [difficulty, setDifficulty] = useState('');
  const [socketMessage, setSocketMessage] = useState('');
  const [socketID, setSocketID] = useState('');
  const { user, sendMatchRequest } = useSession();
  const [messages, setMessages] = useState(initialMessages);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [matchRoomID, setMatchRoomID] = useState('');
  const [message, setMessage] = useState('');
  const [pendingMatchRequest, setPendingMatchRequest] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const socketRef = useRef();
  const [socketIDonConnect, setSocketIDonConnect] = useState('');
  // dialogs
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogMsg, setDialogMsg] = useState('');
  var countdownCircleResetter = 0;
  const closeDialog = () => setIsDialogOpen(false);

  const setSuccessDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle('Success');
    setDialogMsg(msg);
  };

  const setErrorDialog = (msg) => {
    setIsDialogOpen(true);
    setDialogTitle('Error');
    setDialogMsg(msg);
  };
  // user undefined from useSession
  useEffect(() => {
    console.log('user is: ', user);
    setUsername(user?.username);
    handleConnectToSocket();
    // socket.auth = { username: user.username };
    // socket.connect();
  }, [user]);

  // socket connection established
  socket.on('connect', () => {
    setSocketIDonConnect(socket.id);
    console.log('ID on connect : ', socket.id);
    console.log('connected: ', socket.id);
    setUsername(user?.username);
    setSocketID(socket.id);
  });

  const handleConnectToSocket = () => {
    setUsername(user?.username);
    console.log('username: ', user?.username);
    socket.auth = { username };
    socket.connect();
  };

  socket.on('message', (payload) => {
    console.log('socket id in client: ', socket.id);
    console.log('message from socket: ', payload);
  });

  // join Room when match is successful and room is created
  const handleJoinRoom = () => {
    socket.emit('join-room', { username, matchRoomID }, (messageCb) => {
      setRoom(matchRoomID);
      console.log('message from server: ', messageCb);
    });
  };

  const handleLeaveRoom = () => {
    socket.emit('leave-room', { username, room }, (messageCb) => {
      setRoom('');
      console.log('message from server: ', messageCb);
    });
  };

  socket.on('leave-room', ({ message, username }) => {
    console.log('message from server: ', message);
  });

  // Send message with sepcific matchRoomID to the server if there is
  const handleSendSocketMessage = async () => {
    const payload = {
      content: [...messages, message] ?? `hello from client ${username}`,
      sender: socketID ?? '',
      roomId: matchRoomID === '' ? socketID : matchRoomID,
      chatName: 'private chat',
    };
    socket.emit('send-message', payload);
    setMessages([...messages, message]);
  };

  socket.on('receive-message', (payload) => {
    console.log('message from sendMessage socket: ', payload.content);
    // sender is now new receiver to reply to the same room ID
    // need to join room ID
    // being set on sent, so now even if cr8 a roomID it doesnt work
    // can use this for private message instead of private room
    // setMatchRoomID(payload.sender);
    setMessages(payload.content);
  });

  const handleDifficultyChange = (e) => {
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
    } catch (err) {
      console.log('Error: ', err);
      setErrorDialog(err.message);
    }

    if (username && difficulty) {
      try {
        setPendingMatchRequest(true);
        // TODO: send socketID to server to be stored in database to be communicated
        // TODO: by other users if match is found
        const res = await sendMatchRequest(username, difficulty);
        // console.log('sendMatchRequest res: ', res);
        if (res && res.status === 201) {
          setPendingMatchRequest(false);
          setSuccessDialog(
            `Found Match! \n ${res.data.mongoDbID} \n ${res.data.username} \n ${res.data.message}`
          );
          // TODO: Match found, join own room and use socket to tell match to join room as well
          console.log(res.data);
          return res;
        }
        // ? Currently throwing error from sendMatchRequest to be handled here
        // ? is this best practice, or should handle it as a response instead?
      } catch (err) {
        setPendingMatchRequest(false);
        if (err) {
          console.log('Error: ', err.response);
          setErrorDialog(err.response.data.message);
        } else if (err.response.data.status === 500) {
          setErrorDialog('Failed to find a match');
        } else {
          setErrorDialog('Please try again later');
        }
      }
      // if (res.status === 400) {
      //   console.log(res);
      //   setErrorDialog(res.message);
      //   console.log(res.data);
      //   return res;
      // }
    }
  };

  const loadingCircleTimer = () => {
    <CountdownCircleTimer
      isPlaying
      duration={30}
      colors={['#004777', '#F7B801', '#A30000', '#A30000']}
      colorsTime={[30, 20, 10, 0]}
    >
      {({ remainingTime }) => remainingTime}
    </CountdownCircleTimer>;
  };

  return (
    <DefaultLayout>
      <Box display="flex" flexDirection="column" width="80%">
        <Grid container alignItems="center" justifyContent="center">
          <Grid item xs={6}>
            <SendMessageButton onClick={() => handleSendSocketMessage()}>
              Send Message
            </SendMessageButton>
          </Grid>
          <Grid item xs={6}>
            <SocketMessageOutput>{socketMessage}</SocketMessageOutput>
          </Grid>
        </Grid>

        <Box display="flex" flexDirection="column" width="30%">
          <Typography variant="h5" marginBottom="1rem">
            My socket id: {socketID}
          </Typography>
          <Typography variant="h5" marginBottom=".5rem">
            Socket ID on start {socketIDonConnect}
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
          <Button variant="outlined" onClick={handleLeaveRoom}>
            Leave Room
          </Button>

          <Button variant="outlined" onClick={() => handleConnectToSocket()}>
            Connect
          </Button>
          {/* // TODO: Add cancel match UI element as well as backend implementation, 
              // TODO: but have to be able to stop current request being sent which is not possible unless 
              // TODO: separate backend calls into single calls, and frontend do the interval calls*/}
          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={pendingMatchRequest}
            onClick={() => {
              console.log('backdrop clicked');
            }}
          >
            {/* <CountdownCircleTimer
              key={countdownCircleResetter++}
              isPlaying
              duration={30}
              colors={['#004777', '#F7B801', '#A30000', '#A30000']}
              colorsTime={[30, 20, 10, 0]}
            >
              {({ remainingTime }) => remainingTime}
            </CountdownCircleTimer> */}
            <CircularProgress color="inherit" value={10} />
          </Backdrop>
          <Dialog open={isDialogOpen} onClose={closeDialog} width={'50%'}>
            <Box
              flexDirection="column"
              width={'50%'}
              justifyContent={'center'}
              alignSelf={'center'}
            >
              <DialogTitle>{dialogTitle}</DialogTitle>
              <DialogContent>
                <DialogContentText flexDirection={'column'}>{dialogMsg}</DialogContentText>
              </DialogContent>
              <Button onClick={closeDialog}>OK</Button>
              {/* <DialogActions>
              {isSignupSuccess ? (
                <Link href="/login" passHref>
                  <Button>Log in</Button>
                </Link>
              ) : (
                <Button onClick={closeDialog}>Done</Button>
              )}
            </DialogActions> */}
            </Box>
          </Dialog>
          <Box marginTop={'1rem'}>
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

            <Button variant="outlined" onClick={() => handleSendMatchRequest()}>
              Look for Match
            </Button>
          </Box>

          {/* <Box display="flex" flexDirection="row" justifyContent="flex-end">
            <Button variant="outlined" onClick={handleSendSocketMessage}>
              Send
            </Button>
          </Box>
          <Box display="flex" flexDirection="row" justifyContent="flex-end">
            <Button variant="outlined" onClick={connectToSocket({ username: user?.username })}>
              Connect to Socket
            </Button>
          </Box> */}

          {/* <Dialog open={isDialogOpen} onClose={closeDialog}>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogContent>
            <DialogContentText>{dialogMsg}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Close</Button>
          </DialogActions>
        </Dialog> */}
        </Box>
        <Box display="flex" justifyContent="flex-start" flexDirection="column">
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
};

export default Matching;
