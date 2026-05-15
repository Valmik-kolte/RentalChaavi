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

const COLORS = {
  primary: '#ff7a30',
  secondary: '#132238',
  bg: '#f8f3ed',
  white: '#ffffff',
  textLight: '#6b7280',
};

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: COLORS.bg,

      justifyContent: 'center',
      alignItems: 'center',

      paddingHorizontal: 24,
    },

    /* BACKGROUND SHAPES */

    circleOne: {
      position: 'absolute',

      top: -90,
      right: -70,

      width: 260,
      height: 260,

      borderRadius: 130,

      backgroundColor: '#f3e3d4',

      opacity: 0.9,
    },

    circleTwo: {
      position: 'absolute',

      bottom: -100,
      left: -80,

      width: 280,
      height: 280,

      borderRadius: 140,

      backgroundColor: '#f1dfcf',

      opacity: 0.9,
    },

    /* LOGO */

    logoBox: {
      width: 110,
      height: 110,

      borderRadius: 55,

      backgroundColor: '#111111',

      justifyContent: 'center',
      alignItems: 'center',

      shadowColor: '#000',
      shadowOpacity: 0.12,
      shadowRadius: 14,

      shadowOffset: {
        width: 0,
        height: 6,
      },

      elevation: 6,
    },

    logoTxt: {
      color: COLORS.primary,

      fontSize: 34,

      fontWeight: '900',

      letterSpacing: 1,
    },

    /* BRAND */

    brand: {
      marginTop: 26,

      fontSize: 30,

      fontWeight: '900',

      color: COLORS.secondary,

      textAlign: 'center',

      letterSpacing: -0.8,
    },

    sub: {
      marginTop: 12,

      fontSize: 14,

      color: COLORS.textLight,

      letterSpacing: 0.3,

      textAlign: 'center',

      lineHeight: 24,

      paddingHorizontal: 20,
    },

    /* LOADER */

    loaderWrap: {
      marginTop: 34,
    },

    /* FOOTER */

    footer: {
      position: 'absolute',

      bottom: 42,

      fontSize: 13,

      color: COLORS.primary,

      fontWeight: '700',

      letterSpacing: 0.4,
    },

  });