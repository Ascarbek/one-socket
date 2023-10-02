# Introduction

OneSocket is a simple, lightweight socket server and socket client library written in TypeScript for NodeJS.
Under the hood OneSocket uses:
 - NodeJS native [net](https://nodejs.org/api/net.html) module 
 - [Zod](https://zod.dev) for schema validation
 - JSON for data serialization

# Installation

```bash
npm i -D one-socket
```

# Usage
OneSocket is designed to be used in a microservice architecture as RPC or IPC. In comparison to gRPC and protobuf OneSocket uses JavaScript and JSON
which makes it very easy to start working with. OneSocket is not designed to be used in a browser, because it is not an HTTP server.

# Getting Started
## Schema
One Socket uses Zod to parse all incoming and outgoing parameters. The schema is defined as follows:

```TypeScript
 const schema = {
  "-=Method Name=-": {
    request: z.object({
      // incoming object schema
    }),
    response: z.object({
      // outgoing object schema
    }),
  },
}
```

For example, a simple authorization method's schema can look like this:
```TypeScript
import { z } from 'zod';

const schema = {
  SignUp: {
    request: z.object({
      username: z.string().email().min(5),
      password: z.string().min(8),
    }),
    response: z.object({
      userId: z.number(),
    }),
  },

  SignIn: {
    request: z.object({
      username: z.string().email().min(5),
      password: z.string().min(8),
    }),
    response: z.object({
      access: z.string(),
      refresh: z.string(),
    }),
  },
};
```
This schema should be shared between your server and client.
## Handlers
Handlers are defined as an object with method names as keys and handler functions as values. For example:
```TypeScript
const handlers = {
  SignUp: SignUp,
  SignIn: SignIn,
}
```
## Server instance
Both Schema and Handlers should be supplied to the OneSocket server instance
```TypeScript
OneSocketServer('127.0.0.1', 8123, schema, {
  SignUp: SignUp,
  SignIn: SignIn,
});
```
## Client instance
Client instance is a function that takes a host, port and a stringified JSON object as parameters and returns a promise that resolves to a stringified JSON object.
```TypeScript
OneSocketClient('127.0.0.1', 8123, JSON.stringify({ type: 'SignUp', payload: { username: 'admin', password: '123' } }));
```
Since all requests and responses will be parsed using Zod on the Server, the client can safely infer the response type from the schema and return a typed response.
```TypeScript
import { OneSocketClient, type TResponse } from 'one-socket';

type SignUpResponse = TResponse<z.infer<typeof schema.SignUp.response>>;

const SignUpSend: (params: z.infer<typeof schema.SignUp.request>) => Promise<SignUpResponse> = async (params) => {
  const resp = await OneSocketClient('127.0.0.1', 8123, JSON.stringify({ type: 'SignUp', payload: params }));

  return JSON.parse(resp) as SignUpResponse;
};
```

## Examples
you can find examples under /examples folder