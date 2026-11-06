// Non-secret CI smoke test: exercises Vite => Express routing exactly as in Codespaces.
import { spawn } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const root=fileURLToPath(new URL('../',import.meta.url));
const origin='https://private-smoke-test-5173.app.github.dev';
const env={...process.env,CODESPACES:'true',CODESPACE_NAME:'private-smoke-test'};
const children=[];
function run(script) {
  const processRef=spawn('npm',['run',script],{
    cwd:root,detached:true,stdio:'ignore',env
  });
  children.push(processRef);
}
async function waitFor(url,expectedStatus=200){
  const start=Date.now();
  while(Date.now()-start<45000){
    try {
      const response=await fetch(url);
      if(response.status===expectedStatus)return response;
    } catch {}
    await new Promise(resolve=>setTimeout(resolve,550));
  }
  throw new Error('Local private port did not become ready: '+url);
}
function stop(){
  for(const child of children){
    if(child.pid) {
      try {process.kill(-child.pid,'SIGTERM');}catch{}
    }
  }
}
try {
  const keyField=await readFile(new URL('../frontend/src/components/layout/NvidiaKeyField.tsx',import.meta.url),'utf8');
  const rtl=await readFile(new URL('../frontend/src/styles/rtl.css',import.meta.url),'utf8');
  assert.match(keyField,/dir="ltr"/);
  assert.match(keyField,/onPaste=\{paste\}/);
  assert.match(rtl,/key-input.*direction:ltr/);
  run('dev:backend');
  await waitFor('http://127.0.0.1:3001/health');
  run('dev:frontend');
  const html=await (await waitFor('http://127.0.0.1:5173/')).text();
  assert.match(html,/lang="ar" dir="rtl"/);
  const selectionKeys={
    locations:'location-1',clothing:'clothing-1',
    expressions:'expression-1',hairstyles:'hair-1',
    selfieAngles:'angle-1',poses:'pose-1',
    carConditions:'clean-2',lighting:'light-1'
  };
  const response=await fetch('http://127.0.0.1:5173/api/prompt',{
    method:'POST',
    headers:{'Content-Type':'application/json',Origin:origin},
    body:JSON.stringify({selections:selectionKeys,variation:1})
  });
  assert.equal(response.status,200,'Vite proxy/Backend did not accept the private Codespaces origin');
  const data=await response.json();
  assert.equal(data.source,'local');
  assert.equal(data.reason,'no_key');
  assert.match(data.prompt,/^ChatGPT, using the reference image I uploaded/);
  assert.match(data.prompt,/2022 Range Rover Sport/);
  assert.doesNotMatch(data.prompt,/[\u0600-\u06ff]/);
  console.log('Codespaces private-port proxy smoke test passed (simulated origin, no NVIDIA key).');
}finally{stop();}
