import { listener } from './Server/listener.js';
import {ZodObject} from "zod";



export interface IHandlers {
  [keys:string]: (data: any) => Promise<any>;
}

const oneSocket = {
  server: (host: string, port: number) => {
    // listener(host, port);
  },
  client: (host: string, port: number) => {
    console.log('client');
  },
};

export default oneSocket;
