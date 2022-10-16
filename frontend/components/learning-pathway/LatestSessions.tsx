import { Card, List, ListSubheader, ListItem, ListItemText } from '@mui/material';

const dummyHistoryRecords = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => ({
  questionName: 'Tower of Hanoi',
  startedAt: new Date(1665335018243).toUTCString(),
}));

const LatestSessions = () => {
  return (
    <Card>
      <List
        sx={{
          position: 'relative',
          overflow: 'auto',
          height: 500,
        }}
        subheader={<ListSubheader sx={{ fontSize: 20 }}>Latest Sessions</ListSubheader>}
      >
        {dummyHistoryRecords.map((record, index) => (
          <ListItem key={record.startedAt}>
            <ListItemText
              primary={`${index + 1}. ${record.questionName}`}
              secondary={record.startedAt}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default LatestSessions;
