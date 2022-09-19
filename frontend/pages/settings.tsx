import DeleteAccount from '@/components/DeleteAccount';
import UnauthorizedDialog from '@/components/UnauthorizedDialog';
import useUserStore from '@/lib/store';
import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import React, { SyntheticEvent, useState } from 'react';

type SettingsPage = 'default' | 'change password' | 'delete account';

const Settings = () => {
  const [currPage, setCurrPage] = useState<SettingsPage>('default');
  const { user } = useUserStore((state) => ({ user: state.user }));
  const [currTabValue, setCurrTabValue] = useState<number>(0);
  const setTabChange = (e: SyntheticEvent, newValue: number) => {
    setCurrTabValue(newValue);
  };

  const renderPage = () => {
    switch (currPage) {
      case 'delete account':
        return <DeleteAccount />;
      case 'change password':
        return <Container>Change password page</Container>;
      default:
        return (
          <Container>
            Access your account settings by selecting one of the buttons on the left
          </Container>
        );
    }
  };

  if (!user.loginState) return <UnauthorizedDialog />;
  return (
    <Container className="main" maxWidth="lg" sx={{ height: '100vh' }}>
      <Typography variant="h4">Settings</Typography>
      <Box sx={{ display: 'flex' }}>
        <Tabs
          orientation="vertical"
          variant="scrollable"
          value={currTabValue}
          onChange={setTabChange}
          aria-label="settings-tabs"
          sx={{ borderRight: 1, borderColor: 'divider' }}
        >
          <Tab label="Delete Account" onClick={() => setCurrPage('delete account')} />
          <Tab label="Change Password" onClick={() => setCurrPage('change password')} />
        </Tabs>
        {renderPage()}
      </Box>
    </Container>
  );
};

export default Settings;
