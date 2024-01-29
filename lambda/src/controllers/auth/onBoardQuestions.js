import User from '../../models/user.js';
import { userFields } from '../../constants/index.js';
import { track } from '../../utils/index.js';
import { eventProps, eventTypes } from '../../constants/index.js';

const onBoardQuestions = async (req, res) => {
  try {
    const {
      userId,
      questionsData,
      startTimestamp,
      finishTimestamp,
      deviceType,
    } = req.body;
    const user = await User.findByIdAndUpdate(userId, {
      [userFields.COMPLETED_ON_BOARD_QUESTIONS]: questionsData,
    });

    track(eventTypes.ON_BOARD, {
      [eventProps.USER_ID]: userId,
      [eventProps.DEVICE_TYPE]: deviceType,
      [eventProps.USER_ROLE]: user.role,
      [eventProps.START]: startTimestamp,
      [eventProps.FINISH]: finishTimestamp,
    });

    return res.status(200).json({
      message: 'OnBoarding submited successfully',
    });
  } catch (err) {
    res.status(500).send('Sever issue');
  }
};

export default onBoardQuestions;
