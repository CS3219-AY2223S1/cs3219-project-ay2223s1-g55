import DefaultLayout from '@/layouts/DefaultLayout';
import { URL_COMMUNICATION_MESSAGE } from '@/lib/configs';
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
} from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { useEffect, useState } from 'react';
import { ServerToClientEvents, ClientToServerEvents, Message } from '@/lib/types';
import useUserStore from '@/lib/store';
import UnauthorizedDialog from '@/components/UnauthorizedDialog';
import { blue } from '@mui/material/colors';
import uuid from 'react-uuid';

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
        width: '100%',
        border: 1,
        borderColor: 'divider',
        pr: '1%',
        pl: '1%',
      }}
    >
      <Grid>
        <List>
          {messageList.map((message) => (
            <ChatMessage key={message.id} message={message} username={username} />
          ))}
        </List>
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
  console.log('Fetching all messages of: ', sessionId);
  if (!sessionId) {
    console.log('No sessionId given');
    return null;
  }
  try {
    const res = await axios.get(`http://localhost:8008/api/communication/message/${sessionId}`);
    console.log('res from fetchAllMessages: ', res.data);
    if (res.status === 200 || res.status === 201) {
      return res;
    }
    if (res.status === 400 || res.status === 404) {
      console.log('fetchAllMessages failed');
      return res;
    }
    return res;
  } catch (err: any) {
    console.log('error message is: ', err.data);
    throw err;
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

  if (res.status === 200 || res.status === 201) {
    return res;
  }
  if (res.status === 400 || res.status === 404) {
    return res;
  }
  if (res.status === 500) {
    return res;
  }
  return res;
};

export default function SessionPage(props: { sessionId: string }) {
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
      const res = await fetchAllMessages(sessionRoomId);
      // const res = await fetchAllMessages(props.sessionId);
      if (res === null) {
        setMessages([]);
      } else if (res.status === 200 || res.status === 201) {
        // console.log('res.data.messages from handleFetchAllMessages: ', res.data.messages);
        if (res.data.messages.length === 0) {
          setMessages([]);
        }
        const messageResults: Array<Message> = [];
        res.data.messages.forEach((item: any) => {
          // console.log('item: ', item.senderName, item.message, item.createdAt);
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
        console.log('fetchAllMessages failed');
      }
    } catch (err: any) {
      console.log('error message is: ', err);
    }
  };

  const handleCreateMessage = async (
    sessionId: string,
    senderName: string,
    senderId: string,
    message: string
  ) => {
    try {
      const res = await createMessage(sessionId, senderName, senderId, message);
      console.log('res from handleCreateMessage: ', res.status);

      if (res.status === 200 || res.status === 201) {
        console.log('res from handleCreateMessage: ', res);
      } else {
        console.log('createMessage failed');
      }
      return res;
    } catch (err: any) {
      console.log('error message is: ', err.response.data.message);
      console.log(err.message);
      return { status: 500, error: 'Error creating message', data: null };
    }
  };

  useEffect(() => {
    handleFetchAllMessages();
    // only render this on first render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!socket) {
      return;
    }
    const uid = uuid();
    socket.on('joinRoomSuccess', async (sessionId, username, userId) => {
      // TODO: Change this to a different type not a message
      const newMessage: Message = {
        content: `${username} joined the room`,
        senderId: userId,
        senderName: username,
        sessionId,
        createdAt: new Date(Date.now()),
        id: uid,
      };
      setMessages((messages) => [...messages, newMessage]);
    });

    socket.on('receiveMessage', async (content, senderId, senderName, sessionId, createdAt, id) => {
      console.log('roomMessage', content, senderId, senderName, sessionId);
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
      socket.off('joinRoomSuccess');
      socket.off('receiveMessage');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  useEffect(() => {
    const clientSocket = io('http://localhost:8008', {
      transports: ['websocket'],
      // autoConnect: false,
    });

    clientSocket.on('connect', async () => {
      // reactStrictMode: true causes this to run twice
      setIsConnected(true);
      // ! user.id not implemented yet
      clientSocket.emit('joinRoom', sessionRoomId, user.username, '1');
      setSocket(clientSocket);
    });

    return () => {
      console.log('unmounting socket connecting');
      clientSocket.off('connect');
      clientSocket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleReceiveMessage = (message: Message) => {
    setMessages([...messages, message]);
  };

  const handleSendMessage = async (message: string) => {
    if (socket == null) {
      console.log('socket is null');
      return;
    }
    if (message.trim().length === 0) {
      console.log('empty message');
      return;
    }
    if (!user.username) {
      console.log('no user information, cannot send message');
      return;
    }
    setLoading(true);
    const res = await handleCreateMessage(sessionRoomId, user.username, '1', message);
    console.log('res from handleSendMessage: ', res);
    if (res && res.status === 201) {
      const { message, senderId, senderName, sessionId, createdAt, _id } = res.data.data;
      socket.emit('roomMessage', message, senderId, senderName, sessionId, createdAt, _id);
      setLoading(false);
      setIsMessageSent(true);
    } else if (res && res.status === 500) {
      console.log('error creating message');
      setIsMessageSent(false);
      setLoading(false);
      return;
    }
    setMessageInput('');
  };

  if (!user.loginState) return <UnauthorizedDialog />;
  return (
    <DefaultLayout>
      {/* <SessionProvider /> */}
      <div>Hello World</div>
      <Box display="flex" justifyContent="flex-start" flexDirection="column">
        <TextField
          label="Message"
          variant="standard"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          sx={{ marginBottom: '1rem' }}
          autoFocus
        />

        <Box display="flex" flexDirection="row">
          <Box sx={{ m: 1, position: 'relative' }}>
            <SendMessageButton
              disabled={!messageInput}
              onClick={() => handleSendMessage(messageInput)}
            >
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
        <Typography>Messages</Typography>
        <ChatWindow messageList={messages} username={user.username} />
      </Box>
    </DefaultLayout>
  );
}
