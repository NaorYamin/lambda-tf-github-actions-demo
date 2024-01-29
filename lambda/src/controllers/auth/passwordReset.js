import { verifyConfirmationCode } from '../../utils/index.js';
import { generateNewTokens, userResponseFormatter } from '../../utils/index.js';
import { errorMessages } from '../../constants/index.js';

const passwordReset = async (req, res) => {
  try {
    const { email, code, password } = req.body;
    const { user, isMatch } = await verifyConfirmationCode(
      email,
      code,
      password,
    );
    if (isMatch) {
      const { accessToken, refreshToken } = generateNewTokens(email);
      return res.status(200).json({
        user: userResponseFormatter(user),
        accessToken,
        refreshToken,
      });
    }
    return res
      .status(404)
      .json({ error: errorMessages.VERIFICATION_CODE_INCORRECT });
  } catch (err) {
    res.status(500).json({ error: errorMessages.GENERAL_SERVER_ERROR });
  }
};

export default passwordReset;
