import ChangePasswordPage from '@/components/change-password';
import DeleteAccount from '@/components/DeleteAccount';
import UnauthorizedDialog from '@/components/UnauthorizedDialog';
import DefaultLayout from '@/layouts/DefaultLayout';
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
        return <ChangePasswordPage />;
      default:
        return (
          <Container>
            <h2>Adjust your settings here</h2>
          </Container>
        );
    }
  };

  return (
    <DefaultLayout>
      <Container className='main' maxWidth='xl' sx={{ height: '100vh' }}>
        <h1>Settings</h1>
        <Box sx={{ display: 'flex' }}>
          <Tabs
            orientation='vertical'
            variant='scrollable'
            value={currTabValue}
            onChange={setTabChange}
            aria-label='settings-tabs'
            sx={{ borderRight: 1, borderColor: 'divider' }}
          >
            <Tab label='Delete Account' onClick={() => setCurrPage('delete account')} />
            <Tab label='Change Password' onClick={() => setCurrPage('change password')} />
          </Tabs>
          {renderPage()}
        </Box>
      </Container>
    </DefaultLayout>
  );
};

export default Settings;
