import * as net from 'node:net';
import { getHost, getPort } from '../client.js';

export const sendRequest: (params: string) => Promise<string> = (params: string) => {
  const host = getHost();
  const port = getPort();

  return new Promise((resolve, reject) => {
    const client = net.createConnection({ host, port }, async () => {
      client.write(params + '\n');
    });

    let buffer = '';
    client.on('data', (data) => {
      buffer += data.toString();
      if (data.toString().substring(data.toString().length - 1) !== '\n') {
        return;
      }
      client.end();

      resolve(buffer);
    });

    client.on('error', (err) => {
      console.log('oh oh...  ', err);
      reject(err);
    });
  });
};
