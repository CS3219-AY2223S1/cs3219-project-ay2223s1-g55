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
import React, { useEffect, useRef, useState } from 'react';
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
  const bottomRef = useRef<null | HTMLDivElement>(null);
  const { messageList, username } = props;
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);
  return (
    <Box
      sx={{
        mr: '10%',
        ml: '10%',
        pr: '1%',
        pl: '1%',
      }}
    >
      <Grid>
        <Paper style={{ maxHeight: '100vh', overflow: 'auto' }}>
          <List>
            {messageList.map((message) => (
              <ChatMessage key={message.id} message={message} username={username} />
            ))}
            <div ref={bottomRef} />
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
  console.log('Fetch all messages for : ', sessionId);
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

let socket: Socket<ServerToClientEvents, ClientToServerEvents>;

export default function Chat(props: { sessionId: string }) {
  const { sessionId } = props;
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));
  // const [socket, setSocket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isRoomJoined, setIsRoomJoined] = useState(false);
  const [isMessageSent, setIsMessageSent] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleFetchAllMessages = async () => {
    try {
      if (!sessionId) {
        return;
      }
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
    if (sessionId === null) {
      return;
    }
    socket = io(URI_COMMUNICATION_SVC, {
      transports: ['websocket'],
    });

    socket.on('connect', async () => {
      setIsConnected(true);
    });

    socket.on('disconnect', (reason: any) => {
      if (reason === 'io server disconnect') {
        // socket.connect();
      }
      setIsConnected(false);
    });

    return () => {
      console.log('unmounting socket connecting');
      socket.off('connect');
      socket.off('disconnect');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socket == null || sessionId == null) return;
    socket.emit('joinRoom', sessionId, user.username, uuidv4());
  }, [isConnected, sessionId]);

  // After join room
  useEffect(() => {
    if (!isConnected || socket == null || sessionId == null || !isRoomJoined) return;
    handleFetchAllMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRoomJoined]);

  useEffect(() => {
    if (!socket || socket === null || socket === undefined) {
      return;
    }

    socket.on('joinRoomSuccess', async (sessionId, username, userId) => {
      console.log('joinRoomSuccess on socket:', username, sessionId);
      setIsRoomJoined(true);
      // const newMessage: Message = {
      //   content: `${username} joined the room`,
      //   senderId: userId,
      //   senderName: username,
      //   sessionId,
      //   createdAt: new Date(Date.now()),
      //   id: await randomiseJoinRoomId(),
      // };
      // console.log('joinRoomSuccessMessage: ', newMessage);
      // setMessages((messages) => [...messages, newMessage]);
    });

    return () => {
      console.log('offing join and message event');
      socket.off('joinRoomSuccess');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    if (!socket || socket === null || socket === undefined) {
      return;
    }

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
      socket.off('receiveMessage');
    };
  }, [socket, isMessageSent]);

  const handleSendMessage = async () => {
    const message = messageInput;
    if (socket == null) {
      return;
    }
    if (!user.username) {
      return;
    }
    setLoading(true);
    const res = await handleCreateMessage(sessionId, user.username, uuidv4(), message);
    if (res && res.status === 201) {
      const { message, senderId, senderName, sessionId, createdAt, _id } = res.data.data;
      setIsMessageSent(false);
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
      <Typography sx={{ fontSize: 'h4', alignSelf: 'center' }}>Chat</Typography>
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
