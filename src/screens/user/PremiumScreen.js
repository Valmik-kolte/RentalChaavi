// src/screens/user/PremiumScreen.js
// CLEAN QR PAYMENT SCREEN (API CONNECTED)

import React from 'react';

import {
  SafeAreaView,
  StatusBar,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { buyPremiumOwner,buyPremiumUser } from '../../api/propertyApi'; 

export default function PremiumScreen({ navigation, route }) {

  const handleDone = async () => {

    try {

      const premiumType =
  route?.params?.premiumType;

      // USER PREMIUM FLOW
      if (premiumType === 'USER') {

        const token =
          await AsyncStorage.getItem('userToken');

        if (!token) {

          Alert.alert(
            'Error',
            'Please login again'
          );

          return;
        }

        let userId = null;

        try {

          const payload = JSON.parse(
            atob(token.split('.')[1])
          );

          userId = payload.id;

        } catch {

          Alert.alert(
            'Error',
            'Invalid session'
          );

          return;
        }

        const response =
          await buyPremiumUser(userId);

        console.log(
          'USER PREMIUM RESPONSE:',
          response
        );

        Alert.alert(
          'Success',
          'Premium request sent',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.replace('MainApp')
            },
          ]
        );

        return;
      }

      // OWNER PREMIUM FLOW
      const ownerId =
        await AsyncStorage.getItem('ownerId');

      console.log('OWNER ID:', ownerId);

      if (!ownerId) {

        Alert.alert(
          'Error',
          'Please login again'
        );

        return;
      }

      const response =
        await buyPremiumOwner(ownerId);

      console.log(
        'PREMIUM RESPONSE:',
        response.data
      );

      Alert.alert(
        'Success',
        'Premium request sent',
        [
          {
            text: 'OK',
            onPress: () =>
              navigation.replace('MainApp')
          },
        ]
      );

    } catch (error) {

      console.log(
        'ERROR:',
        error.response?.data || error.message
      );

      Alert.alert(
        'Error',
        error.response?.data?.message ||
        'Failed to send request'
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#F8FAFF" barStyle="dark-content" />

      <View style={styles.container}>

        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.back}>←</Text>
          </TouchableOpacity>

          <Text style={styles.title}>Scan & Pay</Text>

          <View style={{ width: 24 }} />
        </View>

        {/* CONTENT */}
        <View style={styles.content}>

          {/* QR CODE */}
          <View style={styles.qrContainer}>
            <Image
              source={{
                uri: 'https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=PAYMENT_LINK',
              }}
              style={styles.qr}
            />
          </View>

          {/* INSTRUCTION */}
          <Text style={styles.instructions}>
            Scan this QR using any UPI app and complete your payment
          </Text>

        </View>

        {/* DONE BUTTON */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.doneBtn} onPress={handleDone}>
            <Text style={styles.doneTxt}>Done</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

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

  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  /* HEADER */

  header: {
    marginHorizontal: 16,
    marginTop: 10,

    paddingHorizontal: 18,
    paddingVertical: 16,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: '#ffffff',

    borderRadius: 24,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 5,
    elevation: 2,
  },

  back: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.secondary,
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: -0.4,
  },

  /* CONTENT */

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',

    paddingHorizontal: 24,
  },

  /* QR CARD */

  qrContainer: {
    backgroundColor: '#ffffff',

    padding: 26,

    borderRadius: 34,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },

  qr: {
    width: 240,
    height: 240,

    borderRadius: 20,
  },

  /* INSTRUCTION */

  instructions: {
    marginTop: 28,

    textAlign: 'center',

    color: COLORS.lightText,

    fontSize: 14,

    lineHeight: 24,

    paddingHorizontal: 10,
  },

  /* FOOTER */

  footer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    paddingTop: 10,
  },

  /* BUTTON */

  doneBtn: {
    backgroundColor: COLORS.primary,

    paddingVertical: 18,

    borderRadius: 22,

    alignItems: 'center',

    shadowColor: COLORS.primary,
    shadowOpacity: 0.14,
    shadowRadius: 6,
    elevation: 3,
  },

  doneTxt: {
    color: '#ffffff',

    fontWeight: '900',

    fontSize: 15,

    letterSpacing: 0.3,
  },

});