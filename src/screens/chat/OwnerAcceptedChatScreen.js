import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

import AsyncStorage
from '@react-native-async-storage/async-storage';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  acceptedChats,
} from '../../api/chatApi';

export default function OwnerAcceptedChatScreen({
  navigation,
}) {

  const [loading, setLoading] =
    useState(true);

  const [chats, setChats] =
    useState([]);

  /* =========================
     LOAD CHATS
  ========================= */

  useEffect(() => {

    loadChats();

  }, []);

  const loadChats =
    async () => {

      try {

        setLoading(true);

        const userData =
          await AsyncStorage.getItem(
            'userData'
          );

        const parsed =
          JSON.parse(userData);

        const res =
          await acceptedChats(
            parsed?.id
          );

        console.log(
          'ACCEPTED CHATS:',
          JSON.stringify(
            res?.data,
            null,
            2
          )
        );

        setChats(
          res?.data?.data || []
        );

      } catch (e) {

        console.log(
          'ACCEPTED CHAT ERROR:',
          e?.response?.data || e
        );

      } finally {

        setLoading(false);

      }
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

        <Text style={styles.title}>
          Active Chats
        </Text>

        <View style={{ width: 24 }} />

      </View>

      {/* LOADING */}

      {loading ? (

        <View style={styles.loaderWrap}>

          <ActivityIndicator
            size="large"
            color="#4338CA"
          />

        </View>

      ) : chats.length === 0 ? (

        /* EMPTY */

        <Text style={styles.empty}>
          No Active Chats
        </Text>

      ) : (

        <ScrollView
          contentContainerStyle={{
            paddingHorizontal: 18,
            paddingBottom: 30,
          }}
          showsVerticalScrollIndicator={
            false
          }
        >

          {chats.map(item => (

            <TouchableOpacity
              key={item.roomId}
              style={styles.card}
              onPress={() =>

                navigation.navigate(
                  'ChatRoom',
                  {

                    user: {

                      id:
                        item?.userId,

                      name:
                        item?.userName ||
                        'User',

                    },

                    property: {

                      title:
                        item?.propertyTitle ||
                        'Property Chat',

                    },

                  }
                )
              }
            >

              {/* TOP */}

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >

                {/* AVATAR */}

                <View style={styles.avatar}>

                  <Text style={styles.avatarTxt}>

                    {String(
                      item?.userName ||
                      'U'
                    )
                      .charAt(0)
                      .toUpperCase()}

                  </Text>

                </View>

                {/* CENTER */}

                <View
                  style={{
                    flex: 1,
                    marginLeft: 14,
                  }}
                >

                  <Text style={styles.cardTitle}>

                    {item?.userName ||
                     `User ${item?.userId}`}

                  </Text>

                  <Text
                    numberOfLines={1}
                    style={styles.location}
                  >

                    {item?.lastMessage ||
                     'No messages'}

                  </Text>

                </View>

                {/* TIME */}

                <Text style={styles.time}>

                  {item?.time ||
                   'Now'}

                </Text>

              </View>

              {/* STATUS */}

              <View style={styles.statusBox}>

                <Text style={styles.status}>

                  {item?.status ||
                   'ACTIVE'}

                </Text>

              </View>

            </TouchableOpacity>

          ))}

        </ScrollView>

      )}

    </SafeAreaView>

  );
}

const styles = StyleSheet.create({

  container: {
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

  back: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },

  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },

  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748B',
    fontSize: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,

    marginBottom: 18,

    overflow: 'hidden',

    elevation: 3,

    padding: 16,
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,

    backgroundColor: '#EEF2FF',

    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarTxt: {
    color: '#4338CA',
    fontWeight: '900',
    fontSize: 22,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },

  location: {
    marginTop: 6,
    color: '#64748B',
    lineHeight: 20,
  },

  time: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
  },

  statusBox: {
    alignSelf: 'flex-start',

    marginTop: 16,

    paddingHorizontal: 14,
    paddingVertical: 6,

    borderRadius: 10,

    backgroundColor: '#DCFCE7',
  },

  status: {
    fontWeight: '800',
    color: '#166534',
  },

});