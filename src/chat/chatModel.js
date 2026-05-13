export const buildRoomId = (

  userId,

  ownerId,

) => {

  const u = Number(userId);

  const o = Number(ownerId);

  if (

    !Number.isFinite(u) ||

    !Number.isFinite(o)

  ) {

    return null;

  }

  return `USER_${u}_OWNER_${o}`;

};
/* =========================
   SOCKET QUERY
========================= */

export const getSocketQuery = ({

  currentRole,

  currentUserId,

}) => {

  const id =
    Number(currentUserId);

  if (
    !Number.isFinite(id) ||
    id <= 0
  ) {

    return {};
  }

  /* OWNER */

  if (
    currentRole ===
    'PROPERTY_OWNER'
  ) {

    return {

      ownerId:
        String(id),

    };
  }

  /* USER */

  return {

    userId:
      String(id),

  };
};

/* =========================
   SAFE STRING
========================= */

const toSafeString = value =>

  value === null ||
  value === undefined

    ? ''

    : String(value);

/* =========================
   NORMALIZE MESSAGE DTO
========================= */

export const normalizeMessageResponseDTO =
  dto => {

    const roomId =
      dto?.roomId;

    const senderId =
      dto?.senderId ?? null;

    const senderRole =
      toSafeString(

        dto?.senderRole ||
        'USER'

      );

    const text =
      toSafeString(

        dto?.message ||
        dto?.content ||
        dto?.text ||
        ''

      );

    const createdAt =
      toSafeString(

        dto?.time || ''

      );

    return {

      id:

        `${roomId || 'room'}-${
          senderId || 'na'
        }-${
          createdAt ||
          Date.now()
        }`,

      roomId:
        roomId || null,

      senderId,

      senderRole,

      text,

      createdAt,
    };
};

/* =========================
   EXTRACT RESPONSE LIST
========================= */

const extractDataList =
  response => {

    const direct =
      response?.data;

    /* DIRECT ARRAY */

    if (
      Array.isArray(direct)
    ) {

      return direct;
    }

    /* RESPONSE DTO */

    if (
      Array.isArray(
        direct?.data
      )
    ) {

      return direct.data;
    }

    /* RAW ARRAY */

    if (
      Array.isArray(response)
    ) {

      return response;
    }

    return [];
};

/* =========================
   NORMALIZE HISTORY
========================= */

export const normalizeHistory =
  responseOrList => {

    const list =
      extractDataList(
        responseOrList
      );

    return list.map(
      normalizeMessageResponseDTO
    );
};

/* =========================
   OWN MESSAGE
========================= */

export const isOwnMessage = ({

  senderRole,

  currentRole,

}) => {

  const sr =
    toSafeString(
      senderRole
    ).toUpperCase();

  return currentRole ===
    'PROPERTY_OWNER'

    ? sr ===
      'PROPERTY_OWNER'

    : sr === 'USER';
};