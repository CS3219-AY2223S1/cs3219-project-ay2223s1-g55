import useUserStore from '@/lib/store';
import { LinearProgress, Box, Stack } from '@mui/material';
import { getExperience } from 'api';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import { getNextExperienceLevelMessage } from '@/lib/helpers';
import { MAX_EXP } from '@/lib/constants';

function LinearProgressWithLabel({
  value,
  maxExp,
  ...props
}: LinearProgressProps & { value: number; maxExp: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant='determinate' value={(value / maxExp) * 100} {...props} />
      </Box>
      <Box sx={{ minWidth: 100 }}>
        <Typography variant='body2' color='text.secondary'>{`${value}/${maxExp} XP`}</Typography>
      </Box>
    </Box>
  );
}

const selector = (state: any) => ({ user: state.user });

const ExperienceLevel = () => {
  const { user } = useUserStore(selector);
  const [experience, setExperience] = useState({
    experienceLevel: 'Beginner',
    experiencePoints: 0,
  });
  const { experienceLevel, experiencePoints } = experience;
  const maxExp = MAX_EXP[`${experience.experienceLevel}`];

  useEffect(() => {
    const fetchExperience = async () => {
      const _experience = await getExperience(user.username);
      setExperience(_experience);
    };
    if (user?.loginState) fetchExperience();
  }, [user?.loginState]);

  return (
    <Stack spacing='xs' sx={{ marginBottom: 5 }}>
      <h2>{experienceLevel}</h2>
      <LinearProgressWithLabel value={experiencePoints} maxExp={maxExp} />
      <p style={{ fontSize: 14 }}>
        {getNextExperienceLevelMessage(experienceLevel, maxExp - experiencePoints)}
      </p>
    </Stack>
  );
};

export default ExperienceLevel;
