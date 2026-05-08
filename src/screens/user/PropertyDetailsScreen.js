import React from 'react';

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

const { width } = Dimensions.get('window');

// const BASE_URL = 'http://192.168.1.13:8080';
const BASE_URL = 'http://192.168.0.133:8080';

export default function PropertyDetailsScreen({
  navigation,
  route,
}) {

  const property =
    route?.params?.property;

  console.log(
    'DETAIL SCREEN PROPERTY:',
    property
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

              return `${BASE_URL}/uploads/${String(img)
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

            return `${BASE_URL}/uploads/${finalImg}`;
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
              : `${BASE_URL}/uploads/${property.image}`
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

  const images =
    parseImages(property?.doctypeImages);

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

  const callOwner = () => {

    const phone =
      property?.ownerMobile ||
      property?.mobileNumber;

    if (phone) {

      Linking.openURL(`tel:${phone}`);

    } else {

      Alert.alert(
        'Premium Required',
        'Owner details available for premium users only.'
      );
    }
  };

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
              {property?.propertyType || 'N/A'}
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

                : 'N/A'}

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

                  'N/A'

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

                'N/A'

              }

            </Text>
          </View>

        </View>

        {/* ABOUT */}
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

                'Beautiful property with premium interior and peaceful environment.'

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

                'Address not available'}

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
        <View style={styles.cta}>

          <Text style={styles.ctaTitle}>
            Interested in this property?
          </Text>

          <Text style={styles.ctaSub}>
            Connect with the owner and
            schedule your visit today.
          </Text>

          {property?.price ? (

            <TouchableOpacity
              style={styles.postBtn}
              onPress={callOwner}
            >

              <Text style={styles.postTxt}>
                Contact Owner
              </Text>

            </TouchableOpacity>

          ) : (

            <TouchableOpacity
              style={styles.postBtn}
              onPress={() =>
                navigation.navigate(
                  'Premium',
                  {
                    isUserPremium: true
                  }
                )
              }
            >

              <Text style={styles.postTxt}>
                Buy Premium
              </Text>

            </TouchableOpacity>

          )}

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

  loaderWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },

  image: {
    width: '100%',
    height: 260,
  },

  noImage: {
    width: width - 36,
    height: 260,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    overflow: 'hidden',
    marginLeft: 18,
  },

  noImageTxt: {
    color: '#64748B',
    fontWeight: '700',
  },

  topButtons: {
    position: 'absolute',
    top: 20,
    left: 18,
    zIndex: 10,
  },

  iconBtn: {
    backgroundColor: '#FFFFFFDD',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconTxt: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },

  hero: {
    backgroundColor: '#4338CA',
    marginHorizontal: 18,
    marginTop: -40,
    borderRadius: 26,
    padding: 22,
  },

  heroTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
  },

  heroSub: {
    color: '#E0E7FF',
    marginTop: 8,
  },

  heroPrice: {
    marginTop: 18,
    fontSize: 26,
    fontWeight: '900',
    color: '#fff',
  },

  section: {
    fontSize: 21,
    fontWeight: '900',
    marginHorizontal: 18,
    marginTop: 28,
    marginBottom: 14,
    color: '#0F172A',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
  },

  gridCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
  },

  gridLabel: {
    color: '#64748B',
    fontSize: 13,
  },

  gridValue: {
    marginTop: 8,
    fontWeight: '900',
    color: '#0F172A',
    fontSize: 15,
  },

  cardWrap: {
    paddingHorizontal: 18,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
  },

  loc: {
    color: '#64748B',
    lineHeight: 22,
  },

  ownerCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  avatarTxt: {
    color: '#4338CA',
    fontWeight: '900',
    fontSize: 20,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },

  cta: {
    backgroundColor: '#fff',
    marginHorizontal: 18,
    marginTop: 24,
    borderRadius: 24,
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
    marginTop: 18,
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 16,
  },

  postTxt: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 15,
  },

});