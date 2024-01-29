import { check } from 'express-validator';
import { User } from '../../models/index.js';
import { userFields, errorMessages } from '../../constants/index.js';
import { formatEmail } from '../../utils/index.js';

export const duplicateUser = check(userFields.EMAIL).custom(async (email) => {
  // @TODO: check if user is active or unActive
  const user = await User.findOne({ email: formatEmail(email) });
  if (user) {
    throw new Error(errorMessages.EMAIL_ALREADY_EXISTS);
  }
});
