import {
  generateNewAccessToken,
  validateRefreshToken,
} from "../../utils/index.js";

const newAccessToken = async (req, res) => {
  const bearer = req.headers.authorization || req.cookies.refreshToken;
  const refreshToken = bearer?.replace("Bearer ", "");

  try {
    const { email } = await validateRefreshToken(refreshToken);
    const accessToken = generateNewAccessToken(email);
    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(401).send("Refresh token is incorrect or has expired");
  }
};

export default newAccessToken;
