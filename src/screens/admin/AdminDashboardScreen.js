import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import api from '../../api/axiosConfig';

export default function AdminDashboardScreen({ navigation }) {

  const [stats, setStats] = useState({
    users: 0,
    owners: 0,
    listings: 0,
    premium: 0,
  });

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const usersRes = await api.get('/admin/pending-users');
      const ownersRes = await api.get('/admin/pending-Owner');

      const users = usersRes?.data || [];
      const owners = ownersRes?.data || [];

      setStats({
        users: users.length,
        owners: owners.length,
        listings: 0,
        premium: 0,
      });

    } catch (e) {
      console.log('ERROR:', e?.response?.data || e.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  const actions = [
    { title: 'User Management', screen: 'UsersManagement' },
    { title: 'Owner Approvals', screen: 'OwnersApproval' },
    { title: 'Property Review', screen: 'PropertiesApproval' },
    { title: 'Premium Requests', screen: 'PremiumRequests' },
    { title: 'Reports & Analytics', screen: 'ReportsAnalytics' },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>Admin Panel</Text>
            <Text style={styles.tag}>Welcome Admin 👋</Text>
          </View>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.profileTxt}>Profile</Text>
          </TouchableOpacity>
        </View>

        {/* HERO */}
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>
            Control Platform{'\n'}Smartly
          </Text>

          <Text style={styles.heroSub}>
            Manage users, owners, properties and premium flows.
          </Text>
        </View>

        {/* STATS */}
        <Text style={styles.section}>Overview</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4338CA" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.grid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.users}</Text>
              <Text style={styles.statTitle}>Users</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.owners}</Text>
              <Text style={styles.statTitle}>Owners</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.listings}</Text>
              <Text style={styles.statTitle}>Listings</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.premium}</Text>
              <Text style={styles.statTitle}>Premium</Text>
            </View>
          </View>
        )}

        {/* ACTIONS */}
        <Text style={styles.section}>Quick Actions</Text>

        <View style={styles.cardWrap}>
          {actions.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={styles.actionCard}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.actionTxt}>{item.title}</Text>
              <Text style={styles.arrow}>→</Text>
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
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brand: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },

  tag: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },

  profileBtn: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },

  profileTxt: {
    color: '#fff',
    fontWeight: '800',
  },

  hero: {
    backgroundColor: '#4338CA',
    marginHorizontal: 18,
    borderRadius: 26,
    padding: 22,
    marginTop: 8,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 36,
  },

  heroSub: {
    color: '#E0E7FF',
    marginTop: 10,
  },

  section: {
    fontSize: 20,
    fontWeight: '900',
    marginHorizontal: 18,
    marginTop: 26,
    marginBottom: 14,
    color: '#0F172A',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },

  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  statValue: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4338CA',
  },

  statTitle: {
    marginTop: 6,
    color: '#64748B',
  },

  cardWrap: {
    paddingHorizontal: 18,
  },

  actionCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E7FF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  actionTxt: {
    fontWeight: '800',
    color: '#0F172A',
  },

  arrow: {
    color: '#94A3B8',
    fontSize: 16,
  },
});