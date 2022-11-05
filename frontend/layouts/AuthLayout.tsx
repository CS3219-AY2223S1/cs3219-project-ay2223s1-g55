import { Box, Container, Card } from '@mui/material';
import React from 'react';

interface IProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: IProps) => {
  return (
    <Box sx={{ backgroundImage: 'url("/images/login-bg.jpg")', width: '100vw', height: '100vh' }}>
      <Container
        maxWidth='md'
        sx={{ display: 'flex', justifyContent: 'center', height: '100%', alignItems: 'center' }}
      >
        <Card sx={{ width: 'fit-content', padding: 10, height: 'fit-content' }}>{children}</Card>
      </Container>
    </Box>
  );
};

export default AuthLayout;
