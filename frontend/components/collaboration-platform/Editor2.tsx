import { useEffect, useState } from 'react';
import { URI_EDITOR_SVC } from '@/lib/configs';
import { io } from 'socket.io-client';
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';
import Editor from '@monaco-editor/react';

const SAVE_INTERVAL_MS = 2000;

let socket: any;

const Editor2 = (props) => {
  const { sessionId } = props;
  const [isConnected, setIsConnected] = useState(false);
  const [value, setValue] = useState('');
  // const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [language, setLanguage] = useState<string>('JavaScript');

  const handleChange = (value, event) => {
    setValue(value);
    socket.emit('send-changes', value);
  };

  const handleLanguageChange = (e: SelectChangeEvent<string>) => {
    setLanguage(e.target.value);
    console.log('language chosen:', e.target.value);
  };

  useEffect(() => {
    // check for connection, get room id and connect either here or on top
    socket = io(URI_EDITOR_SVC, {
      transports: ['websocket'],
      // autoConnect: false,
    });

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', (reason: any) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        // socket.connect();
      }
      setIsConnected(false);
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    if (!isConnected || socket == null) return;
    console.log(sessionId);

    socket.once('load-editor', (editor: any) => {
      setValue(editor);
      setIsDisabled(false);
    });

    socket.emit('get-editor', sessionId);
  }, [isConnected]);

  useEffect(() => {
    // backend port used for socket.io
    if (socket == null) return;

    const handler = (deltaOrTextTBC: any) => {
      setValue(deltaOrTextTBC);
    };

    socket.on('receive-changes', handler);

    return () => {
      socket.off('receive-changes');
    };
  }, [socket]);

  useEffect(() => {
    // backend port used for socket.io
    if (socket == null) return;

    const interval = setInterval(() => {
      socket.emit('save-editor', value);
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, value]);

  return (
    <div>
      <FormControl sx={{ width: '150px' }}>
        <InputLabel>Language</InputLabel>
        <Select value={language} label={language} onChange={handleLanguageChange}>
          <MenuItem value='javascript'>JavaScript</MenuItem>
          <MenuItem value='typescript'>TypeScript</MenuItem>
          <MenuItem value='python'>Python</MenuItem>
        </Select>
      </FormControl>
      <Editor
        height='90vh'
        defaultLanguage='javascript'
        defaultValue='// some comment'
        value={value}
        language={language.toLowerCase()}
        onChange={handleChange}
      />
    </div>
  );
};

export default Editor2;
