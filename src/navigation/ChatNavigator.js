import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

/* CHAT SCREENS */

import UserChatScreen
from '../screens/chat/UserChatScreen';

import OwnerChatScreen
from '../screens/chat/OwnerChatScreen';

import UserChatListScreen
from '../screens/chat/UserChatListScreen';

import OwnerChatListScreen
from '../screens/chat/OwnerChatListScreen';



const Stack =
  createNativeStackNavigator();

export default function ChatNavigator({

  role,

}) {

  const safeRole =
    String(role || '')
      .toUpperCase()
      .replace('ROLE_', '');

  /* =========================
     OWNER FLOW
  ========================= */

  if (
    safeRole ===
    'PROPERTY_OWNER'
  ) {

    return (

      <Stack.Navigator
        screenOptions={{
          headerShown:false,
          animation:
            'slide_from_right',
        }}
      >
        <Stack.Screen
          name="OwnerChats"
          component={
            OwnerChatListScreen
          }
        />

        {/* ROOM */}

        <Stack.Screen
          name="OwnerChatScreen"
          component={
            OwnerChatScreen
          }
          />

      </Stack.Navigator>

    );
  }

  /* =========================
     USER FLOW
  ========================= */

  return (

    <Stack.Navigator
      screenOptions={{
        headerShown:false,
        animation:
          'slide_from_right',
      }}
    >

      {/* USER LIST */}

      <Stack.Screen
        name="UserChats"
        component={
          UserChatListScreen
        }
      />

      {/* ROOM */}

      <Stack.Screen
        name="UserChatScreen"
        component={
          UserChatScreen
        }
      />

    </Stack.Navigator>

  );
}