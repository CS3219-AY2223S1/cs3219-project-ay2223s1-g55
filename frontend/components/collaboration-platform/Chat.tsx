import { URL_COMMUNICATION_MESSAGE, URI_COMMUNICATION_SVC } from '@/lib/configs';
import {
  Alert,
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Input,
  IconButton,
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
import SendIcon from '@mui/icons-material/Send';
import { createMessage, getMessages } from 'api';

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
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
  }, [messageList]);
  return (
    <Box
      sx={{
        pr: '0.5%',
        pl: '0.5%',
        width: '100%',
      }}
    >
      <Box style={{ height: '50vh', overflow: 'auto', overscrollBehavior: 'contain' }}>
        <List>
          {messageList.map((message) => (
            <ChatMessage key={message.id} message={message} username={username} />
          ))}
          <div ref={bottomRef} />
        </List>
      </Box>
    </Box>
  );
}

const ChatWindowTitle = styled(Typography)(({ theme }) => ({
  fontSize: 'h4',
  fontWeight: 'bold',
  color: 'white',
  textAlign: 'center',
  backgroundColor: theme.palette.primary.light,
  padding: 10,
  borderRadius: '10px 10px 0 0',
  // marginBottom: '1vw',
}));

const ChatMessageInput = styled(Input)(({ theme }) => ({
  // width: '100%',
  // height: '5vh',

  // backgroundColor: 'rgba(242, 242, 247, 0.8)',
  // borderRadius: 35,
  // margin: '1vw 0 0 0',
  padding: '0 1vw 0 1vw',
  fontSize: 'h6',
  color: 'black',
  // border: '2px solid grey',
}));

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
      const _messages = await getMessages(sessionId);
      const messageResults = _messages.map((message) => ({
        ...message,
        content: message.message ?? '',
        createdAt: new Date(message.createdAt),
        id: message._id ?? '',
      }));
      setMessages((previousMessages) => [...messageResults, ...previousMessages]);
    } catch (err: any) {
      console.log('error message is: ', err);
    }
  };

  const randomiseId = async () => {
    const uid = uuidv4();
    return uid;
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
      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (socket == null || sessionId == null || !user.username) return;
    socket.emit('joinRoom', sessionId, user.username, uuidv4());
  }, [sessionId]);

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
      const joinMessage: Message = {
        content: username === user.username ? 'You joined the room' : `${username} joined the room`,
        senderId: userId,
        senderName: username,
        sessionId,
        createdAt: new Date(Date.now()),
        id: await randomiseId(),
      };
      console.log('joinRoomSuccessMessage: ', joinMessage);
      setMessages((messages) => [...messages, joinMessage]);
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
    const res = await createMessage(sessionId, user.username, uuidv4(), message);
    if (res) {
      const { message, senderId, senderName, sessionId, createdAt, _id } = res.data;
      setIsMessageSent(false);
      socket.emit(
        'roomMessage',
        message ?? '',
        senderId,
        senderName,
        sessionId,
        createdAt,
        _id ?? ''
      );
      setLoading(false);
      setIsMessageSent(true);
    } else {
      setIsMessageSent(false);
      setLoading(false);
      return;
    }
    setMessageInput('');
  };

  if (!user.loginState) return <UnauthorizedDialog />;
  return (
    <Box
      display='flex'
      justifyContent='flex-start'
      flexDirection='column'
      sx={{
        position: 'fixed',
        bottom: '4vh',
        boxShadow: 4,
        borderRadius: '10px',
        width: 'inherit',
      }}
    >
      {/* <Typography sx={{ fontSize: 'h4', alignSelf: 'center', fontWeight: 900 }}>Chat</Typography> */}
      <ChatWindowTitle>Chat</ChatWindowTitle>
      <ChatWindow messageList={messages} username={user.username} />
      <Box
        sx={{
          backgroundColor: 'rgba(242, 242, 247, 0.8)',
          borderRadius: 35,
          padding: '0 0.1vw 0 0.1vw',
          margin: '1vw 1vw 0vw 1vw',
        }}
        display='flex'
        flexDirection='row'
        alignItems='center'
      >
        {/* <Box> */}
        <ChatMessageInput
          fullWidth
          // label='Message'
          placeholder='Message...'
          // variant='standard'
          value={messageInput}
          onChange={handleMessageInput}
          disableUnderline
          multiline
        />
        <Box sx={{ m: 1, position: 'relative' }}>
          <IconButton
            disabled={!messageInput}
            onClick={handleSendMessage}
            size='small'
            color='primary'
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>

      <Box display='block' height='40px' width='100%' flexDirection='row' alignSelf='center'>
        {isMessageSent ? (
          <Box />
        ) : (
          <Alert severity='error' sx={{ padding: '0 1vw 0 1vw' }}>
            Message failed to send
          </Alert>
        )}
      </Box>
    </Box>
  );
}
