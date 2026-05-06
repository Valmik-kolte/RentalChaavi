import React, { useState } from 'react';

import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function UsersManagementScreen({ navigation }) {
  const [search, setSearch] = useState('');

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Amit Sharma',
      city: 'Pune',
      email: 'amit@gmail.com',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Sneha Patil',
      city: 'Mumbai',
      email: 'sneha@gmail.com',
      status: 'Blocked',
    },
  ]);

  const filtered = users.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.city.toLowerCase().includes(search.toLowerCase()) ||
    item.email.toLowerCase().includes(search.toLowerCase())
  );

  const updateStatus = id => {
    setUsers(
      users.map(item =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'Active' ? 'Blocked' : 'Active',
            }
          : item
      )
    );
  };

  const badgeColor = status =>
    status === 'Active' ? '#16A34A' : '#DC2626';

  const viewUser = item => {
    Alert.alert(item.name, `${item.email}\n${item.city}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Users Management</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* SEARCH */}
      <View style={styles.searchWrap}>
        <TextInput
          placeholder="Search name, city, email"
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />
      </View>

      {/* LIST */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.container}>
          {filtered.map(item => (
            <View key={item.id} style={styles.card}>

              {/* TOP */}
              <View style={styles.row}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarTxt}>
                    {item.name.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text style={styles.meta}>{item.city}</Text>
                  <Text style={styles.email}>{item.email}</Text>
                </View>

                <Text style={[styles.status, { color: badgeColor(item.status) }]}>
                  {item.status}
                </Text>
              </View>

              {/* ACTIONS */}
              <View style={styles.actionRow}>
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => viewUser(item)}
                >
                  <Text style={styles.viewTxt}>View</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={
                    item.status === 'Active'
                      ? styles.blockBtn
                      : styles.unblockBtn
                  }
                  onPress={() => updateStatus(item.id)}
                >
                  <Text
                    style={
                      item.status === 'Active'
                        ? styles.blockTxt
                        : styles.unblockTxt
                    }
                  >
                    {item.status === 'Active' ? 'Block' : 'Unblock'}
                  </Text>
                </TouchableOpacity>
              </View>

            </View>
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

  searchWrap: {
    marginHorizontal: 18,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  search: {
    height: 48,
  },

  container: {
    paddingHorizontal: 18,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarTxt: {
    color: '#4338CA',
    fontWeight: '900',
  },

  name: {
    fontWeight: '900',
    color: '#0F172A',
  },

  meta: {
    color: '#64748B',
    fontSize: 12,
  },

  email: {
    color: '#64748B',
    fontSize: 12,
  },

  status: {
    fontWeight: '800',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 12,
  },

  viewBtn: {
    flex: 1,
    backgroundColor: '#EEF2FF',
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 8,
    alignItems: 'center',
  },

  viewTxt: {
    color: '#4338CA',
    fontWeight: '800',
  },

  blockBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  unblockBtn: {
    flex: 1,
    backgroundColor: '#4338CA',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  blockTxt: {
    color: '#DC2626',
    fontWeight: '800',
  },

  unblockTxt: {
    color: '#fff',
    fontWeight: '800',
  },
});