import { app } from './app.js';
import { env } from './config/env.js';

// Inside a codespace only Vite (5173) is forwarded. The API (3001)
// listens on loopback and is reachable via Vite's same-origin /api proxy.
const host=process.env.CODESPACES==='true'?'127.0.0.1':'0.0.0.0';
const server=app.listen(env.port,host,()=>{
  console.info('Backend started on its configured private interface.');
});
function shutdown(){
  server.close(()=>process.exit(0));
  setTimeout(()=>process.exit(1),10000).unref();
}
process.on('SIGINT',shutdown);
process.on('SIGTERM',shutdown);
