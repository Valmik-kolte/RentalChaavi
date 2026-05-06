import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen({ navigation }) {
  const { logout, userData } = useContext(AuthContext);
  const user = userData || {};

  const menu = [
    { title: 'Edit Profile', screen: null },
    { title: 'Saved Rentals', screen: 'Favorites' },
    { title: 'Premium Plans', screen: 'Premium' },
    { title: 'My Chats', screen: 'Chats' },
    { title: 'Help & Support', screen: null },
    { title: 'Logout', screen: null },
  ];

  const handleMenu = item => {
    if (item.screen) {
      navigation.navigate(item.screen);
      return;
    }

    if (item.title === 'Logout') {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            Alert.alert('Success', 'Logged out successfully');
          },
        },
      ]);
      return;
    }

    Alert.alert(item.title);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.small}>Caryanam Broker</Text>
          <Text style={styles.title}>My Account</Text>
        </View>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>
              {(user.name || user.fullName || 'U')[0]}
            </Text>
          </View>

          <Text style={styles.name}>
            {user.name || user.fullName || user.username || 'No Name'}
          </Text>

          <Text style={styles.email}>{user.email || 'No Email'}</Text>

          <Text style={styles.mobile}>
            +91 {user.mobile || user.phone || user.contact || 'No Mobile'}
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeTxt}>
              {user.membership || 'Free'}
            </Text>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>4</Text>
            <Text style={styles.statLabel}>Chats</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>Pune</Text>
            <Text style={styles.statLabel}>City</Text>
          </View>
        </View>

        {/* MENU */}
        <View style={{ paddingHorizontal: 18, marginTop: 18 }}>
          {menu.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={
                item.title === 'Logout'
                  ? styles.logoutCard
                  : styles.menuCard
              }
              onPress={() => handleMenu(item)}
            >
              <Text
                style={
                  item.title === 'Logout'
                    ? styles.logoutTxt
                    : styles.menuTxt
                }
              >
                {item.title}
              </Text>
            </TouchableOpacity>
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
    paddingTop: 16,
    paddingHorizontal: 18,
    paddingBottom: 14,
  },

  small: {
    fontSize: 13,
    color: '#64748B',
  },

  title: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },

  profileCard: {
    marginHorizontal: 18,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: '#4338CA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarTxt: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '900',
  },

  name: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },

  email: {
    marginTop: 6,
    color: '#64748B',
    fontSize: 14,
  },

  mobile: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 14,
  },

  badge: {
    marginTop: 14,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  badgeTxt: {
    color: '#4338CA',
    fontWeight: '800',
    fontSize: 13,
  },

  statsRow: {
    marginHorizontal: 18,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statBox: {
    width: '31%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#4338CA',
  },

  statLabel: {
    marginTop: 6,
    fontSize: 13,
    color: '#64748B',
  },

  menuCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  menuTxt: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 15,
  },

  logoutCard: {
    backgroundColor: '#FEE2E2',
    padding: 18,
    borderRadius: 18,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#FECACA',
  },

  logoutTxt: {
    color: '#DC2626',
    fontWeight: '900',
    fontSize: 15,
    textAlign: 'center',
  },
});