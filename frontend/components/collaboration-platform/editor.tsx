import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import io from 'socket.io-client';
import { URI_EDITOR_SVC } from '@/lib/configs';
import { CardContent, Snackbar, Alert } from '@mui/material';

const SAVE_INTERVAL_MS = 2000;
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => <p>Loading ...</p>,
});
const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['bold', 'italic', 'underline'],
    [{ color: [] }, { background: [] }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ align: [] }],
    ['image', 'blockquote', 'code-block'],
    ['clean'],
  ],
};
let socket: any;

function Editor(props: { sessionId: string; isReady: boolean }) {
  const { sessionId, isReady } = props;
  const [isConnected, setIsConnected] = useState(false);
  const [value, setValue] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [alertValue, setAlertValue] = useState<string>('');
  const [isAlert, setIsAlert] = useState<boolean>(false);

  const handleVal = (content: any, delta: any, source: any, editor: any) => {
    if (source !== 'user') return;
    setValue(editor.getContents());
    socket.emit('send-changes', editor.getContents());
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setIsAlert(false);
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
        console.log('how can he disconnect');
      }
      setIsConnected(false);
    });
    return () => {
      const discMsg = 'The other user has left';
      socket.emit('alert-disconnected', discMsg);
      socket.off('connect');
      socket.off('disconnect');
    };
  }, []);

  useEffect(() => {
    if (!isConnected || socket == null || !isReady) return;
    console.log(sessionId);

    socket.once('load-editor', (editor: any) => {
      setValue(editor);
      setIsDisabled(false);
    });

    socket.emit('get-editor', sessionId);
  }, [isConnected, isReady]);

  useEffect(() => {
    // backend port used for socket.io
    if (socket == null) return;

    const handler = (deltaOrTextTBC: any) => {
      setValue(deltaOrTextTBC);
    };

    socket.on('receive-changes', handler);

    const handleAlert = (alert: string) => {
      setIsAlert(true);
    };

    socket.on('alert-disconnected', handleAlert);
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
    <CardContent>
      <Snackbar open={isAlert} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity='warning' sx={{ width: '100%' }}>
          The other user has left the room
        </Alert>
      </Snackbar>
      <ReactQuill
        theme='snow'
        modules={modules}
        onChange={(content: any, delta: any, source: any, editor: any) =>
          handleVal(content, delta, source, editor)
        }
        value={value}
        readOnly={isDisabled}
      />
    </CardContent>
  );
}

export default Editor;
