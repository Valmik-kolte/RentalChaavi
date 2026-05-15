import { io } from 'socket.io-client';

const SOCKET_URL =
  'http://10.10.1.210:8080';

export const socket = io(
  SOCKET_URL,
  {
    transports: ['websocket'],
    autoConnect: false,
  }
);