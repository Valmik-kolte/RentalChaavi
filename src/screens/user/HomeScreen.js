import React, {
  useEffect,
  useState,
  useContext,
} from 'react';

import { AuthContext } from '../../context/AuthContext';

import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getProperties,
  filterProperties,
} from '../../api/propertyApi';

const BASE_URL =
  // 'http://192.168.1.6:8080';
  'http://10.10.1.210:8080';

export default function HomeScreen({
  navigation,
}) {

  const [search, setSearch] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [properties, setProperties] =
    useState([]);

  const {
    userRole,
    userData,
  } = useContext(AuthContext);

  const categories = [
    '1 BHK',
    '2 BHK',
    '3 BHK',
    'Villa',
    'House',
  ];

  useEffect(() => {
    fetchProperties();
  }, []);

  const parseImages = (
    imgString
  ) => {

    try {

      if (!imgString) {
        return [];
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
          `${BASE_URL}/${img
            .trim()
            .replace(/^\/+/, '')}`
        );

    } catch {

      return [];
    }
  };

  const fetchProperties =
    async () => {

      try {

        setLoading(true);

        const token =
          await AsyncStorage.getItem(
            'userToken'
          );

        console.log(
          'HOME TOKEN:',
          token
        );

        if (!token) {

          console.log(
            'NO TOKEN FOUND'
          );

          return;
        }

        let userId = null;

        try {

          const payload = JSON.parse(
            atob(
              token.split('.')[1]
            )
          );

          userId = payload.id;

          console.log(
            'HOME USER ID:',
            userId
          );

        } catch (e) {

          console.log(
            'TOKEN PARSE ERROR:',
            e
          );

          return;
        }

        if (!userId) {

          console.log(
            'USER ID NOT FOUND'
          );

          return;
        }

        const basicRes =
          await getProperties(userId);

        const basicList =
          Array.isArray(basicRes)

            ? basicRes

            : Array.isArray(
                basicRes?.data
              )

            ? basicRes.data

            : [];

        let detailedList = [];

        if (
          basicList.length > 0
        ) {

          const propertyType =
            basicList[0]
              ?.propertyType ||
            'APARTMENT';

          const detailedRes =
            await filterProperties(
              userId,
              {
                propertyType,
              }
            );

          detailedList =
            Array.isArray(
              detailedRes?.data
            )

              ? detailedRes.data

              : [];
        }

        const merged =
          basicList.map(
            (basic, index) => {

              const detailed =
                detailedList[index] ||
                {};

              return {

                ...detailed,
                ...basic,

                doctypeImages:
                  basic?.doctypeImages ||
                  detailed?.doctypeImages,

                title:
                  basic?.title ||
                  detailed?.title,

                propertyType:
                  basic?.propertyType ||
                  detailed?.propertyType,
              };
            }
          );

        setProperties(merged);

      } catch (error) {

        console.log(
          'HOME API ERROR:',
          error?.response?.data ||
          error.message
        );

      } finally {

        setLoading(false);
        setRefreshing(false);
      }
    };

  const onRefresh = () => {

    setRefreshing(true);

    fetchProperties();
  };

  const filteredProperties =
    properties.filter(item =>

      item?.city
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      item?.location
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        ) ||

      item?.title
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    );
    console.log(
      'HOME USER DATA:',
      userData
    );

  return (

    <SafeAreaView
      style={styles.container}
      edges={[
        'top',
        'left',
        'right',
      ]}
    >

      <StatusBar
        backgroundColor="#F8FAFC"
        barStyle="dark-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.scroll
        }
        refreshControl={
          <RefreshControl
            refreshing={
              refreshing
            }
            onRefresh={
              onRefresh
            }
          />
        }
      >

        {/* HEADER */}
        <View style={styles.header}>

          <View>

            <Text style={styles.brand}>
              Caryanam Broker
            </Text>

            <Text style={styles.tag}>
              Welcome back 👋
            </Text>

            {/* <Text
              style={{
                fontSize: 12,
                color: '#4338CA',
                marginTop: 2,
              }}
            >

              {userData?.email}
              {' '}
              (
              {userRole}
              )

            </Text> */}

          </View>

          <TouchableOpacity
            style={
              styles.profileBtn
            }
            onPress={() =>
              navigation.navigate('ProfileTab')
            }
          >

            <Text
              style={
                styles.profileTxt
              }
            >
              Profile
            </Text>

          </TouchableOpacity>

        </View>

        {/* HERO */}
        <View style={styles.hero}>

          <Text
            style={
              styles.heroTitle
            }
          >

            Find Verified
            {'\n'}
            Homes For Rent

          </Text>

          <Text
            style={
              styles.heroSub
            }
          >

            Apartments,
            flats,
            villas and family
            homes from trusted
            owners & brokers.

          </Text>

          <View
            style={
              styles.searchBox
            }
          >

            <Text
              style={
                styles.searchIcon
              }
            >
              ⌕
            </Text>

            <TextInput
              placeholder="Search city, area, locality"
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={
                setSearch
              }
              style={
                styles.input
              }
            />

          </View>

          <TouchableOpacity
            style={
              styles.searchBtn
            }
            onPress={() =>
              navigation.navigate('ActionTab')
            }
          >

            <Text
              style={
                styles.searchTxt
              }
            >
              Explore Homes
            </Text>

          </TouchableOpacity>

        </View>

        {/* CATEGORY */}
        {/* <Text style={styles.section}>
          Categories
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.horizontalWrap
          }
        >

          {categories.map(
            (item, i) => (

              <TouchableOpacity
                key={i}
                style={
                  styles.catBtn
                }
              >

                <Text
                  style={
                    styles.catTxt
                  }
                >
                  {item}
                </Text>

              </TouchableOpacity>
            )
          )}

        </ScrollView> */}

        {/* LISTINGS */}
        <Text style={styles.section}>
          Properties
        </Text>

        <View style={styles.cardWrap}>

          {loading ? (

            <ActivityIndicator
              size="large"
              color="#4338CA"
            />

          ) : filteredProperties.length ===
            0 ? (

            <Text
              style={styles.empty}
            >
              No Properties Found
            </Text>

          ) : (

            filteredProperties.map(
              (item, i) => (

                <TouchableOpacity
                  key={i}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate(
                      'PropertyDetails',
                      {
                        property: item,
                        isUserPremium: true,
                      }
                    )
                  }
                >

                  {(
                  item?.coverImage
                  ? `${BASE_URL}/${item.coverImage}`

                  : parseImages(
                      item?.doctypeImages
                    )[0] ||

                    item?.image
                ) ? (

                  <Image
                    source={{
                      uri:

                        item?.coverImage
                          ? `${BASE_URL}/${item.coverImage}`

                          : parseImages(
                              item?.doctypeImages
                            )[0] ||

                            item?.image,
                    }}
                    style={styles.image}
                    resizeMode="cover"
                  />

                ) : (

                  <View style={styles.imagePlaceholder}>

                    <Text style={styles.imagePlaceholderTxt}>
                      No Image
                    </Text>

                  </View>

                )}

                  <View
                    style={{
                      flex: 1,
                      marginTop: 14,
                    }}
                  >

                    <Text
                      style={
                        styles.cardTitle
                      }
                    >

                      {item.title ||
                        'Property'}

                    </Text>

                    <Text
                      style={
                        styles.price
                      }
                    >

                      ₹
                      {item.price ||
                        '0'}
                      {' '}
                      / month

                    </Text>

                    <Text
                      style={
                        styles.loc
                      }
                    >

                      {item.location ||
                        item.city}

                    </Text>

                  </View>

                </TouchableOpacity>
              )
            )
          )}

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

const COLORS = {
  primary: '#ff7a30',
  secondary: '#132238',
  bg: '#f8f3ed',
  white: '#ffffff',
  text: '#1f2937',
  lightText: '#6b7280',
  border: '#eadfd3',
  card: '#ffffff',
};

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  scroll: {
    paddingBottom: 40,
  },

  /* HEADER */

  header: {
    marginHorizontal: 16,
    marginTop: 10,

    paddingHorizontal: 18,
    paddingVertical: 16,

    borderRadius: 20,

    backgroundColor: '#111111',

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },

  brand: {
    fontSize: 22,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 0.2,
  },

  tag: {
    marginTop: 4,
    fontSize: 12,
    color: '#d1d5db',
  },

  profileBtn: {
    backgroundColor: COLORS.primary,

    paddingHorizontal: 18,
    paddingVertical: 11,

    borderRadius: 14,
  },

  profileTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  /* HERO */

  hero: {
    marginHorizontal: 16,
    marginTop: 18,

    borderRadius: 28,

    padding: 24,

    backgroundColor: '#f5ede5',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  heroTitle: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: -1,
  },

  heroSub: {
    color: COLORS.lightText,

    marginTop: 14,

    lineHeight: 24,
    fontSize: 14,

    width: '92%',
  },

  /* SEARCH */

  searchBox: {
    backgroundColor: '#ffffff',

    marginTop: 22,

    borderRadius: 18,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 16,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchIcon: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '900',
  },

  input: {
    flex: 1,

    color: COLORS.text,

    paddingVertical: 15,

    marginLeft: 10,

    fontSize: 14,
  },

  searchBtn: {
    backgroundColor: COLORS.primary,

    marginTop: 16,

    paddingVertical: 16,

    borderRadius: 18,

    shadowColor: COLORS.primary,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 3,
  },

  searchTxt: {
    color: '#fff',

    textAlign: 'center',

    fontWeight: '800',

    fontSize: 15,
  },

  /* SECTION */

  section: {
    fontSize: 24,
    fontWeight: '800',

    marginHorizontal: 18,
    marginTop: 30,
    marginBottom: 16,

    color: COLORS.secondary,
  },

  /* CATEGORY */

  horizontalWrap: {
    paddingHorizontal: 16,
  },

  catBtn: {
    backgroundColor: '#fff',

    paddingHorizontal: 18,
    paddingVertical: 11,

    borderRadius: 30,

    marginRight: 10,

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  catTxt: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: 13,
  },

  /* CARDS */

  cardWrap: {
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: COLORS.card,

    borderRadius: 26,

    padding: 14,

    marginBottom: 20,

    borderWidth: 1,
    borderColor: '#f3e7dc',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  image: {
    width: '100%',
    height: 210,

    borderRadius: 22,

    backgroundColor: '#e5e7eb',
  },

  imagePlaceholder: {
    width: '100%',
    height: 210,

    borderRadius: 22,

    backgroundColor: '#e5e7eb',

    justifyContent: 'center',
    alignItems: 'center',
  },

  imagePlaceholderTxt: {
    color: '#6b7280',
    fontWeight: '700',
    fontSize: 14,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.secondary,
  },

  price: {
    color: COLORS.primary,

    fontWeight: '900',

    marginTop: 10,

    fontSize: 20,
  },

  loc: {
    color: COLORS.lightText,

    marginTop: 8,

    fontSize: 14,

    lineHeight: 22,
  },

  empty: {
    textAlign: 'center',

    color: COLORS.lightText,

    marginTop: 30,

    fontSize: 15,
  },

});