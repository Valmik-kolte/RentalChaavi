import React, {
  useState,
  useCallback,
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
  useFocusEffect,
} from '@react-navigation/native';

import {
  pendingChats,
  acceptedChats,
  rejectedChats,
} from '../../api/chatApi';


export default function UserChatListScreen({
  navigation,
}) {

  const [loading, setLoading] =
    useState(true);

  const [chats, setChats] =
    useState([]);

  /* =========================
     LOAD CHATS
  ========================= */

  useFocusEffect(
    useCallback(() => {

      loadChats();

    }, [])
  );

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

        console.log(
          'CURRENT USER:',
          parsed
        );

        const OWNER_ID = 1;

          const [

            pendingRes,

            acceptedRes,

            rejectedRes,

          ] = await Promise.all([

            pendingChats(
              OWNER_ID
            ),

            acceptedChats(
              OWNER_ID
            ),

            rejectedChats(
              OWNER_ID
            ),

          ]);
              const pending =
                (pendingRes?.data?.data || [])
                .map(item => ({
                  ...item,
                  status: 'PENDING',
                }));

              const accepted =
                (acceptedRes?.data?.data || [])
                .map(item => ({
                  ...item,
                  status: 'ACCEPTED',
                }));

              const rejected =
                (rejectedRes?.data?.data || [])
                .map(item => ({
                  ...item,
                  status: 'REJECTED',
                }));

              const allChats = [

                ...pending,

                ...accepted,

                ...rejected,

              ];

              /* ONLY CURRENT USER CHATS */

              const filteredChats =
                allChats.filter(
                  item =>
                    Number(item?.userId) ===
                    Number(parsed?.id)
                );

              /* REMOVE DUPLICATES */

              const uniqueChats =
                Array.from(
                  new Map(
                    filteredChats.map(item => [
                      item.roomId ||
                      `${item.userId}-${item.ownerId}-${item.propertyId}`,
                      item,
                    ])
                  ).values()
                );

              console.log(
                'ALL USER CHATS:',
                uniqueChats
              );

              setChats(uniqueChats);

      } catch (e) {

        console.log(
          'CHAT LIST ERROR:',
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
          My Chats
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
          No Chats Yet
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
                  'UserChatScreen',
                  {

                    user: {

                      id:
                        item?.ownerId,

                      name:
                        item?.ownerName ||
                        'Owner',

                    },

                    property: {

                      title:
                        item?.propertyTitle ||
                        'Property Chat',

                    },

                    roomData: {

                      roomId:
                        item?.roomId,

                      userId:
                        item?.userId,

                      ownerId:
                        item?.ownerId,

                      

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
                      item?.ownerName ||
                      'O'
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

                    {item?.ownerName ||
                     'Owner'}

                  </Text>

                  <Text
                    numberOfLines={1}
                    style={styles.location}
                  >

                    {
                      item?.lastMessage ||
                      item?.message ||
                      'Start conversation'
                    }

                  </Text>

                </View>

                {/* TIME */}

                <Text style={styles.time}>

                  {item?.time ||
                   'Now'}

                </Text>

              </View>

              {/* STATUS */}

              <View
                  style={[

                    styles.statusBox,

                    item.status ===
                    'ACCEPTED'

                      ? {
                          backgroundColor:
                          '#DCFCE7'
                        }

                      : item.status ===
                        'REJECTED'

                      ? {
                          backgroundColor:
                          '#FEE2E2'
                        }

                      : {
                          backgroundColor:
                          '#FEF3C7'
                        }

                  ]}
                  >

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

  /* HEADER */

  header: {
    marginHorizontal: 16,
    marginTop: 10,

    paddingHorizontal: 18,
    paddingVertical: 16,

    borderRadius: 24,

    backgroundColor: '#111111',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  back: {
    fontSize: 22,
    fontWeight: '900',
    color: '#ffffff',
  },

  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.2,
  },

  /* LOADER */

  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* EMPTY */

  empty: {
    textAlign: 'center',

    marginTop: 60,

    color: COLORS.lightText,

    fontSize: 15,

    fontWeight: '600',
  },

  /* CARD */

  card: {
    backgroundColor: '#ffffff',

    borderRadius: 28,

    marginBottom: 16,

    padding: 18,

    borderWidth: 1,
    borderColor: '#f3e7dc',

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  /* AVATAR */

  avatar: {
    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: '#fff1e8',

    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarTxt: {
    color: COLORS.primary,

    fontWeight: '900',

    fontSize: 20,
  },

  /* CHAT DETAILS */

  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.secondary,
  },

  location: {
    marginTop: 6,

    color: '#6b7280',

    lineHeight: 19,

    fontSize: 13,
  },

  time: {
    color: '#94a3b8',

    fontSize: 10,

    fontWeight: '700',

    marginLeft: 8,
  },

  /* STATUS */

  statusBox: {
    alignSelf: 'flex-start',

    marginTop: 14,

    paddingHorizontal: 13,
    paddingVertical: 6,

    borderRadius: 30,
  },

  status: {
    fontWeight: '800',
    fontSize: 12,
    color: '#166534',
  },

});