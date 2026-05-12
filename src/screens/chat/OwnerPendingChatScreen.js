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
  pendingChats,
  acceptChat,
  rejectChat,
} from '../../api/chatApi';

export default function OwnerPendingChatScreen({
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
          await pendingChats(
            parsed?.id
          );

        console.log(
          'PENDING CHATS:',
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
          'PENDING CHAT ERROR:',
          e?.response?.data || e
        );

      } finally {

        setLoading(false);

      }
    };

  /* =========================
     ACCEPT
  ========================= */

  const handleAccept =
    async roomId => {

      try {

        await acceptChat({
          roomId,
        });

        loadChats();

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
          Pending Requests
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
          No Pending Chats
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

            <View
              key={item.roomId}
              style={styles.card}
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
                     'New request'}

                  </Text>

                </View>

              </View>

              {/* ACTIONS */}

              <View style={styles.actionRow}>

                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() =>
                    handleAccept(
                      item.roomId
                    )
                  }
                >

                  <Text style={styles.editTxt}>
                    Accept
                  </Text>

                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() =>
                    handleReject(
                      item.roomId
                    )
                  }
                >

                  <Text style={styles.deleteTxt}>
                    Reject
                  </Text>

                </TouchableOpacity>

              </View>

              {/* OPEN CHAT */}

              <TouchableOpacity
                style={styles.chatBtn}
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

                <Text style={styles.chatTxt}>
                  Open Chat
                </Text>

              </TouchableOpacity>

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

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 18,
  },

  editBtn: {
    flex: 1,

    backgroundColor: '#4338CA',

    paddingVertical: 12,

    borderRadius: 12,

    alignItems: 'center',

    marginRight: 8,
  },

  editTxt: {
    color: '#fff',
    fontWeight: '800',
  },

  deleteBtn: {
    flex: 1,

    backgroundColor: '#FEE2E2',

    paddingVertical: 12,

    borderRadius: 12,

    alignItems: 'center',
  },

  deleteTxt: {
    color: '#DC2626',
    fontWeight: '800',
  },

  chatBtn: {
    marginTop: 14,

    backgroundColor: '#2563EB',

    paddingVertical: 14,

    borderRadius: 14,

    alignItems: 'center',
  },

  chatTxt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },

});