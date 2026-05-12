import { io } from 'socket.io-client';

const SOCKET_URL =
//   'http://192.168.0.133:9092';
  'http://192.168.1.6:9092';
  

export const socket = io(
  SOCKET_URL,
  {
    transports: ['websocket'],
    autoConnect: false,
  }
);