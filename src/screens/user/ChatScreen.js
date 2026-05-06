import React, { useState } from 'react';

import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatScreen({ navigation, route }) {
  const chat = route?.params?.chat || {
    name: 'Rajesh Patil',
    property: '2 BHK Apartment',
  };

  const [message, setMessage] = useState('');

  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'owner',
      text: 'Hello, this rental is available.',
      time: '10:30 AM',
    },
    {
      id: 2,
      type: 'me',
      text: 'Can I visit tomorrow?',
      time: '10:32 AM',
    },
    {
      id: 3,
      type: 'owner',
      text: 'Yes, after 11 AM works.',
      time: '10:35 AM',
    },
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        type: 'me',
        text: message,
        time: 'Now',
      },
    ]);

    setMessage('');
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.name}>{chat.name}</Text>
          <Text style={styles.property}>{chat.property}</Text>
        </View>

        <View style={styles.onlineDot} />
      </View>

      {/* CHAT BODY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatContainer}
      >
        {messages.map(item => (
          <View
            key={item.id}
            style={[
              styles.msgWrap,
              item.type === 'me'
                ? { alignItems: 'flex-end' }
                : { alignItems: 'flex-start' },
            ]}
          >
            <View
              style={[
                styles.msgBox,
                item.type === 'me'
                  ? styles.myMsg
                  : styles.ownerMsg,
              ]}
            >
              <Text
                style={[
                  styles.msgTxt,
                  item.type === 'me' && { color: '#fff' },
                ]}
              >
                {item.text}
              </Text>

              <Text
                style={[
                  styles.time,
                  item.type === 'me' && { color: '#E0E7FF' },
                ]}
              >
                {item.time}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* INPUT */}
      <View style={styles.bottom}>
        <TextInput
          placeholder="Type message..."
          placeholderTextColor="#94A3B8"
          value={message}
          onChangeText={setMessage}
          style={styles.input}
        />

        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendTxt}>Send</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  back: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },

  name: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },

  property: {
    fontSize: 12,
    color: '#4338CA',
    marginTop: 2,
  },

  onlineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#22C55E',
  },

  chatContainer: {
    padding: 18,
    paddingBottom: 110,
  },

  msgWrap: {
    marginBottom: 14,
  },

  msgBox: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  ownerMsg: {
    backgroundColor: '#EEF2FF',
  },

  myMsg: {
    backgroundColor: '#4338CA',
  },

  msgTxt: {
    fontSize: 14,
    color: '#0F172A',
  },

  time: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 6,
    alignSelf: 'flex-end',
  },

  bottom: {
    position: 'absolute',
    left: 12,
    right: 12,
    bottom: 12,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  input: {
    flex: 1,
    paddingHorizontal: 12,
  },

  sendBtn: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 16,
    justifyContent: 'center',
    borderRadius: 14,
  },

  sendTxt: {
    color: '#fff',
    fontWeight: '800',
  },
});