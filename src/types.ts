import { z } from 'zod';

export const ProtocolSchema = z.record(
  z.string(),
  z.object({
    request: z.any(),
    response: z.any(),
  })
);

export type IProtocol = z.infer<typeof ProtocolSchema>;

export interface IHandlers {
  [keys: string]: (params: any) => Promise<any>;
}

export type TResponse<T> = { success: false; errorMsg: string } | { success: true; payload: T };
