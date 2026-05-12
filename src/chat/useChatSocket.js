import {
  useEffect,
  useState,
  useCallback,
} from 'react';

import {
  socket
} from './socket';

import {
  getHistory,
  sendMessage as sendMessageApi,
  typingStatus,
} from '../api/chatApi';

import {
  normalizeHistory,
  normalizeMessageResponseDTO,
  getSocketQuery,
} from './chatModel';

export default function useChatSocket({

  roomId,

  currentUserId,

    userId,

    ownerId,

    currentRole = 'USER',

}) {

  /* =========================
     STATES
  ========================= */

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [chatStatus, setChatStatus] =
    useState('PENDING');

  const [typing, setTyping] =
    useState(false);

  const [connected, setConnected] =
    useState(false);

  /* =========================
     LOAD HISTORY
  ========================= */

  const fetchHistory =
    useCallback(async () => {

      if (!roomId) return;

      try {

        setLoading(true);

        const res =
          await getHistory(
            roomId
          );

        const normalized =
          normalizeHistory(
            res
          );

        setMessages(
          normalized
        );

        /* LAST STATUS */

        const rawList =

          res?.data?.data || [];

        if (
          rawList.length > 0
        ) {

          const last =
            rawList[
              rawList.length - 1
            ];

          if (last?.status) {

            setChatStatus(
              last.status
            );
          }
        }

      } catch (e) {

        console.log(
          'FETCH HISTORY ERROR:',
          e?.response?.data || e
        );

      } finally {

        setLoading(false);

      }

    }, [roomId]);

  /* =========================
     SOCKET CONNECT
  ========================= */

  useEffect(() => {

    if (!roomId) return;

    const query =
      getSocketQuery({

        currentRole,

        currentUserId,

      });

    /* CONNECT */

        socket.io.opts.query = query;

        socket.connect();

        socket.on('connect', () => {

        console.log(
            'SOCKET CONNECTED:',
            socket.id
        );

        setConnected(true);

        /* JOIN ROOM */

        socket.emit(
            'join_room',
            roomId
        );

        });

        socket.on(
        'connect_error',
        err => {

            console.log(
            'SOCKET CONNECTION ERROR:',
            err?.message || err
            );

            setConnected(false);

        }
        );

    
    /* LOAD HISTORY */

    fetchHistory();

    /* =========================
       RECEIVE MESSAGE
    ========================= */

    socket.on(
      'receive_message',
      dto => {

        console.log(
          'LIVE MESSAGE:',
          dto
        );

        const normalized =
          normalizeMessageResponseDTO(
            dto
          );

        setMessages(prev => {

          const exists =
            prev.some(

              item =>

                item.id ===
                normalized.id

            );

          if (exists) {
            return prev;
          }

          return [
            ...prev,
            normalized,
          ];
        });
      }
    );

    /* =========================
       CHAT ACCEPTED
    ========================= */

    socket.on(
      'chat_accepted',
      () => {

        setChatStatus(
          'ACCEPTED'
        );

      }
    );

    /* =========================
       CHAT REJECTED
    ========================= */

    socket.on(
      'chat_rejected',
      () => {

        setChatStatus(
          'REJECTED'
        );

      }
    );

    /* =========================
       TYPING
    ========================= */

    socket.on(
      'typing',
      () => {

        setTyping(true);

        clearTimeout(
          global.typingHideTimeout
        );

        global.typingHideTimeout =
          setTimeout(() => {

            setTyping(false);

          }, 1200);

      }
    );

    /* =========================
       CLEANUP
    ========================= */

    return () => {

      socket.off(
        'receive_message'
      );

      socket.off(
        'chat_accepted'
      );

      socket.off(
        'chat_rejected'
      );

      socket.off(
        'typing'
      );

      socket.disconnect();

      setConnected(false);

    };

  }, [

    roomId,

    currentRole,

    currentUserId,

    fetchHistory,

  ]);

  /* =========================
     SEND MESSAGE
  ========================= */

  const sendMessage =
    async text => {

      if (!text?.trim()) {
        return;
      }

      try {

        await sendMessageApi({

            userId,

            ownerId,

            senderRole:
            currentRole,

            message:
            text,

            });

      } catch (e) {

        console.log(
          'SEND MESSAGE ERROR:',
          e?.response?.data || e
        );

      }
    };

  /* =========================
     SEND TYPING
  ========================= */

  const sendTyping =
    text => {

      if (!roomId) return;

      clearTimeout(
        global.typingTimeout
      );

      global.typingTimeout =
        setTimeout(() => {

          typingStatus({
            roomId,
          });

        }, 500);
    };

  /* =========================
     RETURN
  ========================= */

  return {

    messages,

    loading,

    typing,

    connected,

    chatStatus,

    sendMessage,

    sendTyping,

    refresh:
      fetchHistory,

  };
}