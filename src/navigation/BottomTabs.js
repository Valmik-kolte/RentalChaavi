// src/navigation/BottomTabs.js
// FINAL CLEAN VERSION (ADMIN + OWNER + USER SWITCH)

import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Platform } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import ChatNavigator
from './ChatNavigator';
import {
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';


/* USER SCREENS */
import HomeScreen from '../screens/user/HomeScreen';
import PropertyListScreen from '../screens/user/PropertyListScreen';
import FavoritesScreen from '../screens/user/FavoritesScreen';
import ProfileScreen from '../screens/user/ProfileScreen';

/* OWNER SCREENS */
import OwnerHomeScreen from '../screens/owner/OwnerHomeScreen';
import AddPropertyScreen from '../screens/owner/AddPropertyScreen';
import MyListingsScreen from '../screens/owner/MyListingsScreen';
// import OwnerChatListScreen from '../screens/chat/OwnerChatListScreen';
import OwnerProfileScreen from '../screens/owner/OwnerProfileScreen';

/* ADMIN SCREENS */
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import PremiumRequestsScreen from '../screens/admin/PremiumRequestsScreen';
import ManagePropertiesScreen from '../screens/admin/ManagePropertiesScreen';
import UsersManagementScreen from '../screens/admin/UsersManagementScreen';

const Tab = createBottomTabNavigator();

/* 🔥 TAB ICON */
function TabIcon({ label, focused }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
      {focused && (
        <View
          style={{
            width: 6,
            height: 6,
            borderRadius: 10,
            backgroundColor: '#ff7a30',
            marginBottom: 5,
          }}
        />
      )}

      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          backgroundColor: focused ? '#ff7a30' : '#CBD5E1',
        }}
      />

      <Text
        style={{
          marginTop: 4,
          fontSize: 10,
          fontWeight: '700',
          color: focused ? '#ff7a30' : '#94A3B8',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function BottomTabs() {
  const { userRole } = useContext(AuthContext);

  const role = String(userRole || '').toUpperCase();

  const isAdmin = role.includes('ADMIN');
  const isOwner = role.includes('OWNER');

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          position: 'absolute',
          left: 12,
          right: 12,
          bottom: 12,
          height: Platform.OS === 'ios' ? 82 : 72,
          borderRadius: 24,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 18 : 10,
          elevation: 14,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
        },
      }}
    >

      {/* 🏠 HOME / DASHBOARD */}
      <Tab.Screen
        name="HomeTab"
        component={
          isAdmin
            ? AdminDashboardScreen
            : isOwner
            ? OwnerHomeScreen
            : HomeScreen
        }
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              label={
                isAdmin ? 'DASH' : isOwner ? 'DASH' : 'HOME'
              }
              focused={focused}
            />
          ),
        }}
      />

      {/* 📩 REQUESTS / ADD / RENT */}
      <Tab.Screen
        name="ActionTab"
        component={
          isAdmin
            ? PremiumRequestsScreen
            : isOwner
            ? AddPropertyScreen
            : PropertyListScreen
        }
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              label={
                isAdmin ? 'USER' : isOwner ? 'ADD' : 'RENT'
              }
              focused={focused}
            />
          ),
        }}
      />

      {/* 🏢 PROPERTIES / LIST */}
      
      {(isAdmin || isOwner) && (
        <Tab.Screen
          name="ListTab"
          component={
            isAdmin
              ? ManagePropertiesScreen
              : MyListingsScreen
          }
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon
                label={isAdmin ? 'OWNER' : 'LIST'}
                focused={focused}
              />
            ),
          }}
        />
      )}

      {/* 👥 CHAT */}

        {!isAdmin && (
          <Tab.Screen
            name="ChatTab"
            options={({ route }) => {

  const routeName =
    getFocusedRouteNameFromRoute(route) ?? '';

  const hideTab =
    routeName === 'UserChatScreen' ||
    routeName === 'OwnerChatScreen';

  return {

    tabBarStyle: {
      display: hideTab
        ? 'none'
        : 'flex',

      position: 'absolute',
      left: 12,
      right: 12,
      bottom: 12,
      height:
        Platform.OS === 'ios'
          ? 82
          : 72,

      borderRadius: 24,
      backgroundColor: '#FFFFFF',
      borderTopWidth: 0,
      paddingTop: 6,
      paddingBottom:
        Platform.OS === 'ios'
          ? 18
          : 10,

      elevation: 14,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: {
        width: 0,
        height: 5,
      },
    },

    tabBarIcon: ({ focused }) => (
      <TabIcon
        label="CHAT"
        focused={focused}
      />
    ),
  };
}}
          >
            {() => (
              <ChatNavigator role={role} />
            )}
          </Tab.Screen>
        )}

      {/* 👤 PROFILE */}
      <Tab.Screen
        name="ProfileTab"
        component={
          isOwner ? OwnerProfileScreen : ProfileScreen
        }
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon label="PROFILE" focused={focused} />
          ),
        }}
      />

    </Tab.Navigator>
  );
}