import type { Request, Response, NextFunction } from 'express';
import { parsePromptRequest } from '../schemas/prompt-request.schema.js';
import { generatePrompt } from '../services/prompt.service.js';
import { authorizeNvidiaOwner } from '../security/owner-access.js';

export async function postPrompt(req:Request,res:Response,next:NextFunction){
  try{
    const data=parsePromptRequest(req.body);
    const result=await generatePrompt(data,authorizeNvidiaOwner(req.get('X-Nvidia-Owner-Token')));
    res.setHeader('Cache-Control','no-store');
    res.status(200).json(result);
  }catch(error){next(error);}
}

