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
const BASE_URL = 'http://192.168.0.133:8080';

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
              <View style={{ flex: 1 }}>

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

                  <TouchableOpacity style={styles.btn}>
                    <Text style={styles.btnTxt}>
                      View
                    </Text>
                  </TouchableOpacity>

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

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  brand: {
    fontSize: 26,
    fontWeight: '700',
    color: '#0F172A',
  },

  sub: {
    color: '#64748B',
    marginTop: 4,
  },

  filterBtn: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },

  filterTxt: {
    color: '#fff',
    fontWeight: '600',
  },

  searchWrap: {
    paddingHorizontal: 20,
    marginTop: 20,
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  list: {
    padding: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 12,
    marginBottom: 18,
    flexDirection: 'row',
    gap: 14,
    elevation: 3,
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 14,
  },

  imageBox: {
    width: 110,
    height: 110,
    borderRadius: 14,
    backgroundColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },

  imageTxt: {
    color: '#334155',
    fontWeight: '600',
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4338CA',
    marginTop: 6,
  },

  location: {
    marginTop: 6,
    color: '#64748B',
  },

  row: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tag: {
    backgroundColor: '#DBEAFE',
    color: '#4338CA',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    fontWeight: '600',
  },

  btn: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  btnTxt: {
    color: '#fff',
    fontWeight: '600',
  },

  empty: {
    textAlign: 'center',
    marginTop: 40,
    color: '#64748B',
    fontSize: 16,
  },
  filterCard: {
  backgroundColor: '#FFFFFF',
  marginHorizontal: 20,
  marginTop: 16,
  borderRadius: 18,
  padding: 18,
  elevation: 4,
},

filterHeading: {
  fontSize: 18,
  fontWeight: '700',
  color: '#0F172A',
  marginBottom: 16,
},

filterInput: {
  backgroundColor: '#F8FAFC',
  borderWidth: 1,
  borderColor: '#E2E8F0',
  borderRadius: 12,
  paddingHorizontal: 14,
  height: 50,
  marginBottom: 14,
  color: '#0F172A',
},

priceRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
},

priceInput: {
  width: '48%',
  backgroundColor: '#F8FAFC',
  borderWidth: 1,
  borderColor: '#E2E8F0',
  borderRadius: 12,
  paddingHorizontal: 14,
  height: 50,
  color: '#0F172A',
},

filterActionRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginTop: 18,
},

clearBtn: {
  flex: 1,
  backgroundColor: '#E2E8F0',
  paddingVertical: 14,
  borderRadius: 12,
  marginRight: 10,
  alignItems: 'center',
},

applyBtn: {
  flex: 1,
  backgroundColor: '#4338CA',
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
},

clearTxt: {
  color: '#0F172A',
  fontWeight: '700',
},

applyTxt: {
  color: '#FFFFFF',
  fontWeight: '700',
},
typeRow: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginBottom: 14,
},

typeBtn: {
  borderWidth: 1,
  borderColor: '#CBD5E1',
  paddingHorizontal: 14,
  paddingVertical: 10,
  borderRadius: 10,
  marginRight: 10,
  marginBottom: 10,
  backgroundColor: '#FFFFFF',
},

typeTxt: {
  color: '#0F172A',
  fontWeight: '600',
},
});