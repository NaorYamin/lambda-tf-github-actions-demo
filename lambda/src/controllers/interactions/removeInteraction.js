import { Like, Dislike } from '../../models/index.js';
import {
  errorMessages,
  interactionFields,
  interactions,
} from '../../constants/index.js';
import { track } from '../../utils/index.js';
import { eventProps, eventTypes } from '../../constants/index.js';

const removeInteraction = async (req, res) => {
  const { interactionId } = req.params;
  const { interactionType = interactions.LIKE, deviceType } = req.body;

  try {
    const InteractionModel =
      interactionType === interactions.LIKE ? Like : Dislike;

    const interaction = await InteractionModel.findByIdAndRemove(interactionId);

    track(eventTypes.DELET_ANIMAL_FROM_LIST, {
      [eventProps.USER_ID]: interaction[interactionFields.USER_ID],
      [eventProps.ANIMAL_ID]: interaction[interactionFields.ANIMAL_ID],
      [eventProps.DEVICE_TYPE]: deviceType,
    });

    return res.status(200).json({ interactionId, interactionType });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: errorMessages.GENERAL_SERVER_ERROR });
  }
};

export default removeInteraction;
