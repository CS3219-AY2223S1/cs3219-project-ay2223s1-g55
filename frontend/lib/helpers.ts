import dayjs from 'dayjs';

export const stringToUrlFormat = (string) => {
  return string.toLowerCase().replaceAll(' ', '-');
};

export const getNextExperienceLevelMessage = (level, remainingPoints) => {
  if (level === 'Elite') {
    return 'You are officially a l33t coder. Congratulations!';
  }
  let nextLevel;
  if (level === 'Beginner') {
    nextLevel = 'Novice';
  } else if (level === 'Novice') {
    nextLevel = 'Expert';
  } else if (level === 'Expert') {
    nextLevel = 'Elite';
  }
  return `Obtain ${remainingPoints} more experience points to become a ${nextLevel}.`;
};

export const formatDate = (date) => {
  return dayjs(date).format('DD MMM YYYY hh:mma');
};
