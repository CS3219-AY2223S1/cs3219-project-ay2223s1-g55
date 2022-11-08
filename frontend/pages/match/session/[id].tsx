import { useRouter } from 'next/router';
import { Box, Card, Grid, CardContent, Stack, Button, Drawer } from '@mui/material';
import Editor from '@/components/collaboration-platform/editor';
import Chat from '@/components/collaboration-platform/Chat';
import useUserStore from '@/lib/store';
import { QuestionType } from '@/lib/types';
import { useState, useEffect } from 'react';
import QuestionDescription from '@/components/Question/QuestionDescription';
import DefaultLayout from '@/layouts/DefaultLayout';
import { getQuestionByTitle, getQuestionTitle } from 'api';

export default function CollaborationPlatform() {
  const router = useRouter();
  const { id: sessionId }: { id?: string } = router.query;
  const [questionTitle, setQuestionTitle] = useState<string>();
  const [question, setQuestion] = useState<QuestionType>();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(true);
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  useEffect(() => {
    const fetchData = async () => {
      const _questionTitle = await getQuestionTitle(sessionId ?? '');
      setQuestionTitle(_questionTitle);

      const convertedTitle = _questionTitle?.replaceAll(' ', '-').toLocaleLowerCase();
      const _question = await getQuestionByTitle(convertedTitle);
      setQuestion(_question);
      console.log(_questionTitle);
    };

    if (!router.isReady) return;
    fetchData();
  }, [router.isReady]);

  return (
    <DefaultLayout>
      <div style={{ padding: 40 }}>
        <Button onClick={toggleDrawer}>See Question</Button>

        <Drawer anchor='left' open={isDrawerOpen} onClose={toggleDrawer}>
          <Box
            sx={{ width: '40vw', padding: '40px' }}
            role='presentation'
            onClick={toggleDrawer}
            onKeyDown={toggleDrawer}
          >
            <QuestionDescription question={question} />
          </Box>
        </Drawer>

        <Grid container spacing={3}>
          <Grid item xs={9} md={8}>
            <Stack>
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
      </div>
    </DefaultLayout>
  );
}
