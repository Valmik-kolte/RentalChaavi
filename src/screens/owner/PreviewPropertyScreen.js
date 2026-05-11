import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  StatusBar,
} from 'react-native';

import { decode as atob } from 'base-64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  addProperty,
  uploadPropertyImages,
  saveFacilities,
} from '../../api/propertyApi';

export default function PreviewPropertyScreen({
  route,
  navigation,
}) {

  const { form, images ,facilities,} = route.params;

  const imageKeys = Object.keys(images);

  // ================= BUILD FORM DATA =================

  const buildFormData = (imageMap) => {

    const formData = new FormData();

    Object.keys(imageMap).forEach((key) => {

      const uri = imageMap[key];

      const fileName =
        uri.split('/').pop() || `${key}.jpg`;

      const fileType = fileName.endsWith('.png')
        ? 'image/png'
        : 'image/jpeg';

      formData.append('files', {
        uri,
        name: fileName,
        type: fileType,
      });
    });

    return formData;
  };

  // ================= HANDLE POST =================

  const handlePost = async () => {

    try {

      const token =
        await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert('Error', 'Please login again');
        return;
      }

      const payloadBase64 = token.split('.')[1];

      const decoded =
        JSON.parse(atob(payloadBase64));

      const ownerId = decoded?.id;

      console.log("OWNER ID:", ownerId);

      if (!ownerId) {
        Alert.alert('Error', 'Invalid session');
        return;
      }

      const mapType = {
        apartment: 'APARTMENT',
        villa: 'VILLA',
        'independent house': 'INDEPENDENT_HOUSE',
        studio: 'STUDIO',
      };

      const selectedType =
        mapType[form.type?.toLowerCase()?.trim()];

      console.log("FORM TYPE:", form.type);
      console.log("SELECTED TYPE:", selectedType);

      if (!selectedType) {
        Alert.alert('Error', 'Invalid Property Type');
        return;
      }

      // ================= PAYLOAD =================

      const payload = {

        title: form.title.trim(),

        apartmentName:
          form.apartmentName.trim(),

        price: Number(form.rent),

        location: form.location.trim(),

        city: form.city.trim(),

        address: form.address.trim(),

        state: form.state.trim(),

        pincode: form.pincode.trim(),

        description: form.description.trim(),

        propertyType: selectedType,

        mobileNumber: form.mobile.trim(),

        bhkType: form.bhkType,

        furnishing: form.furnishing,

        pgType: form.pgType,

        carpetArea:
          form.carpetArea.trim() || "750 sqft",
      };

      console.log(
        "FINAL PAYLOAD:",
        JSON.stringify(payload, null, 2)
      );

      // ================= ADD PROPERTY =================

      const res =
        await addProperty(ownerId, payload);

      console.log(
        "ADD PROPERTY RESPONSE:",
        res
      );

      if (!res || res.status !== 200) {

        Alert.alert(
          'Error',
          res?.message || 'Failed to add property'
        );

        return;
      }

      const propertyId =
        res?.data?.id || res?.id;

      if (!propertyId) {

        Alert.alert(
          'Error',
          'Property ID not found'
        );

        return;
      }

      console.log("PROPERTY ID:", propertyId);

      // ================= STORE IDS =================

      const existing =
        await AsyncStorage.getItem(
          'ownerProperties'
        );

      const parsed =
        existing ? JSON.parse(existing) : [];

      const updated = [...parsed, propertyId];

      await AsyncStorage.setItem(
        'ownerProperties',
        JSON.stringify(updated)
      );

      console.log(
        "UPDATED PROPERTY IDS:",
        updated
      );

      // ================= IMAGE UPLOAD =================

      try {

        console.log("UPLOADING IMAGES...");

        await uploadPropertyImages(
          propertyId,
          buildFormData(images)
        );
        // ✅ SAVE FACILITIES
        if (
          facilities &&
          facilities.length > 0
        ) {

          console.log(
            "SAVING FACILITIES:",
            facilities
          );

          await saveFacilities({
            ownerId: ownerId,
            facilities: facilities.map(item => ({
              facilityName: item,
              status: 'ACTIVE',
            })),
          });

          console.log(
            "FACILITIES SAVED"
          );
        }
        Alert.alert(
          'Property Saved',
          'Your property is pending admin approval.',
          [
            {
              text: 'Request Premium',
              onPress: () =>
                navigation.navigate('Premium'),
            },
            {
              text: 'Later',
              onPress: () =>
                navigation.navigate('Tabs'),
            },
          ]
        );

      } catch (imgErr) {

        console.log(
          "IMAGE UPLOAD ERROR:",
          imgErr
        );

        Alert.alert(
          'Property Saved',
          'Property saved but image upload failed.',
          [
            {
              text: 'Request Premium',
              onPress: () =>
                navigation.navigate('Premium'),
            },
            {
              text: 'Later',
              onPress: () =>
                navigation.navigate('Tabs'),
            },
          ]
        );
      }

    } catch (error) {

      console.log("FULL ERROR:", error);

      const errMsg =
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong';

      Alert.alert('Error', errMsg);
    }
  };

  // ================= UI =================

  return (

    <SafeAreaView style={styles.safe}>

      <StatusBar
        backgroundColor="#F8FAFC"
        barStyle="dark-content"
      />

      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >

        {/* HEADER */}

        <Text style={styles.title}>
          Preview Property
        </Text>

        {/* DETAILS CARD */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Property Details
          </Text>

          <View style={styles.row}>
            <Text style={styles.label}>Title</Text>
            <Text style={styles.value}>
              {form.title}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Apartment
            </Text>
            <Text style={styles.value}>
              {form.apartmentName}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Price</Text>
            <Text style={styles.price}>
              ₹ {form.rent}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Location
            </Text>
            <Text style={styles.value}>
              {form.location}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>City</Text>
            <Text style={styles.value}>
              {form.city}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>State</Text>
            <Text style={styles.value}>
              {form.state}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Pincode
            </Text>
            <Text style={styles.value}>
              {form.pincode}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              BHK
            </Text>
            <Text style={styles.value}>
              {form.bhkType.replace('_', ' ')}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Furnishing
            </Text>
            <Text style={styles.value}>
              {form.furnishing.replace('_', ' ')}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              PG Type
            </Text>
            <Text style={styles.value}>
              {form.pgType.replace('_', ' ')}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>
              Area
            </Text>
            <Text style={styles.value}>
              {form.carpetArea}
            </Text>
          </View>

          <View style={styles.descBox}>
            <Text style={styles.label}>
              Description
            </Text>

            <Text style={styles.desc}>
              {form.description}
            </Text>
          </View>

        </View>


      {/* FACILITIES */}

        <View style={styles.card}>

          <Text style={styles.sectionTitle}>
            Facilities
          </Text>

          <View style={styles.facilityContainer}>

            {facilities?.map((item, index) => (

              <View
                key={index}
                style={styles.facilityChip}
              >

                <Text style={styles.facilityText}>
                  ✓ {item}
                </Text>

              </View>
            ))}

          </View>

        </View>
        {/* IMAGES */}

        <Text style={styles.imageTitle}>
          Property Images
        </Text>

        <View style={styles.imageGrid}>

          {imageKeys.map((key) => (

            <Image
              key={key}
              source={{ uri: images[key] }}
              style={styles.image}
            />
          ))}
        </View>

        {/* BUTTON */}

        <TouchableOpacity
          style={styles.button}
          onPress={handlePost}
        >
          <Text style={styles.buttonText}>
            Post Property
          </Text>
        </TouchableOpacity>

      </ScrollView>

    </SafeAreaView>
  );
}

// ================= STYLES =================

const styles = StyleSheet.create({

  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  container: {
    flex: 1,
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,

    elevation: 4,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 18,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    paddingVertical: 10,

    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },

  value: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
    maxWidth: '60%',
    textAlign: 'right',
  },

  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#16A34A',
  },

  descBox: {
    marginTop: 18,
  },

  desc: {
    marginTop: 8,
    fontSize: 15,
    lineHeight: 22,
    color: '#334155',
  },

  imageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },

  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  image: {
    width: '48%',
    height: 140,
    borderRadius: 16,
    marginBottom: 14,
    backgroundColor: '#E2E8F0',
  },

  button: {
    backgroundColor: '#4338CA',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,

    shadowColor: '#4338CA',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 5,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '700',
  },
  facilityContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },

  facilityChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
  },

  facilityText: {
    color: '#4338CA',
    fontWeight: '600',
  },
});