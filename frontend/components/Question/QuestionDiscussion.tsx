import useUserStore from '@/lib/store';
import { QuestionCommentType } from '@/lib/types';
import { Box, Button, Container, Divider, Grid, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { addComment, getComments } from 'api';

const QuestionDiscussion = ({ isReady, title }: { isReady: boolean; title: string }) => {
  const [currComments, setCurrComments] = useState<QuestionCommentType[]>([]);
  const [comment, setComment] = useState<string>('');
  const { user } = useUserStore((state) => ({ user: state.user }));
  const username = user?.username;

  const handleClick = async () => {
    await addComment(title, { user: username, comment });
    console.log('Created comment', comment);
    setComment('');
  };

  useEffect(() => {
    const fetchData = async () => {
      const comments = await getComments(title);
      setCurrComments(comments);
    };
    if (!isReady) return;
    fetchData();
  }, [isReady, title]);

  return (
    <Container
      className='outer-container'
      sx={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Container className='inner-container' sx={{ height: '210px', overflowY: 'auto' }}>
        <Typography gutterBottom variant='h6'>
          Comments
        </Typography>
        {currComments.map((c, i) => {
          const dateTime = dayjs(c.created_at).format('DD/MM/YYYY h:mmA');

          return (
            <Box key={i} sx={{ height: '40%' }}>
              <Container sx={{ maxHeight: 'max-content' }}>
                <Grid container>
                  <Grid item xs={6} rowSpacing={1}>
                    <Typography sx={{ fontSize: 'large', fontWeight: '700' }}>{c.user}</Typography>
                  </Grid>
                  <Grid item xs={6} justifyContent='flex-end'>
                    <Typography sx={{ textAlign: 'right', color: 'gray' }}>{dateTime}</Typography>
                  </Grid>
                  <Grid item xs={12} justifyContent='center' sx={{ height: '100%' }}>
                    <Container>
                      <Typography noWrap gutterBottom variant='body1'>
                        {c.comment}
                      </Typography>
                    </Container>
                  </Grid>
                </Grid>
              </Container>
              <Divider />
            </Box>
          );
        })}
      </Container>
      <Container style={{ width: '70%' }}>
        <Typography gutterBottom variant='h6'>
          Write a Comment
        </Typography>
        <TextField
          fullWidth
          rows={4}
          variant='outlined'
          label='Comment'
          multiline
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <Button
          style={{ marginTop: '10px' }}
          fullWidth
          disabled={!comment}
          variant='contained'
          onClick={handleClick}
        >
          Comment
        </Button>
      </Container>
    </Container>
  );
};

export default QuestionDiscussion;
