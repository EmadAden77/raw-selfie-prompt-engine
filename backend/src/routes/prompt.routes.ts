import { Router } from 'express';
import { postPrompt } from '../controllers/prompt.controller.js';
export const promptRouter=Router();
promptRouter.post('/',postPrompt);

