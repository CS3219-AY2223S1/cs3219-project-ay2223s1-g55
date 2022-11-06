import { Box, Typography, Divider, List, ListItem, Container } from '@mui/material';

const QuestionDescription = ({ question }) => {
  const QuestionDifficultyToColorMap = {
    Easy: 'green',
    Medium: 'orange',
    Hard: 'red',
  };

  return (
    <Box>
      <Typography variant='h4'>{question?.title}</Typography>
      <Typography variant='subtitle2' color={QuestionDifficultyToColorMap[question?.difficulty]}>
        {question?.difficulty}
      </Typography>
      <Divider />
      <Box sx={{ padding: '20px 0px 20px 0px' }}>
        <Typography variant='body1'>{question?.description}</Typography>
      </Box>
      <Typography variant='h6'>Examples</Typography>
      <Box>
        {question?.examples.map((e, i) => (
          <List key={i}>
            <ListItem>
              <Typography variant='subtitle1'>{`Example ${i + 1}.`}</Typography>
            </ListItem>
            <Container
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                backgroundColor: 'grey',
                border: '2px',
                borderRadius: '5px',
                maxWidth: '700px',
              }}
            >
              <Typography variant='caption'>{`Input: ${e.input}`}</Typography>
              <Typography variant='caption'>{`Output: ${e.output}`}</Typography>
              <Typography variant='caption'>
                {e.explanation ? `Explanation: ${e.explanation}` : ''}
              </Typography>
            </Container>
          </List>
        ))}
      </Box>
      <Typography variant='h6'>Constraints</Typography>
      <List>
        {question?.constraints.map((c, i) => (
          <ListItem key={i}>
            <Typography variant='caption'>{`${i + 1}. ${c}`}</Typography>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default QuestionDescription;
