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
import {getProperties, filterProperties} from '../../api/propertyApi';
import { SafeAreaView } from 'react-native-safe-area-context';

const BASE_URL = 'http://192.168.1.13:8080';

export default function PropertyListScreen({ navigation }) {

  const [search, setSearch] = useState('');
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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

      let detailedList = [];

        if (basicList.length > 0) {

          const propertyType =
            basicList[0]?.propertyType || "APARTMENT";

          const detailedRes = await filterProperties(userId, {
            propertyType
          });

          console.log("DETAIL RESPONSE:", detailedRes);

          detailedList = Array.isArray(detailedRes?.data)
            ? detailedRes.data
            : [];
        }

      console.log("BASIC LIST:", basicList);
      console.log("DETAIL LIST:", detailedList);

      // ✅ MERGE BOTH API RESPONSES
      const merged = basicList.map((basic) => {

      const detailed = detailedList.find(
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

          furnishing:

            detailed?.furnishing ||

            detailed?.furnishingType ||

            basic?.furnishing ||

            basic?.furnishingType ||

            null,

          carpetArea:

            detailed?.carpetArea ||

            detailed?.builtupArea ||

            detailed?.area ||

            basic?.carpetArea ||

            basic?.builtupArea ||

            basic?.area ||

            null,

          description:

            detailed?.description ||

            detailed?.about ||

            detailed?.propertyDescription ||

            basic?.description ||

            basic?.about ||

            basic?.propertyDescription ||

            null,

          id:
            detailed?.id ||
            basic?.id ||
            null,
        };
    });

      console.log("MERGED DATA:", merged);

      const mappedProperties = merged.map(mapBackendToUi);

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

          <TouchableOpacity style={styles.filterBtn}>
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

});