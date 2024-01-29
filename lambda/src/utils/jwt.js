import jwt from "jsonwebtoken";

export const generateNewAccessToken = (email) =>
  generateNewToken(email, process.env.ACCESS_TOKEN_SECRET_KEY, "2h");

export const generateNewRefreshToken = (email) =>
  generateNewToken(email, process.env.REFRESH_TOKEN_SECRET_KEY, "365d");

const generateNewToken = (email, secretKey, expiresIn) => {
  console.log("jwt => ", email, secretKey);
  const token = jwt.sign({ email: email }, secretKey, {
    expiresIn,
  });
  return token;
};

export const generateNewTokens = (email) => {
  const accessToken = generateNewAccessToken(email);
  const refreshToken = generateNewRefreshToken(email);
  return { accessToken, refreshToken };
};

export const validateRefreshToken = async (token) => {
  try {
    const data = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET_KEY);
    return data;
  } catch (err) {
    console.error(err);
    return;
  }
};
