    import React, {
      useEffect,
      useState
    } from 'react';

    import {
      StatusBar,
      ScrollView,
      View,
      Text,
      TouchableOpacity,
      StyleSheet,
      ActivityIndicator,
    } from 'react-native';

    import AsyncStorage
    from '@react-native-async-storage/async-storage';

    import {
      pendingChats,
      acceptChat,
      rejectChat,
    } from '../../api/chatApi';

    import {
      SafeAreaView
    } from 'react-native-safe-area-context';

    export default function OwnerChatListScreen({ navigation }) {
      const [loading, setLoading] =
      useState(true);

    const [chats, setChats] =
      useState([]);

    const [ownerId, setOwnerId] =
      useState(null);

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

        setOwnerId(parsed?.id);

        const res =
          await pendingChats(
            parsed?.id
          );

        console.log(
          'PENDING CHAT RESPONSE:',
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

    const handleAccept =
      async roomId => {

        try {

          await acceptChat({
            roomId,
          });

          fetchChats();

        } catch (e) {

          console.log(
            'ACCEPT ERROR:',
            e?.response?.data || e
          );

        }
      };

      const handleReject =
      async roomId => {

        try {

          await rejectChat({
            roomId,
          });

          fetchChats();

        } catch (e) {

          console.log(
            'REJECT ERROR:',
            e?.response?.data || e
          );

        }
      };
      
      if (loading) {

      return (

        <View style={{
          flex:1,
          justifyContent:'center',
          alignItems:'center',
          backgroundColor:'#F8FAFC'
        }}>

          <ActivityIndicator
            size="large"
            color="#4338CA"
          />

        </View>

      );
    }
  

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
     <ScrollView
  showsVerticalScrollIndicator={false}
  contentContainerStyle={{
    paddingBottom: 40
  }}
>

        <View style={styles.container}>

            {chats.map(item => (

              <View
                key={item.roomId}
                style={styles.card}
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
                  flex: 1,
                  marginLeft: 14
                }}>

                  <View style={styles.row}>

                    <Text style={styles.name}>
                      User #{item.userId}
                    </Text>

                  </View>

                  <Text style={styles.property}>
                    Pending Property Chat
                  </Text>

                  <Text
                    numberOfLines={1}
                    style={styles.msg}
                  >
                    {item.lastMessage}
                  </Text>

                  {/* ACTIONS */}
                  <View style={{
                    flexDirection:'row',
                    marginTop:12,
                  }}>

                    <TouchableOpacity
                      onPress={() =>
                        handleAccept(
                          item.roomId
                        )
                      }
                      style={{
                        backgroundColor:'#16A34A',
                        paddingHorizontal:16,
                        paddingVertical:8,
                        borderRadius:10,
                        marginRight:10,
                      }}
                    >

                      <Text style={{
                        color:'#fff',
                        fontWeight:'700',
                      }}>
                        Accept
                      </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        handleReject(
                          item.roomId
                        )
                      }
                      style={{
                        backgroundColor:'#DC2626',
                        paddingHorizontal:16,
                        paddingVertical:8,
                        borderRadius:10,
                      }}
                    >

                      <Text style={{
                        color:'#fff',
                        fontWeight:'700',
                      }}>
                        Reject
                      </Text>

                    </TouchableOpacity>

                  </View>

                  {/* OPEN CHAT */}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(
                        'ChatScreen',
                        {
                          user: {
                            id: item.ownerId,
                            name:
                              `User ${item.userId}`,
                          },

                          property: {
                            title:
                              'Property Chat',
                          },
                        }
                      )
                    }
                    style={{
                      marginTop:12,
                      backgroundColor:'#4338CA',
                      paddingVertical:10,
                      borderRadius:10,
                      alignItems:'center',
                    }}
                  >

                    <Text style={{
                      color:'#fff',
                      fontWeight:'700',
                    }}>
                      Open Chat
                    </Text>

                  </TouchableOpacity>

                </View>

                {/* RIGHT */}
                <View style={{
                  alignItems:'flex-end'
                }}>

                  <Text style={styles.time}>
                    {item.time || 'Now'}
                  </Text>

                </View>

              </View>

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