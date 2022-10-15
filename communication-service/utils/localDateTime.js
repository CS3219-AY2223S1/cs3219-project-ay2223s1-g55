export const localDateTime = (createdAt) => {
  const localDate = new Date(createdAt.getTime() + 480 * 60000);
  return localDate;
};
