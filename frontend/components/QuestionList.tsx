import { URL_QUESTION_GET_DIFFICULTY } from '@/lib/configs';
import axios from 'axios';
import { SyntheticEvent, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Grid,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Question } from '@/lib/types';

const QuestionList = () => {
  const [questions, setQuestions] = useState<Question[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currExpanded, setCurrExpanded] = useState<number | boolean>(false);
  const handleQuestionClick = (index: number) => (e: SyntheticEvent, isExpanded: boolean) => {
    setCurrExpanded(isExpanded ? index : 0);
  };
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
      {questions?.map((qn) => {
        return (
          <Accordion
            expanded={currExpanded === questions.indexOf(qn) + 1}
            onChange={handleQuestionClick(questions.indexOf(qn) + 1)}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls={`panel${questions.indexOf(qn) + 1}-title`}
              id={`panel${questions.indexOf(qn) + 1}-header`}
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>{qn.title}</Typography>
              <Typography sx={{ width: '100%', textAlign: 'right' }}>{qn.difficulty}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{qn.description}</Typography>
              <Typography>{qn.examples}</Typography>
              <Typography>{qn.constraints}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Container>
  );
};

export default QuestionList;
