import { IHandlers, IProtocol, ProtocolSchema } from './types.js';
import * as process from 'process';

let _protocol: IProtocol;

let _host: string;
let _port: number;

export const getHost = () => {
  return _host;
};

export const getPort = () => {
  return _port;
};

export const client = (host: string, port: number, protocol: IProtocol) => {
  _host = host;
  _port = port;

  const protocolParse = ProtocolSchema.safeParse(protocol);

  if (!protocolParse.success) {
    console.log('protocolParse error: ', protocolParse.error.errors[0].message);
    process.exit(1);
  } else {
    _protocol = protocol;
    /*handlers = new Proxy(_handlers, {
      get(t,p,r){
        console.log('get handler: ', p);
        return t[p as string];
      }
    });*/
  }

  // socketWrapper(host, port);
};
