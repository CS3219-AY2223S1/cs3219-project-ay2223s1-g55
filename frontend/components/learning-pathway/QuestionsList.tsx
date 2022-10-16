import { QuestionType } from '@/lib/types';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';

interface QuestionsListProps {
  questions: QuestionType[];
  difficulty: string;
  completedQuestions?: string[];
}

const QuestionsList = ({ questions, difficulty, completedQuestions = [] }: QuestionsListProps) => {
  return (
    <Accordion defaultExpanded>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>{difficulty}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <List>
          {questions?.map((question) => (
            <>
              <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <ListItemText primary={question.title} />
                {completedQuestions?.includes(question.title) ? (
                  <CheckCircleTwoToneIcon color="success" />
                ) : (
                  <CancelTwoToneIcon color="error" />
                )}
              </ListItem>
              <Divider />
            </>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

export default QuestionsList;
