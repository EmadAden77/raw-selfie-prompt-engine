import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';
export const promptLimiter=rateLimit({
  windowMs:env.rateLimitWindowMs,
  limit:env.rateLimitMax,
  standardHeaders:'draft-7',
  legacyHeaders:false,
  message:{error:'طلبات كثيرة. حاول لاحقًا.'}
});

