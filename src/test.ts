import { z } from 'zod';
import { server } from './server.js';
import { client } from './client.js';
import { sendRequest } from './Client/sendRequest.js';

const list = {
  Authorization: {
    request: z
      .object({
        username: z.string(),
        password: z.string(),
      })
      .strict(),
    response: z
      .object({
        access: z.string(),
      })
      .strict(),
  },

  ValidateToken: {
    request: z
      .object({
        access: z.string(),
      })
      .strict(),
    response: z
      .object({
        access: z.string(),
        refresh: z.string(),
      })
      .strict(),
  },
};

const AuthorizationRequest = async (params: z.infer<typeof list.Authorization.request>) => {
  console.log('AuthorizationRequest', params);
  return { access: 'ey_123' };
};

const ValidateTokenRequest = async (params: any) => {};

const AuthorizationSend: (
  params: z.infer<typeof list.Authorization.request>
) => Promise<z.infer<typeof list.Authorization.response>> = async (params) => {
  const resp = await sendRequest(JSON.stringify({ type: 'Authorization', payload: params }));

  return JSON.parse(resp) as z.infer<typeof list.Authorization.response>;
};

const ValidateTokenResponse = async (params: any) => {};

(async () => {
  server('127.0.0.1', 8123, list, {
    Authorization: AuthorizationRequest,
    ValidateToken: ValidateTokenRequest,
  });

  client('127.0.0.1', 8123, list);

  const resp = await AuthorizationSend({ username: 'admin', password: '123' });
  console.log('response: ', resp);
})();
