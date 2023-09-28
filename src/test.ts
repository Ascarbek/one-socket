import { z, ZodDiscriminatedUnionOption, ZodObject } from 'zod';
import { socketWrapper } from './Server/socketWrapper.js';

export interface IProtocol {
  [keys: string]: {
    request: ZodObject<any>;
    response: ZodObject<any>;
  };
}

(async () => {
  const list: IProtocol = {
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

  try{
    JSON.parse('{"username":"admin","password":"12');
  }
  catch (e) {
    // console.log('error: ', e);
  }

  socketWrapper(list,{})

  const parseResult = list['Authorization'].request.strict().safeParse({ username: 'admin', password: '123', another:'2' });
  if (parseResult.success) {
    console.log('parse result success: ');
  } else {
    console.log('parse result error: ', parseResult.error.errors[0].message);
  }

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
