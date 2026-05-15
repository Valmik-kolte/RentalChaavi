import React, {
  useState,
  useEffect
} from 'react';

import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Image,
  Dimensions,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getFacilities
} from '../../api/propertyApi';

const { width } = Dimensions.get('window');

// const BASE_URL = 'http://192.168.1.6:8080';
const BASE_URL = 'http://10.10.1.210:8080';

export default function PropertyDetailsScreen({
  navigation,
  route,
}) {

  const property =
      route?.params?.property;

      const isPremiumLocked = false;
          

        const lockedText = 'Not Available';

    useEffect(() => {

    const fetchFacilities = async () => {

      // owner can always view facilities
      try {

        const ownerId =
          property?.raw?.ownerId ||
          property?.ownerId;

        console.log(
          'OWNER ID:',
          ownerId
        );

        if (!ownerId) return;

        const propertyId =
          property?.id ||
          property?.raw?.id;

        const res =
          await getFacilities(
            ownerId,
            propertyId
          );

        console.log(
          'FACILITIES RESPONSE:',
          JSON.stringify(res, null, 2)
        );

        setFacilities(
          res?.data || []
        );

      } catch (err) {

        console.log(
          'FACILITY FETCH ERROR:',
          err
        );
      }
    };

    fetchFacilities();

  }, []);
    
    const [facilities, setFacilities] =
  useState([]);


  console.log(
  'DETAIL SCREEN PROPERTY FULL:',
  JSON.stringify(property, null, 2)
);

  console.log(
  'RAW DOCTYPE IMAGES:',
      property?.doctypeImages
    );

  const parseImages = (imgString) => {

      try {

        // CASE 1
        if (
          !imgString ||
          imgString === '[]'
        ) {

          // fallback image
          if (property?.image) {
            return [property.image];
          }

          return [];
        }

        // CASE 2
        if (Array.isArray(imgString)) {

          return imgString.map(img => {

            // already full URL
            if (
              String(img).startsWith('http')
            ) {
              return img;
            }

              return `${BASE_URL}/${String(img)
              .trim()
              .replace(/^\/+/, '')}`;
          });
        }

        // CASE 3
        const cleaned = String(imgString)

          .replace(/^\[/, '')
          .replace(/\]$/, '')
          .replace(/"/g, '')
          .trim();

        if (!cleaned) {

          if (property?.image) {
            return [property.image];
          }

          return [];
        }

        return cleaned
          .split(',')
          .map(img => {

            const finalImg = img
              .trim()
              .replace(/^\/+/, '');

            // already full URL
            if (
              finalImg.startsWith('http')
            ) {
              return finalImg;
            }

            return `${BASE_URL}/${finalImg}`;
          })
          .filter(Boolean);

      } catch (e) {

        console.log(
          'IMAGE PARSE ERROR:',
          e
        );

        // fallback
        if (property?.image) {
          return [
            property.image.startsWith('http')
              ? property.image
              : `${BASE_URL}/${property.image}`
          ];
        }

        return [];
      }
    };

  if (!property) {

    return (
      <SafeAreaView style={styles.loaderWrap}>
        <Text>Property not found</Text>
      </SafeAreaView>
    );
  }

      const images = [

      property?.coverImage
        ? `${BASE_URL}/${property.coverImage}`

        : property?.raw?.coverImage
        ? `${BASE_URL}/${property.raw.coverImage}`

        : null,

      ...parseImages(
        property?.doctypeImages
      ),

    ].filter(Boolean);

    console.log(
      'PARSED IMAGES:',
      images
    );
    console.log(
      'FINAL IMAGES:',
      images
    );

  const ownerName =
    property?.ownerName ||
    'Verified Owner';

  const ownerInitial =
    ownerName?.charAt(0)?.toUpperCase();


  return (

    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}
    >

      <StatusBar
        backgroundColor="#F8FAFC"
        barStyle="dark-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* IMAGE CAROUSEL */}
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={{
    paddingRight: 18,
  }}
  style={{
    marginTop: 18,
  }}
>

  {images.length > 0 ? (

    images.map((img, index) => (

      <View
        key={index}
        style={{
          width: width - 36,
          marginLeft:
            index === 0 ? 18 : 10,
          borderRadius: 24,
          overflow: 'hidden',
          backgroundColor: '#E2E8F0',
        }}
      >

        <Image
          source={{ uri: img }}
          style={styles.image}
          resizeMode="cover"

          onError={() => {

            console.log(
              'FAILED IMAGE:',
              img
            );
          }}
        />

      </View>
    ))

  ) : (

    <View style={styles.noImage}>

      <Text style={styles.noImageTxt}>
        No Image Available
      </Text>

    </View>

  )}

</ScrollView>

        {/* TOP BUTTONS */}
        <View style={styles.topButtons}>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}
          >

            <Text style={styles.iconTxt}>
              ←
            </Text>

          </TouchableOpacity>

        </View>

        {/* PRICE CARD */}
        <View style={styles.hero}>

          <Text style={styles.heroTitle}>
            {property?.title || 'Property'}
          </Text>

          <Text style={styles.heroSub}>

            {property?.location ||
            property?.city

              ? `${property?.location || ''} ${property?.city || ''}`

              : 'Location not available'}

          </Text>

          <Text style={styles.heroPrice}>

            {property?.price

              ? `₹${Number(property.price).toLocaleString()} / month`

              : 'Premium Required'}

          </Text>

        </View>

        {/* HIGHLIGHTS */}
        <Text style={styles.section}>
          Highlights
        </Text>

        <View style={styles.grid}>

          <View style={styles.gridCard}>
            <Text style={styles.gridLabel}>
              Property Type
            </Text>

            <Text style={styles.gridValue}>
              {property?.propertyType || lockedText }
            </Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridLabel}>
              BHK Type
            </Text>

            <Text style={styles.gridValue}>

              {property?.bhkType

                ? String(property.bhkType)
                    .replace(/_/g, ' ')

                : lockedText}

            </Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridLabel}>
              Furnishing
            </Text>

            <Text style={styles.gridValue}>

              {

                  property?.furnishing ||

                  property?.furnishingType ||

                  property?.furnishedStatus ||

                   lockedText

                }

              </Text>
          </View>

          <View style={styles.gridCard}>
            <Text style={styles.gridLabel}>
              Area
            </Text>

            <Text style={styles.gridValue}>

              {

                property?.carpetArea ||

                property?.builtupArea ||

                property?.area ||

                property?.squareFeet ||

                lockedText

              }

            </Text>
          </View>

        </View>

        {/* ABOUT */}

     {/* APARTMENT NAME */}
        <Text style={styles.section}>
        Apartment Name
        </Text>

        <View style={styles.cardWrap}>

        <View style={styles.card}>

            <Text style={styles.loc}>

            {
                property?.apartmentName ||
                property?.raw?.apartmentName ||
                'Apartment name not available'
            }

            </Text>

        </View>

        </View>

        {/* FACILITIES */}
        <Text style={styles.section}>
        Facilities
        </Text>

        <View style={styles.cardWrap}>

        <View style={styles.facilitiesWrap}>

            {facilities.length > 0 ? (

            facilities.map(
                (facility, index) => (

                <View
                    key={index}
                    style={styles.facilityChip}
                >

                    <Text style={styles.facilityTxt}>

                    {String(
                        facility?.facilityName ||
                        facility
                    ).replace(/_/g, ' ')}

                    </Text>

                </View>
                )
            )

            ) : (

            <Text style={styles.loc}>
                No Facilities Available
            </Text>

            )}

        </View>

        </View>

        <Text style={styles.section}>
          About Property
        </Text>

        <View style={styles.cardWrap}>

          <View style={styles.card}>

            <Text style={styles.loc}>

              {

                property?.description ||

                property?.about ||

                property?.propertyDescription ||

                property?.details ||

                lockedText

              }

            </Text>

          </View>

        </View>

        {/* ADDRESS */}
        <Text style={styles.section}>
          Address
        </Text>

        <View style={styles.cardWrap}>

          <View style={styles.card}>

            <Text style={styles.loc}>

              {property?.address ||

                property?.location ||

                lockedText}

            </Text>

          </View>

        </View>

        {/* OWNER */}
        <Text style={styles.section}>
          Owner Details
        </Text>

        <View style={styles.cardWrap}>

          <View style={styles.ownerCard}>

            <View style={styles.avatar}>

              <Text style={styles.avatarTxt}>
                {ownerInitial}
              </Text>

            </View>

            <View style={{ flex: 1 }}>

              <Text style={styles.cardTitle}>
                {ownerName}
              </Text>

              <Text style={styles.loc}>
                Trusted Owner
              </Text>

            </View>

          </View>

        </View>

        {/* CTA */}
        {/* <View style={styles.cta}>

          <Text style={styles.ctaTitle}>
            Interested in this property?
          </Text>

          <Text style={styles.ctaSub}>
            Connect with the owner and
            schedule your visit today.
          </Text>

         
        </View> */}

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

  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  scroll: {
    paddingBottom: 50,
  },

  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.bg,
  },

  /* IMAGE */

  image: {
    width: '100%',
    height: 320,
  },

  noImage: {
    width: width - 32,
    height: 320,

    backgroundColor: '#ece7e2',

    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 32,

    overflow: 'hidden',

    marginLeft: 16,
  },

  noImageTxt: {
    color: COLORS.lightText,
    fontWeight: '700',
    fontSize: 14,
  },

  /* TOP BUTTON */

  topButtons: {
    position: 'absolute',
    top: 20,
    left: 18,
    zIndex: 10,
  },

  iconBtn: {
    backgroundColor: '#fffffff2',

    width: 48,
    height: 48,

    borderRadius: 24,

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },

  iconTxt: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.secondary,
  },

  /* HERO */

  hero: {
    backgroundColor: '#ffffff',

    marginHorizontal: 16,

    marginTop: 18,

    borderRadius: 30,

    padding: 24,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  heroTitle: {
    fontSize: 28,
    lineHeight: 36,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: -0.8,
  },

  heroSub: {
    color: COLORS.lightText,

    marginTop: 10,

    fontSize: 14,

    lineHeight: 22,
  },

  heroPrice: {
    marginTop: 18,

    fontSize: 30,

    fontWeight: '900',

    color: COLORS.primary,
  },

  /* SECTION */

  section: {
    fontSize: 24,
    fontWeight: '900',

    marginHorizontal: 18,
    marginTop: 30,
    marginBottom: 16,

    color: COLORS.secondary,
    letterSpacing: -0.4,
  },

  /* GRID */

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',

    paddingHorizontal: 16,
  },

  gridCard: {
    width: '48%',

    backgroundColor: '#ffffff',

    borderRadius: 24,

    padding: 18,

    marginBottom: 14,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },

  gridLabel: {
    color: COLORS.lightText,
    fontSize: 12,
    fontWeight: '600',
  },

  gridValue: {
    marginTop: 10,

    fontWeight: '800',

    color: COLORS.secondary,

    fontSize: 15,

    lineHeight: 22,
  },

  /* CARD */

  cardWrap: {
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: '#ffffff',

    borderRadius: 24,

    padding: 20,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },

  loc: {
    color: '#4b5563',

    lineHeight: 24,

    fontSize: 14,
  },

  /* OWNER */

  ownerCard: {
    backgroundColor: '#ffffff',

    borderRadius: 24,

    padding: 20,

    flexDirection: 'row',
    alignItems: 'center',

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },

  avatar: {
    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: '#fff1e8',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 16,

    borderWidth: 2,
    borderColor: '#ffe2cf',
  },

  avatarTxt: {
    color: COLORS.primary,

    fontWeight: '900',

    fontSize: 22,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary,
  },

  /* FACILITIES */

  facilitiesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },

  facilityChip: {
    backgroundColor: '#fff1e8',

    paddingVertical: 11,
    paddingHorizontal: 16,

    borderRadius: 30,

    marginRight: 10,
    marginBottom: 10,

    borderWidth: 1,
    borderColor: '#ffe2cf',
  },

  facilityTxt: {
    color: COLORS.primary,

    fontWeight: '700',

    fontSize: 13,
  },

  /* CTA */

  cta: {
    backgroundColor: '#ffffff',

    marginHorizontal: 16,

    marginTop: 28,

    borderRadius: 30,

    padding: 28,

    alignItems: 'center',

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },

  ctaTitle: {
    fontSize: 26,

    fontWeight: '900',

    color: COLORS.secondary,

    textAlign: 'center',

    lineHeight: 34,
  },

  ctaSub: {
    color: COLORS.lightText,

    marginTop: 12,

    textAlign: 'center',

    lineHeight: 24,

    fontSize: 14,
  },

  postBtn: {
    backgroundColor: COLORS.primary,

    marginTop: 22,

    paddingHorizontal: 30,
    paddingVertical: 16,

    borderRadius: 18,

    shadowColor: COLORS.primary,
    shadowOpacity: 0.14,
    shadowRadius: 5,
    elevation: 2,
  },

  postTxt: {
    color: '#ffffff',

    fontWeight: '800',

    fontSize: 15,
  },

});