import { MouseEvent as ReactMouseEvent, useState } from 'react';
import {
  Avatar,
  FormControl,
  Grid,
  Button,
  IconButton,
  InputLabel,
  ListItemIcon,
  Menu,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from '@mui/material';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import DefaultLayout from '@/layouts/DefaultLayout';
import { STATUS_CODE_LOGGED_OUT } from '@/lib/constants';
import router from 'next/router';
import useUserStore from '@/lib/store';
import { clearJwt, getJwtCookie } from '@/lib/cookies';
import UnauthorizedDialog from '@/components/UnauthorizedDialog';
import ProfileAvatarButton from '@/components/defaultLayout/ProfileAvatarButton';
import QuestionList from '@/components/QuestionList';

function Dashboard() {
  const [difficulty, setDifficulty] = useState('');

  const { user, logout } = useUserStore((state) => ({
    user: state.user,
    logout: state.logoutUser,
  }));

  const handleDifficultyChange = (e: SelectChangeEvent<string>) => {
    setDifficulty(e.target.value);
  };

  const handleMatching = async () => {
    router.push('/match');
  };

  if (!user.loginState) return <UnauthorizedDialog />;

  const handleChangePassword = () => {
    router.push('/change-password');
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
          xs={12}
          justifySelf="center"
          sx={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}
        >
          <Button
            id="matching_button"
            variant="contained"
            onClick={handleMatching}
            sx={{ height: '100%' }}
          >
            Match
          </Button>
        </Grid>
      </Grid>
      <QuestionList />
    </DefaultLayout>
  );
}

export default Dashboard;
