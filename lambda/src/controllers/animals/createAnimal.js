import { Branch, Animal } from '../../models/index.js';
import { branchFields, errorMessages } from '../../constants/index.js';
import { animalFields } from '../../constants/index.js';
import { getBirthdayTimestamp } from '../../utils/age.js';
import { uploadImagesToS3 } from '../../utils/uploadImagesToS3.js';
import { track } from '../../utils/index.js';
import { eventProps, eventTypes } from '../../constants/index.js';

const updateBranchAnimalCount = async (_id) =>
  await Branch.findOneAndUpdate(
    { _id },
    { $inc: { [branchFields.ANIMAL_COUNT]: 1 } },
    { new: true },
  );

const addAnimalToDb = async ({
  animal,
  images,
  userId,
  branchId,
  shelterId,
}) => {
  const {
    name,
    breed,
    gender,
    description,
    years = 0,
    months = 0,
    size,
    hypoallergenic,
    neutered,
    vaccinated,
    type = 'dog',
  } = animal;

  const birthDayTimestamp = getBirthdayTimestamp(years, months);

  return await Animal.create({
    [animalFields.NAME]: name,
    [animalFields.GENDER]: gender,
    [animalFields.TYPE]: type,
    [animalFields.BREED]: breed,
    [animalFields.DESCRIPTION]: description,
    [animalFields.SIZE]: size,
    [animalFields.BIRTH_DAY]: birthDayTimestamp,
    [animalFields.HYPOALLERGENIC]: hypoallergenic,
    [animalFields.NEUTERED]: neutered,
    [animalFields.VACCINATED]: vaccinated,
    [animalFields.USER_ID]: userId,
    [animalFields.BRANCH_ID]: branchId,
    [animalFields.SHELTER_ID]: shelterId,
    [animalFields.IMAGES]: images,
  });
};

const createAnimal = async (req, res) => {
  const {
    animal,
    userId,
    branchId,
    shelterId,
    deviceType,
    userRole,
    startTimestamp,
    finishTimestamp,
  } = req.body;
  try {
    // @TODO: Send email - You've just created an animal
    const images = await uploadImagesToS3({
      images: req.files,
      route: 'Animals',
    });
    const animalDoc = await addAnimalToDb({
      animal: JSON.parse(animal),
      images,
      userId: userId,
      branchId: branchId,
      shelterId: shelterId,
    });
    if (branchId) updateBranchAnimalCount(branchId);

    track(eventTypes.CREATE_ANIMAL, {
      [eventProps.USER_ID]: userId,
      [eventProps.ANIMAL_ID]: animalDoc._id,
      [eventProps.DEVICE_TYPE]: deviceType,
      [eventProps.USER_ROLE]: userRole,
      [eventProps.START]: startTimestamp,
      [eventProps.FINISH]: finishTimestamp,
    });

    return res
      .status(200)
      .json({ animal: animalDoc, userId, branchId, shelterId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: errorMessages.GENERAL_SERVER_ERROR });
  }
};

export default createAnimal;
