const validEmail = (email: string) => {
  if (email) {
    return /^[a-z0-9\-._+]+@(?:[a-z0-9\-_]+\.)+[a-z0-9\-_]{2,99}$/i.test(email);
  }
  return true;
};
export default validEmail;
