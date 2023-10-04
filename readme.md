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
which makes it very easy to start working with. 
OneSocket is not designed to be used in a browser, because it doesn't use HTTP.

# Getting Started
## Schema

OneSocket uses Zod Schema to parse all incoming and outgoing parameters. The Schema is defined as follows:

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

For example, a simple authorization method's Schema can look like this:
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
This Schema should be shared between your server and client.

## OneSocket Client <> Server communication
OneSocket uses JSON to communicate between client and server. 
To call a server method the client should send a JSON object with a following structure:
```TypeScript
const requestMessage = {
  type: '-=Method Name=-',
  payload: {
    // request object
  },
}
```
The server will parse the request object using the Schema and call the corresponding handler function.
The handler function should return a response object that will be validated using the Schema and sent back to the client with a following structure: 
```TypeScript
const responseMessage = {
  success: true,
  payload: {
    // response object
  },
} | {
  success: false,
  errorMsg: 'error message'
}
```
If there has been any error during the request parsing or handling, the server will put the error message into the `errorMsg` field and set success to false.
If the request has been handled successfully, the server will put the response object into the `payload` field and set success to true.

## Handlers
Handlers are defined as an object with method names as keys and handler functions as values. For example:
```TypeScript
const SignUp: (params: z.infer<typeof schema.SignUp.request>) => Promise<z.infer<typeof schema.SignUp.response>> = async (params) => {
  // all handler functions should be asynchronios (return a Promise) 
  return Promise.resolve({ 
    userId: 1,
  });
};

const SignIn: (params: z.infer<typeof schema.SignIn.request>) => Promise<z.infer<typeof schema.SignIn.response>> = async (params) => {
  // all handler functions should be asynchronios (return a Promise) 
  return Promise.resolve({
    access: 'access token',
    refresh: 'refresh token',
  });
};

const handlers = {
  SignUp: SignUp,
  SignIn: SignIn,
}
```
## Server instance
Both Schema and Handlers should be supplied to the OneSocket server instance (after the host port).
```TypeScript
OneSocketServer(8123, schema, handlers);
```
## Client instance
Client instance is a function that takes a host, port and a JSON object as parameters and returns a promise that resolves to a stringified JSON object.
```TypeScript
OneSocketClient('127.0.0.1', 8123, { type: 'SignUp', payload: { username: 'admin', password: '123' } });
```
Since all requests and responses will be parsed using Zod on the Server, the client can safely infer the response type from the schema and return a typed response.
```TypeScript
import { OneSocketClient, type TResponse } from 'one-socket';

// wrapper type
type SignUpResponse = TResponse<z.infer<typeof schema.SignUp.response>>;

const SignUpSend: (params: z.infer<typeof schema.SignUp.request>) => Promise<SignUpResponse> = async (params) => {
  const resp = await OneSocketClient('127.0.0.1', 8123, { type: 'SignUp', payload: params });

  return JSON.parse(resp) as SignUpResponse;
};
```

## Examples
you can find examples under /examples folder