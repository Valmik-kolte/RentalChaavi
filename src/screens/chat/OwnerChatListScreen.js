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

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },

  emptyWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTxt: {
    fontSize: 16,
    color: '#64748B',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
  },

  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#4338CA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarTxt: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },

  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  message: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 13,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
  },

  accepted: {
    backgroundColor: '#DCFCE7',
  },

  rejected: {
    backgroundColor: '#FEE2E2',
  },

  pending: {
    backgroundColor: '#FEF3C7',
  },

  badgeTxt: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 18,
    alignItems: 'center',
  },

  acceptBtn: {
    backgroundColor: '#16A34A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },

  rejectBtn: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 10,
  },

  btnTxt: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  chatBtn: {
    flex: 1,
    backgroundColor: '#4338CA',
    paddingVertical: 10,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  chatTxt: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

});