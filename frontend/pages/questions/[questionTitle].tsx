import { useRouter } from 'next/router';
import axios from 'axios';
import { URL_QUESTION_SVC } from '@/lib/configs';
import { useEffect, useState } from 'react';
import { Container, Divider } from '@mui/material';
import { QuestionType } from '@/lib/types';
import QuestionDiscussion from '@/components/Question/QuestionDiscussion';
import QuestionDescription from '@/components/Question/QuestionDescription';

const Question = () => {
  const router = useRouter();
  const { questionTitle } = router.query;
  const [question, setQuestion] = useState<QuestionType[]>();
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

  return !router.isReady ? (
    <div />
  ) : (
    <Container>
      <QuestionDescription question={question} />
      <Divider />
      <QuestionDiscussion isReady={router.isReady} title={questionTitle ?? ''} />
    </Container>
  );
};

export default Question;
