import React, {
  useState,
  useEffect,
  useRef,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import AsyncStorage
from '@react-native-async-storage/async-storage';

import useChatSocket
from '../../chat/useChatSocket';

import {
  buildRoomId,
} from '../../chat/chatModel';

export default function OwnerChatScreen({
  route,
  navigation,
}) {

  const {
        user,
        roomData,
        status,
        } = route.params;

  const [message, setMessage] =
    useState('');

    const [isTyping,
    setIsTyping] =
    useState(false);

    const [localMessages,
    setLocalMessages] =
    useState([]);

  const [currentUser,
  setCurrentUser] =
  useState(undefined);

  const scrollRef =
    useRef();

  /* =========================
     LOAD CURRENT USER
  ========================= */

  useEffect(() => {

    getCurrentUser();

  }, []);

      const getCurrentUser =
      async () => {

        try {

          const userData =
            await AsyncStorage.getItem(
              'userData'
            );

          console.log(
            'STORAGE USER:',
            userData
          );

          if (userData) {

            const parsed =
              JSON.parse(userData);

            setCurrentUser(
              parsed
            );

          } else {

            setCurrentUser(null);

          }

        } catch (e) {

          console.log(
            'USER FETCH ERROR:',
            e
          );

          setCurrentUser(null);

        }
      };

  /* =========================
     ROOM ID
  ========================= */

  const roomId =
  buildRoomId(

  roomData?.userId,

  roomData?.ownerId,

  );
  /* =========================
     CHAT SOCKET HOOK
  ========================= */

  const {

    messages,

    loading,

    typing,

    connected,

    chatStatus,

    sendMessage,

    sendTyping,

  } = useChatSocket({

    roomId,

    currentUserId:
      currentUser?.id,

    ownerId:
      roomData?.ownerId,

      userId:
        roomData?.userId,


      currentRole:
        'PROPERTY_OWNER',

  });

  /* =========================
     AUTO SCROLL
  ========================= */

  useEffect(() => {

    setTimeout(() => {

      scrollRef?.current
        ?.scrollToEnd({
          animated: true,
        });

    }, 200);

  }, [messages]);

    useEffect(() => {

    setLocalMessages(
    messages || []
    );

    }, [messages]);

  /* =========================
     WAIT USER
  ========================= */

  if (currentUser === undefined) {

    return (

      <SafeAreaView
        style={styles.loaderWrap}
      >

        <ActivityIndicator
          size="large"
          color="#4338CA"
        />

      </SafeAreaView>

    );
  }

  /* =========================
     SEND MESSAGE
  ========================= */

  const onSend =
    async () => {

        if (!message.trim()) {
        return;
        }

        if (chatStatus === 'REJECTED') {
        return;
        }

        console.log(
        'OWNER SENDING MESSAGE'
        );

        const tempMessage = {

            id: Date.now(),

            text: message,

            senderRole:
                'PROPERTY_OWNER', 

            createdAt:
                new Date().toISOString(),

            };

            setLocalMessages(prev => [
            ...prev,
            tempMessage,
            ]);

            await sendMessage(
            message
            );

            setMessage('');

    };

    console.log(
        'OWNER CHAT STATUS:',
        chatStatus
        );

        console.log(
        'CURRENT OWNER:',
        currentUser
        );

        console.log(
        'ROOM ID:',
        roomId
        );

    return (

    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : 'height'
      }
    >

      <SafeAreaView style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >

          <Text style={styles.back}>
            ←
          </Text>

        </TouchableOpacity>

        <View style={{ flex: 1 }}>

          <Text style={styles.ownerName}>
            {user?.name}
          </Text>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 2,
            }}
          >

            <View
              style={{

                width: 8,

                height: 8,

                borderRadius: 10,

                backgroundColor:
                  connected
                    ? '#22C55E'
                    : '#94A3B8',

                marginRight: 6,

              }}
            />

            <Text style={styles.propertyName}>

              {connected
                ? 'Online'
                : 'Offline'}

            </Text>

          </View>

        </View>

      </View>

      {/* STATUS */}

      {/* <View style={styles.statusRow}>

        <Text style={styles.status}>

          {String(chatStatus)
            .toUpperCase()}

        </Text>

        <Text style={styles.connected}>

          {connected
            ? 'ONLINE'
            : 'OFFLINE'}

        </Text>

      </View> */}

      {/* BODY */}

      {loading ? (

        <View style={styles.loaderWrap}>

          <ActivityIndicator
            size="large"
            color="#4338CA"
          />

        </View>

      ) : (

        <ScrollView
          ref={scrollRef}
          style={styles.chatBody}
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            paddingBottom: 120,
            flexGrow: 1,
          }}
        >

          {messages.length === 0 ? (

            <Text style={styles.emptyTxt}>
              No Messages Yet
            </Text>

          ) : (

            localMessages.map(msg => {

              const own =
                msg.senderRole ===
                'PROPERTY_OWNER';

                

              return (

                <View
                  key={msg.id}
                  style={[

                    styles.messageBox,

                    own
                      ? styles.myMessage
                      : styles.ownerMessage

                  ]}
                >

                  <Text
                    style={

                      own
                        ? styles.myMessageText
                        : styles.ownerMessageText

                    }
                  >
                    {msg.text}
                  </Text>

                  <Text
                    style={

                      own
                        ? styles.myTime
                        : styles.ownerTime

                    }
                  >
                    {new Date(
                      msg.createdAt
                    ).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Text>

                </View>

              );
            })

          )}

          {/* TYPING */}

          {typing &&
            !isTyping && (

            <Text style={styles.typing}>
              Typing...
            </Text>

          )}


          {/* PENDING */}

          {/* {String(chatStatus)
            .toUpperCase() ===
            'PENDING' &&

            messages.length === 0 && (

            <Text style={styles.pendingTxt}>
              Waiting for owner approval
            </Text>

          )} */}

          {/* REJECTED */}

          {chatStatus ===
           'REJECTED' && (

            <Text style={styles.rejectedTxt}>
              Chat rejected
            </Text>

          )}

        </ScrollView>

      )}

        {/* {String(chatStatus)
            .toUpperCase() ===
            'PENDING' && (

            <View
            style={{
                padding: 10,
                backgroundColor: '#FEF3C7',
                margin: 10,
                borderRadius: 10,
            }}
            >

            <Text
                style={{
                color: '#92400E',
                fontWeight: '600',
                }}
            >
                Waiting for approval action
            </Text>

            </View>

            )} */}

            {String(status)
                .toUpperCase() ===
                'PENDING' && (

                <View
                    style={{
                    padding: 10,
                    backgroundColor: '#DBEAFE',
                    margin: 10,
                    borderRadius: 10,
                    }}
                >

                    <Text
                    style={{
                        color: '#1E40AF',
                        fontWeight: '600',
                    }}
                    >
                    This chat is pending
                    </Text>

                </View>

                )}

      {/* INPUT */}

      <View style={styles.inputContainer}>

        <TextInput
          value={message}

          editable={
            chatStatus !==
            'REJECTED'
          }

          onChangeText={
            text => {

                setMessage(text);

                const typingNow =
                text.trim().length > 0;

                setIsTyping(
                typingNow
                );

                sendTyping(
                typingNow
                );

            }
            }

          placeholder="Type message..."

          placeholderTextColor="#888"

          style={styles.input}
        />

        <TouchableOpacity

          disabled={
            chatStatus ===
            'REJECTED'
          }

          style={[

            styles.sendBtn,

            chatStatus ===
            'REJECTED' && {
              opacity: 0.5
            }

          ]}

          onPress={onSend}
        >

          {/* <Text style={styles.sendTxt}>
            Send
          </Text> */}
          <Text style={styles.sendTxt}>
            ➤
          </Text>

        </TouchableOpacity>

      </View>

        </SafeAreaView>

    </KeyboardAvoidingView>
  );
}

const COLORS = {
  primary: '#ff7a30',
  secondary: '#132238',
  bg: '#f8f3ed',
  white: '#ffffff',
  text: '#1f2937',
  lightText: '#6b7280',
  border: '#eadfd3',
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  /* LOADER */

  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    alignItems: 'center',

    marginHorizontal: 16,
    marginTop: 10,

    paddingHorizontal: 18,
    paddingVertical: 15,

    backgroundColor: '#ffffff',

    borderRadius: 24,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },

  back: {
    fontSize: 22,
    fontWeight: '900',

    color: COLORS.secondary,

    marginRight: 14,
  },

  ownerName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.secondary,
  },

  propertyName: {
    marginTop: 3,
    color: COLORS.lightText,
    fontSize: 12,
  },

  /* CHAT BODY */

  chatBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 10,
  },

  emptyTxt: {
    color: COLORS.lightText,
    textAlign: 'center',
    marginTop: 40,
    fontSize: 14,
  },

  /* MESSAGE */

  messageBox: {
    paddingHorizontal: 16,
    paddingVertical: 12,

    borderRadius: 22,

    marginBottom: 12,
  },

  /* MY MESSAGE */

  myMessage: {
    alignSelf: 'flex-end',

    backgroundColor: COLORS.primary,

    maxWidth: '78%',

    borderBottomRightRadius: 8,

    marginLeft: 50,

    shadowColor: COLORS.primary,
    shadowOpacity: 0.10,
    shadowRadius: 4,
    elevation: 2,
  },

  /* OWNER MESSAGE */

  ownerMessage: {
    alignSelf: 'flex-start',

    backgroundColor: '#ffffff',

    maxWidth: '78%',

    borderBottomLeftRadius: 8,

    marginRight: 50,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 3,
    elevation: 1,
  },

  /* MESSAGE TEXT */

  myMessageText: {
    color: '#ffffff',
    fontSize: 14,
    lineHeight: 22,
  },

  ownerMessageText: {
    color: COLORS.secondary,
    fontSize: 14,
    lineHeight: 22,
  },

  /* TIME */

  myTime: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 10,
    marginTop: 5,
    alignSelf: 'flex-end',
  },

  ownerTime: {
    color: '#94a3b8',
    fontSize: 10,
    marginTop: 5,
    alignSelf: 'flex-end',
  },

  /* TYPING */

  typing: {
    color: COLORS.lightText,
    marginTop: 8,
    marginLeft: 4,
    fontSize: 13,
  },

  pendingTxt: {
    color: COLORS.lightText,
    marginTop: 18,
    textAlign: 'center',
    fontSize: 14,
  },

  rejectedTxt: {
    color: '#DC2626',
    marginTop: 18,
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 14,
  },

  /* PENDING CARD */

  pendingCard: {
    backgroundColor: '#fff7ed',

    marginHorizontal: 16,
    marginTop: 10,

    paddingVertical: 12,
    paddingHorizontal: 14,

    borderRadius: 18,

    borderWidth: 1,
    borderColor: '#fed7aa',
  },

  pendingText: {
    color: '#c2410c',
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },

  /* INPUT AREA */

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,

    paddingHorizontal: 14,
    paddingVertical: 10,

    backgroundColor: '#ffffff',

    borderRadius: 24,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },

  /* INPUT */

  input: {
    flex: 1,

    color: COLORS.secondary,

    fontSize: 14,

    paddingHorizontal: 6,
    paddingVertical: 10,

    maxHeight: 120,
  },

  /* SEND BUTTON */

  sendBtn: {
    width: 44,
    height: 44,

    borderRadius: 22,

    backgroundColor: COLORS.primary,

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: 10,

    shadowColor: COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  sendTxt: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
  },

});