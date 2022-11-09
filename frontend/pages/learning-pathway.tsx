import DefaultLayout from '@/layouts/DefaultLayout';
import { Grid, Stack, Container, TextField } from '@mui/material';
import * as React from 'react';
import LatestSessions from '@/components/learning-pathway/LatestSessions';
import { difficulties as _difficulties, QuestionType } from '@/lib/types';
import { getQuestions, getAllCompletedQuestions } from 'api';
import { NextPage } from 'next';
import QuestionsList from '@/components/learning-pathway/QuestionsList';
import useUserStore from '@/lib/store';
import ExperienceLevel from '@/components/learning-pathway/ExperienceLevel';

const selector = (state: any) => ({ user: state.user });

const LearningPathway: NextPage = () => {
  const { user } = useUserStore(selector);
  const [completedQuestions, setCompletedQuestions] = React.useState<string[]>([]);

  const [easyQuestions, setEasyQuestions] = React.useState<QuestionType[]>([]);
  const [mediumQuestions, setMediumQuestions] = React.useState<QuestionType[]>([]);
  const [hardQuestions, setHardQuestions] = React.useState<QuestionType[]>([]);

  React.useEffect(() => {
    const fetchAllQuestions = async () => {
      const _easyQuestions = await getQuestions('Easy');
      const _mediumQuestions = await getQuestions('Medium');
      const _hardQuestions = await getQuestions('Hard');
      setEasyQuestions(_easyQuestions);
      setMediumQuestions(_mediumQuestions);
      setHardQuestions(_hardQuestions);
    };
    fetchAllQuestions();
  }, []);

  React.useEffect(() => {
    const fetchCompletedQuestions = async () => {
      const _completedQuestions = await getAllCompletedQuestions(user.username);
      setCompletedQuestions(_completedQuestions);
    };
    if (user?.loginState) fetchCompletedQuestions();
  }, [user]);

  return (
    <DefaultLayout>
      <Container maxWidth='xl'>
        <h1>Learning Pathway</h1>

        <Grid container gap={5}>
          <Grid item xs={12} md={7}>
            <ExperienceLevel />

            <Stack spacing={2}>
              <QuestionsList
                difficulty='Easy'
                questions={easyQuestions}
                completedQuestions={completedQuestions}
              />
              <QuestionsList
                difficulty='Medium'
                questions={mediumQuestions}
                completedQuestions={completedQuestions}
              />
              <QuestionsList
                difficulty='Hard'
                questions={hardQuestions}
                completedQuestions={completedQuestions}
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <LatestSessions />
          </Grid>
        </Grid>
      </Container>
    </DefaultLayout>
  );
};

export default LearningPathway;
