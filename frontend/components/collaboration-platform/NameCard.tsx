import { URL_MATCHING_SESSION } from '@/lib/configs';
import { Box, Button, Chip, Stack, styled, Typography, Card } from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import router from 'next/router';

const NameBox = styled(Card)(({ theme }) => ({
  fontSize: 'h4',
  fontWeight: 'bold',
  color: theme.palette.primary.light,
  textAlign: 'center',
  backgroundColor: 'white',
  padding: '5px',
  borderRadius: '10px',
  my: 2,
}));

function NameCard(props: { sessionId: string; isReady: boolean }) {
  const [username1, setUsername1] = useState('anonymous');
  const [username2, setUsername2] = useState('anonymous');
  const [error, setError] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const { sessionId, isReady } = props;

  const handleLeaveRoom = async () => {
    router.push('/match');
  };
  const fetchSession = async (sessionId: string) => {
    if (!sessionId) {
      return null;
    }
    try {
      const res = await axios.get(`${URL_MATCHING_SESSION}/${sessionId}`);
      if (res.status === 200 || res.status === 201) {
        return res;
      }
      throw new Error('Error fetching session');
    } catch (err: any) {
      console.error(err);
      setError(err);
      return null;
    }
  };

  useEffect(() => {
    if (!isReady) {
      return;
    }
    setLoading(true);
    fetchSession(sessionId)
      .then((res) => {
        setUsername1(res?.data?.data?.username1);
        setUsername2(res?.data?.data?.username2);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setError(error);
      });
  }, [isReady]);
  if (error) return <p />;
  if (isLoading) return <p>Loading...</p>;
  return (
    <NameBox>
      <Stack sx={{ py: '10px' }} justifyContent='center' alignItems='center' spacing={2}>
        {/* <Chip sx={{ fontSize: 'h4', fontweight: 'bold' }} label='Matched!' /> */}
        <Typography sx={{ paddingTop: '4', fontSize: 'h4', fontWeight: 'bold' }}>
          Current Match
        </Typography>

        <Stack direction='row' justifyContent='center' alignItems='center' spacing={2}>
          <Chip label={username1} />
          <Chip label={username2} />
        </Stack>
        <Button
          onClick={handleLeaveRoom}
          sx={{ borderRadius: '10px' }}
          variant='contained'
          color='secondary'
        >
          Leave Room
        </Button>
      </Stack>
    </NameBox>
  );
}

export default NameCard;
