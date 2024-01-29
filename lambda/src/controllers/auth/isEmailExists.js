import User from '../../models/user.js';
import { errorMessages } from '../../constants/index.js';
import { formatEmail } from '../../utils/index.js';

const isEmailExists = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: formatEmail(email) });
    if (user) {
      return res.status(200).json({
        emailExists: true,
      });
    }
    return res.status(404).json({
      error: errorMessages.USER_NOT_FOUND,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: errorMessages.GENERAL_SERVER_ERROR });
  }
};

export default isEmailExists;
