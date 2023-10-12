import * as net from 'node:net';
import { z } from 'zod';
import { TResponse } from '../types.js';

const incomingSchema = z.object({
  type: z.string(),
  payload: z.any(),
});

const outgoingSchema = z.discriminatedUnion('success', [
  z.object({
    success: z.literal(true),
    payload: z.any(),
  }),
  z.object({
    success: z.literal(false),
    errorMsg: z.string(),
  }),
]);

export const OneSocketClient: (host: string, port: number, params: any) => Promise<TResponse<any>> = (
  host,
  port,
  params
) => {
  return new Promise((resolve) => {
    const incomingParseResult = incomingSchema.safeParse(params);
    if (!incomingParseResult.success) {
      const errors = incomingParseResult.error.errors;
      console.log(errors);
      return resolve({ success: false, errorMsg: errors[errors.length - 1].message });
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

      try {
        const response = JSON.parse(buffer);
        const outgoingParseResult = outgoingSchema.safeParse(response);
        if (!outgoingParseResult.success) {
          const errors = outgoingParseResult.error.errors;
          console.log(errors);
          return resolve({ success: false, errorMsg: errors[errors.length - 1].message });
        }
        resolve(response);
      } catch (e) {
        resolve({ success: false, errorMsg: 'Invalid response payload' });
      }
    });

    client.on('error', (err) => {
      console.log('oh oh...  ', err);
      resolve({ success: false, errorMsg: 'Connection error' });
    });
  });
};
