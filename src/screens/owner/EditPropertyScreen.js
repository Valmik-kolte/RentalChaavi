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
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  launchImageLibrary,
} from 'react-native-image-picker';

const BASE_URL = 'http://192.168.0.133:8080';

export default function EditPropertyScreen({
  navigation,
  route,
}) {

  const property =
    route?.params?.property;

  const raw =
    property?.raw || {};

  console.log(
    'EDIT PROPERTY FULL:',
    JSON.stringify(property, null, 2)
  );

  const [loading, setLoading] =
    useState(false);

  const [title, setTitle] =
    useState(
      property?.title ||
      raw?.title ||
      ''
    );

  const [price, setPrice] =
    useState(
      String(
        property?.price ||
        raw?.price ||
        ''
      )
    );

  const [location, setLocation] =
    useState(
      property?.location ||
      raw?.location ||
      ''
    );

  const [city, setCity] =
    useState(
      property?.city ||
      raw?.city ||
      ''
    );

  const [address, setAddress] =
    useState(
      property?.address ||
      raw?.address ||
      ''
    );

  const [description, setDescription] =
    useState(
      raw?.description ||
      property?.description ||
      ''
    );

  const [apartmentName, setApartmentName] =
    useState(
      raw?.apartmentName ||
      ''
    );

  const [bhkType, setBhkType] =
    useState(
      raw?.bhkType ||
      property?.bhkType ||
      ''
    );

  const [propertyType, setPropertyType] =
    useState(
      raw?.propertyType ||
      property?.propertyType ||
      ''
    );

  const [furnishing, setFurnishing] =
    useState(
      raw?.furnishing ||
      property?.furnishing ||
      ''
    );

  const [carpetArea, setCarpetArea] =
    useState(
      raw?.carpetArea ||
      property?.carpetArea ||
      ''
    );

  const parseImages = (imgString) => {

    try {

      if (
        !imgString ||
        imgString === '[]'
      ) {
        return [];
      }

      if (Array.isArray(imgString)) {

        return imgString.map(img => {

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
        .map(img => {

          const finalImg = img
            .trim()
            .replace(/^\/+/, '');

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

      return [];
    }
  };

  const [images, setImages] =
    useState([

      raw?.coverImage
        ? `${BASE_URL}/${raw.coverImage}`
        : null,

      ...parseImages(
        property?.doctypeImages ||
        raw?.doctypeImages
      ),

    ].filter(Boolean));

  const pickImages = async () => {

    try {

      const result =
        await launchImageLibrary({
          mediaType: 'photo',
          selectionLimit: 5,
        });

      if (result.didCancel) {
        return;
      }

      const selected =
        result.assets || [];

      const formatted =
        selected.map(item => ({
          uri: item.uri,
          type: item.type,
          fileName: item.fileName,
        }));

      setImages(prev => [
        ...prev,
        ...formatted,
      ]);

    } catch (e) {

      console.log(
        'IMAGE PICK ERROR:',
        e
      );
    }
  };

  const removeImage = index => {

    const updated = [...images];

    updated.splice(index, 1);

    setImages(updated);
  };

  const handleUpdate = async () => {

    try {

      setLoading(true);

      const payload = {

        id:
          property?.id ||
          raw?.id,

        title,

        apartmentName,

        location,

        city,

        address,

        description,

        price:
          Number(price),

        bhkType,

        propertyType,

        furnishing,

        carpetArea,
      };

      console.log(
        'UPDATE PAYLOAD:',
        payload
      );

      Alert.alert(
        'Success',
        'Property Updated Successfully'
      );

      navigation.goBack();

    } catch (e) {

      console.log(
        'UPDATE ERROR:',
        e
      );

      Alert.alert(
        'Error',
        'Update Failed'
      );

    } finally {

      setLoading(false);
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

      {/* HEADER */}

      <View style={styles.header}>

        <TouchableOpacity
          onPress={() =>
            navigation.goBack()
          }
        >

          <Text style={styles.back}>
            ←
          </Text>

        </TouchableOpacity>

        <Text style={styles.title}>
          Edit Property
        </Text>

        <View style={{ width: 24 }} />

      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 50,
        }}
      >

        {/* IMAGES */}

        <Text style={styles.section}>
          Property Images
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 20 }}
        >

          {images.map((img, index) => {

            const imageUri =
              typeof img === 'string'
                ? img
                : img?.uri;

            return (

              <View
                key={index}
                style={styles.imageWrap}
              >

                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                />

                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() =>
                    removeImage(index)
                  }
                >

                  <Text style={styles.removeTxt}>
                    ✕
                  </Text>

                </TouchableOpacity>

              </View>
            );
          })}

        </ScrollView>

        <TouchableOpacity
          style={styles.uploadBtn}
          onPress={pickImages}
        >

          <Text style={styles.uploadTxt}>
            Add Images
          </Text>

        </TouchableOpacity>

        {/* FORM */}

        <View style={styles.form}>

          <Text style={styles.label}>
            Property Title
          </Text>

          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
            style={styles.input}
          />

          <Text style={styles.label}>
            Apartment Name
          </Text>

          <TextInput
            value={apartmentName}
            onChangeText={setApartmentName}
            placeholder="Apartment name"
            style={styles.input}
          />

          <Text style={styles.label}>
            Price
          </Text>

          <TextInput
            value={price}
            onChangeText={setPrice}
            placeholder="Enter price"
            keyboardType="numeric"
            style={styles.input}
          />

          <Text style={styles.label}>
            Location
          </Text>

          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="Location"
            style={styles.input}
          />

          <Text style={styles.label}>
            City
          </Text>

          <TextInput
            value={city}
            onChangeText={setCity}
            placeholder="City"
            style={styles.input}
          />

          <Text style={styles.label}>
            Address
          </Text>

          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="Address"
            style={styles.input}
          />

          <Text style={styles.label}>
            BHK Type
          </Text>

          <TextInput
            value={bhkType}
            onChangeText={setBhkType}
            placeholder="ONE_BHK"
            style={styles.input}
          />

          <Text style={styles.label}>
            Property Type
          </Text>

          <TextInput
            value={propertyType}
            onChangeText={setPropertyType}
            placeholder="APARTMENT"
            style={styles.input}
          />

          <Text style={styles.label}>
            Furnishing
          </Text>

          <TextInput
            value={furnishing}
            onChangeText={setFurnishing}
            placeholder="FULLY_FURNISHED"
            style={styles.input}
          />

          <Text style={styles.label}>
            Carpet Area
          </Text>

          <TextInput
            value={carpetArea}
            onChangeText={setCarpetArea}
            placeholder="800 sqft"
            style={styles.input}
          />

          <Text style={styles.label}>
            Description
          </Text>

          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="Description"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
            style={styles.textarea}
          />

          <TouchableOpacity
            style={styles.updateBtn}
            onPress={handleUpdate}
            disabled={loading}
          >

            {loading ? (

              <ActivityIndicator
                color="#FFFFFF"
              />

            ) : (

              <Text style={styles.updateTxt}>
                Update Property
              </Text>

            )}

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

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
  },

  back: {
    fontSize: 28,
    color: '#0F172A',
    fontWeight: '700',
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },

  section: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 12,
  },

  imageWrap: {
    marginLeft: 18,
    position: 'relative',
  },

  image: {
    width: 120,
    height: 120,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
  },

  removeBtn: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 28,
    height: 28,
    borderRadius: 20,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },

  removeTxt: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  uploadBtn: {
    marginHorizontal: 18,
    backgroundColor: '#4338CA',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 10,
  },

  uploadTxt: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  form: {
    paddingHorizontal: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 8,
    marginTop: 14,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#0F172A',
  },

  textarea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    color: '#0F172A',
    height: 140,
  },

  updateBtn: {
    backgroundColor: '#4338CA',
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 28,
    marginBottom: 30,
  },

  updateTxt: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});

