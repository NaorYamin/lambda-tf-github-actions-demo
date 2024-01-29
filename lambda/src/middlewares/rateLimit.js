import { rateLimit as expressRateLimit } from 'express-rate-limit';

const TIME = 60 * 30 * 1000; // 0.5 hour

export const rateLimit = expressRateLimit({
  windowMs: TIME,
  limit: 10, // Limit each IP to 10 create account requests per `window` per TIME
  message: 'Too many tries, Please try again in an hour',
  standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
