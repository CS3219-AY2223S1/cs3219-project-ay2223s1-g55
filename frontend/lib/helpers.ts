import dayjs from 'dayjs';

export const stringToUrlFormat = (string) => {
  return string.toLowerCase().replaceAll(' ', '-');
};

export const getNextExperienceLevelMessage = (level, remainingPoints) => {
  if (level === 'Elite') {
    return 'You are officially a l33t coder. Congratulations!';
  }
  const nextLevelMap = {
    Beginner: 'Novice',
    Novice: 'Expert',
    Expert: 'Elite',
  };
  return `Obtain ${remainingPoints} more experience points to become a ${
    nextLevelMap[`${level}`]
  }.`;
};

export const formatDate = (date) => {
  return dayjs(date).format('DD MMM YYYY hh:mma');
};

export const validatePassword = (password) => {
  const trimmedPasword = password.trim();

  const uppercaseRegExp = /(?=.*?[A-Z])/;
  const lowercaseRegExp = /(?=.*?[a-z])/;
  const digitsRegExp = /(?=.*?[0-9])/;
  const specialCharRegExp = /(?=.*?[#?!@$%^&*-])/;
  const minLengthRegExp = /.{8,}/;
  const passwordLength = trimmedPasword.length;
  const uppercasePassword = uppercaseRegExp.test(trimmedPasword);
  const lowercasePassword = lowercaseRegExp.test(trimmedPasword);
  const digitsPassword = digitsRegExp.test(trimmedPasword);
  const specialCharPassword = specialCharRegExp.test(trimmedPasword);
  const minLengthPassword = minLengthRegExp.test(trimmedPasword);

  let errMsg = '';
  if (passwordLength === 0) {
    errMsg = 'Password is empty';
  } else if (!uppercasePassword) {
    errMsg = 'At least one Uppercase';
  } else if (!lowercasePassword) {
    errMsg = 'At least one Lowercase';
  } else if (!digitsPassword) {
    errMsg = 'At least one digit';
  } else if (!specialCharPassword) {
    errMsg = 'At least one Special Character';
  } else if (!minLengthPassword) {
    errMsg = 'A minimum of 8 characters is required';
  } else {
    errMsg = '';
  }

  return errMsg;
};
