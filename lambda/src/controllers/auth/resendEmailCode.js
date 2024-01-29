import { formatEmail, sendEmailConfirmationCode } from '../../utils/index.js';

const resendEmailCode = async (req, res) => {
  try {
    const { email } = req.body;
    sendEmailConfirmationCode(formatEmail(email), true);
    return res.status(201).json({ codeSent: true });
  } catch (err) {
    return res.status(404).json({ codeSent: false });
  }
};

export default resendEmailCode;
