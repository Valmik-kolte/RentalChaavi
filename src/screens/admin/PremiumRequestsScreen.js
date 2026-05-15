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

  /* HEADER */

  header: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,

    paddingHorizontal: 18,
    paddingVertical: 16,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    backgroundColor: '#ffffff',

    borderRadius: 24,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },

  back: {
    fontSize: 24,
    color: COLORS.secondary,
    fontWeight: '900',
  },

  title: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: -0.3,
  },

  /* BODY */

  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },

  /* EMPTY */

  empty: {
    marginTop: 90,

    textAlign: 'center',

    color: COLORS.lightText,

    fontSize: 15,

    fontWeight: '600',
  },

  /* CARD */

  card: {
    backgroundColor: '#ffffff',

    borderRadius: 30,

    padding: 22,

    marginBottom: 18,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 20,

    fontWeight: '900',

    color: COLORS.secondary,

    marginBottom: 10,
  },

  meta: {
    marginTop: 6,

    color: COLORS.lightText,

    fontSize: 14,

    lineHeight: 22,
  },

  /* STATUS ROW */

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    marginTop: 20,
  },

  type: {
    backgroundColor: '#fff1e8',

    color: COLORS.primary,

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 30,

    fontWeight: '800',

    fontSize: 12,

    overflow: 'hidden',
  },

  status: {
    fontWeight: '900',
    fontSize: 13,
  },

  /* ACTIONS */

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 22,
  },

  approveBtn: {
    flex: 1,

    backgroundColor: '#16a34a',

    paddingVertical: 15,

    borderRadius: 18,

    alignItems: 'center',

    marginRight: 10,

    shadowColor: '#16a34a',
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
  },

  approveTxt: {
    color: '#ffffff',

    fontWeight: '800',

    fontSize: 14,
  },

  rejectBtn: {
    flex: 1,

    backgroundColor: '#fff1f2',

    paddingVertical: 15,

    borderRadius: 18,

    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#fecdd3',
  },

  rejectTxt: {
    color: '#e11d48',

    fontWeight: '800',

    fontSize: 14,
  },

});