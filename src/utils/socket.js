import SocketIOClient from "socket.io-client";
import {CHAT_SOCKET_URL} from "../endpoints";
import {getuuid} from '../utils/common';

let socket

export const initSocket = (query) => {
  if (!socket){
    console.log('socket util: init socket')
    socket = new SocketIOClient(CHAT_SOCKET_URL, {query: query, transports: ['websocket']});
  }
  return socket;
}

export const getSocket = () => {
  console.log('Socket Util getting socket')
  return socket;
}
