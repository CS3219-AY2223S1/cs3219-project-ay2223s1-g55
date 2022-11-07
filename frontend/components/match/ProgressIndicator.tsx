import React, { useEffect } from 'react';
import { Box, CircularProgress, CircularProgressProps, Typography } from '@mui/material';

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  const { value } = props;
  return (
    <Box sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center' }}>
      <CircularProgress
        sx={{ borderRadius: 1 }}
        size={50}
        color='primary'
        thickness={5}
        variant='indeterminate'
        {...props}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant='caption' component='div' color='text.secondary'>{`${Math.round(
          value
        )}s`}</Typography>
      </Box>
    </Box>
  );
}

const ProgressIndicator = () => {
  const [progress, setProgress] = React.useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prevProgress) => (prevProgress === 0 ? 30 : prevProgress - 1));
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return <CircularProgressWithLabel value={progress} />;
};

export default ProgressIndicator;
