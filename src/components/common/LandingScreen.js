import React, {
  useEffect,
  useState,
} from 'react';

import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  filterProperties,
} from '../../api/propertyApi';

import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL =
  'http://192.168.1.13:8080';

export default function LandingScreen({
  navigation,
}) {

  const [search,
    setSearch] =
    useState('');

  const [loading,
    setLoading] =
    useState(true);

  const [properties,
    setProperties] =
    useState([]);

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

        if (!token) {
          return;
        }

        let userId = null;

        try {

          const payload =
            JSON.parse(
              atob(
                token.split('.')[1]
              )
            );

          userId =
            payload.id;

        } catch (e) {

          console.log(
            'TOKEN ERROR:',
            e
          );

          return;
        }

        const res =
          await filterProperties(
            userId,
            {}
          );

        console.log(
          'FILTER RESPONSE:',
          res
        );

        const propertyList =

          Array.isArray(
            res?.data
          )

            ? res.data

            : Array.isArray(
                res?.data?.data
              )

            ? res.data.data

            : [];

        setProperties(
          propertyList
        );

      } catch (error) {

        console.log(
          'ERROR:',
          error?.response?.data ||
          error.message
        );

        Alert.alert(
          'Error',
          'Unable to load properties'
        );

      } finally {

        setLoading(false);
      }
    };

  const filteredProperties =
    properties.filter(
      item =>

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
      >

        {/* HEADER */}
        <View style={styles.header}>

          <View>

            <Text style={styles.brand}>
              Caryanam Broker
            </Text>

            <Text style={styles.tag}>
              Trusted Home Rental Marketplace
            </Text>

          </View>

          <TouchableOpacity
            style={styles.loginBtn}
            onPress={() =>
              navigation.navigate(
                'Login'
              )
            }
          >

            <Text style={styles.loginTxt}>
              Login
            </Text>

          </TouchableOpacity>

        </View>

        {/* HERO */}
        <View style={styles.hero}>

          <Text style={styles.heroTitle}>
            Find Verified
            {'\n'}
            Homes For Rent
          </Text>

          <Text style={styles.heroSub}>
            Apartments,
            flats,
            villas and family
            homes from trusted
            owners.
          </Text>

          <View style={styles.searchBox}>

            {/* <Text style={styles.searchIcon}>
              ⌕
            </Text>

            <TextInput
              placeholder="Search city, area, locality"
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={
                setSearch
              }
              style={styles.input}
            /> */}

          </View>

          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() =>
              navigation.navigate('Login')
            }
          >

            <Text style={styles.searchTxt}>
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
            (
              item,
              i
            ) => (

              <TouchableOpacity
                key={i}
                style={styles.catBtn}
              >

                <Text style={styles.catTxt}>
                  {item}
                </Text>

              </TouchableOpacity>
            )
          )}

        </ScrollView> */}

        {/* LISTINGS */}
        {/* <Text style={styles.section}>
          Popular Homes
        </Text>

        <View style={styles.cardWrap}>

          {loading ? (

            <ActivityIndicator
              size="large"
              color="#4338CA"
            />

          ) : filteredProperties.length ===
            0 ? (

            <Text style={styles.empty}>
              No Properties Found
            </Text>

          ) : (

            filteredProperties.map(
              (
                item,
                i
              ) => (

                <TouchableOpacity
                  key={i}
                  style={styles.card}
                  onPress={() =>
                    navigation.navigate(
                      'PropertyDetails',
                      {
                        property:
                          item,
                      }
                    )
                  }
                >

                  {parseImages(
                    item?.doctypeImages
                  )[0] ? (

                    <Image
                      source={{
                        uri:
                          parseImages(
                            item?.doctypeImages
                          )[0],
                      }}
                      style={
                        styles.image
                      }
                      resizeMode="cover"
                    />

                  ) : (

                    <View
                      style={
                        styles.imageBox
                      }
                    >

                      <Text
                        style={
                          styles.imageTxt
                        }
                      >
                        No Image
                      </Text>

                    </View>

                  )}

                  <View style={styles.content}>

                    <Text
                      style={
                        styles.cardTitle
                      }
                    >

                      {item?.title ||
                        'Property'}

                    </Text>

                    <Text
                      style={
                        styles.price
                      }
                    >

                      ₹
                      {

                        Number(

                          item?.price ??

                          item?.rent ??

                          0

                        ).toLocaleString()

                      }
                      {' '}
                      / month

                    </Text>

                    <Text
                      style={
                        styles.location
                      }
                    >

                      {item?.location ||
                        item?.city}

                    </Text>

                    <View style={styles.row}>

                      <Text style={styles.tagBox}>

                        {item?.bhkType
                          ? String(
                              item.bhkType
                            ).replace(
                              /_/g,
                              ' '
                            )
                          : 'HOME'}

                      </Text>

                      <TouchableOpacity
                        style={
                          styles.btn
                        }
                      >

                        <Text
                          style={
                            styles.btnTxt
                          }
                        >
                          View Details
                        </Text>

                      </TouchableOpacity>

                    </View>

                  </View>

                </TouchableOpacity>
              )
            )
          )}

        </View> */}

        {/* CTA */}
        <View style={styles.cta}>

          <Text style={styles.ctaTitle}>
            Are You Owner?
          </Text>

          <Text style={styles.ctaSub}>
            List your home and
            receive genuine tenant
            leads instantly.
          </Text>

          <TouchableOpacity
            style={styles.postBtn}
            onPress={() =>
              navigation.navigate(
                'Register'
              )
            }
          >

            <Text style={styles.postTxt}>
              List Home 
            </Text>

          </TouchableOpacity>

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
  textLight: '#6b7280',
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
    paddingVertical: 15,

    borderRadius: 18,
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
    color: '#fff',
    letterSpacing: 0.2,
  },

  tag: {
    marginTop: 3,
    color: '#d1d5db',
    fontSize: 11,
    fontWeight: '500',
  },

  loginBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
  },

  loginTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },

  /* HERO */

  hero: {
    marginHorizontal: 16,
    marginTop: 18,

    borderRadius: 28,

    paddingHorizontal: 24,
    paddingVertical: 34,

    backgroundColor: '#f5ede5',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },

  heroTitle: {
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: -0.8,
  },

  heroSub: {
    marginTop: 16,

    fontSize: 15,
    lineHeight: 24,

    color: '#4b5563',

    width: '92%',
    fontWeight: '500',
  },

  searchBox: {
    marginTop: 22,
  },

  input: {
    backgroundColor: '#fff',

    borderRadius: 16,

    paddingHorizontal: 18,
    paddingVertical: 16,

    fontSize: 14,
    color: '#111827',

    borderWidth: 1,
    borderColor: COLORS.border,
  },

  searchBtn: {
    marginTop: 22,

    backgroundColor: COLORS.primary,

    paddingVertical: 16,

    borderRadius: 16,

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
    color: COLORS.secondary,

    marginHorizontal: 18,
    marginTop: 30,
    marginBottom: 16,
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

  /* PROPERTY CARDS */

  cardWrap: {
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: COLORS.card,

    borderRadius: 24,

    marginBottom: 20,

    overflow: 'hidden',

    borderWidth: 1,
    borderColor: '#f1e5db',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  image: {
    width: '100%',
    height: 220,
    backgroundColor: '#e5e7eb',
  },

  imageBox: {
    width: '100%',
    height: 220,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: '#e5e7eb',
  },

  imageTxt: {
    color: '#6b7280',
    fontWeight: '700',
    fontSize: 14,
  },

  content: {
    padding: 18,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.secondary,
  },

  price: {
    marginTop: 10,

    fontSize: 22,
    fontWeight: '900',

    color: COLORS.primary,
  },

  location: {
    marginTop: 8,

    fontSize: 14,
    color: '#6b7280',

    fontWeight: '500',
  },

  row: {
    marginTop: 18,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tagBox: {
    backgroundColor: '#fff1e8',

    color: COLORS.primary,

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 12,

    fontWeight: '800',

    overflow: 'hidden',

    fontSize: 12,
  },

  btn: {
    backgroundColor: COLORS.secondary,

    paddingHorizontal: 18,
    paddingVertical: 10,

    borderRadius: 12,
  },

  btnTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },

  empty: {
    textAlign: 'center',

    marginTop: 60,

    color: '#6b7280',

    fontWeight: '600',
    fontSize: 15,
  },

  /* CTA */

  cta: {
    marginHorizontal: 16,
    marginTop: 22,

    borderRadius: 24,

    padding: 24,

    backgroundColor: '#111111',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  ctaTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '800',
  },

  ctaSub: {
    color: '#d1d5db',

    marginTop: 12,

    fontSize: 15,
    lineHeight: 24,
  },

  postBtn: {
    marginTop: 22,

    backgroundColor: COLORS.primary,

    paddingVertical: 16,

    borderRadius: 18,

    alignItems: 'center',
  },

  postTxt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },

});