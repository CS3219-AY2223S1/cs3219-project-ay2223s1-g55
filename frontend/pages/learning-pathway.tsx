import DefaultLayout from '@/layouts/DefaultLayout';
import { Card, Divider, Grid, List, ListItem, ListItemText, Stack, Container } from '@mui/material';
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';
import LatestSessions from '@/components/learning-pathway/LatestSessions';

const levels = [
  'Level 1 - New Student',
  'Level 2 - Beginner',
  'Level 3 - Novice',
  'Level 4 - Hard',
  'Level 5 - Very Hard',
  'Level 6 - Advanced',
  'Level 7 - Expert',
  'Level 8 - l33t',
];

const dummyQuestionBank = [
  { questionName: 'smallest n-terms', done: true },
  { questionName: 'Reverse linked list', done: false },
];

const LearningPathway = () => {
  return (
    <DefaultLayout>
      <Container maxWidth="xl">
        <h1>Learning Pathway</h1>

        <Grid container gap={5}>
          <Grid item xs={12} md={7}>
            <h2>My Journey</h2>

            <Stack spacing={2}>
              {levels.map((level) => (
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>{level}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <List>
                      {dummyQuestionBank.map((record) => (
                        <>
                          <ListItem sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <ListItemText primary={record.questionName} />
                            {record.done ? (
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
              ))}
            </Stack>
          </Grid>

          <Grid item xs={12} md={3}>
            <LatestSessions />
          </Grid>
        </Grid>
      </Container>
    </DefaultLayout>
  );
};

export default LearningPathway;
