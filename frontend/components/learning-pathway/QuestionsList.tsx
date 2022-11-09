import { QuestionType } from '@/lib/types';
import { Accordion, AccordionSummary, Typography, AccordionDetails, List } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { memo } from 'react';
import QuestionListItem from './QuestionListItem';

interface QuestionsListProps {
  questions: QuestionType[];
  difficulty: string;
  completedQuestions?: string[];
}

const QuestionsList = memo(({ questions, difficulty, completedQuestions }: QuestionsListProps) => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{difficulty}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ maxHeight: 400, overflowY: 'scroll' }}>
        {!questions?.length && 'No questions to show.'}
        <List sx={{ maxHeight: 'inherit' }}>
          {questions?.map((question) => (
            <QuestionListItem
              question={question}
              completed={completedQuestions?.includes(question.title)}
              key={question.title}
            />
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
});

export default QuestionsList;
