import useUserStore from '@/lib/store';
import { Card, List, ListSubheader, ListItem, ListItemText } from '@mui/material';
import { getAllRecords } from 'api';
import React, { useState } from 'react';

const selectors = (state: any) => ({ user: state.user });

const LatestSessions = () => {
  const { user } = useUserStore(selectors);
  const [history, setHistory] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchHistory = async () => {
      const sessions = await getAllRecords(user.username);
      setHistory(sessions);
    };

    if (user?.loginState) fetchHistory();
  }, [user]);

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
        {history.map((record, index) => (
          <ListItem key={record.startedAt}>
            <ListItemText
              primary={`${index + 1}. ${record.questionName}`}
              secondary={record.startedAt && new Date(record.startedAt).toUTCString()}
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default LatestSessions;
