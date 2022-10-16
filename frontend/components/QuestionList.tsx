import { URL_QUESTION_SVC } from '@/lib/configs';
import axios from 'axios';
import { SyntheticEvent, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Difficulty, QuestionType } from '@/lib/types';
import Link from 'next/link';

const QuestionList = () => {
  const [currDifficulty, setCurrDifficulty] = useState<Difficulty>('All');
  const [questions, setQuestions] = useState<QuestionType[]>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currExpanded, setCurrExpanded] = useState<number | boolean>(false);
  const handleQuestionClick = (index: number) => (e: SyntheticEvent, isExpanded: boolean) => {
    setCurrExpanded(isExpanded ? index : 0);
  };
  const getQuestions = async (difficulty: Difficulty) => {
    try {
      if (difficulty === 'All') {
        const res = await axios.get(`${URL_QUESTION_SVC}`);
        console.log('res__difficulty', res);
        return res.data;
      }
      const params = new URLSearchParams({ difficulty });
      const res = await axios.get(`${URL_QUESTION_SVC}?${params.toString()}`);
      console.log('res', res);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  const handleDifficultyChange = (e: SelectChangeEvent<string>) => {
    const selectedDifficulty = e.target.value as Difficulty;
    setCurrDifficulty(selectedDifficulty);
  };

  const convertTitle = (title: string) => {
    return title.toLowerCase().replaceAll(' ', '-');
  };

  useEffect(() => {
    getQuestions(currDifficulty)
      .then((res) => {
        setQuestions(res.questions);
      })
      .finally(() => {
        console.log('question: ', questions);
        setIsLoading(false);
      });
  }, [currDifficulty]);

  return isLoading ? (
    <div>Loading...</div>
  ) : (
    <Container>
      <Box id="difficulty_selector" style={{ width: '30%' }}>
        <FormControl fullWidth>
          <InputLabel>Difficulty</InputLabel>
          <Select
            labelId="difficulty-select-label"
            id="difficulty-select"
            value={currDifficulty}
            label="Difficulty"
            onChange={handleDifficultyChange}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Box>
        {questions?.map((qn, i) => {
          return (
            <Accordion expanded={currExpanded === i + 1} onChange={handleQuestionClick(i + 1)}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel${i + 1}-title`}
                id={`panel${questions.indexOf(qn) + 1}-header`}
              >
                <Typography sx={{ width: '33%', flexShrink: 0 }}>{qn.title}</Typography>
                <Typography sx={{ width: '100%', textAlign: 'right' }}>{qn.difficulty}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ListItemText primary={qn.description} />
                  </ListItem>
                  {/* <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ListItemText primary={qn.examples} />
                  </ListItem>
                  <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <ListItemText primary={qn.constraints} />
                  </ListItem> */}
                </List>
                <Link href={`/questions/${convertTitle(qn.title)}`}>
                  <Button variant="outlined">See More</Button>
                </Link>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </Container>
  );
};

export default QuestionList;
