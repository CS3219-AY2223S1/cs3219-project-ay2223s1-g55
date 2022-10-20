import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import io from 'socket.io-client';
import { Box, Card, CardContent, Typography } from '@mui/material';
import axios from 'axios';
import { URL_MATCHING_SVC, URL_QUESTION_SVC } from '@/lib/configs';
import useUserStore from '@/lib/store';
import { QuestionType } from '@/lib/types';
import QuestionDescription from '../Question/QuestionDescription';

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

function Editor(props: { sessionId: string }) {
  const { sessionId } = props;
  const [isConnected, setIsConnected] = useState(false);
  const [value, setValue] = useState('');
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [questionTitle, setQuestionTitle] = useState<string>();
  const [question, setQuestion] = useState<QuestionType>();

  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const handleVal = (content: any, delta: any, source: any, editor: any) => {
    if (source !== 'user') return;
    setValue(editor.getContents());
    socket.emit('send-changes', editor.getContents());
  };

  useEffect(() => {
    // check for connection, get room id and connect either here or on top
    socket = io('http://localhost:8004', {
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

    socket.once('load-document', (document: any) => {
      setValue(document);
      setIsDisabled(false);
    });

    socket.emit('get-document', sessionId);
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
      socket.emit('save-document', value);
    }, SAVE_INTERVAL_MS);

    return () => {
      clearInterval(interval);
    };
  }, [socket, value]);

  const getQuestionTitle = async () => {
    const res = await axios.get(`${URL_MATCHING_SVC}/session/${sessionId}`);
    return res.data;
  };

  const getQuestion = async () => {
    const convertedTitle = questionTitle?.replaceAll(' ', '-').toLocaleLowerCase();
    const res = await axios.get(`${URL_QUESTION_SVC}/${convertedTitle}`);
    return res.data.question;
  };

  useEffect(() => {
    getQuestionTitle()
      .then((res) => {
        setQuestionTitle(res.data.question);
      })
      .then(() => {
        getQuestion().then((res) => {
          setQuestion(res[0]);
        });
      })
      .finally(() => {
        console.log(questionTitle);
      });
  }, []);

  useEffect(() => {
    getQuestion().then((res) => {
      setQuestion(res[0]);
    });
  }, [questionTitle]);

  return (
    <Box>
      <QuestionDescription question={question} />
      <ReactQuill
        theme="snow"
        modules={modules}
        onChange={(content: any, delta: any, source: any, editor: any) =>
          handleVal(content, delta, source, editor)
        }
        value={value}
        readOnly={isDisabled}
      />
    </Box>
  );
}

export default Editor;
