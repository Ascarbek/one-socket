import * as net from 'node:net';
import * as process from 'process';
import {z, ZodObject} from "zod";
import {IProtocol} from "../test.js";


const incoming  = z.object({
  type: z.string(),
  payload: z.any(),
});

const outComing = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
  }).merge(z.object({
    access: z.string(),
  })),
  z.object({
    success: z.literal(false),
    errorMsg: z.string(),
  }),
]);

let list:IProtocol;
let handlers:{[keys: string]: (params:any) => Promise<any>};

export const processMessage = async (msg:string) => {
  let raw: any;
  try{
    raw = JSON.parse(msg);
  }
  catch (e) {
    return {success: false, errorMsg: 'Invalid request payload'};
  }

  const type = raw.type;
  if(!list[type]){
    return {success: false, errorMsg: 'Request not found'};
  }
  if(!handlers[type]){
    return {success: false, errorMsg: 'Handler not found'};
  }

  const resp =await handlers[type](raw.payload);


  return {success: true, payload: resp};
}

export const socketWrapper = (_list:IProtocol, _handlers:{[keys: string]: () => void}) => {
list = _list;
handlers = _handlers;

 /* const server = net.createServer((socket) => {
    let buffer = '';
    socket.on('data', async (data) => {
      buffer += data.toString();
      if (data.toString().substring(data.toString().length - 1) !== '\n') {
        return;
      }

      const request = buffer;
      if (!request) {
        socket.write(JSON.stringify({ success: false, error: 'Invalid request payload' }));
        return;
      }

      // console.log('request: ', request.type);

      const response = await dataCallback(request);
      socket.write(response);
    });

    socket.on('end', () => {});

    socket.on('error', (err) => {
      console.error('oh oh...  ', err);
      process.exit(1);
    });
  });

  if (!port) {
    console.error('port is not defined in environment variables');
    return;
  }

  server.listen(port,host, () => {
    console.log(`Qaltam Data Server started at port ${port}`);
  });*/
};
