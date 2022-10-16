import useUserStore from '@/lib/store';
import { LinearProgress, Box, Stack } from '@mui/material';
import { getExperience } from 'api';
import { useEffect, useState } from 'react';
import * as React from 'react';
import { LinearProgressProps } from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';

const MAX_EXP = 200; // TODO: figure out max exp per experience level.

function LinearProgressWithLabel({ value, ...props }: LinearProgressProps & { value: number }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 100 }}>
        <Typography variant="body2" color="text.secondary">{`${value}/${MAX_EXP} XP`}</Typography>
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

  useEffect(() => {
    const fetchExperience = async () => {
      const _experience = await getExperience(user.username);
      setExperience(_experience);
    };
    if (user?.loginState) fetchExperience();
  }, [user?.loginState]);

  return (
    <Stack spacing="xs" sx={{ marginBottom: 5 }}>
      <h2>{experienceLevel}</h2>
      {/* TODO: instead of hardcoding novice, find a way to determine the next experience level. */}
      <LinearProgressWithLabel value={experiencePoints} />
      <p style={{ fontSize: 14 }}>
        Obtain {MAX_EXP - experiencePoints} more experience points to become a Novice
      </p>
    </Stack>
  );
};

export default ExperienceLevel;
