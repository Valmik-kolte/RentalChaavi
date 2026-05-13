// src/navigation/OwnerStackNavigator.js
// FINAL CLEAN VERSION
// BottomTabs as ROOT (same behavior as user)

import React from 'react';

import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

/* 🔥 IMPORTANT */
import BottomTabs from './BottomTabs';


import EditPropertyScreen from '../screens/owner/EditPropertyScreen';
import PreviewPropertyScreen from '../screens/owner/PreviewPropertyScreen';
import OwnerPropertyDetailsScreen from '../screens/owner/OwnerPropertyDetailsScreen';
import OwnerChatListScreen
from '../screens/chat/OwnerChatListScreen';

/* SHARED FULL SCREENS */
import PropertyDetailsScreen from '../screens/user/PropertyDetailsScreen';
import PremiumScreen from '../screens/user/PremiumScreen';
import ChatNavigator
from './ChatNavigator';

const Stack = createNativeStackNavigator();

export default function OwnerStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Tabs"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        gestureEnabled: true,
        contentStyle: {
          backgroundColor: '#F8FAFC',
        },
      }}
    >

      {/* 🔥 MAIN ROOT (TABS) */}
      <Stack.Screen
        name="Tabs"
        component={BottomTabs}
      />

      {/* 🔥 FULL SCREENS (NO TABS) */}

      <Stack.Screen
        name="PreviewProperty"
        component={PreviewPropertyScreen}
      />
      
      <Stack.Screen
        name="PropertyDetails"
        component={OwnerPropertyDetailsScreen}
      />
      

      <Stack.Screen
        name="EditProperty"
        component={EditPropertyScreen}
      />

      <Stack.Screen
        name="Chats"
        component={ChatNavigator}
      />

      <Stack.Screen
        name="Premium"
        component={PremiumScreen}
      />
      <Stack.Screen
        name="OwnerChats"
        component={OwnerChatListScreen}
      />
    </Stack.Navigator>
  );
}