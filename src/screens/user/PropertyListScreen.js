import React, { useState, useEffect } from 'react';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import {getProperties, filterProperties,} from '../../api/propertyApi';
import { SafeAreaView } from 'react-native-safe-area-context';

// const BASE_URL = 'http://192.168.1.6:8080';
const BASE_URL = 'http://10.10.1.210:8080';

export default function PropertyListScreen({ navigation }) {

  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] =
  useState('');

  const [selectedType, setSelectedType] =
    useState(''); 

  const [minPrice, setMinPrice] =
    useState('');

  const [maxPrice, setMaxPrice] =
    useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] =
  useState(false);

  // ✅ IMAGE PARSER
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
          return imgString;
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

  // ✅ SAME AS WEB PROJECT
  const mapBackendToUi = (dto) => {

    console.log("DTO:", dto);
    const images = parseImages(dto?.doctypeImages);
  
    console.log(
      'PROPERTY IMAGES:',
      images
    );

    const imagePath = images[0];

    const imageUrl = imagePath
      ? `${BASE_URL}/${String(imagePath).replace(/^\/+/, '')}`
      : '';

    return {

        id:
          dto?.id ||
          null,

        title:
          dto?.title ||
          'Untitled Property',

        location:
          dto?.location ||
          '',

        city:
          dto?.city ||
          '',

        price:
          dto?.price ??
          dto?.rent ??
          null,

        bhkType:
          dto?.bhkType
            ? String(dto.bhkType)
                .replace(/_/g, ' ')
            : null,

        propertyType:
          dto?.propertyType ||
          'N/A',

        furnishing:

          dto?.furnishing ||

          dto?.furnishingType ||

          dto?.furnishedStatus ||

          null,

        carpetArea:

          dto?.carpetArea ||

          dto?.builtupArea ||

          dto?.area ||

          dto?.squareFeet ||

          null,

        description:

          dto?.description ||

          dto?.about ||

          dto?.propertyDescription ||

          dto?.details ||

          null,

        image: imageUrl,

        doctypeImages:
          dto?.doctypeImages ||
          null,

        raw: dto,
      };
  };
    const applyFilters = async () => {
      
    try {

      setLoading(true);

      const token =
        await AsyncStorage.getItem(
          'userToken'
        );

      if (!token) {
        return;
      }

      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      const userId = payload.id;

      const body = {

        city:
          selectedCity || null,

        propertyType:
          selectedType &&
          selectedType !== 'ALL'
            ? selectedType
             : null,

        minPrice:
          minPrice
            ? Number(minPrice)
            : null,

        maxPrice:
          maxPrice
            ? Number(maxPrice)
            : null,

      };

      console.log(
        'FILTER BODY:',
        body
      );

      const response =
        await filterProperties(
          userId,
          body
        );

      console.log(
        'FILTER RESPONSE:',
        response
      );
      console.log(
          'FILTER DATA:',
          response?.data
        );

     const data =
      Array.isArray(response?.data)
        ? response.data
        : [];

      const mapped =
        data.map(mapBackendToUi);

      setProperties(mapped);

    } catch (e) {

      console.log(
        'FILTER ERROR:',
        e?.response?.data || e
      );

    } finally {

      setLoading(false);

    }
    };
  // ✅ FETCH PROPERTIES
  const fetchProperties = async () => {

    try {

      setLoading(true);

      const token = await AsyncStorage.getItem('userToken');

      console.log("TOKEN:", token);

      if (!token) {
        console.log("NO TOKEN FOUND");
        return;
      }

      let userId = null;

      try {

        const payload = JSON.parse(
          atob(token.split('.')[1])
        );

        userId = payload.id;

        console.log("EXTRACTED USER ID:", userId);

      } catch (e) {

        console.log("TOKEN PARSE ERROR:", e);
        return;
      }

      if (!userId) {
        console.log("USER ID NOT FOUND IN TOKEN");
        return;
      }

      const basicRes = await getProperties(userId);

      console.log("BASIC RESPONSE:", basicRes);

      const basicList = Array.isArray(basicRes)
        ? basicRes
        : Array.isArray(basicRes?.data)
        ? basicRes.data
        : [];

      

      console.log("BASIC LIST:", basicList);
      const mappedProperties =
        basicList.map(mapBackendToUi);

        console.log(
        "MAPPED PROPERTIES:",
        mappedProperties
        );

      console.log("MAPPED PROPERTIES:", mappedProperties);

      setProperties(mappedProperties);

    } catch (error) {

      console.log(
        "FETCH ERROR:",
        error?.response?.data || error.message
      );

    } finally {

      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ✅ SEARCH FILTER
  const filtered = properties.filter(item =>
    item.title?.toLowerCase().includes(search.toLowerCase()) ||
    item.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['top', 'left', 'right']}
    >

      <StatusBar
        backgroundColor="#F8FAFC"
        barStyle="dark-content"
      />

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* HEADER */}
        <View style={styles.header}>

          <View>
            <Text style={styles.brand}>
              Rental Homes
            </Text>

            <Text style={styles.sub}>
              Find your perfect stay
            </Text>
          </View>

          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() =>
              setShowFilters(!showFilters)
            }
          >
            <Text style={styles.filterTxt}>
              Filter
            </Text>
          </TouchableOpacity>

        </View>

        {/* SEARCH */}
        <View style={styles.searchWrap}>

          <TextInput
            placeholder="Search city, area, locality"
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />
          {
            showFilters && (

            <View style={styles.filterCard}>

              <Text style={styles.filterHeading}>
                Filter Properties
              </Text>

              <TextInput
                placeholder="City"
                placeholderTextColor="#94A3B8"
                value={selectedCity}
                onChangeText={setSelectedCity}
                style={styles.filterInput}
              />

              <View style={styles.typeRow}>

  {[
    'ALL',
    'APARTMENT',
    'PG',
    'HOUSE',
    'VILLA',
  ].map(type => (

    <TouchableOpacity
      key={type}
      style={[

        styles.typeBtn,

        selectedType === type && {
          backgroundColor: '#4338CA',
        }

      ]}
      onPress={() =>
        setSelectedType(type)
      }
    >

      <Text
        style={[

          styles.typeTxt,

          selectedType === type && {
            color: '#f7e2e2',
          }

        ]}
      >
        {type}
      </Text>

    </TouchableOpacity>

  ))}

</View>

              <View style={styles.priceRow}>

                <TextInput
                  placeholder="Min Price"
                  placeholderTextColor="#94A3B8"
                  value={minPrice}
                  onChangeText={setMinPrice}
                  keyboardType="numeric"
                  style={styles.priceInput}
                />

                <TextInput
                  placeholder="Max Price"
                  placeholderTextColor="#94A3B8"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                  keyboardType="numeric"
                  style={styles.priceInput}
                />

              </View>

              <View style={styles.filterActionRow}>

                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={() => {

                    setSelectedCity('');
                    setSelectedType('');
                    setMinPrice('');
                    setMaxPrice('');

                    fetchProperties();

                  }}
                >

                  <Text style={styles.clearTxt}>
                    Clear
                  </Text>

                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={() => {

                    applyFilters();

                    setShowFilters(false);

                  }}
                >

                  <Text style={styles.applyTxt}>
                    Apply Filters
                  </Text>

                </TouchableOpacity>

              </View>

            </View>

            )
            }
        </View>

        {/* LOADING */}
        {loading && (
          <ActivityIndicator
            size="large"
            color="#4338CA"
            style={{ marginTop: 20 }}
          />
        )}

        {/* LIST */}
        <View style={styles.list}>

          {!loading && filtered.map((item, index) => (

            <TouchableOpacity
            key={`${item.id || index}-${index}`}
            style={styles.card}
           onPress={() => {

            navigation.navigate(
              'PropertyDetails',
              {
                property: item,
                isUserPremium: true
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

                onError={() => {

                  console.log(
                    'FAILED IMAGE:',
                    item.image
                  );
                }}

                defaultSource={require('../../assets/images/no-image.png')}
              />
              ) : (
                <View style={styles.imageBox}>
                  <Text style={styles.imageTxt}>
                    No Image
                  </Text>
                </View>
              )}

              {/* DETAILS */}
              <View style={styles.cardContent}>

                <Text style={styles.cardTitle}>
                  {item.title}
                </Text>

                <Text style={styles.price}>
                  {item.price
                ? `₹${Number(item.price).toLocaleString()}`
                : 'Price Not Available'}
                </Text>

                <Text style={styles.location}>
                  {item.location || item.city
                  ? `${item.location || ''} ${item.city || ''}`
                  : 'Location Not Available'}
                </Text>

                <View style={styles.row}>

                  <Text style={styles.tag}>
                    {item.bhkType || item.propertyType}
                  </Text>

                  {/* <TouchableOpacity style={styles.btn}>
                    <Text style={styles.btnTxt}>
                      View
                    </Text>
                  </TouchableOpacity> */}

                </View>

              </View>

            </TouchableOpacity>

          ))}

          {!loading && filtered.length === 0 && (
            <Text style={styles.empty}>
              No rentals found
            </Text>
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

    paddingHorizontal: 18,
    paddingVertical: 18,

    borderRadius: 26,

    backgroundColor: '#ffffff',

    borderWidth: 1,
    borderColor: COLORS.border,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },

  brand: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: -0.5,
  },

  sub: {
    color: COLORS.lightText,
    marginTop: 4,
    fontSize: 13,
    fontWeight: '500',
  },

  filterBtn: {
    backgroundColor: COLORS.primary,

    paddingHorizontal: 18,
    paddingVertical: 12,

    borderRadius: 16,

    shadowColor: COLORS.primary,
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 2,
  },

  filterTxt: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },

  /* SEARCH */

  searchWrap: {
    paddingHorizontal: 16,
    marginTop: 20,
  },

  input: {
    backgroundColor: '#ffffff',

    borderRadius: 22,

    paddingHorizontal: 20,

    height: 58,

    borderWidth: 1,
    borderColor: COLORS.border,

    color: COLORS.text,

    fontSize: 14,

    shadowColor: '#000',
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },

  /* FILTER CARD */

  filterCard: {
    backgroundColor: '#ffffff',

    marginTop: 18,

    borderRadius: 28,

    padding: 20,

    borderWidth: 1,
    borderColor: '#f3e7dc',

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  filterHeading: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 20,
  },

  filterInput: {
    backgroundColor: '#faf7f2',

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 18,

    paddingHorizontal: 18,

    height: 54,

    marginBottom: 16,

    color: COLORS.text,

    fontSize: 14,
  },

  /* TYPE BUTTONS */

  typeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 14,
  },

  typeBtn: {
    borderWidth: 1,
    borderColor: COLORS.border,

    paddingHorizontal: 18,
    paddingVertical: 11,

    borderRadius: 30,

    marginRight: 10,
    marginBottom: 10,

    backgroundColor: '#ffffff',
  },

  typeTxt: {
    color: COLORS.secondary,
    fontWeight: '700',
    fontSize: 12,
  },

  /* PRICE */

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  priceInput: {
    width: '48%',

    backgroundColor: '#faf7f2',

    borderWidth: 1,
    borderColor: COLORS.border,

    borderRadius: 18,

    paddingHorizontal: 18,

    height: 54,

    color: COLORS.text,

    fontSize: 14,
  },

  /* FILTER ACTIONS */

  filterActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  clearBtn: {
    flex: 1,

    backgroundColor: '#ebe4dc',

    paddingVertical: 16,

    borderRadius: 18,

    marginRight: 10,

    alignItems: 'center',
  },

  applyBtn: {
    flex: 1,

    backgroundColor: COLORS.primary,

    paddingVertical: 16,

    borderRadius: 18,

    alignItems: 'center',

    shadowColor: COLORS.primary,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },

  clearTxt: {
    color: COLORS.secondary,
    fontWeight: '800',
    fontSize: 13,
  },

  applyTxt: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },

  /* LIST */

  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
  },

  /* PROPERTY CARD */

  card: {
    backgroundColor: '#ffffff',

    borderRadius: 28,

    marginBottom: 20,

    overflow: 'hidden',

    borderWidth: 1,
    borderColor: '#f3e7dc',

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  /* IMAGE */

  image: {
    width: '100%',
    height: 220,

    backgroundColor: '#e5e7eb',
  },

  imageBox: {
    width: '100%',
    height: 220,

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

  cardContent: {
    padding: 18,
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: COLORS.secondary,
    lineHeight: 28,
  },

  price: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.primary,
    marginTop: 12,
  },

  location: {
    marginTop: 10,

    color: COLORS.lightText,

    fontSize: 13,

    lineHeight: 21,
  },

  row: {
    marginTop: 18,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tag: {
    backgroundColor: '#fff1e8',

    color: COLORS.primary,

    paddingHorizontal: 14,
    paddingVertical: 8,

    borderRadius: 30,

    fontWeight: '800',

    fontSize: 12,

    overflow: 'hidden',
  },

  btn: {
    backgroundColor: COLORS.primary,

    paddingHorizontal: 18,
    paddingVertical: 11,

    borderRadius: 14,

    shadowColor: COLORS.primary,
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 2,
  },

  btnTxt: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },

  /* EMPTY */

  empty: {
    textAlign: 'center',

    marginTop: 50,

    color: COLORS.lightText,

    fontSize: 15,

    fontWeight: '600',
  },

});