import { errorMessages } from '../../constants/index.js';
import { verifyConfirmationCode } from '../../utils/index.js';
import { track } from '../../utils/index.js';
import { eventProps, eventTypes } from '../../constants/index.js';

const verifyEmailCode = async (req, res) => {
  try {
    const { email, code, deviceType } = req.body;
    const { user, isMatch } = await verifyConfirmationCode(email, code?.trim());

    if (isMatch)
      track(eventTypes.REGISTRATION, {
        [eventProps.USER_ID]: user._id,
        [eventProps.DEVICE_TYPE]: deviceType,
        [eventProps.USER_ROLE]: user.role,
      });

    return res.status(201).json({ isMatch });
  } catch (err) {
    res.status(500).json({ error: errorMessages.GENERAL_SERVER_ERROR });
  }
};

export default verifyEmailCode;
