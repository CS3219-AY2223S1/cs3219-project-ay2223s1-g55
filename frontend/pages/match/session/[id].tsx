import { useRouter } from 'next/router';
import { EditRoad } from '@mui/icons-material';
import { Card, Grid, CardContent, Stack } from '@mui/material';
import Editor from '@/components/collaboration-platform/editor';
import Chat from '@/components/chat';
import { URL_MATCHING_SESSION, URL_QUESTION_SVC } from '@/lib/configs';
import useUserStore from '@/lib/store';
import { QuestionType } from '@/lib/types';
import axios from 'axios';
import { useState, useEffect } from 'react';
import QuestionDescription from '@/components/Question/QuestionDescription';

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
  }, []);

  useEffect(() => {
    getQuestion().then((res) => {
      setQuestion(res[0]);
    });
  }, [questionTitle]);

  return (
    <div style={{ padding: 40 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Stack>
            <QuestionDescription question={question} />
            <Card elevation={3} sx={{ p: 2 }}>
              <CardContent>
                <Editor sessionId={sessionId ?? ''} />
              </CardContent>
            </Card>
          </Stack>
        </Grid>
        <Grid xs={12} md={4}>
          <Card sx={{ m: 3 }}>
            <Chat sessionId={sessionId ?? ''} />
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
