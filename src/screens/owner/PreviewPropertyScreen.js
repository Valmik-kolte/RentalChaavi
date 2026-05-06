import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { decode as atob } from 'base-64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addProperty, uploadPropertyImages } from '../../api/propertyApi';

export default function PreviewPropertyScreen({ route, navigation }) {

  const { form, images } = route.params;

  const imageKeys = Object.keys(images);

  const buildFormData = (imageMap) => {
    const formData = new FormData();

    Object.keys(imageMap).forEach((key) => {
      const uri = imageMap[key];

      const fileName = uri.split('/').pop() || `${key}.jpg`;

      const fileType = fileName.endsWith('.png')
        ? 'image/png'
        : 'image/jpeg';

      formData.append('files', {
        uri: uri,
        name: fileName,
        type: fileType,
      });
    });

    return formData;
  };

  const handlePost = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');

        if (!token) {
        Alert.alert('Error', 'Login again');
        return;
        }

        const payloadBase64 = token.split('.')[1];
        const decoded = JSON.parse(atob(payloadBase64));

        const ownerId = decoded?.id;

        if (!ownerId) {
        Alert.alert('Error', 'Invalid session');
        return;
        }

        if (!ownerId) {
            Alert.alert('Error', 'Login again');
            return;
        }

        const mapType = {
            apartment: 'APARTMENT',
            'independent house': 'INDEPENDENT_HOUSE',
            'standalone building': 'STANDALONE_BUILDING',
        };

        const selectedType = mapType[form.type?.toLowerCase()?.trim()];

        
        if (!form.bhkType) {
          Alert.alert("Error", "Select BHK Type");
          return;
        }

        if (!form.furnishing) {
          Alert.alert("Error", "Select Furnishing Type");
          return;
        }

        if (!selectedType && !form.pgType) {
            Alert.alert("Error", "Select Property Type or PG Type");
            return;
        }
        const payload = {
            // ownerId: ownerId,
            title: form.title.replace(/[0-9]/g, '').trim(),
            price: Number(form.rent),
            location: form.location.replace(/[0-9]/g, '').trim(),
            city: form.city.trim(),
            address: form.address.trim(),
            state: form.state.trim(),
            pincode: form.pincode.trim(),
            description: form.description.trim(),
            propertyType: selectedType || null,
            mobileNumber: form.mobile.replace(/\D/g, '').slice(0, 10),
            bhkType: form.bhkType,
            furnishing: form.furnishing,
            pgType: form.pgType || null,
            carpetArea: form.carpetArea.trim() || "750 sqft",
        };

        console.log("FINAL PAYLOAD:", payload);

        // ✅ STEP 1: SAVE PROPERTY (ALWAYS WORKS)
        const res = await addProperty(ownerId, payload);

        console.log("ADD PROPERTY RESPONSE:", res?.data);

       if (!res?.data) {
        Alert.alert('Error', 'Failed to add property');
        return;
      }
      console.log("BASE URL CHECK");

        const propertyId = res.data?.data?.id;
        

        if (!propertyId) {
            Alert.alert('Error', 'Property not created');
            return;
        }

        console.log("FORM DATA:", images);

        const existing = await AsyncStorage.getItem('ownerProperties');
        const parsed = existing ? JSON.parse(existing) : [];

        const updated = [...parsed, propertyId];

        await AsyncStorage.setItem('ownerProperties', JSON.stringify(updated));

        console.log("UPDATED PROPERTY IDS:", updated);
        // ✅ STEP 2: UPLOAD IMAGES
        try {
            await uploadPropertyImages(propertyId, buildFormData(images));

            Alert.alert(
            'Property Saved (Pending Approval)',
            'Your property is saved as pending. Request premium to make it live.',
            [
                {
                text: 'Request Premium',
                onPress: () => navigation.navigate('Premium'),
                },
                {
                text: 'Later',
                onPress: () => navigation.navigate('Tabs'),
                }
            ]
            );

        } catch (imgErr) {
            console.log("IMAGE UPLOAD ERROR:", imgErr);

            Alert.alert(
            'Property Saved',
            'Saved but image upload failed. You can retry later.',
            [
                {
                text: 'Request Premium',
                onPress: () => navigation.navigate('Premium'),
                },
                {
                text: 'Later',
                onPress: () => navigation.navigate('Tabs'),
                }
            ]
            );
        }

        } catch (error) {
        const errMsg =
            error?.response?.data?.message ||
            error?.message ||
            'Something went wrong';

          console.log("FULL ERROR:", error);
          console.log("STATUS:", error?.response?.status);
          console.log("DATA:", error?.response?.data);
          console.log("MESSAGE:", error?.message);

        // ❌ DO NOT CHECK PREMIUM HERE
        Alert.alert('Error', errMsg);
        }
  };

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>Preview Property</Text>

      {/* DETAILS */}
      <View style={styles.card}>
        <Text>Title: {form.title}</Text>
        <Text>Price: ₹{form.rent}</Text>
        <Text>Location: {form.location}</Text>
        <Text>City: {form.city}</Text>
        <Text>State: {form.state}</Text>
        <Text>Address: {form.address}</Text>
        <Text>Pincode: {form.pincode}</Text>
        <Text>BHK: {form.bhkType}</Text>
        <Text>Furnishing: {form.furnishing}</Text>
        <Text>PG Type: {form.pgType}</Text>
        <Text>Area: {form.carpetArea}</Text>
      </View>

      {/* IMAGES */}
      <Text style={styles.subtitle}>Images</Text>

      <View style={styles.imageGrid}>
        {imageKeys.map((key) => (
          <Image
            key={key}
            source={{ uri: images[key] }}
            style={styles.image}
          />
        ))}
      </View>

      {/* POST BUTTON */}
      <TouchableOpacity style={styles.button} onPress={handlePost}>
        <Text style={styles.buttonText}>Post Property</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
  },
  subtitle: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  image: {
    width: '30%',
    height: 100,
    margin: 5,
    borderRadius: 8,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#4338CA',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});