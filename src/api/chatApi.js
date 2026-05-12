import api from './axiosConfig';

/* =========================
   SEND MESSAGE
========================= */

export const sendMessage = async ({
  userId,
  ownerId,
  senderRole,
  message,
}) => {

  return api.post(
    '/api/chat/send',
    {
      userId,
      ownerId,
      senderRole,
      message,
    }
  );
};

/* =========================
   GET CHAT HISTORY
========================= */

export const getHistory = async (
  roomId
) => {

  return api.get(
    `/api/chat/history/${roomId}`
  );
};

/* =========================
   TYPING STATUS
========================= */

export const typingStatus = async ({
  roomId,
}) => {

  return api.post(
    '/api/chat/typing',
    {
      roomId,
    }
  );
};

/* =========================
   OWNER ACCEPTED CHATS
========================= */

export const acceptedChats =
  async (ownerId) => {

    console.log(
      'ACCEPTED OWNER ID:',
      ownerId
    );

    return api.get(
      `/api/chat/accepted/${Number(ownerId)}`
    );
  };

/* =========================
   OWNER PENDING CHATS
========================= */

export const pendingChats =
  async (ownerId) => {

    console.log(
      'PENDING OWNER ID:',
      ownerId
    );

    return api.get(
      `/api/chat/pending/${Number(ownerId)}`
    );
  };

/* =========================
   OWNER REJECTED CHATS
========================= */

export const rejectedChats =
  async (ownerId) => {

    console.log(
      'REJECTED OWNER ID:',
      ownerId
    );

    return api.get(
      `/api/chat/rejected/${Number(ownerId)}`
    );
  };

/* =========================
   ACCEPT CHAT
========================= */

export const acceptChat =
  async ({
    roomId,
  }) => {

    return api.post(
      '/api/chat/accept',
      {
        roomId,
        senderRole:
          'PROPERTY_OWNER',
      }
    );
  };

/* =========================
   REJECT CHAT
========================= */

export const rejectChat =
  async ({
    roomId,
  }) => {

    return api.post(
      '/api/chat/reject',
      {
        roomId,
        senderRole:
          'PROPERTY_OWNER',
      }
    );
  };