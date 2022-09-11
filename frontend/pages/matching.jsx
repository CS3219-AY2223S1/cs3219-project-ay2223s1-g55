import { SetStateAction, useState, useRef } from 'react';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSession } from '@/contexts/session.context';
import DefaultLayout from '@/layouts/DefaultLayout';
import { STATUS_CODE_LOGGED_OUT, STATUS_CODE_DELETED } from '@/lib/constants';
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
  // transports: ['websocket'],
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
  const { user, logout, deleteUser } = useSession();
  const [messages, setMessages] = useState(initialMessages);
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [matchRoomID, setMatchRoomID] = useState('');
  const [message, setMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const socketRef = useRef();

  socket.on('connect', () => {
    console.log('connected: ', socket.id);
    setUsername(user?.username);
    setSocketID(socket.id);
  });

  // const connectToSocket = () => {
  //   setUsername(user?.username);
  //   console.log('username: ', username);
  //   socket.auth = { username };
  //   socket.connect();
  // };
  // const sendPrivateMessage = (content) => {
  //   if (this.selectedUser) {
  //     socket.emit('private message', {
  //       content,
  //       to: this.selectedUser.userID,
  //     });
  //   }
  //   this.selectedUser.messages.push({
  //     content,
  //     fromSelf: true,
  //   });
  // };

  // socket.on('private message', ({ content, from }) => {
  //   for (let i = 0; i < this.users.length; i++) {
  //     const user = this.users[i];
  //     if (user.userID === from) {
  //       user.messages.push({
  //         content,
  //         fromSelf: false,
  //       });
  //       if (user !== this.selectedUser) {
  //         user.hasNewMessages = true;
  //       }
  //       break;
  //     }
  //   }
  // });

  socket.on('message', (payload) => {
    console.log('socket id in client: ', socket.id);
    console.log('message from socket: ', payload.message);
  });

  // socket.on('receiveMessage', (payload) => {
  //   // ID of the socket sending the message
  //   console.log('recive message event');
  //   setMatchRoomID(payload.sender);
  //   setMessages([...messages, payload.content]);
  //   console.log('message from socket: ', payload.content);
  // });

  // socket.on('joinRoom', ({ message, username }) => {
  //   console.log('message from server: ', matchRoomID);
  //   setMatchRoomID(matchRoomID);
  // });

  // join Room when match is successful and room is created
  const joinRoom = () => {
    socket.emit('joinRoom', { username, matchRoomID }, (messageCb) => {
      console.log('message from server: ', messageCb);
    });
  };

  // Send message with sepcific matchRoomID to the server if there is
  const handleSendSocketMessage = async () => {
    const payload = {
      content: [...messages, message] ?? `hello from client ${username}`,
      sender: socketID ?? '',
      roomId: matchRoomID ?? '',
      chatName: 'private chat',
    };
    console.log('Sending socket message: ', payload);
    // socket.emit('message', { data: `hello from client ${username}` });
    socket.emit('sendMessage', payload);
    setMessages([...messages, message]);
    // setMessages([...messages, payload.content]);
  };

  socket.on('sendMessage', (payload) => {
    console.log('message from sendMessage socket: ', payload.payload);
    setMessages(payload.content);
  });

  socket.on('receiveMessage', (data) => {
    // ID of the socket sending the message
    console.log('RECEIVE MESSAGE EVENT');
    console.log('receive message event: ', data.payload);
    // setMatchRoomID(payload.sender);
    setMessages(data.payload.content);
    console.log('message from socket: ', data.payload.content);
  });

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };
  return (
    <DefaultLayout>
      <Box display="flex" flexDirection="column" width="80%">
        <Grid container alignItems="center" justifyContent="center">
          {/* <Grid item xs={6}>
            <div id="difficulty_selector" style={{ width: '30%', marginTop: '3rem' }}>
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
            </div>
          </Grid> */}

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
          <Typography variant="h3" marginBottom="2rem">
            Start Chat {socketID}
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
          <Button variant="outlined" onClick={() => joinRoom()}>
            Join Room
          </Button>

          <Button variant="outlined" onClick={() => connectToSocket()}>
            Connect
          </Button>
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
            {messages.map((message, index) => (
              <ListItem key={index}>
                <ListItemText primary={message} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Box>
    </DefaultLayout>
  );
};

export default Matching;
