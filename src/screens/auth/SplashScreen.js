import React, {
  useEffect,
} from 'react';

import {
  View,
  Text,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

export default function SplashScreen({
  navigation,
}) {

  useEffect(() => {

    const timer =
      setTimeout(() => {

        navigation?.replace?.(
          'Landing'
        );

      }, 2200);

    return () =>
      clearTimeout(timer);

  }, [navigation]);

  return (

    <View style={styles.container}>

      <StatusBar
        backgroundColor="#F8FAFC"
        barStyle="dark-content"
      />

      {/* TOP CIRCLE */}
      <View style={styles.circleOne} />

      {/* BOTTOM CIRCLE */}
      <View style={styles.circleTwo} />

      {/* LOGO */}
      <View style={styles.logoBox}>

        <Text style={styles.logoTxt}>
          CB
        </Text>

      </View>

      {/* BRAND */}
      <Text style={styles.brand}>
        Caryanam Broker
      </Text>

      <Text style={styles.sub}>
        Trusted Rental Marketplace
      </Text>

      {/* LOADER */}
      <View style={styles.loaderWrap}>

        <ActivityIndicator
          size="large"
          color="#4338CA"
        />

      </View>

      {/* FOOTER */}
      <Text style={styles.footer}>
        Rent • Buy • Sell • Stay
      </Text>

    </View>
  );
}

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: '#F8FAFC',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },

    circleOne: {
      position: 'absolute',
      top: -50,
      right: -40,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: '#EEF2FF',
    },

    circleTwo: {
      position: 'absolute',
      bottom: -70,
      left: -50,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: '#EEF2FF',
    },

    logoBox: {
      width: 124,
      height: 124,
      borderRadius: 62,
      backgroundColor: '#4338CA',
      justifyContent: 'center',
      alignItems: 'center',

      shadowColor: '#4338CA',
      shadowOpacity: 0.25,
      shadowRadius: 16,
      shadowOffset: {
        width: 0,
        height: 8,
      },

      elevation: 10,
    },

    logoTxt: {
      color: '#fff',
      fontSize: 42,
      fontWeight: '900',
      letterSpacing: 1,
    },

    brand: {
      marginTop: 28,
      fontSize: 34,
      fontWeight: '900',
      color: '#0F172A',
      textAlign: 'center',
    },

    sub: {
      marginTop: 10,
      fontSize: 15,
      color: '#64748B',
      letterSpacing: 0.4,
      textAlign: 'center',
      lineHeight: 22,
    },

    loaderWrap: {
      marginTop: 36,
    },

    footer: {
      position: 'absolute',
      bottom: 44,
      fontSize: 14,
      color: '#4338CA',
      fontWeight: '800',
      letterSpacing: 0.5,
    },

  });