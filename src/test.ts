import { z } from 'zod';
import { server } from './server.js';
import { client } from './client.js';
import { sendRequest } from './Client/sendRequest.js';

const list = {
  Authorization: {
    request: z.object({
      username: z.string(),
      password: z.string(),
    }),
    response: z.object({
      access: z.string(),
    }),
  },

  ValidateToken: {
    request: z.object({
      access: z.string(),
    }),
    response: z.object({
      access: z.string(),
      refresh: z.string(),
    }),
  },
};

const AuthorizationRequest = async (params: z.infer<typeof list.Authorization.request>) => {
  console.log('AuthorizationRequest', params);
  return { access: 'ey_123' };
};

const ValidateTokenRequest = async (params: any) => {};

const AuthorizationResponse = z.discriminatedUnion('success', [
  z.object({ success: z.literal(true), payload: list.Authorization.response }),
  z.object({ success: z.literal(false), errorMsg: z.string() }),
]);

const AuthorizationSend: (
  params: z.infer<typeof list.Authorization.request>
) => Promise<z.infer<typeof AuthorizationResponse>> = async (params) => {
  const resp = await sendRequest('127.0.0.1', 8123, JSON.stringify({ type: 'Authorization', payload: params }));

  return JSON.parse(resp) as z.infer<typeof AuthorizationResponse>;
};

const ValidateTokenResponse = async (params: any) => {};

(async () => {
  server('127.0.0.1', 8123, list, {
    Authorization: AuthorizationRequest,
    ValidateToken: ValidateTokenRequest,
  });

  const resp = await AuthorizationSend({ username: 'admin', password: '123' });
  console.log('response: ', resp);
})();
