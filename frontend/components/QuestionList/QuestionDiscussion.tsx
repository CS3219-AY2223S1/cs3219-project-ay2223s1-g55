import { URL_QUESTION_SVC } from '@/lib/configs';
import useUserStore from '@/lib/store';
import { QuestionCommentType } from '@/lib/types';
import { Box, Button, Container, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';

const QuestionDiscussion = ({ isReady, title }: { isReady: boolean; title: string | string[] }) => {
  const [currComments, setCurrComments] = useState<QuestionCommentType[]>([]);
  const [comment, setComment] = useState<string>('');
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));
  const username = user?.username;

  const addComment = async (createdComment: QuestionCommentType) => {
    const res = await axios.post(`${URL_QUESTION_SVC}/${title}`, createdComment);
    return res.data;
  };

  const fetchComments = async () => {
    const res = await axios.get(`${URL_QUESTION_SVC}/${title}`);
    return res.data?.question[0].comments;
  };

  const handleClick = async () => {
    const createdComment: QuestionCommentType = { user: username, comment };
    console.log('Created comment', createdComment);
    const res = await addComment(createdComment);
    setComment('');
  };

  useEffect(() => {
    if (!isReady) return;
    fetchComments().then((res) => setCurrComments(res));
  }, [isReady, currComments]);

  return (
    <Container
      className="outer-container"
      sx={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Container className="inner-container" sx={{ height: '100%', overflowY: 'auto' }}>
        <Typography gutterBottom variant="h6">
          Comments
        </Typography>
        {currComments.map((c, i) => (
          <Typography key={i} gutterBottom variant="subtitle1">
            {i}, {c.user}: {c.comment}
          </Typography>
        ))}
      </Container>
      <Box style={{ width: '70%' }}>
        <Typography gutterBottom variant="h6">
          Write a Comment
        </Typography>
        <TextField
          fullWidth
          rows={4}
          variant="outlined"
          label="Comment"
          multiline
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          style={{ marginTop: '10px' }}
          fullWidth
          disabled={!comment}
          variant="contained"
          onClick={handleClick}
        >
          Comment
        </Button>
      </Box>
    </Container>
  );
};

export default QuestionDiscussion;
