import { createNodeMailerAwsTransporter } from './index.js';
import User from '../models/user.js';
import { userFields } from '../constants/index.js';
import bcrypt from 'bcryptjs';

const gernerateMessage = (code) => `Confirmation Code: ${code}
Please enter this code on the confirmation page to verify your email address. If you did not request this registration, please ignore this email.`;

const sendEmail = async (email, code) => {
  const transporter = createNodeMailerAwsTransporter();
  transporter.sendMail(
    {
      from: 'adoptmecoil@gmail.com',
      to: email,
      subject: 'Adopt Me confirmation code',
      text: gernerateMessage(code),
    },
    (err, info) => {
      if (err) {
        console.error('sendEmailError => ', err);
      }
      if (info) {
        console.log('EmailSentSuccessfully to => ', info?.envelope.to);
      }
    },
  );
};

const generateCode = () => Math.floor(100000 + Math.random() * 900000);

const verifyUserInDB = async (user) => {
  await user.updateOne({
    active: true,
    emailConfirmationCode: null,
  });
};

const updateConfirmationCodeInDB = async (user, code) => {
  await user.updateOne({
    emailConfirmationCode: code,
  });
};

export const sendEmailConfirmationCode = async (email, updateUser) => {
  const sixDigitsCode = generateCode();
  sendEmail(email, sixDigitsCode);
  if (updateUser) {
    const user = await User.findOne({ email });
    updateConfirmationCodeInDB(user, sixDigitsCode);
  }
  return sixDigitsCode;
};

export const verifyConfirmationCode = async (email, code, password) => {
  try {
    const user = await User.findOne({ email });

    if (!user || code !== user?.emailConfirmationCode) return;

    await verifyUserInDB(user);
    if (password) {
      const encryptedPassword = await bcrypt.hash(password, 10);
      await user.updateOne({ [userFields.PASSWORD]: encryptedPassword });
    }
    return { user, isMatch: true };
  } catch (err) {
    console.error('verifyConfirmationCode => ', err);
    return;
  }
};
