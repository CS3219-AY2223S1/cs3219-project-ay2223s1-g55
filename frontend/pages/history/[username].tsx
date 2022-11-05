import DefaultLayout from '@/layouts/DefaultLayout';
import { formatDate } from '@/lib/helpers';
import {
  Container,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
  TextField,
} from '@mui/material';
import { getAllRecords } from 'api';
import { useState, useMemo } from 'react';

const UserHistory = ({ records }) => {
  const [search, setSearch] = useState('');

  const filteredRecords = useMemo(
    () =>
      records?.filter((record) => record.questionName.toLowerCase().includes(search.toLowerCase())),
    [records, search]
  );

  return (
    <DefaultLayout>
      <Container sx={{ marginTop: 3 }}>
        <TextField
          label='Search by Question Title'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <List
          sx={{
            position: 'relative',
            overflow: 'auto',
            height: 500,
            outline: '1px solid #e0e0e0',
            marginTop: 5,
          }}
          subheader={
            <ListSubheader sx={{ fontSize: 20 }}>
              {`All Sessions (Total: ${records.length})`}
              <Divider />
            </ListSubheader>
          }
        >
          {filteredRecords?.map((record) => (
            <ListItem key={record.startedAt}>
              <ListItemText
                primary={record.questionName}
                secondary={formatDate(record.startedAt)}
              />
            </ListItem>
          ))}

          <p style={{ textAlign: 'center', color: '#b0b0b0', fontSize: 14 }}>End of list.</p>
        </List>
      </Container>
    </DefaultLayout>
  );
};

export const getServerSideProps = async (ctx) => {
  const username = ctx.params.username as string;
  const records = await getAllRecords(username);
  return { props: { records } };
};

export default UserHistory;
