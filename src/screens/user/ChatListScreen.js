import React from 'react';

import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function ChatListScreen({ navigation }) {
  const chats = [
    {
      id: 1,
      name: 'Rajesh Patil',
      property: '2 BHK Baner',
      msg: 'Is this rental still available?',
      time: '10:45 AM',
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: 'Amit Sharma',
      property: '1 BHK Wakad',
      msg: 'Can I visit tomorrow?',
      time: 'Yesterday',
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: 'Priya Desai',
      property: 'PG Hinjewadi',
      msg: 'Please share exact location',
      time: 'Mon',
      unread: 1,
      online: true,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Messages</Text>
          <Text style={styles.sub}>Your conversations</Text>
        </View>

        <View style={styles.countBox}>
          <Text style={styles.countTxt}>{chats.length}</Text>
        </View>
      </View>

      {/* CHAT LIST */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.container}>
          {chats.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate('ChatScreen', { chat: item })
              }
            >
              {/* AVATAR */}
              <View style={styles.avatarWrap}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarTxt}>
                    {item.name.substring(0, 1).toUpperCase()}
                  </Text>
                </View>

                {item.online && <View style={styles.online} />}
              </View>

              {/* CENTER */}
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.name}>{item.name}</Text>

                <Text style={styles.property}>{item.property}</Text>

                <Text numberOfLines={1} style={styles.msg}>
                  {item.msg}
                </Text>
              </View>

              {/* RIGHT */}
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.time}>{item.time}</Text>

                {item.unread > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeTxt}>{item.unread}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },

  sub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  countBox: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },

  countTxt: {
    color: '#fff',
    fontWeight: '800',
  },

  container: {
    paddingHorizontal: 18,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  avatarWrap: {
    position: 'relative',
  },

  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarTxt: {
    color: '#4338CA',
    fontWeight: '900',
    fontSize: 18,
  },

  online: {
    position: 'absolute',
    right: 2,
    bottom: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#fff',
  },

  name: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },

  property: {
    fontSize: 12,
    color: '#4338CA',
    marginTop: 2,
  },

  msg: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  time: {
    fontSize: 11,
    color: '#64748B',
  },

  badge: {
    backgroundColor: '#4338CA',
    marginTop: 6,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },

  badgeTxt: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },
});