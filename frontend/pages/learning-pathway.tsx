import DefaultLayout from '@/layouts/DefaultLayout';
import { Grid, Stack, Container } from '@mui/material';
import * as React from 'react';
import LatestSessions from '@/components/learning-pathway/LatestSessions';
import { difficulties as _difficulties, QuestionType } from '@/lib/types';
import { getQuestions } from 'api';
import { NextPage } from 'next';
import QuestionsList from '@/components/learning-pathway/QuestionsList';

interface IProps {
  easyQuestions: QuestionType[];
  mediumQuestions: QuestionType[];
  hardQuestions: QuestionType[];
}

const LearningPathway: NextPage<IProps> = ({ easyQuestions, mediumQuestions, hardQuestions }) => {
  return (
    <DefaultLayout>
      <Container maxWidth="xl">
        <h1>Learning Pathway</h1>

        <Grid container gap={5}>
          <Grid item xs={12} md={7}>
            <h2>My Journey</h2>

            <Stack spacing={2}>
              <QuestionsList difficulty="Easy" questions={easyQuestions} />
              <QuestionsList difficulty="Medium" questions={mediumQuestions} />
              <QuestionsList difficulty="Hard" questions={hardQuestions} />
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

export const getStaticProps = async () => {
  const easyQuestions = await getQuestions('Easy');
  const mediumQuestions = await getQuestions('Medium');
  const hardQuestions = await getQuestions('Hard');
  return { props: { easyQuestions, mediumQuestions, hardQuestions } };
};

export default LearningPathway;
