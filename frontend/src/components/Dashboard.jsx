import { useState } from 'react';
import { Button, FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../context/session.context';
import DefaultLayout from '../layouts/DefaultLayout';
import { STATUS_CODE_LOGGED_OUT } from '../constants';

function Dashboard() {
  const navigate = useNavigate();
  const [difficulty, setDifficulty] = useState('');
  const { user, logout } = useSession();

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  const handleLogout = async () => {
    const res = await logout();
    if (res?.status === STATUS_CODE_LOGGED_OUT) {
      navigate('/login');
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
          item
          xs={6}
          justifySelf="flex-end"
          sx={{ display: 'flex', justifyContent: 'flex-end' }}
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
      </Grid>
    </DefaultLayout>
  );
}

export default Dashboard;
