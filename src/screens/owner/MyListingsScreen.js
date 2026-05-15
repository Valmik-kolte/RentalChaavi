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
  deleteProperty,
} from '../../api/propertyApi';

import { SafeAreaView } from 'react-native-safe-area-context';

// const BASE_URL = 'http://192.168.1.6:8080';
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
          Array.isArray(
            basicRes?.data?.properties
          )
            ? basicRes.data.properties
            : [];

            

      console.log(
      'FULL OWNER RESPONSE:',
      basicRes
    );

      const mapped =
        basicList.map(
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

          // ✅ prevent empty/default property
          const hasValidData =

            parsed &&
            (
              parsed.title ||
              parsed.apartmentName ||
              parsed.location ||
              parsed.address ||
              parsed.price ||
              parsed.rent ||
              parsed.image ||
              parsed.imageUri
            );

          if (hasValidData) {

            mapped.unshift({
              ...parsed,
              status: 'PENDING',
            });

          }

        } catch (e) {

          console.log(
            'PENDING PROPERTY ERROR:',
            e
          );
        }
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

      {/* <View style={styles.tabWrapper}>

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

      </View> */}

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
          contentContainerStyle={{
            paddingBottom: 120,
          }}
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

                <TouchableOpacity
                  key={item.id?.toString() || Math.random().toString()}
                  style={styles.card}

                  onPress={() => {

                    navigation.navigate(
                        'PropertyDetails',
                      {
                        property: item,
                      }
                    );
                  }}
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
                              property: item,
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

                </TouchableOpacity>
              ))
            )}

          </View>

        </ScrollView>
      )}

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

  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  /* HEADER */

  header: {
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 10,

    paddingHorizontal: 18,
    paddingVertical: 16,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

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
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.secondary,
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: -0.3,
  },

  /* TABS */

  tabWrapper: {
    marginBottom: 14,
  },

  tabContainer: {
    paddingHorizontal: 16,
  },

  tabBtn: {
    backgroundColor: '#ffffff',

    paddingHorizontal: 18,
    paddingVertical: 11,

    borderRadius: 18,

    marginRight: 10,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  activeTab: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  tabTxt: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: 13,
  },

  activeTabTxt: {
    color: '#ffffff',
  },

  /* EMPTY */

  empty: {
    textAlign: 'center',

    marginTop: 60,

    color: COLORS.lightText,

    fontSize: 15,

    fontWeight: '600',
  },

  /* CARD */

  card: {
    backgroundColor: '#ffffff',

    borderRadius: 30,

    marginBottom: 22,

    overflow: 'hidden',

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  /* IMAGE */

  image: {
    width: '100%',
    height: 240,

    backgroundColor: '#ece7e2',
  },

  imageBox: {
    width: '100%',
    height: 240,

    backgroundColor: '#ece7e2',

    justifyContent: 'center',
    alignItems: 'center',
  },

  imageTxt: {
    color: COLORS.lightText,
    fontWeight: '700',
    fontSize: 14,
  },

  /* DETAILS */

  info: {
    padding: 20,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.secondary,
    lineHeight: 30,
  },

  price: {
    marginTop: 10,

    fontSize: 28,

    fontWeight: '900',

    color: COLORS.primary,
  },

  location: {
    marginTop: 10,

    color: COLORS.lightText,

    lineHeight: 22,

    fontSize: 14,
  },

  /* STATUS */

  statusBox: {
    alignSelf: 'flex-start',

    marginTop: 16,

    paddingHorizontal: 14,
    paddingVertical: 7,

    borderRadius: 30,
  },

  status: {
    fontWeight: '800',
    fontSize: 12,
  },

  /* ACTIONS */

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    marginTop: 22,
  },

  editBtn: {
    flex: 1,

    backgroundColor: COLORS.primary,

    paddingVertical: 15,

    borderRadius: 18,

    alignItems: 'center',

    marginRight: 10,

    shadowColor: COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
  },

  editTxt: {
    color: '#ffffff',

    fontWeight: '800',

    fontSize: 14,
  },

  deleteBtn: {
    flex: 1,

    backgroundColor: '#fff1f2',

    paddingVertical: 15,

    borderRadius: 18,

    alignItems: 'center',

    borderWidth: 1,
    borderColor: '#fecdd3',
  },

  deleteTxt: {
    color: '#e11d48',

    fontWeight: '800',

    fontSize: 14,
  },

});