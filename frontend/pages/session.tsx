import DefaultLayout from '@/layouts/DefaultLayout';
import { URL_COMMUNICATION_MESSAGE } from '@/lib/configs';
import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const fetchAllMessages = async (sessionId: string) => {
  console.log('Fetching all messages');
  try {
    const res = await axios.get(`URL_COMMUNICATION_MESSAGE/${sessionId}`);
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
    console.log('error message is: ', err.response.data.message);
    console.log(err.message);
    throw err;
  }
};

export default function SessionPage() {
  const [messages, setMessages] = useState([]);

  const handleFetchAllMessages = async () => {
    try {
      const res = await fetchAllMessages('1000');
      if (res.status === 200 || res.status === 201) {
        setMessages(res.data.messages);
      } else {
        console.log('fetchAllMessages failed');
      }
    } catch (err: any) {
      console.log('error message is: ', err.response.data.message);
      console.log(err.message);
    }
  };

  useEffect(() => {
    handleFetchAllMessages();

    return () => {
      console.log('unmounting');
      setMessages([]);
    };
  }, [setMessages]);

  const convertStringToDate = (dateString: string) => {
    const dateC = Date.parse(dateString);
    const date = new Date(dateC);
    return date.toLocaleString();
  };

  return (
    <DefaultLayout>
      {/* <SessionProvider /> */}
      <div>Hello World</div>
      <Box display="flex" justifyContent="flex-start" flexDirection="column">
        <Typography>Messages</Typography>
        <List>
          {messages.map(
            (
              msg: { senderName: string; senderId: string; message: string; createdAt: string },
              index
            ) => (
              <ListItem key={index}>
                <ListItemText
                  primary={msg.senderName}
                  secondary={convertStringToDate(msg.createdAt)}
                />
                <ListItemText primary={msg.message} />
              </ListItem>
            )
          )}
        </List>
      </Box>
    </DefaultLayout>
  );
}
