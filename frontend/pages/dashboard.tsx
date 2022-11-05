import { Box, Button } from '@mui/material';
import DefaultLayout from '@/layouts/DefaultLayout';
import router from 'next/router';
import useUserStore from '@/lib/store';
import UnauthorizedDialog from '@/components/UnauthorizedDialog';
import QuestionList from '@/components/Question/QuestionList';
import axios from 'axios';
import { URL_QUESTION_SVC } from '@/lib/configs';

function Dashboard({ questions }) {
  const { user } = useUserStore((state) => ({
    user: state.user,
  }));

  const handleMatching = async () => {
    router.push('/match');
  };

  if (!user.loginState) return <UnauthorizedDialog />;

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

      <QuestionList allQuestions={questions} />
    </DefaultLayout>
  );
}

export default Dashboard;

export async function getStaticProps() {
  const { data } = await axios.get(`${URL_QUESTION_SVC}`);
  const { questions } = data;
  const titleAndDifficulty = questions.map((qn) => {
    const { title, difficulty } = qn;
    return { title, difficulty };
  });
  return {
    props: {
      questions: titleAndDifficulty,
    },
    // revalidate: 604800,
  };
}
