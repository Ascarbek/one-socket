import * as net from 'node:net';
import { z } from 'zod';

const incomingSchema = z.object({
  type: z.string(),
  payload: z.any(),
});

export const OneSocketClient: (host: string, port: number, params: any) => Promise<string> = (host, port, params) => {
  return new Promise((resolve, reject) => {
    const incomingParseResult = incomingSchema.safeParse(params);
    if (!incomingParseResult.success) {
      const errors = incomingParseResult.error.errors;
      console.log(errors);
      return reject(errors[errors.length - 1].message);
    }

    const client = net.createConnection({ host, port }, async () => {
      client.write(JSON.stringify(params) + '\n');
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
