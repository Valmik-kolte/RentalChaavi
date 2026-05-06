import React, { useEffect, useState } from 'react';

import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getPendingUsers,
  getPendingOwners,
  approveUser,
  rejectUser,
  approveOwner,
  rejectOwner,
} from '../../api/adminApi';

export default function ManagePropertiesScreen({ navigation }) {

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);

      const users = await getPendingUsers();
      const owners = await getPendingOwners();

      const formattedUsers = users.map(u => ({
        id: u.userId,
        name: u.fullName,
        email: u.email,
        mobile: u.mobileNumber,
        status: u.premiumStatus,
        type: 'USER',
      }));

      const formattedOwners = owners.map(o => ({
        id: o.ownerId,
        name: o.fullName,
        email: o.email,
        mobile: o.mobileNumber,
        status: o.premiumStatus,
        type: 'OWNER',
      }));

      setRequests([...formattedUsers, ...formattedOwners]);

    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const approve = async (item) => {
    try {
      if (item.type === 'USER') {
        await approveUser(item.id);
      } else {
        await approveOwner(item.id);
      }

      Alert.alert('Approved');
      fetchRequests();
    } catch (e) {
      console.log(e);
      Alert.alert('Error approving');
    }
  };

  const reject = async (item) => {
    try {
      if (item.type === 'USER') {
        await rejectUser(item.id);
      } else {
        await rejectOwner(item.id);
      }

      Alert.alert('Rejected');
      fetchRequests();
    } catch (e) {
      console.log(e);
      Alert.alert('Error rejecting');
    }
  };

  const getStatusColor = status => {
    const s = status?.toLowerCase();
    if (s === 'approved') return '#16A34A';
    if (s === 'rejected') return '#EF4444';
    return '#F59E0B';
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Manage Requests</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.container}>

          {loading ? (
            <ActivityIndicator size="large" color="#4338CA" style={{ marginTop: 30 }} />
          ) : requests.length === 0 ? (
            <Text style={styles.empty}>No Requests Found</Text>
          ) : (
            requests.map(item => (
              <View key={item.id} style={styles.card}>

                <Text style={styles.cardTitle}>{item.name}</Text>

                <Text style={styles.meta}>{item.email}</Text>
                <Text style={styles.meta}>{item.mobile}</Text>

                <View style={styles.rowBetween}>
                  <Text style={styles.type}>{item.type}</Text>

                  <Text style={[
                    styles.status,
                    { color: getStatusColor(item.status) }
                  ]}>
                    {item.status?.toUpperCase()}
                  </Text>
                </View>

                {item.status?.toLowerCase() === 'pending' && (
                  <View style={styles.actionRow}>

                    <TouchableOpacity
                      style={styles.approveBtn}
                      onPress={() => approve(item)}
                    >
                      <Text style={styles.approveTxt}>Approve</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.rejectBtn}
                      onPress={() => reject(item)}
                    >
                      <Text style={styles.rejectTxt}>Reject</Text>
                    </TouchableOpacity>

                  </View>
                )}

              </View>
            ))
          )}

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

  container: {
    paddingHorizontal: 18,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },

  meta: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 13,
  },

  rowBetween: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  type: {
    fontWeight: '700',
    color: '#4338CA',
  },

  status: {
    fontWeight: '800',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 14,
  },

  approveBtn: {
    flex: 1,
    backgroundColor: '#4338CA',
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
  },

  rejectBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  approveTxt: {
    color: '#fff',
    fontWeight: '800',
  },

  rejectTxt: {
    color: '#DC2626',
    fontWeight: '800',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748B',
  },
});