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
  isOwnMessage,
} from '../../chat/chatModel';

export default function ChatRoomScreen({
  route,
  navigation,
}) {

  const {
      user,
      property,
      roomData,
      } = route.params;

  const [message, setMessage] =
    useState('');

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

        String(
          currentUser?.role
        )
        .includes(
          'PROPERTY_OWNER'
        )

          ? 'PROPERTY_OWNER'

          : 'USER',

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

      /* USER BLOCK */

      if (

        String(chatStatus)
          .toUpperCase() ===
          'PENDING' &&

        messages.length === 0 &&

        !String(
          currentUser?.role
        ).includes(
          'PROPERTY_OWNER'
        )

      ) {

        console.log(
          'WAITING FOR APPROVAL'
        );

        return;
      }

      await sendMessage(
        message
      );

      setMessage('');

    };

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

            messages.map(msg => {

              const own =
                isOwnMessage({

                  senderRole:
                    msg.senderRole,

                  currentRole:
                    currentUser?.role,

                });

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

          {typing && (

            <Text style={styles.typing}>
              Typing...
            </Text>

          )}

          {/* PENDING */}

          {/* PENDING */}

          {String(chatStatus)
            .toUpperCase() ===
            'PENDING' &&

            messages.length === 0 && (

            <Text style={styles.pendingTxt}>
              Waiting for owner approval
            </Text>

          )}

          {/* REJECTED */}

          {chatStatus ===
           'REJECTED' && (

            <Text style={styles.rejectedTxt}>
              Chat rejected
            </Text>

          )}

        </ScrollView>

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

              sendTyping(
                text.trim().length > 0
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

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingBottom: 70,
  },

  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 18,
    paddingVertical: 16,

    backgroundColor: '#fff',

    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  back: {
    fontSize: 24,
    fontWeight: '900',

    color: '#0F172A',

    marginRight: 16,
  },

  ownerName: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },

  propertyName: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 13,
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingHorizontal: 18,
    paddingVertical: 12,
  },

  status: {
    backgroundColor: '#EEF2FF',
    color: '#4338CA',

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 10,

    overflow: 'hidden',

    fontWeight: '800',
    fontSize: 12,
  },

  connected: {
    color: '#059669',
    fontWeight: '800',
    fontSize: 12,
  },

  chatBody: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  emptyTxt: {
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },

  // messageBox: {
  //   maxWidth: '80%',

  //   paddingHorizontal: 14,
  //   paddingVertical: 10,

  //   borderRadius: 18,

  //   marginBottom: 14,
  // },

    messageBox: {

    paddingHorizontal: 14,

    paddingVertical: 10,

    borderRadius: 18,

    marginBottom: 10,

    },

  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4338CA',
    maxWidth: '78%',
    borderBottomRightRadius: 6,
    marginLeft: 50,
    
  },

  ownerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    maxWidth: '78%',
    borderBottomLeftRadius: 6,
    marginRight: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  myMessageText: {

    color: '#FFFFFF',

    fontSize: 15,

    lineHeight: 22,

  },

  ownerMessageText: {

    color: '#0F172A',

    fontSize: 15,

    lineHeight: 22,

  },


  myTime: {

    color: 'rgba(255,255,255,0.7)',

    fontSize: 11,

    marginTop: 4,

    alignSelf: 'flex-end',

  },

  ownerTime: {

    color: '#64748B',

    fontSize: 11,

    marginTop: 4,

    alignSelf: 'flex-end',

  },
  
  typing: {
    color: '#999',
    marginTop: 10,
  },

  pendingTxt: {
    color: '#999',
    marginTop: 20,
    textAlign: 'center',
  },

  rejectedTxt: {
    color: '#DC2626',
    marginTop: 20,
    textAlign: 'center',
    fontWeight: '700',
  },

  inputContainer: {

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 12,

    paddingVertical: 10,

    backgroundColor: '#FFFFFF',

    borderTopWidth: 1,

    borderTopColor: '#E2E8F0',

  },

  input: {

    flex: 1,

    backgroundColor: '#F1F5F9',

    borderRadius: 24,

    paddingHorizontal: 18,

    paddingVertical: 12,

    fontSize: 15,

    color: '#0F172A',

    maxHeight: 120,

    },

  sendBtn: {

    marginLeft: 10,

    backgroundColor: '#4338CA',

    width: 48,

    height: 48,

    borderRadius: 24,

    justifyContent: 'center',

    alignItems: 'center',

  },

  sendTxt: {

    color: '#FFFFFF',

    fontSize: 20,

    fontWeight: '700',

    },

});