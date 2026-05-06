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
            owners & brokers.
          </Text>

          <View style={styles.searchBox}>

            <Text style={styles.searchIcon}>
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
            />

          </View>

          <TouchableOpacity
            style={styles.searchBtn}
          >

            <Text style={styles.searchTxt}>
              Explore Homes
            </Text>

          </TouchableOpacity>

        </View>

        {/* CATEGORY */}
        <Text style={styles.section}>
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

        </ScrollView>

        {/* LISTINGS */}
        <Text style={styles.section}>
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

        </View>

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
              List Home Free
            </Text>

          </TouchableOpacity>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  scroll: {
    paddingBottom: 40,
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brand: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
  },

  tag: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },

  loginBtn: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 14,
  },

  loginTxt: {
    color: '#fff',
    fontWeight: '800',
  },

  hero: {
    backgroundColor: '#4338CA',
    marginHorizontal: 18,
    borderRadius: 26,
    padding: 22,
    marginTop: 8,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#fff',
    lineHeight: 38,
  },

  heroSub: {
    color: '#E0E7FF',
    marginTop: 10,
  },

  searchBox: {
    backgroundColor: '#fff',
    marginTop: 18,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  searchIcon: {
    color: '#4338CA',
    fontSize: 18,
    fontWeight: '900',
  },

  input: {
    flex: 1,
    paddingVertical: 14,
    marginLeft: 10,
    color: '#0F172A',
    fontWeight: '600',
  },

  searchBtn: {
    backgroundColor: '#312E81',
    marginTop: 14,
    paddingVertical: 15,
    borderRadius: 16,
  },

  searchTxt: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '800',
  },

  section: {
    fontSize: 21,
    fontWeight: '900',
    marginHorizontal: 18,
    marginTop: 26,
    marginBottom: 14,
    color: '#0F172A',
  },

  horizontalWrap: {
    paddingHorizontal: 18,
  },

  catBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  catTxt: {
    color: '#4338CA',
    fontWeight: '700',
  },

  cardWrap: {
    paddingHorizontal: 18,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 3,
  },

  image: {
    width: '100%',
    height: 210,
    backgroundColor: '#E2E8F0',
  },

  imageBox: {
    width: '100%',
    height: 210,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageTxt: {
    color: '#64748B',
    fontWeight: '700',
    fontSize: 15,
  },

  content: {
    padding: 16,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },

  price: {
    fontSize: 22,
    fontWeight: '900',
    color: '#4338CA',
    marginTop: 10,
  },

  location: {
    marginTop: 8,
    color: '#64748B',
    fontSize: 14,
  },

  row: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tagBox: {
    backgroundColor: '#EEF2FF',
    color: '#4338CA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    fontWeight: '800',
    overflow: 'hidden',
    fontSize: 12,
  },

  btn: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },

  btnTxt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 13,
  },

  empty: {
    textAlign: 'center',
    marginTop: 60,
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
  },

  cta: {
    backgroundColor: '#fff',
    marginHorizontal: 18,
    marginTop: 18,
    borderRadius: 22,
    padding: 22,
    alignItems: 'center',
  },

  ctaTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },

  ctaSub: {
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 22,
  },

  postBtn: {
    backgroundColor: '#4338CA',
    marginTop: 16,
    paddingHorizontal: 26,
    paddingVertical: 14,
    borderRadius: 16,
  },

  postTxt: {
    color: '#fff',
    fontWeight: '800',
  },

});