import User from '../../models/user.js';
import bcrypt from 'bcryptjs';
import {
  formatEmail,
  generateNewTokens,
  userResponseFormatter,
} from '../../utils/index.js';
import { errorMessages, userFields } from '../../constants/index.js';
import { track } from '../../utils/index.js';
import { eventProps, eventTypes } from '../../constants/index.js';

const login = async (req, res) => {
  try {
    const { email: reqEmail, password, deviceType } = req.body;

    const email = formatEmail(reqEmail);
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({
        error: errorMessages.USER_NOT_FOUND,
        fields: { [userFields.EMAIL]: true },
      });
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched)
      return res.status(401).json({
        error: errorMessages.INVALID_PASSWORD,
        fields: { [userFields.PASSWORD]: true },
      });

    const { accessToken, refreshToken } = generateNewTokens(email);

    track(eventTypes.LOGIN, {
      [eventProps.USER_ID]: user._id,
      [eventProps.DEVICE_TYPE]: deviceType,
      [eventProps.USER_ROLE]: user.role,
    });

    res.status(200).json({
      user: userResponseFormatter(user),
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: errorMessages.GENERAL_SERVER_ERROR });
  }
};

export default login;
