import { init } from "@amplitude/analytics-node";

export const analyticsInit = () => {
  try {
    init(process.env.AMPLITUDE_API_KEY).promise;
  } catch (err) {
    console.log("Analytics connection failed");
    console.error(err);
  }
};
