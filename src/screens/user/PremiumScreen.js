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
                navigation.goBack(),
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
              navigation.goBack(),
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

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },

  container: {
    flex: 1,
    justifyContent: 'space-between',
  },

  header: {
    paddingHorizontal: 18,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  back: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0F172A',
  },

  title: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0F172A',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 24,
    elevation: 5,
  },

  qr: {
    width: 220,
    height: 220,
  },

  instructions: {
    marginTop: 20,
    textAlign: 'center',
    color: '#64748B',
    fontSize: 14,
    lineHeight: 20,
  },

  footer: {
    padding: 18,
  },

  doneBtn: {
    backgroundColor: '#1565FF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },

  doneTxt: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
});