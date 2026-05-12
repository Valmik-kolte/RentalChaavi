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
  acceptedChats,
} from '../../api/chatApi';

export default function AcceptedChatListScreen({
  navigation,
}) {

  const [loading, setLoading] =
    useState(true);

  const [chats, setChats] =
    useState([]);

  useEffect(() => {

    fetchChats();

  }, []);

  const fetchChats = async () => {

    try {

      setLoading(true);

      const userData =
        await AsyncStorage.getItem(
          'user'
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

  if (loading) {

    return (

      <View style={styles.loaderWrap}>

        <ActivityIndicator
          size="large"
          color="#4338CA"
        />

      </View>

    );
  }

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Active Chats
      </Text>

      <ScrollView
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
                'ChatScreen',
                {
                  user: {
                    id:
                      item.ownerId,

                    name:
                      `User ${item.userId}`,
                  },

                  property: {
                    title:
                      'Accepted Property Chat',
                  },
                }
              )
            }
          >

            {/* AVATAR */}
            <View style={styles.avatar}>

              <Text style={styles.avatarTxt}>
                {String(item.userId)
                  .charAt(0)
                  .toUpperCase()}
              </Text>

            </View>

            {/* CENTER */}
            <View style={{
              flex:1,
              marginLeft:14,
            }}>

              <Text style={styles.name}>
                User #{item.userId}
              </Text>

              <Text style={styles.property}>
                Active Conversation
              </Text>

              <Text
                numberOfLines={1}
                style={styles.msg}
              >
                {item.lastMessage}
              </Text>

            </View>

            {/* RIGHT */}
            <View style={{
              alignItems:'flex-end'
            }}>

              <Text style={styles.time}>
                {item.time || 'Now'}
              </Text>

              <View style={styles.activeBadge}>

                <Text style={styles.activeTxt}>
                  ACTIVE
                </Text>

              </View>

            </View>

          </TouchableOpacity>

        ))}

      </ScrollView>

    </View>

  );
}

const styles = StyleSheet.create({

  container: {
    flex:1,
    backgroundColor:'#F8FAFC',
    padding:18,
  },

  loaderWrap: {
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#F8FAFC',
  },

  title: {
    fontSize:24,
    fontWeight:'900',
    color:'#0F172A',
    marginBottom:20,
  },

  card: {
    backgroundColor:'#fff',
    borderRadius:18,
    padding:14,
    marginBottom:14,
    flexDirection:'row',
    alignItems:'center',
    borderWidth:1,
    borderColor:'#E0E7FF',
  },

  avatar: {
    width:54,
    height:54,
    borderRadius:27,
    backgroundColor:'#DCFCE7',
    justifyContent:'center',
    alignItems:'center',
  },

  avatarTxt: {
    color:'#16A34A',
    fontWeight:'900',
    fontSize:18,
  },

  name: {
    fontSize:15,
    fontWeight:'900',
    color:'#0F172A',
  },

  property: {
    fontSize:12,
    color:'#16A34A',
    marginTop:2,
  },

  msg: {
    fontSize:13,
    color:'#64748B',
    marginTop:4,
  },

  time: {
    fontSize:11,
    color:'#64748B',
  },

  activeBadge: {
    backgroundColor:'#DCFCE7',
    paddingHorizontal:8,
    paddingVertical:4,
    borderRadius:10,
    marginTop:8,
  },

  activeTxt: {
    color:'#16A34A',
    fontSize:10,
    fontWeight:'800',
  },

});