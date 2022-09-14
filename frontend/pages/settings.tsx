import DeleteAccount from '@/components/DeleteAccount';
import { useUserStore } from '@/lib/store';
import {
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material';
import { useState } from 'react';

type SettingsPage = 'default' | 'change password' | 'delete account';

const Settings = () => {
  const [currPage, setCurrPage] = useState<SettingsPage>('default');
  const { user, deleteUser } = useUserStore((state) => ({
    user: state.user,
    deleteUser: state.deleteUser,
  }));

  const renderPage = () => {
    switch (currPage) {
      case 'delete account':
        return <DeleteAccount />;
      case 'change password':
        return <div>Change password page</div>;
      default:
        return <div>Access your account settings by selecting one of the buttons on the left</div>;
    }
  };

  return (
    <Container className="main" maxWidth="lg" sx={{ height: '100vh' }}>
      <Typography variant="h4">Settings</Typography>
      <Grid container sx={{ height: '90%' }}>
        <Grid item xs={3}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setCurrPage('delete account')}>
                <ListItemText primary="Delete Account" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={() => setCurrPage('change password')}>
                <ListItemText primary="Change Password" />
              </ListItemButton>
            </ListItem>
          </List>
        </Grid>
        <Divider orientation="vertical" flexItem></Divider>
        <Grid item xs={8.9}>
          {renderPage()}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
