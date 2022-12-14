import { Box, Button, Stack } from '@mui/material';
import DefaultLayout from '@/layouts/DefaultLayout';
import router from 'next/router';
import useUserStore from '@/lib/store';
import QuestionList from '@/components/Question/QuestionList';
import DoughnutChart from '@/components/charts/doughnutChart';
import LineChart from '@/components/charts/lineChart';
import { getAllQuestions } from 'api';

function Dashboard({ questions }) {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const handleMatching = async () => {
    router.push('/match');
  };

  return (
    <DefaultLayout>
      <Box
        justifySelf='center'
        sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
      >
        <Button
          id='matching_button'
          variant='contained'
          onClick={handleMatching}
          sx={{ height: '100%' }}
        >
          Find a Match
        </Button>
      </Box>
      <Stack direction='row' justifyContent='center' alignItems='center' spacing={2}>
        <DoughnutChart username={user.username ?? ''} />
        <LineChart username={user.username ?? ''} />
      </Stack>
      <QuestionList allQuestions={questions} />
    </DefaultLayout>
  );
}

export default Dashboard;

export async function getStaticProps() {
  const questions = await getAllQuestions();
  const titleAndDifficulty = questions?.map((qn) => {
    const { title, difficulty } = qn;
    return { title, difficulty };
  });

  return {
    props: {
      questions: titleAndDifficulty ?? [],
    },
    // revalidate: 604800,
  };
}
