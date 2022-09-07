import { useState } from 'react';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import DefaultLayout from '../layouts/DefaultLayout';
import { STATUS_CODE_DELETED, STATUS_CODE_LOGGED_OUT } from '../constants';

function Dashboard() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('');
  const { user, logout, deleteUser } = useSession();

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleLogout = async () => {
    const res = await logout();
    if (res?.status === STATUS_CODE_LOGGED_OUT) {
      navigate('/login');
    }
  };

  const handleDeleteUser = async () => {
    const res = await deleteUser();
    if (res?.status === STATUS_CODE_DELETED) {
      navigate('/signup');
    }
  };

  return (
    <DefaultLayout>
      <Grid container alignItems="center" justifyContent="center">
        <Grid item xs={6}>
          <div id="difficulty_selector" style={{ width: '30%' }}>
            <FormControl fullWidth>
              <InputLabel>Difficulty</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={difficulty}
                label="Difficulty"
                onChange={handleDifficultyChange}
              >
                <MenuItem value="Easy">Easy</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </div>
        </Grid>
        <Grid
          container
          item
          xs={6}
          justifySelf="flex-end"
          sx={{ display: 'flex', justifyContent: 'flex-end' }}
        >
          <Grid
            item
            xs={12}
            justifySelf="center"
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              id="logout_button"
              variant="contained"
              onClick={handleLogout}
              sx={{ height: '100%' }}
            >
              LOG OUT
            </Button>
          </Grid>
          <Grid
            item
            xs={12}
            justifySelf="center"
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <Button
              id="delete_account_button"
              variant="contained"
              onClick={handleDeleteUser}
              sx={{ height: '100%' }}
            >
              DELETE
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </DefaultLayout>
  );
}

export default Dashboard;
