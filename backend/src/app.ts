import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { promptRouter } from './routes/prompt.routes.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { promptLimiter } from './middleware/rate-limiter.js';

const publicPagesOrigin = 'https://emadaden77.github.io';

function isOwnPrivateCodespaceOrigin(origin:string):boolean{
  if(process.env.CODESPACES!=='true'||!process.env.CODESPACE_NAME)return false;
  // Exact Codespaces creator URL: reject other codespaces and non-HTTPS origins.
  return origin==='https://'+process.env.CODESPACE_NAME+'-5173.app.github.dev';
}
export const app=express();
app.disable('x-powered-by');
// Vercel terminates HTTPS and forwards the client IP through one trusted proxy.
// Keep local development unproxied; never trust arbitrary forwarded headers globally.
if (process.env.VERCEL === '1') app.set('trust proxy', 1);
app.use((helmet as unknown as () => import('express').RequestHandler)());
app.use(cors({
  origin(origin,callback){
    if(!origin||origin===publicPagesOrigin||env.corsOrigins.includes(origin)||isOwnPrivateCodespaceOrigin(origin))
      return callback(null,true);
    return callback(new Error('Origin is not allowed'));
  },
  methods:['GET','POST'],
  allowedHeaders:['Content-Type','X-Nvidia-Owner-Token']
}));
app.use(express.json({limit:'32kb',strict:true}));
app.get('/health',(_req,res)=>res.json({status:'ok'}));
app.use('/api/prompt',promptLimiter,promptRouter);
app.use(notFound);
app.use(errorHandler);

// Vercel's Express framework expects a default-exported request handler.
export default app;
