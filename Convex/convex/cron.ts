import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.interval(
  'processScheduledWhispers',
  { minutes: 1 },
  internal.whispers.processScheduledWhispers
);

crons.daily(
  'cleanupOldRateLimits',
  { hourUTC: 3, minuteUTC: 0 },
  internal.rateLimits.cleanupOldRateLimits
);

export default crons;
