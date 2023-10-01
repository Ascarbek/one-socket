import { getHandlers, getProtocol } from '../server.js';

const error = (msg: string) => {
  return {
    success: false,
    errorMsg: msg,
  };
};

export const processMessage = async (msg: string) => {
  const protocol = getProtocol();
  const handlers = getHandlers();

  let raw: any;
  try {
    raw = JSON.parse(msg);
  } catch (e) {
    return error('Invalid request payload');
  }

  const type = raw.type;

  if (!type) {
    return error('Request type not found');
  }
  if (!protocol[type]) {
    return error('Request not found');
  }
  if (!handlers[type]) {
    return error('Handler not found');
  }

  const requestSchema = protocol[type].request;
  const requestParseResult = requestSchema.safeParse(raw.payload);

  if (!requestParseResult.success) {
    return error(requestParseResult.error.errors[0].message);
  }

  try {
    const response = await handlers[type](raw.payload);
    const responseSchema = protocol[type].response;
    const responseParseResult = responseSchema.safeParse(response);
    if (!responseParseResult.success) {
      return error(responseParseResult.error.errors[0].message);
    }

    return { success: true, payload: response };
  } catch (e) {
    return error(JSON.stringify(e));
  }
};