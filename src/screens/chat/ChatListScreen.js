import React from 'react';

import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

export default function ChatListScreen({
  navigation,
}) {

  const chats = [

    {
      id: 1,
      name: 'Rahul Owner',
      msg: 'Is property available?',
    },

    {
      id: 2,
      name: 'Amit User',
      msg: 'Interested in flat.',
    },

  ];

  return (

    <SafeAreaView style={styles.container}>

      {/* HEADER */}

      <View style={styles.header}>

        <Text style={styles.heading}>
          Chats
        </Text>

      </View>

      {/* LIST */}

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 18,
          paddingBottom: 120,
          paddingTop: 10,
        }}
        showsVerticalScrollIndicator={
          false
        }
      >

        {chats.map(item => (

          <TouchableOpacity
            key={item.id}

            onPress={() =>

              navigation.navigate(
                'ChatRoom',
                {
                  user: item,
                }
              )

            }

            style={styles.card}
          >

            {/* AVATAR */}

            <View style={styles.avatar}>

              <Text style={styles.avatarTxt}>

                {item.name
                  ?.charAt(0)
                  ?.toUpperCase()}

              </Text>

            </View>

            {/* CENTER */}

            <View style={styles.center}>

              <Text style={styles.name}>

                {item.name}

              </Text>

              <Text
                numberOfLines={1}
                style={styles.msg}
              >

                {item.msg}

              </Text>

            </View>

            {/* STATUS */}

            <View style={styles.badge}>

              <Text style={styles.badgeTxt}>
                ACTIVE
              </Text>

            </View>

          </TouchableOpacity>

        ))}

      </ScrollView>

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
    paddingBottom: 16,
  },

  heading: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
  },

  card: {
    backgroundColor: '#fff',

    borderRadius: 20,

    padding: 16,

    marginBottom: 16,

    flexDirection: 'row',
    alignItems: 'center',

    elevation: 3,
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
    fontSize: 22,
    fontWeight: '900',
  },

  center: {
    flex: 1,
    marginLeft: 14,
  },

  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },

  msg: {
    marginTop: 6,
    color: '#64748B',
    lineHeight: 20,
  },

  badge: {
    backgroundColor: '#DCFCE7',

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 10,
  },

  badgeTxt: {
    color: '#166534',
    fontWeight: '800',
    fontSize: 11,
  },

});