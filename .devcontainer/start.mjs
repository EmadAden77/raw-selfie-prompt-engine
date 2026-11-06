// Runs automatically on Codespaces startup. No user commands or API tokens needed.
import { spawn } from 'node:child_process';
import { connect } from 'node:net';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const host = '127.0.0.1';

async function isListening(port) {
  return new Promise(resolve => {
    const socket = connect({ host, port });
    const done = value => { socket.destroy(); resolve(value); };
    socket.once('connect', () => done(true));
    socket.once('error', () => done(false));
    socket.setTimeout(750, () => done(false));
  });
}

function launch(command) {
  const child = spawn('npm', ['run', command], {
    cwd: root,
    detached: true,
    stdio: 'ignore',
    env: process.env,
  });
  child.unref();
}

if (!(await isListening(3001))) launch('dev:backend');
if (!(await isListening(5173))) launch('dev:frontend');
// Codespaces itself forwards port 5173 privately by default.
