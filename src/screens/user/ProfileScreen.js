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

  const handleLogout = () => {

    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (e) {
              console.log('Logout Error', e);
            }
          },
        },
      ]
    );

  };

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right']}
    >

      <StatusBar
        backgroundColor="#F8FAFC"
        barStyle="dark-content"
      />

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>
            ←
          </Text>
        </TouchableOpacity>

        <Text style={styles.title}>
          My Profile
        </Text>

        <View style={{ width: 24 }} />

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* PROFILE CARD */}

        <View style={styles.profileCard}>

          <View style={styles.avatar}>

            <Text style={styles.avatarTxt}>
              {(user.name || user.fullName || 'U')[0].toUpperCase()}
            </Text>

          </View>

          <Text style={styles.name}>
            {user.name || user.fullName || 'User'}
          </Text>

          <Text style={styles.role}>
            Rental User Account
          </Text>

        </View>

        {/* DETAILS */}

        <View style={styles.detailsCard}>

          <Text style={styles.sectionTitle}>
            Account Details
          </Text>

          <View style={styles.detailRow}>

            <Text style={styles.label}>
              Email Address
            </Text>

            <Text style={styles.value}>
              {user.email || 'Not Available'}
            </Text>

          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>

            <Text style={styles.label}>
              Mobile Number
            </Text>

            <Text style={styles.value}>
              +91 {user.mobile || user.phone || 'Not Available'}
            </Text>

          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>

            {/* <Text style={styles.label}>
              Membership
            </Text>

            <Text style={styles.value}>
              {user.membership || 'Free Plan'}
            </Text> */}

          </View>

        </View>

        {/* LOGOUT */}

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={handleLogout}
        >

          <Text style={styles.logoutTxt}>
            Logout
          </Text>

        </TouchableOpacity>

        {/* FOOTER */}

        <View style={styles.footer}>

          <Text style={styles.footerText}>
            Caryanam Broker • Smart Rental Management
          </Text>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

const COLORS = {
  primary: '#ff7a30',
  secondary: '#132238',
  bg: '#f8f3ed',
  white: '#ffffff',
  text: '#1f2937',
  lightText: '#6b7280',
  border: '#eadfd3',
};

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  scroll: {
    paddingBottom: 40,
  },

  /* HEADER */

  header: {
    marginHorizontal: 16,
    marginTop: 10,

    paddingHorizontal: 18,
    paddingVertical: 16,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: '#ffffff',

    borderRadius: 24,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },

  back: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.secondary,
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.secondary,
    letterSpacing: 0.3,
  },

  /* PROFILE CARD */

  profileCard: {
    marginHorizontal: 16,
    marginTop: 20,

    backgroundColor: '#ffffff',

    borderRadius: 30,

    paddingVertical: 34,

    alignItems: 'center',

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  avatar: {
    width: 100,
    height: 100,

    borderRadius: 50,

    backgroundColor: '#fff1e8',

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 3,
    borderColor: '#ffe2cf',
  },

  avatarTxt: {
    color: COLORS.primary,

    fontSize: 34,

    fontWeight: '900',
  },

  name: {
    marginTop: 18,

    fontSize: 24,

    fontWeight: '900',

    color: COLORS.secondary,
  },

  role: {
    marginTop: 8,

    color: COLORS.lightText,

    fontSize: 14,

    fontWeight: '600',
  },

  /* DETAILS CARD */

  detailsCard: {
    marginHorizontal: 16,
    marginTop: 20,

    backgroundColor: '#ffffff',

    borderRadius: 28,

    padding: 22,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },

  sectionTitle: {
    fontSize: 19,

    fontWeight: '800',

    color: COLORS.secondary,

    marginBottom: 20,
  },

  detailRow: {
    paddingVertical: 8,
  },

  label: {
    fontSize: 13,

    color: COLORS.lightText,

    marginBottom: 8,

    fontWeight: '600',
  },

  value: {
    fontSize: 15,

    fontWeight: '700',

    color: COLORS.secondary,

    lineHeight: 22,
  },

  divider: {
    height: 1,

    backgroundColor: '#f1e6dc',

    marginVertical: 14,
  },

  /* LOGOUT BUTTON */

  logoutBtn: {
    marginHorizontal: 16,
    marginTop: 24,

    backgroundColor: COLORS.primary,

    paddingVertical: 18,

    borderRadius: 22,

    alignItems: 'center',

    shadowColor: COLORS.primary,
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 3,
  },

  logoutTxt: {
    color: '#ffffff',

    fontSize: 15,

    fontWeight: '800',
  },

  /* FOOTER */

  footer: {
    marginTop: 32,
    alignItems: 'center',
    paddingBottom: 10,
  },

  footerText: {
    color: '#94a3b8',

    fontSize: 12,

    fontWeight: '600',
  },

});