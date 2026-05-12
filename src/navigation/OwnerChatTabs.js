import React from 'react';

import {
  createMaterialTopTabNavigator,
} from '@react-navigation/material-top-tabs';

import OwnerPendingChatScreen
from '../screens/chat/OwnerPendingChatScreen';

import OwnerAcceptedChatScreen
from '../screens/chat/OwnerAcceptedChatScreen';

import OwnerRejectedChatScreen
from '../screens/chat/OwnerRejectedChatScreen';

const Tab =
  createMaterialTopTabNavigator();

export default function OwnerChatTabs() {

  return (

    <Tab.Navigator

      screenOptions={{

        tabBarStyle: {
          backgroundColor:'#0D0D0D',
        },

        tabBarIndicatorStyle: {
          backgroundColor:'#FFD700',
          height:3,
        },

        tabBarActiveTintColor:
          '#FFD700',

        tabBarInactiveTintColor:
          '#777',

        tabBarLabelStyle: {
          fontWeight:'700',
          fontSize:12,
        },

      }}
    >

      {/* PENDING */}

      <Tab.Screen
        name="Pending"
        component={
          OwnerPendingChatScreen
        }
      />

      {/* ACTIVE */}

      <Tab.Screen
        name="Active"
        component={
          OwnerAcceptedChatScreen
        }
      />

      {/* REJECTED */}

      <Tab.Screen
        name="Rejected"
        component={
          OwnerRejectedChatScreen
        }
      />

    </Tab.Navigator>

  );
}