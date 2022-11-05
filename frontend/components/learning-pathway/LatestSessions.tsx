import useUserStore from '@/lib/store';
import { Card, List, ListSubheader, ListItem, ListItemText } from '@mui/material';
import { getAllRecords } from 'api';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { formatDate } from '@/lib/helpers';
import Link from 'next/link';

dayjs.extend(utc);
dayjs.extend(timezone);

const selectors = (state: any) => ({ user: state.user });

const LatestSessions = () => {
  const { user } = useUserStore(selectors);
  const [history, setHistory] = useState<any[]>([]);

  React.useEffect(() => {
    const fetchHistory = async () => {
      const sessions = await getAllRecords(user.username, 10);
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
              secondary={formatDate(record.startedAt)}
            />
          </ListItem>
        ))}
        <p style={{ textAlign: 'center', color: '#b0b0b0', fontSize: 14 }}>
          <Link href={`/history/${user.username}`}>View More</Link>
        </p>
      </List>
    </Card>
  );
};

export default LatestSessions;
