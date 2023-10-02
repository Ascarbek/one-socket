import { IHandlers, IProtocol, ProtocolSchema } from './types.js';
import { socketWrapper } from './Server/socketWrapper.js';
import * as process from 'process';
import { processMessage } from './Server/requestParser.js';

let _protocol: IProtocol;
let _handlers: IHandlers;

export const getProtocol = () => {
  return _protocol;
};

export const getHandlers = () => {
  return _handlers;
};

export const OneSocketServer = (host: string, port: number, protocol: IProtocol, handlers: IHandlers) => {
  const protocolParse = ProtocolSchema.safeParse(protocol);

  if (!protocolParse.success) {
    console.log('protocolParse error: ', protocolParse.error.errors[0].message);
    process.exit(1);
  } else {
    _protocol = protocol;
    _handlers = handlers;
  }

  socketWrapper(host, port, processMessage);
};
