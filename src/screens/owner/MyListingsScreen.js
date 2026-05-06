import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { getPropertyById, deleteProperty } from '../../api/propertyApi';
import { getOwnerProperties } from '../../api/ownerApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';

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

export default function MyListingsScreen({ navigation }) {
  const { userData } = useContext(AuthContext);

  const [activeTab, setActiveTab] = useState('All');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', fetchListings);
    return unsubscribe;
  }, [navigation]);

  const fetchListings = async () => {
  try {
    const ownerId = userData?.id;

    if (!ownerId) {
      console.log(" NO OWNER ID");
      return;
    }

    setLoading(true);

    const res = await getOwnerProperties(ownerId);

    console.log("✅ FULL API RESPONSE:", res);

        
        let data = [];

        if (Array.isArray(res)) {
          data = res;
        } else if (res?.properties) {
          data = res.properties;
        } else if (res?.data?.properties) {
          data = res.data.properties;
        } else {
          console.log("⚠️ Unexpected API structure:", res);
        }

        setListings(data);

      } catch (e) {
        console.log("❌ API ERROR:", e?.response?.data || e.message);
      } finally {
        setLoading(false);
      }
    };

  const tabs = ['All', 'Active', 'Pending', 'Rented'];

  const filtered =
    activeTab === 'All'
      ? listings
      : listings.filter(
          item =>
            item.status?.toLowerCase() === activeTab.toLowerCase()
        );

  const statusColor = status => {
    const s = status?.toLowerCase();

    if (s === 'active') return '#16A34A';
    if (s === 'pending') return '#F59E0B';
    return '#4338CA';
  };

  const handleDelete = item => {
    Alert.alert(
      'Delete Property',
      'Are you sure?',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteProperty(item.id);
              fetchListings();
            } catch {
              Alert.alert('Error', 'Delete failed');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.back}>←</Text>
        </TouchableOpacity>

        <Text style={styles.title}>My Listings</Text>

        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <View style={styles.tabWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabContainer}
        >
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tabBtn,
                activeTab === tab && styles.activeTab,
              ]}
              onPress={() => setActiveTab(tab)}
            >
              <Text
                style={[
                  styles.tabTxt,
                  activeTab === tab && styles.activeTabTxt,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#4338CA" />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingHorizontal: 18 }}>
            {filtered.length === 0 ? (
              <Text style={{ textAlign: 'center', marginTop: 20 }}>
                No properties found
              </Text>
            ) : (
              filtered.map(item => (
                <View key={item.id} style={styles.card}>
                  
                  <View style={styles.imageBox}>
                    <Image
                      source={{
                        uri: item.imageUrls?.[0]
                          ? `http://192.168.1.13:8080/uploads/${item.imageUrls[0]}`
                          : 'https://via.placeholder.com/150',
                      }}
                      style={styles.image}
                    />
                  </View>

                  <Text style={styles.cardTitle}>
                    {item.title || 'Property'}
                  </Text>

                  <Text style={styles.price}>
                    ₹{item.price || 0}
                  </Text>

                  <Text style={styles.location}>
                    {item.city || 'Location'}
                  </Text>

                  <View
                    style={[
                      styles.statusBox,
                      { backgroundColor: statusColor(item.status) + '20' },
                    ]}
                  >
                    <Text
                      style={[
                        styles.status,
                        { color: statusColor(item.status) },
                      ]}
                    >
                      {item.status?.toUpperCase() || 'ACTIVE'}
                    </Text>

                    <Text style={styles.metaTxt}>
                      {item.views || 0} Views
                    </Text>

                    <Text style={styles.metaTxt}>
                      {item.leads || 0} Leads
                    </Text>
                  </View>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() =>
                        navigation.navigate('EditProperty', { id: item.id })
                      }
                    >
                      <Text style={styles.editTxt}>Edit</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(item)}
                    >
                      <Text style={styles.deleteTxt}>Delete</Text>
                    </TouchableOpacity>
                  </View>

                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  header: {
    paddingHorizontal: 18,
    paddingVertical: 16,
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
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },

  tabWrapper: {
    marginBottom: 10,
  },

  tabContainer: {
    paddingHorizontal: 18,
    alignItems: 'center',
  },

  tabBtn: {
    backgroundColor: '#EEF2F7',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 22,
    marginRight: 10,
  },

  activeTab: {
    backgroundColor: '#4338CA',
  },

  tabTxt: {
    color: '#334155',
    fontWeight: '800',
    fontSize: 13,
  },

  activeTabTxt: {
    color: '#fff',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#EEF2F7',
  },

  imageBox: {
    height: 145,
    borderRadius: 18,
    backgroundColor: '#E0E7FF',
    marginBottom: 14,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#0F172A',
  },

  price: {
    marginTop: 8,
    color: '#4338CA',
    fontWeight: '900',
    fontSize: 16,
  },

  location: {
    marginTop: 6,
    color: '#64748B',
    fontSize: 14,
  },

  statusBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 10,
  },

  status: {
    fontWeight: '900',
    fontSize: 13,
  },

  metaTxt: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 2,
  },

  actionRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  editBtn: {
    width: '48%',
    backgroundColor: '#E0E7FF',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },

  editTxt: {
    color: '#4338CA',
    fontWeight: '900',
  },

  deleteBtn: {
    width: '48%',
    backgroundColor: '#FEE2E2',
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
  },

  deleteTxt: {
    color: '#EF4444',
    fontWeight: '900',
  },
});