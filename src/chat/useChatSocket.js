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

    ownerId,

    userId,

    propertyId,

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

            console.log(
              'LAST CHAT STATUS:',
              last?.status
            );
            console.log(
            'CHAT STATUS FROM API:',
            last?.status
            );
            setChatStatus(
              String(last.status)
                .toUpperCase()
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

        if (!socket.connected) {

          socket.connect();

        }

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

        /* ROOM FILTER */

        if (

          dto?.roomId &&

          String(dto.roomId) !==
          String(roomId)

        ) {

          return;

        }

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
      dto => {

        /* ROOM FILTER */

        if (

          dto?.roomId &&

          String(dto.roomId) !==
          String(roomId)

        ) {

          return;

        }

        setTyping(
          !!dto?.typing
        );

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

      socket.off(
        'connect'
      );

      socket.off(
        'connect_error'
      );

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

      const payload = {

        userId,

        ownerId,

        propertyId,

        senderRole:
          currentRole,

        message:
          text.trim(),

      };

      try {

        /* REALTIME SOCKET */

        if (socket.connected) {

          socket.emit(
            'send_message',
            payload
          );

          return;

        }

        /* FALLBACK REST */

        await sendMessageApi(
          payload
        );

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
    typing => {

      if (!roomId) return;

      if (!socket.connected) return;

      socket.emit(
        'typing',
        {

          roomId,

          userId:
            currentUserId,

          typing:
            !!typing,

        }
      );

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