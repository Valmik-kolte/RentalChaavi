import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
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

export default function PremiumRequestsScreen() {
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
      console.log("ERROR:", e?.response?.data || e.message);
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

      Alert.alert("Approved");
      fetchRequests();
    } catch {
      Alert.alert("Error approving");
    }
  };

  const reject = async (item) => {
    try {
      if (item.type === 'USER') {
        await rejectUser(item.id);
      } else {
        await rejectOwner(item.id);
      }

      Alert.alert("Rejected");
      fetchRequests();
    } catch {
      Alert.alert("Error rejecting");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>

      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Premium Requests</Text>
          <Text style={styles.sub}>Approve or reject premium users</Text>
        </View>

        {/* BODY */}
        {loading ? (
          <ActivityIndicator size="large" color="#4338CA" style={{ marginTop: 30 }} />
        ) : requests.length === 0 ? (
          <Text style={styles.empty}>No Requests Found</Text>
        ) : (
          <View style={styles.container}>
            {requests.map(item => (
              <View key={item.id} style={styles.card}>

                <Text style={styles.name}>{item.name}</Text>

                <Text style={styles.info}>{item.email}</Text>
                <Text style={styles.info}>{item.mobile}</Text>

                <View style={styles.rowBetween}>
                  <Text style={styles.type}>{item.type}</Text>

                  <Text
                    style={[
                      styles.status,
                      item.status?.toLowerCase() === 'pending'
                        ? { color: '#F59E0B' }
                        : { color: '#16A34A' },
                    ]}
                  >
                    {item.status?.toUpperCase()}
                  </Text>
                </View>

                {item.status?.toLowerCase() === 'pending' && (
                  <View style={styles.actionRow}>

                    <TouchableOpacity
                      style={styles.approve}
                      onPress={() => approve(item)}
                    >
                      <Text style={styles.btnText}>Approve</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.reject}
                      onPress={() => reject(item)}
                    >
                      <Text style={styles.btnText}>Reject</Text>
                    </TouchableOpacity>

                  </View>
                )}
              </View>
            ))}
          </View>
        )}

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
    paddingBottom: 14,
  },

  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },

  sub: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
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

  name: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },

  info: {
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

  approve: {
    flex: 1,
    backgroundColor: '#4338CA',
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
  },

  reject: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  btnText: {
    color: '#fff',
    fontWeight: '800',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748B',
  },
});