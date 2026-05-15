// src/screens/auth/LoginScreen.js
import { jwtDecode } from 'jwt-decode';
import React, {
  useState,
  useContext,
} from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  AuthContext,
} from '../../context/AuthContext';

export default function LoginScreen({
  navigation,
}) {
  const { login } =
    useContext(AuthContext);

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [showPassword,
    setShowPassword] =
    useState(false);

  const validateEmail =
    value => {
      return /\S+@\S+\.\S+/.test(
        value
      );
    };

    const handleLogin = async () => {
      try {
        setLoading(true);

        const response = await login({
          email: email.trim(),
          password,
        });

        console.log("FULL LOGIN RESPONSE:");
        console.log(JSON.stringify(response, null, 2));

        if (!response?.success) {
          Alert.alert(
            'Login Failed',
            response?.message || 'Try again.'
          );
          return;
        }

        let ownerId = null;
        let role = 'USER'; // default

        try {
          const decoded = jwtDecode(response.token);

          console.log("DECODED TOKEN:", decoded);

          /* existing */
          ownerId = decoded?.id;

          /* 🔥 NEW: extract role */
          role = decoded?.role || 'USER';

          /* normalize role */
          role = role.toUpperCase().replace('ROLE_', '');

          console.log("FINAL ROLE:", role);

        } catch (err) {
          console.log("Token decode failed:", err);
        }

        console.log("LOGIN RESPONSE:", response);
        console.log("OWNER ID:", ownerId);

        if (!ownerId) {
          Alert.alert(
            'Error',
            'Owner ID not received from server'
          );
          return;
        }

        /* SAVE DATA */
        await AsyncStorage.setItem(
          'ownerId',
          String(ownerId)
        );

        await AsyncStorage.setItem(
          'userRole',
          role
        );

        await AsyncStorage.setItem(
          'userToken',
          response.token
        );

        console.log("OWNER ID SAVED");
        console.log("ROLE SAVED:", role);

      } catch (error) {
        Alert.alert(
          'Login Failed',
          'Something went wrong.'
        );
      } finally {
        setLoading(false);
      }
    };
       
  return (
    <SafeAreaView
      style={styles.container}
      edges={[
        'top',
        'left',
        'right',
      ]}
    >
      <StatusBar
        backgroundColor="#F8FAFC"
        barStyle="dark-content"
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : 'height'
        }
      >
        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={
            styles.scroll
          }
        >
          {/* TOP */}
          <View style={styles.top}>
            <View style={styles.logo}>
              <Text style={styles.logoTxt}>
                CB
              </Text>
            </View>

            <Text style={styles.brand}>
              Caryanam Broker
            </Text>

            <Text style={styles.heading}>
              Welcome Back
            </Text>

            <Text style={styles.sub}>
              Secure login to manage
              home rentals, leads and
              dashboard access.
            </Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>
            <Text style={styles.label}>
              Email Address
            </Text>

            <TextInput
              placeholder="Enter email"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              value={email}
              onChangeText={
                setEmail
              }
              style={styles.input}
            />

            <Text style={styles.label}>
              Password
            </Text>

            <View style={styles.passWrap}>
              <TextInput
                placeholder="Enter password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={
                  !showPassword
                }
                returnKeyType="done"
                value={password}
                onChangeText={
                  setPassword
                }
                style={
                  styles.passInput
                }
              />

              <TouchableOpacity
                onPress={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
              >
                <Text
                  style={
                    styles.showTxt
                  }
                >
                  {showPassword
                    ? 'Hide'
                    : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity>
              <Text style={styles.forgot}>
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginBtn}
              onPress={
                handleLogin
              }
              disabled={
                loading
              }
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={
                    styles.loginTxt
                  }
                >
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                'Register'
              )
            }
          >
            <Text
              style={
                styles.bottomTxt
              }
            >
              New User?{' '}
              <Text
                style={
                  styles.link
                }
              >
                Create Account
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor: COLORS.bg,
    },

    scroll: {
      flexGrow: 1,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 30,
      justifyContent: 'center',
    },

    /* TOP */

    top: {
      alignItems: 'center',
      marginBottom: 26,
    },

    logo: {
      width: 78,
      height: 78,
      borderRadius: 39,

      backgroundColor: '#111111',

      justifyContent: 'center',
      alignItems: 'center',

      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 10,
      elevation: 4,
    },

    logoTxt: {
      color: COLORS.primary,
      fontSize: 24,
      fontWeight: '900',
      letterSpacing: 1,
    },

    brand: {
      marginTop: 16,
      fontSize: 22,
      fontWeight: '800',
      color: COLORS.secondary,
      letterSpacing: 0.2,
    },

    heading: {
      marginTop: 10,
      fontSize: 34,
      fontWeight: '900',
      color: COLORS.secondary,
      letterSpacing: -1,
    },

    sub: {
      marginTop: 12,

      textAlign: 'center',

      color: COLORS.lightText,

      lineHeight: 24,
      fontSize: 14,

      paddingHorizontal: 14,
    },

    /* CARD */

    card: {
      backgroundColor: '#ffffff',

      borderRadius: 28,

      padding: 22,

      borderWidth: 1,
      borderColor: '#f3e7dc',

      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 3,
    },

    label: {
      fontSize: 13,
      fontWeight: '700',
      color: COLORS.secondary,

      marginBottom: 8,
      marginTop: 14,
    },

    input: {
      backgroundColor: '#faf7f2',

      borderRadius: 16,

      borderWidth: 1,
      borderColor: COLORS.border,

      paddingHorizontal: 16,
      paddingVertical: 16,

      color: COLORS.text,
      fontSize: 14,
    },

    passWrap: {
      flexDirection: 'row',
      alignItems: 'center',

      backgroundColor: '#faf7f2',

      borderRadius: 16,

      borderWidth: 1,
      borderColor: COLORS.border,

      paddingHorizontal: 16,
    },

    passInput: {
      flex: 1,
      paddingVertical: 16,
      color: COLORS.text,
      fontSize: 14,
    },

    showTxt: {
      color: COLORS.primary,
      fontWeight: '700',
      fontSize: 13,
    },

    forgot: {
      textAlign: 'right',

      color: COLORS.primary,

      marginTop: 14,

      fontWeight: '700',
      fontSize: 13,
    },

    /* BUTTON */

    loginBtn: {
      backgroundColor: COLORS.primary,

      paddingVertical: 17,

      borderRadius: 18,

      marginTop: 26,

      shadowColor: COLORS.primary,
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 3,
    },

    loginTxt: {
      color: '#fff',

      textAlign: 'center',

      fontWeight: '800',
      fontSize: 15,
    },

    /* BOTTOM */

    bottomTxt: {
      textAlign: 'center',

      marginTop: 28,

      color: COLORS.lightText,

      fontSize: 14,

      marginBottom: 10,
    },

    link: {
      color: COLORS.primary,
      fontWeight: '800',
    },

  });