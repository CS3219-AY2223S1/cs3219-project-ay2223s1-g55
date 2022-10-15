import { useRouter } from 'next/router';
import axios from 'axios';
import { URL_QUESTION_SVC } from '@/lib/configs';
import { useEffect, useState } from 'react';
import { Box, Container, Divider, List, ListItem, Typography } from '@mui/material';
import { QuestionType } from '@/lib/types';
import QuestionDiscussion from '@/components/QuestionDiscussion';

const Question = () => {
  const router = useRouter();
  const { questionTitle } = router.query;
  console.log('router query', router.query);
  const [question, setQuestion] = useState<QuestionType>();
  const [commentsAdded, setCommentsAdded] = useState<boolean>(false);

  const getQuestionByTitle = async () => {
    const res = await axios.get(`${URL_QUESTION_SVC}/${questionTitle}`);
    return res.data;
  };

  useEffect(() => {
    if (!router.isReady) return;
    getQuestionByTitle().then((res) => {
      if (res.question) setQuestion(res.question[0]);
    });
  }, [questionTitle, router.isReady, commentsAdded]);

  useEffect(() => {
    console.log('qn', question);
  }, [question]);

  return (
    <Container>
      <Typography variant="h4">{question?.title}</Typography>
      <Typography
        variant="subtitle2"
        // sx={{
        //   color:
        //     question?.difficulty === 'Easy'
        //       ? 'green'
        //       : question?.difficulty === 'Medium'
        //       ? 'orange'
        //       : 'red',
        // }}
      >
        {question?.difficulty}
      </Typography>
      <Typography variant="body1">{question?.description}</Typography>
      <Typography variant="h6">Examples</Typography>
      <Box>
        {question?.examples.map((e, i) => (
          <List>
            <ListItem>
              <Typography variant="subtitle1">{`Example ${i + 1}.`}</Typography>
            </ListItem>
            <Container
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                backgroundColor: 'grey',
                border: '2px',
                borderRadius: '5px',
                maxWidth: '700px',
              }}
            >
              <Typography variant="caption">{`Input: ${e.input}`}</Typography>
              <Typography variant="caption">{`Output: ${e.output}`}</Typography>
              <Typography variant="caption">
                {e.explanation ? `Explanation: ${e.explanation}` : ''}
              </Typography>
            </Container>
          </List>
        ))}
      </Box>
      <Typography variant="h6">Constraints</Typography>
      <List>
        {question?.constraints.map((c, i) => (
          <ListItem>
            <Typography variant="caption">{`${i + 1}. ${c}`}</Typography>
          </ListItem>
        ))}
      </List>
      <Divider />
      <QuestionDiscussion isReady={router.isReady} title={questionTitle ?? ''} />
    </Container>
  );
};

export default Question;
