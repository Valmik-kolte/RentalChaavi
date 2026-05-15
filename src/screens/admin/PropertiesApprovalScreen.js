import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'react-native';
import {
  BASE_URL,
} from '../../api/axios';
import api from '../../api/axiosConfig';

export default function PropertiesApprovalScreen({ navigation }) {

  const [search, setSearch] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await api.get('/admin/properties');
      console.log("ADMIN PROPERTIES:", res?.data);

      const all = res?.data?.data || [];

      // 🔥 ONLY PENDING
      const pending = all.filter(
        item => item.status?.toLowerCase() === 'pending'
      );

      setProperties(pending);

    } catch (e) {
      console.log('ERROR:', e?.response?.data || e.message);
      Alert.alert('Error', 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      console.log("APPROVING:", id);

      await api.post(`/admin/approveProperty/${id}`);

      Alert.alert('Success', 'Property Approved');
      fetchProperties();
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Approval failed');
    }
  };

  const handleReject = async (id) => {
    try {
      console.log("REJECTING:", id);

      await api.post(`/admin/rejectProperty/${id}`);

      Alert.alert('Rejected');
      fetchProperties();
    } catch (e) {
      console.log(e);
      Alert.alert('Error', 'Reject failed');
    }
  };

  const filtered = properties.filter(item =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.city?.toLowerCase().includes(search.toLowerCase()) ||
    item.propertyType?.toLowerCase().includes(search.toLowerCase())
  );

  const badgeColor = status => {
    const s = status?.toLowerCase();

    if (s === 'approved') return '#16A34A';
    if (s === 'rejected') return '#DC2626';
    return '#F59E0B'; // pending
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F8FAFF" barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Property Approval</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* SEARCH */}
      <View style={{ paddingHorizontal: 18 }}>
        <TextInput
          placeholder="Search city, type, title"
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          style={styles.search}
        />
      </View>

      {/* BODY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: 18,
          paddingTop: 14,
          paddingBottom: 40,
        }}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#1565FF" />
        ) : filtered.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 40 }}>
            No Pending Properties
          </Text>
        ) : (
          filtered.map(item => (
            <View key={item.id} style={styles.card}>

              {/* IMAGE */}
              <Image
                source={{
                  uri:
                    item.imageUrls?.[0]
                      ? `http://10.10.1.210:8080/uploads/${item.imageUrls[0]}`
                      : 'https://via.placeholder.com/300'
                }}
                style={styles.imageBox}
              />

              {/* INFO */}
              <View style={styles.row}>
                <Text style={styles.name}>{item.title}</Text>

                <Text style={[
                  styles.status,
                  { color: badgeColor(item.status) }
                ]}>
                  {item.status?.toUpperCase()}
                </Text>
              </View>

              <Text style={styles.price}>₹{item.price}</Text>

              <Text style={styles.meta}>
                {item.city} • {item.propertyType}
              </Text>

              <Text style={styles.owner}>
                Owner: {item.ownerName || 'N/A'}
              </Text>

              <Text style={styles.meta}>
                📧 {item.ownerEmail || 'No Email'}
              </Text>

              <Text style={styles.meta}>
                📞 {item.ownerMobile || 'No Mobile'}
              </Text>

              {/* ACTIONS */}
              <View style={styles.actionRow}>

                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => handleApprove(item.id)}
                >
                  <Text style={styles.approveTxt}>Approve</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => handleReject(item.id)}
                >
                  <Text style={styles.rejectTxt}>Reject</Text>
                </TouchableOpacity>

              </View>

            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },

  header: {
    paddingHorizontal: 18,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  back: { fontSize: 26, fontWeight: '900', color: '#0F172A' },

  title: { fontSize: 22, fontWeight: '900', color: '#0F172A' },

  search: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEF2F7',
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: '#111827',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },

  imageBox: {
    height: 130,
    borderRadius: 16,
    marginBottom: 14,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  name: {
    fontSize: 17,
    fontWeight: '900',
    color: '#0F172A',
    flex: 1,
  },

  status: {
    fontSize: 12,
    fontWeight: '900',
    marginLeft: 8,
  },

  price: {
    marginTop: 8,
    color: '#1565FF',
    fontWeight: '900',
    fontSize: 16,
  },

  meta: {
    marginTop: 6,
    color: '#64748B',
    fontSize: 13,
  },

  owner: {
    marginTop: 6,
    color: '#334155',
    fontSize: 13,
  },

  actionRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  approveBtn: {
    width: '48%',
    backgroundColor: '#DCFCE7',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },

  approveTxt: {
    color: '#16A34A',
    fontWeight: '900',
  },

  rejectBtn: {
    width: '48%',
    backgroundColor: '#FEE2E2',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },

  rejectTxt: {
    color: '#DC2626',
    fontWeight: '900',
  },
});