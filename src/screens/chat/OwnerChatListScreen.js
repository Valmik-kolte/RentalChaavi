import React, {
  useEffect,
  useState,
} from 'react';

import { useFocusEffect }
from '@react-navigation/native';


import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import AsyncStorage
from '@react-native-async-storage/async-storage';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  pendingChats,
  acceptedChats,
  rejectedChats,
  acceptChat,
  rejectChat,
} from '../../api/chatApi';

export default function OwnerChatListScreen({
  navigation,
}) {

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [chats, setChats] =
    useState([]);

  /* =========================
     LOAD ALL CHATS
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

            console.log(
            'RAW USER DATA:',
            userData
            );

            const parsed =
            JSON.parse(userData);

            console.log(
            'OWNER USER DATA:',
            parsed
            );

            const ownerId =
            parsed?.id;

            console.log(
            'FINAL OWNER ID:',
            ownerId
            );

            console.log(
            'OWNER ID:',
            ownerId
            );

        const [

          pendingRes,

          acceptedRes,

          rejectedRes,

        ] = await Promise.all([

          pendingChats(ownerId),

          acceptedChats(ownerId),

          rejectedChats(ownerId),

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

            const uniqueChats =
            Array.from(

                new Map(

                allChats.map(item => [
                    item.roomId,
                    item
                ])

                ).values()

            );

            setChats(uniqueChats);

      } catch (e) {

        console.log(
          'OWNER CHAT LIST ERROR:',
          e?.response?.data || e
        );

      } finally {

        setLoading(false);

        setRefreshing(false);

      }
    };

  /* =========================
     ACCEPT
  ========================= */

  const handleAccept =
    async roomId => {

      try {

        console.log(
          'ACCEPTING ROOM:',
          roomId
        );

        const res =
          await acceptChat({
            roomId,
          });

        console.log(
          'ACCEPT RESPONSE:',
          res?.data
        );

        await loadChats();

      } catch (e) {

        console.log(
          'ACCEPT ERROR:',
          e?.response?.data || e
        );

      }
    };

  /* =========================
     REJECT
  ========================= */

  const handleReject =
    async roomId => {

      try {

        await rejectChat({
          roomId,
        });

        loadChats();

      } catch (e) {

        console.log(
          'REJECT ERROR:',
          e?.response?.data || e
        );

      }
    };

  /* =========================
     OPEN CHAT
  ========================= */

  const openChat =
    item => {

      navigation.navigate(
        'OwnerChatScreen',
        {
            status:
              item?.status,
              
          user: {

            id:
              item?.userId,

            name:
              item?.userName ||
              `User ${item?.userId}`,

          },

          property: {

            title:
              item?.propertyTitle ||
              'Property Chat',

          },

          roomData: {

            userId:
              item?.userId,

            ownerId:
              item?.ownerId,

            propertyId:
              item?.propertyId,

          },

        }
      );
    };

  /* =========================
     LOADING
  ========================= */

  if (loading) {

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

  return (

    <SafeAreaView style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.title}>
          Chats
        </Text>

      </View>

      {/* EMPTY */}

      {chats.length === 0 ? (

        <View style={styles.emptyWrap}>

          <Text style={styles.emptyTxt}>
            No Chats Found
          </Text>

        </View>

      ) : (

        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadChats();
              }}
            />
          }
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 30,
          }}
        >

          {chats.map(item => (

            <View
              key={item.roomId}
              style={styles.card}
            >

              {/* TOP */}

              <View style={styles.topRow}>

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

                <View style={{ flex: 1 }}>

                  <Text style={styles.name}>

                    {item?.userName ||
                     `User ${item?.userId}`}

                  </Text>

                  <Text
                    numberOfLines={1}
                    style={styles.message}
                  >

                    {item?.lastMessage ||
                     'No message'}

                  </Text>

                </View>

                {/* STATUS */}

                <View
                  style={[

                    styles.badge,

                    item.status ===
                    'ACCEPTED'

                      ? styles.accepted

                      : item.status ===
                        'REJECTED'

                      ? styles.rejected

                      : styles.pending

                  ]}
                >

                  <Text style={styles.badgeTxt}>

                    {item.status}

                  </Text>

                </View>

              </View>

              {/* ACTIONS */}

              <View style={styles.actionRow}>

                {item.status ===
                 'PENDING' && (

                  <>

                    <TouchableOpacity
                      style={styles.acceptBtn}
                      onPress={() =>
                        handleAccept(
                          item.roomId
                        )
                      }
                    >

                      <Text style={styles.btnTxt}>
                        Accept
                      </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.rejectBtn}
                      onPress={() =>
                        handleReject(
                          item.roomId
                        )
                      }
                    >

                      <Text style={styles.btnTxt}>
                        Reject
                      </Text>

                    </TouchableOpacity>

                  </>

                )}

                <TouchableOpacity

                disabled={
                    item.status ===
                    'REJECTED'
                }

                style={[

                    styles.chatBtn,

                    item.status ===
                    'REJECTED' && {
                    opacity: 0.5
                    }

                ]}

                onPress={() =>
                    openChat(item)
                }
                >

                  <Text style={styles.chatTxt}>
                    Open Chat
                  </Text>

                </TouchableOpacity>

              </View>

            </View>

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

  /* LOADER */

  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },

  /* HEADER */

  header: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,

    paddingHorizontal: 20,
    paddingVertical: 18,

    backgroundColor: '#ffffff',

    borderRadius: 26,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },

  title: {
    fontSize: 26,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: -0.5,
  },

  /* EMPTY */

  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTxt: {
    fontSize: 15,
    color: COLORS.lightText,
    fontWeight: '600',
  },

  /* CARD */

  card: {
    backgroundColor: '#ffffff',

    borderRadius: 28,

    padding: 18,

    marginBottom: 18,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },

  /* TOP ROW */

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* AVATAR */

  avatar: {
    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: '#fff1e8',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 14,

    borderWidth: 2,
    borderColor: '#ffe2cf',
  },

  avatarTxt: {
    color: COLORS.primary,

    fontSize: 20,

    fontWeight: '900',
  },

  /* CHAT DETAILS */

  name: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.secondary,
  },

  message: {
    marginTop: 5,

    color: COLORS.lightText,

    fontSize: 13,

    lineHeight: 20,
  },

  /* STATUS */

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 30,
  },

  accepted: {
    backgroundColor: '#dcfce7',
  },

  rejected: {
    backgroundColor: '#ffe4e6',
  },

  pending: {
    backgroundColor: '#fff7ed',
  },

  badgeTxt: {
    fontSize: 11,
    fontWeight: '800',
    color: COLORS.secondary,
  },

  /* ACTIONS */

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',

    marginTop: 20,
  },

  acceptBtn: {
    backgroundColor: '#16a34a',

    paddingHorizontal: 18,
    paddingVertical: 12,

    borderRadius: 16,

    marginRight: 10,
  },

  rejectBtn: {
    backgroundColor: '#e11d48',

    paddingHorizontal: 18,
    paddingVertical: 12,

    borderRadius: 16,

    marginRight: 10,
  },

  btnTxt: {
    color: '#ffffff',

    fontWeight: '800',

    fontSize: 13,
  },

  /* OPEN CHAT */

  chatBtn: {
    flex: 1,

    backgroundColor: COLORS.primary,

    paddingVertical: 12,

    borderRadius: 16,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },

  chatTxt: {
    color: '#ffffff',

    fontWeight: '800',

    fontSize: 13,
  },

});