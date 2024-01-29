import { User } from '../../models/index.js';
import { check } from 'express-validator';
import { userFields, errorMessages } from '../../constants/index.js';
import { formatEmail } from '../../utils/index.js';

export const userExists = check(userFields.EMAIL).custom(async (email) => {
  const user = await User.findOne({ email: formatEmail(email) });
  if (!user) {
    throw new Error(errorMessages.USER_NOT_FOUND);
  }
});
