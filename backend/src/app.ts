import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { promptRouter } from './routes/prompt.routes.js';
import { errorHandler, notFound } from './middleware/error-handler.js';
import { promptLimiter } from './middleware/rate-limiter.js';

function isOwnPrivateCodespaceOrigin(origin:string):boolean{
  if(process.env.CODESPACES!=='true'||!process.env.CODESPACE_NAME)return false;
  // Exact Codespaces creator URL: reject other codespaces and non-HTTPS origins.
  return origin==='https://'+process.env.CODESPACE_NAME+'-5173.app.github.dev';
}
export const app=express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({
  origin(origin,callback){
    if(!origin||env.corsOrigins.includes(origin)||isOwnPrivateCodespaceOrigin(origin))
      return callback(null,true);
    return callback(new Error('Origin is not allowed'));
  },
  methods:['GET','POST'],
  allowedHeaders:['Content-Type']
}));
app.use(express.json({limit:'32kb',strict:true}));
app.get('/health',(_req,res)=>res.json({status:'ok'}));
app.use('/api/prompt',promptLimiter,promptRouter);
app.use(notFound);
app.use(errorHandler);
