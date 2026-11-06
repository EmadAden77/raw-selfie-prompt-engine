export default function health(_request: unknown, response: {status: (code:number)=>{json:(data:unknown)=>void}}) {
  response.status(200).json({ status: 'ok' });
}
