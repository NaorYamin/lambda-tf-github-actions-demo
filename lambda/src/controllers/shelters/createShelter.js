import bcrypt from 'bcryptjs';
import { Shelter, User } from '../../models/index.js';
import { userFields, shelterFields, roles } from '../../constants/index.js';
import { errorMessages } from '../../constants/index.js';
import { track } from '../../utils/index.js';
import { eventProps, eventTypes } from '../../constants/index.js';

const addUserToDb = async ({ email, password, shelterId, deviceType }) => {
  const encryptedPassword = await bcrypt.hash(password, 10);
  const user = User.create({
    [userFields.EMAIL]: email,
    [userFields.PASSWORD]: encryptedPassword,
    [userFields.ROLE]: roles.SHELTER,
    [userFields.COMPLETED_ON_BOARD_QUESTIONS]: true,
    [userFields.ACTIVE]: true,
    [userFields.SHELTER_ID]: shelterId,
  });

  track(eventTypes.REGISTRATION, {
    [eventProps.USER_ID]: user._id,
    [eventProps.DEVICE_TYPE]: deviceType,
    [eventProps.USER_ROLE]: user.role,
  });

  return user;
};

const addShelterToDb = async ({ name, identifierNumber, contactInfo }) => {
  return await Shelter.create({
    [shelterFields.NAME]: name,
    [shelterFields.IDENTIFIER_NUMBER]: identifierNumber,
    [shelterFields.CONTACT_INFO]: contactInfo,
  });
};

const createShelter = async (req, res) => {
  const { name, identifierNumber, contactInfo, email, password, deviceType } =
    req.body;
  try {
    // @TODO: Send email - You've just created a new shelter
    const shelter = await addShelterToDb({
      name,
      identifierNumber,
      contactInfo,
    });
    const user = await addUserToDb({
      email,
      password,
      shelterId: shelter._id,
      deviceType,
    });

    return res.status(200).json({ shelter, userEmail: user[userFields.EMAIL] });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: errorMessages.GENERAL_SERVER_ERROR });
  }
};

export default createShelter;
