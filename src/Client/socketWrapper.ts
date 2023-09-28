import {IHandlers, ProtocolSchema} from "../types.js";
import {z} from "zod";

type IProtocol = z.infer<typeof ProtocolSchema>;

let list: IProtocol;
let handlers: IHandlers;

const sendMessage = (msg: string) => {
  console.log('send message: ', msg);
}

export const socketWrapper = (_list: IProtocol, _handlers: IHandlers) => {
  list = _list;
  handlers = _handlers;
}