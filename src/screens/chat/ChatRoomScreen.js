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
    useState(null);

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

        if (userData) {

          const parsed =
            JSON.parse(userData);

          setCurrentUser(
            parsed
          );
        }

      } catch (e) {

        console.log(
          'USER FETCH ERROR:',
          e
        );

      }
    };

  /* =========================
     ROOM ID
  ========================= */

  const roomId =
  buildRoomId(
    roomData?.userId,
    roomData?.ownerId
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

    currentUser?.role ===
    'ROLE_PROPERTY_OWNER'

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

  if (!currentUser) {

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

        chatStatus ===
        'PENDING' &&

        messages.length > 0 &&

        currentUser?.role !==
        'PROPERTY_OWNER'

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

          <Text style={styles.propertyName}>
            {property?.title}
          </Text>

        </View>

      </View>

      {/* STATUS */}

      <View style={styles.statusRow}>

        <Text style={styles.status}>

          {chatStatus}

        </Text>

        <Text style={styles.connected}>

          {connected
            ? 'ONLINE'
            : 'OFFLINE'}

        </Text>

      </View>

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
            paddingBottom: 20,
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
                    {msg.createdAt}
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

          {chatStatus ===
           'PENDING' && (

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

              sendTyping(text);

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

          <Text style={styles.sendTxt}>
            Send
          </Text>

        </TouchableOpacity>

      </View>

    </SafeAreaView>
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

  messageBox: {
    maxWidth: '80%',

    paddingHorizontal: 14,
    paddingVertical: 10,

    borderRadius: 18,

    marginBottom: 14,
  },

  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4338CA',

    borderBottomRightRadius: 6,
  },

  ownerMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',

    borderBottomLeftRadius: 6,

    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  myMessageText: {
    color: '#fff',
    fontSize: 15,
  },

  ownerMessageText: {
    color: '#0F172A',
    fontSize: 15,
  },

  myTime: {
    color: '#E0E7FF',
    fontSize: 10,

    marginTop: 6,
    textAlign: 'right',
  },

  ownerTime: {
    color: '#94A3B8',
    fontSize: 10,

    marginTop: 6,
    textAlign: 'right',
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

    paddingHorizontal: 14,
    paddingVertical: 12,

    backgroundColor: '#fff',

    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },

  input: {
    flex: 1,

    backgroundColor: '#F1F5F9',

    borderRadius: 14,

    paddingHorizontal: 14,
    paddingVertical: 12,

    color: '#0F172A',
  },

  sendBtn: {
    marginLeft: 10,

    backgroundColor: '#4338CA',

    paddingHorizontal: 20,
    paddingVertical: 12,

    borderRadius: 14,
  },

  sendTxt: {
    color: '#fff',
    fontWeight: '800',
  },

});