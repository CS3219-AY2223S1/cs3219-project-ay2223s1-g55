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

interface QuestionsListProps {
  questions: QuestionType[];
  difficulty: string;
}

const QuestionsList = ({ questions, difficulty }: QuestionsListProps) => {
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
                {/* {record.done ? (
                              <CheckCircleTwoToneIcon color="success" />
                            ) : (
                              <CancelTwoToneIcon color="error" />
                            )} */}
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
