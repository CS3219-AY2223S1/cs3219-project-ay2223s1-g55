import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'react-quill/dist/quill.snow.css';
import io from 'socket.io-client';

const QuillNoSSRWrapper = dynamic(import('react-quill'), {
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

function TextEditor() {
  const [socket, setSocket] = useState();
  const [body, setBody] = useState('');

  const handleBody = (content: any, editor: any) => {
    setBody(content);
    console.log(body);
    socket.emit('send-changes', editor.getContetn);
  };
  useEffect(() => {
    // backend port used for socket.io
    const s = io('http://localhost:8002', {
      transports: ['websocket'],
      // autoConnect: false,
    });
    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, []);
  return (
    <QuillNoSSRWrapper
      theme="snow"
      modules={modules}
      onChange={(content: any, delta: any, source: any, editor: any) => handleBody(content, editor)}
      value={body}
    />
  );
}

export default TextEditor;
