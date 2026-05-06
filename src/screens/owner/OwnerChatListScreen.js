import React, { useState } from 'react';

import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function OwnerChatListScreen({ navigation }) {
  const [chats] = useState([
    {
      id: 1,
      tenant: 'Amit Sharma',
      property: '2 BHK Baner',
      msg: 'Can we visit today?',
      time: '10:20 AM',
      unread: 3,
      lead: 'Hot Lead',
    },
    {
      id: 2,
      tenant: 'Sneha Patil',
      property: '1 BHK Wakad',
      msg: 'What is final rent?',
      time: 'Yesterday',
      unread: 1,
      lead: 'Interested',
    },
    {
      id: 3,
      tenant: 'Rohan Jain',
      property: 'PG Hinjewadi',
      msg: 'Still available?',
      time: 'Mon',
      unread: 0,
      lead: 'New',
    },
  ]);

  const leadColor = type => {
    if (type === 'Hot Lead') return '#16A34A';
    if (type === 'Interested') return '#F59E0B';
    return '#4338CA';
  };

  const leadBg = type => {
    if (type === 'Hot Lead') return '#DCFCE7';
    if (type === 'Interested') return '#FEF3C7';
    return '#EEF2FF';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Tenant Leads</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.container}>
          {chats.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate('ChatScreen', {
                  chat: {
                    name: item.tenant,
                    property: item.property,
                  },
                })
              }
            >
              {/* AVATAR */}
              <View style={styles.avatar}>
                <Text style={styles.avatarTxt}>
                  {item.tenant.charAt(0).toUpperCase()}
                </Text>
              </View>

              {/* CENTER */}
              <View style={{ flex: 1, marginLeft: 14 }}>
                <View style={styles.row}>
                  <Text style={styles.name}>{item.tenant}</Text>

                  <View
                    style={[
                      styles.leadBadge,
                      { backgroundColor: leadBg(item.lead) },
                    ]}
                  >
                    <Text
                      style={[
                        styles.leadTxt,
                        { color: leadColor(item.lead) },
                      ]}
                    >
                      {item.lead}
                    </Text>
                  </View>
                </View>

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
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  back: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },

  title: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
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

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
  },

  leadBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  leadTxt: {
    fontSize: 11,
    fontWeight: '800',
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