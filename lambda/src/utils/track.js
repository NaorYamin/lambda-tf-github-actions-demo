import { track as amplitudeTrack } from '@amplitude/analytics-node';
import { eventProps } from '../constants/index.js';

export const track = async (eventName, properties = {}) => {
  try {
    const { userId, USER_ID, user_id, ...rest } = properties;
    await amplitudeTrack(eventName, rest, {
      [eventProps.USER_ID]: (userId || USER_ID || user_id).toString(),
      [eventProps.PLATFORM]: 'Server',
    }).promise;
  } catch (error) {
    console.error('AnalyticsTrackError => ', error);
  }
};
