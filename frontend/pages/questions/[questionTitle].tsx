import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Container, Divider } from '@mui/material';
import { QuestionType } from '@/lib/types';
import QuestionDiscussion from '@/components/Question/QuestionDiscussion';
import QuestionDescription from '@/components/Question/QuestionDescription';
import { getQuestionByTitle } from 'api';
import DefaultLayout from '@/layouts/DefaultLayout';

const Question = () => {
  const router = useRouter();
  const { questionTitle } = router.query;
  const [question, setQuestion] = useState<QuestionType>();
  const [commentsAdded, setCommentsAdded] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuestion = async () => {
      const _question = await getQuestionByTitle(questionTitle as string);
      if (_question) setQuestion(_question);
    };
    if (!router.isReady) return;
    fetchQuestion();
  }, [questionTitle, router.isReady, commentsAdded]);

  useEffect(() => {
    console.log('qn', question);
  }, [question]);

  return !router.isReady ? (
    <div />
  ) : (
    <DefaultLayout>
      <Container>
        <QuestionDescription question={question} />
        <Divider />
        <QuestionDiscussion isReady={router.isReady} title={(questionTitle ?? '') as string} />
      </Container>
    </DefaultLayout>
  );
};

export default Question;
