import { z, AnyZodObject, ZodAny } from 'zod';

export const ProtocolSchema = z.record(
  z.string(),
  z.object({
    request: z.any(),
    response: z.any(),
  })
);

export interface IHandlers {
  [keys: string]: (params: any) => Promise<any>;
}
