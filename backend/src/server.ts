import { app } from './app.js';
import { env } from './config/env.js';

const server=app.listen(env.port,'0.0.0.0',()=>{
  // Do not log environment secrets or any user input.
  console.info('Backend is listening on port '+env.port);
});
function shutdown(){
  server.close(()=>process.exit(0));
  setTimeout(()=>process.exit(1),10000).unref();
}
process.on('SIGINT',shutdown);
process.on('SIGTERM',shutdown);

