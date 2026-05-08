import React, { useState, useEffect } from 'react';

import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

import {
  getOwnerProperties,
  filterProperties,
  deleteProperty,
} from '../../api/propertyApi';

import { SafeAreaView } from 'react-native-safe-area-context';

// const BASE_URL = 'http://192.168.1.13:8080';
const BASE_URL = 'http://192.168.0.133:8080';

export default function MyListingsScreen({ navigation }) {

  const [activeTab, setActiveTab] = useState('All');

  const [listings, setListings] = useState([]);

  const [loading, setLoading] = useState(true);

  // ================= IMAGE PARSER =================

  const parseImages = (imgString) => {

    try {

      if (
        !imgString ||
        imgString === '[]'
      ) {
        return [];
      }

      // already array
      if (Array.isArray(imgString)) {

        return imgString
          .map(img =>
            String(img)
              .trim()
              .replace(/^\/+/, '')
          )
          .filter(Boolean);
      }

      const cleaned = String(imgString)

        .replace(/^\[/, '')
        .replace(/\]$/, '')
        .replace(/"/g, '')
        .trim();

      if (!cleaned) {
        return [];
      }

      return cleaned
        .split(',')
        .map(img =>
          img
            .trim()
            .replace(/^\/+/, '')
        )
        .filter(Boolean);

    } catch (e) {

      console.log(
        'PARSE IMAGE ERROR:',
        e
      );

      return [];
    }
  };

  // ================= MAP DTO =================

  const mapBackendToUi = (dto) => {

    const images =
      parseImages(
        dto?.doctypeImages ||
        dto?.imageUrls
      );

    const imagePath = images[0];

    const imageUrl = imagePath

      ? imagePath.startsWith('http')

        ? imagePath

        : `${BASE_URL}/${String(imagePath)
            .replace(/^\/+/, '')}`

      : '';

    return {

      id:
        dto?.id ||
        null,

      title:
        dto?.title ||
        dto?.apartmentName ||
        'Untitled Property',

      location:
        dto?.location ||
        '',

      city:
        dto?.city ||
        '',

      address:
        dto?.address ||
        '',

      price:
        dto?.price ??
        dto?.rent ??
        0,

      status:
        dto?.status ||
        'PENDING',

      bhkType:
        dto?.bhkType

          ? String(dto.bhkType)
              .replace(/_/g, ' ')

          : 'N/A',

      propertyType:
        dto?.propertyType ||
        'N/A',

      furnishing:

        dto?.furnishing ||

        dto?.furnishingType ||

        dto?.furnishedStatus ||

        'N/A',

      carpetArea:

        dto?.carpetArea ||

        dto?.builtupArea ||

        dto?.area ||

        dto?.squareFeet ||

        'N/A',

      image: imageUrl,

      doctypeImages:
        dto?.doctypeImages ||

        dto?.imageUrls ||

        null,

      raw: dto,
    };
  };

  // ================= FETCH LISTINGS =================

  const fetchListings = async () => {

    try {

      setLoading(true);

      const token =
        await AsyncStorage.getItem(
          'userToken'
        );

      if (!token) {

        console.log(
          'NO TOKEN'
        );

        return;
      }

      const decoded =
        jwtDecode(token);

      console.log(
        'DECODED TOKEN:',
        decoded
      );

      const ownerId =
        decoded?.id;

      if (!ownerId) {

        console.log(
          'NO OWNER ID'
        );

        return;
      }

      const basicRes =
        await getOwnerProperties(ownerId);

        console.log(
          "BASIC RESPONSE:",
          basicRes
        );

        const basicList =
          Array.isArray(basicRes)

            ? basicRes

            : Array.isArray(basicRes?.data)

            ? basicRes.data

            : [];

        let detailedList = [];

        if (basicList.length > 0) {

          const propertyType =
            basicList[0]?.propertyType ||
            "APARTMENT";

          const detailedRes =
            await filterProperties(
              ownerId,
              { propertyType }
            );

          console.log(
            "DETAIL RESPONSE:",
            detailedRes
          );

          detailedList =
            Array.isArray(detailedRes?.data)

              ? detailedRes.data

              : [];
        }

      console.log(
      'FULL OWNER RESPONSE:',
      basicRes
    );

      
      const merged =
        basicList.map((basic) => {

          const detailed =
            detailedList.find(
              item =>

                item?.title === basic?.title &&

                item?.propertyType === basic?.propertyType
            ) || {};

          return {

            ...basic,
            ...detailed,

            doctypeImages:
              basic?.doctypeImages ||
              detailed?.doctypeImages,

            title:
              detailed?.title ||
              basic?.title,

            propertyType:
              detailed?.propertyType ||
              basic?.propertyType,

            id:
              detailed?.id ||
              basic?.id,
          };
      });

      console.log(
        "MERGED DATA:",
        merged
      );

      const mapped =
        merged.map(
          mapBackendToUi
        );

        
        const pendingProperty =
        await AsyncStorage.getItem(
          'pendingProperty'
        );

      if (pendingProperty) {

        try {

          const parsed =
            JSON.parse(
              pendingProperty
            );
            console.log(
              'PENDING PROPERTY:',
              parsed
            );

          mapped.unshift({
            ...parsed,
            status: 'PENDING',
          });

        } catch {}
      }

      console.log(
        'MAPPED LISTINGS:',
        mapped
      );

      setListings(mapped);

    } catch (e) {

      console.log(
        'FETCH ERROR FULL:',
        JSON.stringify(e)
      );

      // 🔥 fallback local property

      const pendingProperty =
        await AsyncStorage.getItem(
          'pendingProperty'
        );

      if (pendingProperty) {

        try {

          const parsed =
            JSON.parse(
              pendingProperty
            );

          const localProperty = {
            id: Date.now(),

            title:
              parsed?.title ||
              parsed?.apartmentName ||
              'My Property',

            location:
              parsed?.location ||
              parsed?.address ||
              'Location',

            city:
              parsed?.city || '',

            address:
              parsed?.address || '',

            price:
              parsed?.price ||
              parsed?.rent ||
              0,

            status: 'PENDING',

            bhkType:
              parsed?.bhkType || 'N/A',

            propertyType:
              parsed?.propertyType || 'N/A',

            furnishing:
              parsed?.furnishing || 'N/A',

            carpetArea:
              parsed?.carpetArea || 'N/A',

            image:
              parsed?.image ||

              parsed?.imageUri ||

              parsed?.doctypeImages?.[0] ||

              '',

            raw: parsed,
          };

          setListings([localProperty]);

        } catch (err) {

          console.log(
            'LOCAL PROPERTY PARSE ERROR:',
            err
          );
        }
      }

    } finally {

      setLoading(false);
    }
  };

  // ================= LOAD =================

  useEffect(() => {

    const unsubscribe =
      navigation.addListener(
        'focus',
        fetchListings
      );

    return unsubscribe;

  }, [navigation]);

  // ================= FILTER =================

  const tabs = [
    'All',
    'Active',
    'Pending',
    'Rented',
  ];

  const filtered =
    activeTab === 'All'

      ? listings

      : listings.filter(
          item =>
            item.status
              ?.toLowerCase() ===
            activeTab.toLowerCase()
        );

  // ================= STATUS COLOR =================

  const statusColor = status => {

    const s =
      status?.toLowerCase();

    if (s === 'active') {
      return '#16A34A';
    }

    if (s === 'pending') {
      return '#F59E0B';
    }

    return '#4338CA';
  };

  // ================= DELETE =================

  const handleDelete = item => {

    Alert.alert(
      'Delete Property',
      'Are you sure?',
      [
        {
          text: 'Cancel',
        },

        {
          text: 'Delete',

          onPress: async () => {

            try {

              await deleteProperty(
                item.id
              );

              fetchListings();

            } catch {

              Alert.alert(
                'Error',
                'Delete failed'
              );
            }
          },
        },
      ]
    );
  };

  // ================= UI =================

  return (

    <SafeAreaView
      style={styles.container}
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
          My Listings
        </Text>

        <View style={{ width: 24 }} />

      </View>

      {/* TABS */}

      <View style={styles.tabWrapper}>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={
            styles.tabContainer
          }
        >

          {tabs.map(tab => (

            <TouchableOpacity
              key={tab}
              style={[
                styles.tabBtn,

                activeTab === tab &&
                  styles.activeTab,
              ]}
              onPress={() =>
                setActiveTab(tab)
              }
            >

              <Text
                style={[
                  styles.tabTxt,

                  activeTab === tab &&
                    styles.activeTabTxt,
                ]}
              >

                {tab}

              </Text>

            </TouchableOpacity>
          ))}

        </ScrollView>

      </View>

      {/* LOADER */}

      {loading ? (

        <ActivityIndicator
          size="large"
          color="#4338CA"
          style={{
            marginTop: 40,
          }}
        />

      ) : (

        <ScrollView
          showsVerticalScrollIndicator={false}
        >

          <View
            style={{
              padding: 18,
            }}
          >

            {filtered.length === 0 ? (

              <Text style={styles.empty}>
                No properties found
              </Text>

            ) : (

              filtered.map(item => (

                <View
                  key={item.id?.toString() || Math.random().toString()}
                  style={styles.card}
                >

                  {/* IMAGE */}

                  {item.image ? (

                    <Image
                      source={{
                        uri: item.image,
                      }}
                      style={styles.image}
                      resizeMode="cover"
                    />

                  ) : (

                    <View style={styles.imageBox}>

                      <Text style={styles.imageTxt}>
                        No Image
                      </Text>

                    </View>
                  )}

                  {/* DETAILS */}

                  <View style={styles.info}>

                    <Text
                      style={styles.cardTitle}
                    >

                      {item.title}

                    </Text>

                    <Text style={styles.price}>

                      ₹
                      {Number(
                        item.price || 0
                      ).toLocaleString()}

                    </Text>

                    <Text
                      style={styles.location}
                    >

                      {item.location ||
                      item.city

                        ? `${item.location || ''} ${item.city || ''}`

                        : 'Location Not Available'}

                    </Text>

                    {/* STATUS */}

                    <View
                      style={[
                        styles.statusBox,

                        {
                          backgroundColor:
                            statusColor(
                              item.status
                            ) + '20',
                        },
                      ]}
                    >

                      <Text
                        style={[
                          styles.status,

                          {
                            color:
                              statusColor(
                                item.status
                              ),
                          },
                        ]}
                      >

                        {item.status?.toUpperCase()}

                      </Text>

                    </View>

                    {/* ACTIONS */}

                    <View
                      style={styles.actionRow}
                    >

                      <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() =>
                          navigation.navigate(
                            'EditProperty',
                            {
                              id: item.id,
                            }
                          )
                        }
                      >

                        <Text
                          style={styles.editTxt}
                        >

                          Edit

                        </Text>

                      </TouchableOpacity>

                      <TouchableOpacity
                        style={styles.deleteBtn}
                        onPress={() =>
                          handleDelete(item)
                        }
                      >

                        <Text
                          style={styles.deleteTxt}
                        >

                          Delete

                        </Text>

                      </TouchableOpacity>

                    </View>

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

// ================= STYLES =================

const styles = StyleSheet.create({

  container: {
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

  back: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },

  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },

  tabWrapper: {
    marginBottom: 10,
  },

  tabContainer: {
    paddingHorizontal: 18,
  },

  tabBtn: {
    backgroundColor: '#E2E8F0',

    paddingHorizontal: 18,
    paddingVertical: 10,

    borderRadius: 12,

    marginRight: 10,
  },

  activeTab: {
    backgroundColor: '#4338CA',
  },

  tabTxt: {
    color: '#334155',
    fontWeight: '700',
  },

  activeTabTxt: {
    color: '#fff',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748B',
    fontSize: 16,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 20,

    marginBottom: 18,

    overflow: 'hidden',

    elevation: 3,
  },

  image: {
    width: '100%',
    height: 220,
  },

  imageBox: {
    width: '100%',
    height: 220,

    backgroundColor: '#CBD5E1',

    justifyContent: 'center',
    alignItems: 'center',
  },

  imageTxt: {
    color: '#334155',
    fontWeight: '700',
  },

  info: {
    padding: 16,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },

  price: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: '900',
    color: '#4338CA',
  },

  location: {
    marginTop: 6,
    color: '#64748B',
    lineHeight: 20,
  },

  statusBox: {
    alignSelf: 'flex-start',

    marginTop: 12,

    paddingHorizontal: 14,
    paddingVertical: 6,

    borderRadius: 10,
  },

  status: {
    fontWeight: '800',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 18,
  },

  editBtn: {
    flex: 1,

    backgroundColor: '#4338CA',

    paddingVertical: 12,

    borderRadius: 12,

    alignItems: 'center',

    marginRight: 8,
  },

  editTxt: {
    color: '#fff',
    fontWeight: '800',
  },

  deleteBtn: {
    flex: 1,

    backgroundColor: '#FEE2E2',

    paddingVertical: 12,

    borderRadius: 12,

    alignItems: 'center',
  },

  deleteTxt: {
    color: '#DC2626',
    fontWeight: '800',
  },

});