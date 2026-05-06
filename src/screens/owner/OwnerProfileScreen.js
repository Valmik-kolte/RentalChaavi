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

export default function OwnerProfileScreen({ navigation }) {
  const { logout, userData } = useContext(AuthContext);
  const owner = userData || {};

  const menu = [
    { title: 'Edit Profile', screen: null },
    { title: 'My Listings', screen: 'MyListings' },
    { title: 'Premium Plans', screen: 'Premium' },
    { title: 'Documents', screen: null },
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
            try {
              await logout();
              Alert.alert('Success', 'Logged out successfully');
            } catch (e) {
              console.log('Logout Error', e);
            }
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

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Owner Profile</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* PROFILE */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>
              {(owner.name || owner.fullName || 'U')[0]}
            </Text>
          </View>

          <Text style={styles.name}>
            {owner.name || owner.fullName || owner.username || 'No Name'}
          </Text>

          <Text style={styles.email}>
            {owner.email || 'No Email'}
          </Text>

          <Text style={styles.mobile}>
            +91 {owner.mobile || owner.phone || owner.contact || 'No Mobile'}
          </Text>

          <View style={styles.badge}>
            <Text style={styles.badgeTxt}>
              {owner.plan || 'Free Plan'}
            </Text>
          </View>
        </View>

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {owner.totalListings || 0}
            </Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {owner.activeListings || 0}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statValue}>
              {owner.rentedListings || 0}
            </Text>
            <Text style={styles.statLabel}>Rented</Text>
          </View>
        </View>

        {/* MENU */}
        <View style={{ paddingHorizontal: 18, marginTop: 18 }}>
          {menu.map((item, i) => (
            <TouchableOpacity
              key={i}
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

              {item.title !== 'Logout' && (
                <Text style={styles.arrow}>→</Text>
              )}
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

  profileCard: {
    marginHorizontal: 18,
    backgroundColor: '#fff',
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
  },

  mobile: {
    marginTop: 4,
    color: '#64748B',
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
  },

  statsRow: {
    marginHorizontal: 18,
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  statBox: {
    width: '31%',
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  menuTxt: {
    color: '#0F172A',
    fontWeight: '800',
  },

  arrow: {
    color: '#94A3B8',
    fontSize: 16,
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
    textAlign: 'center',
  },
});