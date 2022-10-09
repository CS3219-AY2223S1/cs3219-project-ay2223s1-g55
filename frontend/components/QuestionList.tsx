import { URL_QUESTION_GET_DIFFICULTY } from '@/lib/configs';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Container, Grid } from '@mui/material';
import { Question } from '@/lib/types';

const QuestionList = () => {
  const [questions, setQuestions] = useState<Question[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const getQuestions = async (difficulty: string) => {
    try {
      const res = await axios.get(URL_QUESTION_GET_DIFFICULTY(difficulty));
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getQuestions('easy')
      .then((res) => {
        setQuestions(res.questions);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <Container>
      <Grid container>
        <Grid item xs>
          {questions?.map((qn) => qn.title)}
        </Grid>
      </Grid>
    </Container>
  );
};

export default QuestionList;
