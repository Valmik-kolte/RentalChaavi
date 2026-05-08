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
  approveUser,
  rejectUser,
} from '../../api/adminApi';

export default function PremiumRequestsScreen({ navigation }) {

  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  // ================= FETCH REQUESTS =================

  const fetchRequests = async () => {

    try {

      setLoading(true);

      const users =
        await getPendingUsers();

      console.log(
        'PENDING USERS:',
        users
      );

      const formattedUsers =
        Array.isArray(users)

          ? users.map(u => ({

              id:
                u.userId ||
                u.id,

              name:
                u.fullName ||
                'No Name',

              email:
                u.email ||
                'No Email',

              mobile:
                u.mobileNumber ||
                'No Mobile',

              status:
                u.premiumStatus ||
                'PENDING',
            }))

          : [];

      setRequests(
        formattedUsers
      );

    } catch (e) {

      console.log(
        'FETCH USER ERROR:',
        e
      );

      Alert.alert(
        'Error',
        'Failed to load user requests'
      );

    } finally {

      setLoading(false);
    }
  };

  // ================= APPROVE =================

  const approve = async (item) => {

    try {

      await approveUser(item.id);

      // UPDATE UI IMMEDIATELY
      setRequests(prev =>
        prev.map(req =>
          req.id === item.id
            ? {
                ...req,
                status: 'APPROVED',
              }
            : req
        )
      );

      Alert.alert(
        'Success',
        'User approved successfully'
      );

    } catch (e) {

      console.log(
        'APPROVE ERROR:',
        e
      );

      Alert.alert(
        'Error',
        'Error approving user'
      );
    }
  };

  // ================= REJECT =================

  const reject = async (item) => {

    try {

      await rejectUser(item.id);

      // UPDATE UI IMMEDIATELY
      setRequests(prev =>
        prev.map(req =>
          req.id === item.id
            ? {
                ...req,
                status: 'REJECTED',
              }
            : req
        )
      );

      Alert.alert(
        'Rejected',
        'User rejected successfully'
      );

    } catch (e) {

      console.log(
        'REJECT ERROR:',
        e
      );

      Alert.alert(
        'Error',
        'Error rejecting user'
      );
    }
  };

  // ================= STATUS COLOR =================

  const getStatusColor = status => {

    const s =
      status?.toLowerCase();

    if (s === 'approved') {
      return '#16A34A';
    }

    if (s === 'rejected') {
      return '#EF4444';
    }

    return '#F59E0B';
  };

  // ================= UI =================

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

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >

          <Text style={styles.back}>
            ←
          </Text>

        </TouchableOpacity>

        <Text style={styles.title}>
          User Requests
        </Text>

        <View style={{ width: 24 }} />

      </View>

      {/* BODY */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 40,
        }}
      >

        <View style={styles.container}>

          {loading ? (

            <ActivityIndicator
              size="large"
              color="#4338CA"
              style={{
                marginTop: 30,
              }}
            />

          ) : requests.length === 0 ? (

            <Text style={styles.empty}>
              No User Requests Found
            </Text>

          ) : (

            requests.map((item, index) => (

              <View
                key={`${item.id}-${index}`}
                style={styles.card}
              >

                <Text style={styles.cardTitle}>
                  {item.name}
                </Text>

                <Text style={styles.meta}>
                  {item.email}
                </Text>

                <Text style={styles.meta}>
                  {item.mobile}
                </Text>

                <View style={styles.rowBetween}>

                  <Text style={styles.type}>
                    USER
                  </Text>

                  <Text
                    style={[
                      styles.status,
                      {
                        color:
                          getStatusColor(
                            item.status
                          ),
                      },
                    ]}
                  >

                    {item.status?.toUpperCase()}

                  </Text>

                </View>

                {item.status
                  ?.toLowerCase() ===
                  'pending' && (

                  <View
                    style={styles.actionRow}
                  >

                    <TouchableOpacity
                      style={
                        styles.approveBtn
                      }
                      onPress={() =>
                        approve(item)
                      }
                    >

                      <Text
                        style={
                          styles.approveTxt
                        }
                      >

                        Approve

                      </Text>

                    </TouchableOpacity>

                    <TouchableOpacity
                      style={
                        styles.rejectBtn
                      }
                      onPress={() =>
                        reject(item)
                      }
                    >

                      <Text
                        style={
                          styles.rejectTxt
                        }
                      >

                        Reject

                      </Text>

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

// ================= STYLES =================

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 14,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  back: {
    fontSize: 26,
    color: '#0F172A',
    fontWeight: '900',
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },

  container: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },

  empty: {
    marginTop: 80,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#FFFFFF',

    borderRadius: 18,

    padding: 18,

    marginBottom: 16,

    elevation: 3,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },

  meta: {
    marginTop: 6,
    color: '#64748B',
    fontSize: 14,
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginTop: 16,
  },

  type: {
    backgroundColor: '#EEF2FF',
    color: '#4338CA',

    paddingHorizontal: 12,
    paddingVertical: 6,

    borderRadius: 10,

    fontWeight: '800',
    fontSize: 12,
  },

  status: {
    fontWeight: '900',
    fontSize: 13,
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 18,
  },

  approveBtn: {
    flex: 1,

    backgroundColor: '#16A34A',

    paddingVertical: 12,

    borderRadius: 12,

    alignItems: 'center',

    marginRight: 8,
  },

  approveTxt: {
    color: '#FFFFFF',
    fontWeight: '800',
  },

  rejectBtn: {
    flex: 1,

    backgroundColor: '#FEE2E2',

    paddingVertical: 12,

    borderRadius: 12,

    alignItems: 'center',
  },

  rejectTxt: {
    color: '#DC2626',
    fontWeight: '800',
  },

});