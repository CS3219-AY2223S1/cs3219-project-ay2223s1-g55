export const convertQueryTitleToTitle = (queryTitle) => {
  const tokens = queryTitle.split('-');

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    tokens[i] = token.charAt(0).toUpperCase() + token.substring(1);
  }

  const title = tokens.join(' ');
  return title;
};
