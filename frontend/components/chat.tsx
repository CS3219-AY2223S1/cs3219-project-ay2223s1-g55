import DefaultLayout from '@/layouts/DefaultLayout';
import { URL_COMMUNICATION_MESSAGE, URI_COMMUNICATION_SVC } from '@/lib/configs';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
  Paper,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import React, { useEffect, useState } from 'react';
import { ServerToClientEvents, ClientToServerEvents, Message } from '@/lib/types';
import useUserStore from '@/lib/store';
import UnauthorizedDialog from '@/components/UnauthorizedDialog';
import { blue } from '@mui/material/colors';
import { v4 as uuidv4 } from 'uuid';

function ChatMessage(props: { message: Message; username: string }) {
  const { message, username } = props;
  const isSelf = message.senderName === username;
  return (
    <Container>
      <ListItem
        key={message.id}
        sx={{
          display: 'grid',
          justifyContent: isSelf ? 'flex-end' : 'flex-start',
          justifyItems: isSelf ? 'flex-end' : 'flex-start',
        }}
      >
        <Typography sx={{ fontSize: 12, color: 'grey', ml: 1, mr: 1 }}>
          {message.senderName}
        </Typography>
        <Container
          sx={{
            backgroundColor: isSelf ? '#1982FC' : '#E6EAEF',
            borderRadius: 5,
          }}
        >
          <ListItemText primary={message.content} sx={{ color: isSelf ? 'white' : 'black' }} />
        </Container>
        <Typography
          sx={{
            fontSize: 10,
            color: '#545454',
            ml: 1,
            mr: 1,
          }}
        >
          {message.createdAt.toLocaleTimeString()}
        </Typography>
      </ListItem>
    </Container>
  );
}

function ChatWindow(props: { messageList: Array<Message>; username: string }) {
  const { messageList, username } = props;
  return (
    <Box
      sx={{
        mr: '10%',
        ml: '10%',
        border: 1,
        borderColor: 'divider',
        pr: '1%',
        pl: '1%',
      }}
    >
      <Grid>
        <Paper style={{ minHeight: 400, maxHeight: 500, overflow: 'auto' }}>
          <List>
            {messageList.map((message) => (
              <ChatMessage key={message.id} message={message} username={username} />
            ))}
          </List>
        </Paper>
      </Grid>
    </Box>
  );
}

const SendMessageButton = styled(Button)({
  backgroundColor: blue[600],
  color: 'black',
  '&:hover': {
    backgroundColor: '#3f51b5',
    color: 'white',
  },
  '&:active': {
    backgroundColor: blue[300],
  },
  '&:disabled': {
    backgroundColor: 'grey',
    color: 'black',
  },
});
const fetchAllMessages = async (sessionId: string) => {
  if (!sessionId) {
    return null;
  }
  try {
    const res = await axios.get(`${URL_COMMUNICATION_MESSAGE}/${sessionId}`);
    if (res.status === 200 || res.status === 201) {
      return res;
    }
    throw new Error('Error fetching messages');
  } catch (err: any) {
    console.error(err);
    // throw err;
    return null;
  }
};

const createMessage = async (
  sessionId: string,
  senderName: string,
  senderId: string,
  message: string
) => {
  const res = await axios.post(URL_COMMUNICATION_MESSAGE, {
    sessionId,
    senderName,
    senderId,
    message,
  });
  return res;
};

export default function Chat(props: { sessionId: string }) {
  const { sessionId } = props;
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));
  const [username, setUsername] = useState('');
  const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sessionRoomId, setSessionId] = useState('2000');

  const handleFetchAllMessages = async () => {
    try {
      const res = await fetchAllMessages(sessionId);
      // const res = await fetchAllMessages(props.sessionId);
      if (res === null) {
        setMessages([]);
      } else if (res.status === 200 || res.status === 201) {
        if (res.data.messages.length === 0) {
          setMessages([]);
        }
        const messageResults: Array<Message> = [];
        res.data.messages.forEach((item: any) => {
          messageResults.push({
            senderName: item.senderName,
            senderId: item.senderId,
            content: item.message,
            createdAt: new Date(item.createdAt),
            sessionId: item.sessionId,
            id: item._id,
          });
        });
        setMessages(messageResults);
      } else {
        throw new Error('Something went wrong');
      }
    } catch (err: any) {
      console.log('error message is: ', err);
    }
  };

  const randomiseJoinRoomId = async () => {
    const uid = uuidv4();
    return uid;
  };

  const handleCreateMessage = async (
    sessionId: string,
    senderName: string,
    senderId: string,
    message: string
  ) => {
    try {
      const res = await createMessage(sessionId, senderName, senderId, message);
      return res;
    } catch (err: any) {
      return { status: 500, error: 'Error creating message', data: null };
    }
  };
  const handleMessageInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessageInput(event.target.value);
  };

  useEffect(() => {
    // ! Being done after join room is done
    handleFetchAllMessages();
    // only render this on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  useEffect(() => {
    if (!socket || socket === null || socket === undefined) {
      return;
    }

    socket.on('joinRoomSuccess', async (sessionId, username, userId) => {
      console.log('joinRoomSuccess on socket');
      const newMessage: Message = {
        content: `${username} joined the room`,
        senderId: userId,
        senderName: username,
        sessionId,
        createdAt: new Date(Date.now()),
        id: await randomiseJoinRoomId(),
      };
      console.log('joinRoomSuccessMessage: ', newMessage);
      setMessages((messages) => [...messages, newMessage]);
    });

    socket.on('receiveMessage', async (content, senderId, senderName, sessionId, createdAt, id) => {
      const newMessage: Message = {
        content,
        senderId,
        senderName,
        sessionId,
        createdAt: new Date(createdAt),
        id,
      };
      setMessages((messages) => [...messages, newMessage]);
    });

    return () => {
      console.log('offing join and message event');
      // socket.off('joinRoomSuccess');
      // socket.off('receiveMessage');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  useEffect(() => {
    const clientSocket = io(URI_COMMUNICATION_SVC, {
      transports: ['websocket'],
      // autoConnect: false,
    });

    clientSocket.on('connect', async () => {
      // reactStrictMode: true causes this to run twice
      setIsConnected(true);
      // ! user.id not implemented yet
      // TODO: Store user.id to be used for authentication for joining room
      // ! Or do authorization on something else
      setSocket(clientSocket);
      if (user) {
        clientSocket.emit('joinRoom', sessionId, user.username, '1');
      }
    });

    return () => {
      console.log('unmounting socket connecting');
      clientSocket.off('connect');
      // clientSocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = async () => {
    const message = messageInput;
    if (socket == null) {
      return;
    }
    if (message.trim().length === 0) {
      return;
    }
    if (!user.username) {
      return;
    }
    setLoading(true);
    const res = await handleCreateMessage(sessionId, user.username, '1', message);
    if (res && res.status === 201) {
      const { message, senderId, senderName, sessionId, createdAt, _id } = res.data.data;
      socket.emit('roomMessage', message, senderId, senderName, sessionId, createdAt, _id);
      setLoading(false);
      setIsMessageSent(true);
    } else if (res && res.status === 500) {
      setIsMessageSent(false);
      setLoading(false);
      return;
    }
    setMessageInput('');
  };

  if (!user.loginState) return <UnauthorizedDialog />;
  return (
    <Box display="flex" justifyContent="flex-start" flexDirection="column">
      <Typography>Messages</Typography>
      <ChatWindow messageList={messages} username={user.username} />
      <TextField
        label="Message"
        variant="standard"
        value={messageInput}
        onChange={handleMessageInput}
        // (e) => setMessageInput(e.target.value)}
        sx={{ marginBottom: '1rem' }}
        autoFocus
      />

      <Box display="flex" flexDirection="row">
        <Box sx={{ m: 1, position: 'relative' }}>
          <SendMessageButton disabled={!messageInput} onClick={handleSendMessage}>
            Send Message
          </SendMessageButton>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                color: blue[500],
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginTop: '-12px',
                marginLeft: '-12px',
              }}
            />
          )}
        </Box>
        {isMessageSent ? null : <Alert severity="error">Message failed to send</Alert>}
      </Box>
    </Box>
  );
}
