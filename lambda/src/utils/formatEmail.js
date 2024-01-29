export const formatEmail = (email) => {
  if (!email) return;
  return email.trim().toLowerCase();
};
