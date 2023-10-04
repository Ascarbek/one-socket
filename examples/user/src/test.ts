import { z } from 'zod';
import { OneSocketServer, OneSocketClient, type TResponse } from 'one-socket';
import * as process from 'process';

/**
 * Common
 * */
const HOST = '127.0.0.1';
const PORT = 8123;

const schema = {
  SignIn: {
    request: z.object({
      username: z.string(),
      password: z.string(),
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

const SignIn: (
  params: z.infer<typeof schema.SignIn.request>
) => Promise<z.infer<typeof schema.SignIn.response>> = async (params) => {
  const { username, password } = params;

  // wait for 100ms to simulate a real request
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (username === 'admin' && password === '123') {
    return { access: 'ey_123', refresh: 'ey_123' };
  } else if (username === 'must_be_invalid') {
    return { access: 'ey_123', refresh: 'ey_123', some: 'another field' };
  } else {
    throw 'Invalid username or password';
  }
};

const handlers = {
  SignIn: SignIn,
};

/**
 * Client
 * */
type SignInResponse = TResponse<z.infer<typeof schema.SignIn.response>>;

const SignInSend: (params: z.infer<typeof schema.SignIn.request>) => Promise<SignInResponse> = async (params) => {
  const resp = await OneSocketClient(HOST, PORT, { type: 'SignIn', payload: params });

  return JSON.parse(resp) as SignInResponse;
};

/**
 * Test
 * */
(async () => {
  OneSocketServer(PORT, schema, handlers);

  // normal request
  const resp1 = await SignInSend({ username: 'admin', password: '123' });
  console.log('response 1: ', resp1);

  // invalid request (unknown field from server)
  const resp2 = await SignInSend({ username: 'must_be_invalid', password: '123' });
  console.log('response 2: ', resp2);

  // invalid request (unknown user)
  const resp3 = await SignInSend({ username: 'unknown', password: '123' });
  console.log('response 3: ', resp3);

  // invalid request (invalid field from client)
  const resp = await OneSocketClient(HOST, PORT, { type: 'SignIn', payload: { some: 'field' } });
  console.log('response 4: ', JSON.parse(resp));

  process.exit(0);
})();
