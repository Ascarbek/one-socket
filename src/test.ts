import { z, ZodDiscriminatedUnionOption, ZodObject } from 'zod';
import { processMessage, socketWrapper as serverSocketWrapper } from './Server/socketWrapper.js';
import { socketWrapper as clientSocketWrapper } from './Client/socketWrapper.js';

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
  return '123';
};

const ValidateTokenRequest = async (params: any) => {};

const AuthorizationResponse = async (params: any) => {
  console.log('AuthorizationResponse', params);
};

const ValidateTokenResponse = async (params: any) => {};

(async () => {
  serverSocketWrapper(list, {
    Authorization: AuthorizationRequest,
    ValidateToken: ValidateTokenRequest,
  });

  await processMessage('{"type":"Authorization","payload":{"username":"admin","password":"123"}}');

  clientSocketWrapper(list, {
    Authorization: AuthorizationResponse,
    ValidateToken: ValidateTokenResponse,
  });

  /*const parseResult = list['Authorization'].request.strict().safeParse({ username: 'admin', password: '123', another:'2' });
  if (parseResult.success) {
    console.log('parse result success: ');
  } else {
    console.log('parse result error: ', parseResult.error.errors[0].message);
  }*/

  /*const protocol = z.discriminatedUnion('type', [
    z.object({
      type: z.literal('AuthorizationRequest'),
      payload: list[0].request,
    }),
    z.object({
      type: z.literal('AuthorizationResponse'),
    }),
    z.object({
      type: z.literal('ValidateTokenRequest'),
    }),
  ]);

  console.log('testing...');

  socketWrapper('host', 3000, JSON.stringify({ type: 'aaa', payload: 'bbbb' }), (data: any) => {
    console.log(data);
    return Promise.resolve('');
  });*/
})();
