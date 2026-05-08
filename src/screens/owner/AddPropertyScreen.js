import { addProperty, uploadPropertyImages } from '../../api/propertyApi';
import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { Picker } from '@react-native-picker/picker';
import { Platform } from 'react-native';
import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddPropertyScreen({ navigation }) {

  const [form, setForm] = useState({
    title: '',
    apartmentName: '',
    rent: '',
    location: '',
    city: '',
    state: '',
    address: '',
    pincode: '',
    mobile: '',
    description: '',
    type: 'Apartment',
    bhkType: 'ONE_BHK',
    furnishing: 'FULLY_FURNISHED',
    pgType: 'BOYS_ONLY',
    carpetArea: '',
  });

  const [images, setImages] = useState({});

  const types = [
    'Apartment',
    'Villa',
    'Independent House',
    'Studio',
  ];

  const imageFields = [
    { key: 'door', label: 'Door' },
    { key: 'hall', label: 'Hall' },
    { key: 'bedroom', label: 'Bedroom' },
    { key: 'balcony', label: 'Balcony' },
    { key: 'kitchen', label: 'Kitchen' },
    { key: 'bath1', label: 'Bathroom 1' },
    { key: 'bath2', label: 'Bathroom 2' },
    { key: 'parking', label: 'Parking' },
    { key: 'soc1', label: 'Society 1' },
    { key: 'soc2', label: 'Society 2' },
  ];

  const update = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const pickImage = (key) => {
    launchImageLibrary(
      { mediaType: 'photo', quality: 0.7 },
      (response) => {
        if (response.didCancel) return;

        if (response.errorCode) {
          Alert.alert('Error', 'Image pick failed');
          return;
        }

        const uri = response.assets?.[0]?.uri;

        if (uri) {
          setImages(prev => ({
            ...prev,
            [key]: uri,
          }));
        }
      }
    );
  };


    const buildFormData = (imageMap) => {
    const formData = new FormData();

    imageFields.forEach(field => {
      const uri = imageMap[field.key];

      if (!uri) return; 

      formData.append('files', {
        uri: Platform.OS === 'android'
          ? uri
          : uri.replace('file://', ''),
        name: `${field.key}-${Date.now()}.jpg`,
        type: 'image/jpeg',
      });
    });

    return formData;
  };
    

  const submit = async () => {
      if (
      !form.title ||
      !form.rent ||
      !form.location ||
      !form.city ||
      !form.state ||
      !form.address ||
      !form.pincode ||
      !form.mobile ||
      !form.bhkType ||
      !form.furnishing ||
      !form.pgType ||
      !form.carpetArea
    ) {
      Alert.alert('Error', 'Please fill all required fields including property details');
      return;
    }

    const missing = imageFields.filter(f => !images[f.key]);

    if (missing.length > 0) {
      Alert.alert('Error', 'Upload all images');
      return;
    }

    try {
     const storedOwnerId = await AsyncStorage.getItem('ownerId');
      console.log("RAW OWNER ID FROM STORAGE:", storedOwnerId);

      const ownerId = Number(storedOwnerId);
      console.log("PARSED OWNER ID:", ownerId);

    if (!ownerId || ownerId === 0) {
      Alert.alert('Error', 'Owner ID not found. Please login again');
      return;
    }

      console.log('OWNER ID:', ownerId);

      console.log("IMAGES OBJECT:", images);
     const mapType = {
        'Apartment': 'APARTMENT',
        'Villa': 'VILLA',
        'Independent House': 'INDEPENDENT_HOUSE',
        'Studio': 'STUDIO',
      };

      if (isNaN(Number(form.rent))) {
        Alert.alert('Error', 'Enter valid price');
        return;
      }
      if (form.mobile.length !== 10) {
        Alert.alert('Error', 'Enter valid 10-digit mobile number');
        return;
      }
      if (isNaN(Number(form.pincode))) {
        Alert.alert('Error', 'Invalid pincode');
        return;
      }

      const payload = {
        title: form.title.trim(),
        apartmentName: form.apartmentName.trim(),
        price: Number(form.rent),
        location: form.location.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
        state: form.state.trim(),              
        pincode: form.pincode.trim(),
        description: form.description.trim(),
        propertyType: mapType[form.type],
        mobileNumber: form.mobile.trim(),
        bhkType: form.bhkType,
        furnishing: form.furnishing,
        pgType: form.pgType,
        carpetArea: form.carpetArea.trim() || "750 sqft",
      };

      console.log("FINAL PAYLOAD:", JSON.stringify(payload, null, 2));
      const res = await addProperty(ownerId, payload);
      await AsyncStorage.setItem(
          'pendingProperty',
          JSON.stringify(formData)
        );

        console.log(
          'PROPERTY SAVED:',
          formData
        );
        console.log("ADD PROPERTY RESPONSE:", res);

        if (!res || res.status !== 200) {
          Alert.alert(
            'Error',
            res?.message || 'Failed to add property'
          );
          return;
        }

        const propertyId = res?.data?.id;

        if (!propertyId) {
          Alert.alert('Error', 'Property not created');
          return;
        }

      

      if (!propertyId) {
        Alert.alert('Error', 'Property created but ID not found');
        return;
      }

      console.log('PROPERTY ID:', propertyId);

    
      try {
      // 🚀 First Upload Attempt
      console.log("UPLOADING IMAGES...");
      await uploadPropertyImages(propertyId, buildFormData(images));

      Alert.alert('Success', 'Property + Images Uploaded');

    } catch (uploadErr) {
      console.log('First upload failed:', uploadErr);

      try {
        // 🔁 Retry Upload
        await uploadPropertyImages(propertyId, buildFormData(images));
        console.log("UPLOAD SUCCESS");
        Alert.alert('Success', 'Uploaded after retry');

      } catch (retryErr) {
        console.log('Retry failed:', retryErr);

        Alert.alert(
          'Warning',
          'Property added but image upload failed'
        );
      }
    }
    } 
    catch (error) {
    const errMsg =
      error?.response?.data?.message ||
      error?.message ||
      'Something went wrong';

    console.log('API ERROR:', errMsg);

    // 🔥 PREMIUM HANDLING
    if (
      errMsg.toLowerCase().includes('premium') ||
      error?.response?.status === 500
    ) {
      Alert.alert(
        'Premium Required',
        'Please buy premium to upload property'
      );
    } else {
      Alert.alert('Error', errMsg);
    }
    }
  };

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']} 
    >
      <StatusBar backgroundColor="#F8FAFF" barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll} 
      >

        <View style={styles.card}>

          <Text style={styles.title}>Upload Property</Text>

          {/* PROPERTY TYPE */}
          <View style={styles.row}>
            {types.map(item => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.typeBtn,
                  form.type === item && styles.activeBtn,
                ]}
                onPress={() => update('type', item)}
              >
                <Text style={[
                  styles.typeTxt,
                  form.type === item && styles.activeTxt,
                ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* INPUTS */}
          {/* PROPERTY TITLE */}
          <Text style={styles.inputLabel}>Property Title</Text>

          <TextInput
            placeholder="Enter Property Title"
            placeholderTextColor="#94A3B8"
            value={form.title}
            onChangeText={v => update('title', v)}
            style={styles.input}
          />

          {/* APARTMENT NAME */}
          <Text style={styles.inputLabel}>Apartment Name</Text>

          <TextInput
            placeholder="Enter Apartment Name"
            placeholderTextColor="#94A3B8"
            value={form.apartmentName}
            onChangeText={v => update('apartmentName', v)}
            style={styles.input}
          />

          {/* PRICE */}
          <Text style={styles.inputLabel}>Price</Text>

          <TextInput
            placeholder="Enter Price"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            value={form.rent}
            onChangeText={v => update('rent', v)}
            style={styles.input}
          />

          {/* LOCATION */}
          <Text style={styles.inputLabel}>Location</Text>

          <TextInput
            placeholder="Enter Location"
            placeholderTextColor="#94A3B8"
            value={form.location}
            onChangeText={v => update('location', v)}
            style={styles.input}
          />

          {/* CITY */}
          <Text style={styles.dropdownLabel}>City</Text>

          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={form.city}
              onValueChange={(value) => update('city', value)}
              style={styles.picker}
              dropdownIconColor="#4338CA"
            >
              <Picker.Item label="Select City" value="" />
              <Picker.Item label="Pune" value="Pune" />
            </Picker>
          </View>

          {/* STATE */}
          <Text style={styles.dropdownLabel}>State</Text>

          <View style={styles.dropdownContainer}>
            <Picker
              selectedValue={form.state}
              onValueChange={(value) => update('state', value)}
              style={styles.picker}
              dropdownIconColor="#4338CA"
            >
              <Picker.Item label="Select State" value="" />
              <Picker.Item label="Maharashtra" value="Maharashtra" />
            </Picker>
          </View>

          {/* ADDRESS */}
          <Text style={styles.inputLabel}>Address</Text>

          <TextInput
            placeholder="Enter Address"
            placeholderTextColor="#94A3B8"
            value={form.address}
            onChangeText={v => update('address', v)}
            style={[styles.input, styles.textArea]}
          />

          {/* PINCODE */}
          <Text style={styles.inputLabel}>Pincode</Text>

          <TextInput
            placeholder="Enter Pincode"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            value={form.pincode}
            onChangeText={v => update('pincode', v)}
            style={styles.input}
          />

          {/* MOBILE */}
          <Text style={styles.inputLabel}>Mobile Number</Text>

          <TextInput
            placeholder="Enter Mobile Number"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            value={form.mobile}
            onChangeText={v => update('mobile', v)}
            style={styles.input}
          />

          {/* CARPET AREA */}
          <Text style={styles.inputLabel}>Carpet Area</Text>

          <TextInput
            placeholder="e.g. 750 sqft"
            placeholderTextColor="#94A3B8"
            value={form.carpetArea}
            onChangeText={v => update('carpetArea', v)}
            style={styles.input}
          />

          {/* DESCRIPTION */}
          <Text style={styles.inputLabel}>Description</Text>

          <TextInput
            placeholder="Enter Property Description"
            placeholderTextColor="#94A3B8"
            value={form.description}
            onChangeText={v => update('description', v)}
            style={[styles.input, styles.descriptionBox]}
            multiline
          />

            <Text style={styles.label}>BHK Type</Text>
            <View style={styles.row}>
              {['ONE_BHK', 'TWO_BHK', 'THREE_BHK'].map(item => (
                <TouchableOpacity
                  key={item}
                  style={[
                    styles.typeBtn,
                    form.bhkType === item && styles.activeBtn,
                  ]}
                  onPress={() => update('bhkType', item)}
                >
                  <Text style={[
                    styles.typeTxt,
                    form.bhkType === item && styles.activeTxt,
                  ]}>
                    {item.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

              <Text style={styles.label}>Furnishing</Text>
              <View style={styles.row}>
                {['FULLY_FURNISHED', 'SEMI_FURNISHED', 'UNFURNISHED'].map(item => (
                  <TouchableOpacity
                    key={item}
                    style={[
                      styles.typeBtn,
                      form.furnishing === item && styles.activeBtn,
                    ]}
                    onPress={() => update('furnishing', item)}
                  >
                    <Text style={[
                      styles.typeTxt,
                      form.furnishing === item && styles.activeTxt,
                    ]}>
                      {item.replace('_', ' ')}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

                <Text style={styles.label}>PG Type</Text>
                <View style={styles.row}>
                  {['BOYS_ONLY', 'GIRLS_ONLY', 'BOTH'].map(item => (
                    <TouchableOpacity
                      key={item}
                      style={[
                        styles.typeBtn,
                        form.pgType === item && styles.activeBtn,
                      ]}
                      onPress={() => update('pgType', item)}
                    >
                      <Text style={[
                        styles.typeTxt,
                        form.pgType === item && styles.activeTxt,
                      ]}>
                        {item.replace('_', ' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

          {/* IMAGE GRID */}
          <Text style={styles.imageTitle}>Property Images (All Required)</Text>

          <View style={styles.imageGrid}>
            {imageFields.map(item => (
              <TouchableOpacity key={item.key} style={styles.imageBox} onPress={() => pickImage(item.key)}>
                {images[item.key] ? (
                  <Image source={{ uri: images[item.key] }} style={styles.imagePreview} />
                ) : (
                  <>
                    <Text style={styles.uploadIcon}>⬆</Text>
                    <Text style={styles.imageTxt}>{item.label}</Text>
                  </>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.submitBtn} onPress={() => {
              if (
                !form.title ||
                !form.apartmentName ||
                !form.rent ||
                !form.location ||
                !form.city ||
                !form.state ||
                !form.address ||
                !form.pincode ||
                !form.mobile
              ) {
                Alert.alert('Error', 'Fill all required fields');
                return;
              }

              navigation.navigate('PreviewProperty', {
                form,
                images,
              });
            }}>
            <Text style={styles.submitTxt}>Preview Property</Text>
          </TouchableOpacity>

        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFF' },

  card: {
    margin: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 18,
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  typeBtn: {
    width: '48%',
    padding: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center',
  },

  scroll: {
    paddingBottom: 120, 
  },

  activeBtn: {
    backgroundColor: '#4338CA',
  },

  typeTxt: {
    color: '#334155',
    fontWeight: '800',
  },

    dropdownLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginTop: 10,
  },

  dropdownContainer: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
  },

  picker: {
    color: '#0F172A',
  },

  inputLabel: {
    marginTop: 14,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },

  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },

  descriptionBox: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
  activeTxt: {
    color: '#fff',
  },

  input: {
    marginTop: 10,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    color: '#0F172A',
  },

  imageTitle: {
    marginTop: 20,
    fontWeight: '800',
    color: '#0F172A',
  },

  imageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 10,
  },

  imageBox: {
    width: '30%',
    height: 90,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#CBD5E1',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },

  uploadIcon: {
    fontSize: 18,
    color: '#64748B',
  },

  imageTxt: {
    fontSize: 11,
    color: '#64748B',
  },

  imagePreview: {
    width: '100%',
    height: '100%',
  },

  submitBtn: {
    marginTop: 20,
    backgroundColor: '#4338CA',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  submitTxt: {
    color: '#fff',
    fontWeight: '900',
  },
});