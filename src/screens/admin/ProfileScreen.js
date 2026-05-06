import React, { useEffect, useState, useContext } from 'react';

import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {

  const { logout } = useContext(AuthContext);

  const [admin, setAdmin] = useState({
    name: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      const storedData = await AsyncStorage.getItem('userData');

      if (storedData) {
        const parsed = JSON.parse(storedData);

        setAdmin({
          name: parsed.fullName || parsed.name || 'Admin',
          email: parsed.email || 'No Email',
          role: parsed.role || 'ADMIN',
        });
      }
    } catch (e) {
      console.log('ERROR:', e);
    }
  };

  const handleLogout = () => {
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
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Admin Profile</Text>

          <View style={{ width: 24 }} />
        </View>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarTxt}>
              {(admin.name || 'A')[0]}
            </Text>
          </View>

          <Text style={styles.name}>{admin.name}</Text>
          <Text style={styles.email}>{admin.email}</Text>

          <View style={styles.roleBox}>
            <Text style={styles.role}>{admin.role}</Text>
          </View>
        </View>

        {/* OPTIONS */}
        <View style={styles.card}>
          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.item}>
            <Text style={styles.itemText}>Settings</Text>
          </TouchableOpacity>
        </View>

        {/* LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

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
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4338CA',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarTxt: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
  },

  name: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },

  email: {
    marginTop: 6,
    color: '#64748B',
  },

  roleBox: {
    marginTop: 12,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },

  role: {
    color: '#4338CA',
    fontWeight: '800',
  },

  card: {
    marginHorizontal: 18,
    marginTop: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  item: {
    padding: 18,
    borderBottomWidth: 1,
    borderColor: '#E0E7FF',
  },

  itemText: {
    color: '#0F172A',
    fontWeight: '700',
  },

  logoutBtn: {
    marginHorizontal: 18,
    marginTop: 20,
    backgroundColor: '#FEE2E2',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
  },

  logoutText: {
    color: '#DC2626',
    fontWeight: '900',
  },
});