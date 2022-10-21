import { useRouter } from 'next/router';
import axios from 'axios';
import { URL_QUESTION_SVC } from '@/lib/configs';
import { useEffect, useState } from 'react';
import { Box, Container, Divider, List, ListItem, Typography } from '@mui/material';
import { QuestionType } from '@/lib/types';
import QuestionDiscussion from '@/components/Question/QuestionDiscussion';
import QuestionDescription from '@/components/Question/QuestionDescription';

const Question = () => {
  const router = useRouter();
  const { questionTitle } = router.query;
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

  // const difficultyColor = () => {
  //   switch (question?.difficulty) {
  //     case 'Easy':
  //       return 'green';
  //     case 'Medium':
  //       return 'orange';
  //     case 'Hard':
  //       return 'red';
  //     default:
  //       return 'black';
  //   }
  // };

  return (
    <Container>
      <QuestionDescription question={question} />
      {/* <Typography variant="h4">{question?.title}</Typography>
      <Typography variant="subtitle2" color={difficultyColor()}>
        {question?.difficulty}
      </Typography>
      <Divider />
      <Box sx={{ padding: '20px 0px 20px 0px' }}>
        <Typography variant="body1">{question?.description}</Typography>
      </Box>
      <Typography variant="h6">Examples</Typography>
      <Box>
        {question?.examples.map((e, i) => (
          <List key={i}>
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
          <ListItem key={i}>
            <Typography variant="caption">{`${i + 1}. ${c}`}</Typography>
          </ListItem>
        ))}
      </List> */}
      <Divider />
      <QuestionDiscussion isReady={router.isReady} title={questionTitle ?? ''} />
    </Container>
  );
};

export default Question;
