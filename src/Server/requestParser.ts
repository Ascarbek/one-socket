import { getHandlers, getProtocol } from '../oneSocketServer.js';

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

  console.log(new Date().toISOString(), ' incoming request: ', type);

  if (!type) {
    return error('Request type not found');
  }
  if (!protocol[type]) {
    return error('Request not found');
  }
  if (!handlers[type]) {
    return error('Handler not found');
  }

  const requestSchema = protocol[type].request.strict();
  const requestParseResult = requestSchema.safeParse(raw.payload);

  if (!requestParseResult.success) {
    const errors = requestParseResult.error.errors;
    console.log(errors);
    return error(errors[errors.length - 1].message);
  }

  try {
    const response = await handlers[type](raw.payload);
    const responseSchema = protocol[type].response.strict();
    const responseParseResult = responseSchema.safeParse(response);
    if (!responseParseResult.success) {
      const errors = responseParseResult.error.errors;
      console.log(errors);
      return error(errors[errors.length - 1].message);
    }

    return { success: true, payload: response };
  } catch (e) {
    return error(JSON.stringify(e));
  }
};
