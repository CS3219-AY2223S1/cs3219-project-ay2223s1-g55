import { QuestionDifficultyToColorMap } from '@/lib/types';
import { Box, Typography, Divider } from '@mui/material';
import parse from 'html-react-parser';
import { useEffect } from 'react';

const QuestionDescription = ({ question }) => {
  const descriptionElement = parse(question?.description ?? '');

  return (
    <Box>
      <Typography variant='h4'>{question?.title}</Typography>
      <Typography variant='subtitle2' color={QuestionDifficultyToColorMap[question?.difficulty]}>
        {question?.difficulty}
      </Typography>
      <Divider />
      <Box sx={{ padding: '20px 0px 20px 0px' }}>{descriptionElement}</Box>
    </Box>
  );
};

export default QuestionDescription;
