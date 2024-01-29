import { GENERAL_SERVER_ERROR } from '../../constants/errorMessages/index.js';
import { eventProps, eventTypes } from '../../constants/index.js';
import { track } from '../../utils/index.js';
import { Animal } from '../../models/index.js';

const toggleActiveStatus = async (req, res) => {
  const { animalId } = req.params;
  const { userId, deviceType, userRole } = req.body;

  try {
    const animal = await Animal.findById(animalId);

    track(
      animal.active ? eventTypes.FREEZE_ANIMAL : eventTypes.RELEASE_ANIMAL,
      {
        [eventProps.USER_ID]: userId,
        [eventProps.ANIMAL_ID]: animalId,
        [eventProps.DEVICE_TYPE]: deviceType,
        [eventProps.USER_ROLE]: userRole,
      },
    );

    animal.active = !animal.active;
    const updatedAnimal = await animal.save();

    return res.status(200).json({ animal: updatedAnimal });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: GENERAL_SERVER_ERROR });
  }
};

export default toggleActiveStatus;
