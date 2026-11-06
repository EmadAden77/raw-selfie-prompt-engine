export async function copyToClipboard(value:string):Promise<void>{
  if(navigator.clipboard?.writeText) {await navigator.clipboard.writeText(value);return;}
  const textarea=document.createElement('textarea');
  textarea.value=value;textarea.style.position='fixed';textarea.style.opacity='0';
  document.body.appendChild(textarea);textarea.select();
  try {if(!document.execCommand('copy')) throw new Error('Copy failed');}
  finally {textarea.remove();}
}
