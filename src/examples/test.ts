import { z } from 'zod';
import { OneSocketServer } from '../oneSocketServer.js';
import { OneSocketClient } from '../Client/oneSocketClient.js';
import { TResponse } from '../types.js';

/**
 * Common
 * */
const HOST = '127.0.0.1';
const PORT = 8123;

const schema = {
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

/**
 * Server
 * */

const AuthorizationRequest = async (params: z.infer<typeof schema.Authorization.request>) => {
  if (params.username === 'admin' && params.password === '123') {
    return { access: 'ey_123' };
  } else if (params.username === 'must_be_invalid') {
    return { access: 'ey_123', some: 'another field' };
  } else {
    throw 'Invalid username or password';
  }
};

const ValidateTokenRequest = async (params: any) => {
  return { access: 'ey_123', refresh: 'ey_123' };
};

/**
 * Client
 * */

type AuthorizationResponse = TResponse<z.infer<typeof schema.Authorization.response>>;

const AuthorizationSend: (
  params: z.infer<typeof schema.Authorization.request>
) => Promise<AuthorizationResponse> = async (params) => {
  const resp = await OneSocketClient(HOST, PORT, JSON.stringify({ type: 'Authorization', payload: params }));

  return JSON.parse(resp) as AuthorizationResponse;
};

type ValidateTokenResponse = TResponse<z.infer<typeof schema.ValidateToken.response>>;

const ValidateTokenSend: (
  params: z.infer<typeof schema.ValidateToken.request>
) => Promise<ValidateTokenResponse> = async (params) => {
  const resp = await OneSocketClient(HOST, PORT, JSON.stringify({ type: 'ValidateToken', payload: params }));

  return JSON.parse(resp) as ValidateTokenResponse;
};

/**
 * Test
 * */
(async () => {
  OneSocketServer(HOST, PORT, schema, {
    Authorization: AuthorizationRequest,
    ValidateToken: ValidateTokenRequest,
  });

  const resp1 = await AuthorizationSend({ username: 'admin', password: '123' });
  console.log('response: ', resp1);
  const resp2 = await AuthorizationSend({ username: 'must_be_invalid', password: '123' });
  console.log('response: ', resp2);
  const resp3 = await AuthorizationSend({ username: 'unknown', password: '123' });
  console.log('response: ', resp3);
})();
