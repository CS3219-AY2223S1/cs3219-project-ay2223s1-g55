import { useRouter } from 'next/router';
import { EditRoad } from '@mui/icons-material';
import { Card, Grid, CardContent, Stack, Container } from '@mui/material';
import Editor from '@/components/collaboration-platform/editor';
import Chat from '@/components/collaboration-platform/Chat';
import { URL_MATCHING_SESSION, URL_QUESTION_SVC } from '@/lib/configs';
import useUserStore from '@/lib/store';
import { QuestionType } from '@/lib/types';
import axios from 'axios';
import { useState, useEffect } from 'react';
import QuestionDescription from '@/components/Question/QuestionDescription';
import DefaultLayout from '@/layouts/DefaultLayout';

export default function CollaborationPlatform() {
  const router = useRouter();
  const { id: sessionId }: { id?: string } = router.query;
  const [questionTitle, setQuestionTitle] = useState<string>();
  const [question, setQuestion] = useState<QuestionType>();

  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const getQuestionTitle = async () => {
    const res = await axios.get(`${URL_MATCHING_SESSION}/${sessionId}`);
    return res.data.data.question;
  };

  const getQuestion = async () => {
    const convertedTitle = questionTitle?.replaceAll(' ', '-').toLocaleLowerCase();
    const res = await axios.get(`${URL_QUESTION_SVC}/${convertedTitle}`);
    return res.data.question;
  };

  useEffect(() => {
    if (!router.isReady) return;
    getQuestionTitle()
      .then((res) => {
        setQuestionTitle(res);
      })
      .then(() => {
        getQuestion().then((res) => {
          setQuestion(res[0]);
        });
      })
      .finally(() => {
        console.log(questionTitle);
      });
  }, [router.isReady]);

  useEffect(() => {
    getQuestion().then((res) => {
      setQuestion(res[0]);
    });
  }, [questionTitle]);

  return (
    <DefaultLayout>
      <Container style={{ padding: 40 }}>
        <Grid container spacing={3}>
          <Grid item xs={9} md={8}>
            <Stack>
              <QuestionDescription question={question} />
              <Card elevation={3} sx={{ p: 2 }}>
                <CardContent>
                  <Editor sessionId={sessionId ?? ''} />
                </CardContent>
              </Card>
            </Stack>
          </Grid>
          <Grid item xs={3} md={4}>
            <Card sx={{ m: 3, overscrollBehavior: 'contain' }}>
              <Chat sessionId={sessionId ?? ''} />
            </Card>
          </Grid>
        </Grid>
      </Container>
    </DefaultLayout>
  );
}
