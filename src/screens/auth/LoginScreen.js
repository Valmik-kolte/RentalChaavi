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

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        '#F8FAFC',
    },

    scroll: {
      flexGrow: 1,
      paddingHorizontal: 22,
      paddingTop: 14,
      paddingBottom: 30,
      justifyContent:
        'center',
    },

    top: {
      alignItems: 'center',
      marginBottom: 24,
    },

    logo: {
      width: 88,
      height: 88,
      borderRadius: 44,
      backgroundColor:
        '#4338CA',
      justifyContent:
        'center',
      alignItems:
        'center',
      shadowColor:
        '#4338CA',
      shadowOpacity: 0.25,
      shadowRadius: 14,
      elevation: 8,
    },

    logoTxt: {
      color: '#fff',
      fontSize: 28,
      fontWeight: '900',
    },

    brand: {
      marginTop: 14,
      fontSize: 25,
      fontWeight: '900',
      color: '#0F172A',
    },

    heading: {
      marginTop: 8,
      fontSize: 28,
      fontWeight: '900',
      color: '#0F172A',
    },

    sub: {
      marginTop: 10,
      textAlign: 'center',
      color: '#64748B',
      lineHeight: 22,
      fontSize: 14,
      paddingHorizontal: 18,
    },

    card: {
      backgroundColor:
        '#FFFFFF',
      borderRadius: 28,
      padding: 22,
      borderWidth: 1,
      borderColor:
        '#EEF2FF',
      shadowColor:
        '#000',
      shadowOpacity: 0.06,
      shadowRadius: 16,
      elevation: 6,
    },

    label: {
      fontSize: 14,
      fontWeight: '800',
      color: '#0F172A',
      marginBottom: 8,
      marginTop: 12,
    },

    input: {
      backgroundColor:
        '#F8FAFC',
      borderRadius: 16,
      borderWidth: 1,
      borderColor:
        '#E2E8F0',
      paddingHorizontal: 14,
      paddingVertical: 15,
      color: '#111827',
    },

    passWrap: {
      flexDirection: 'row',
      alignItems:
        'center',
      backgroundColor:
        '#F8FAFC',
      borderRadius: 16,
      borderWidth: 1,
      borderColor:
        '#E2E8F0',
      paddingHorizontal: 14,
    },

    passInput: {
      flex: 1,
      paddingVertical: 15,
      color: '#111827',
    },

    showTxt: {
      color: '#4338CA',
      fontWeight: '800',
      fontSize: 13,
    },

    forgot: {
      textAlign: 'right',
      color: '#4338CA',
      marginTop: 12,
      fontWeight: '700',
      fontSize: 13,
    },

    loginBtn: {
      backgroundColor:
        '#4338CA',
      paddingVertical: 16,
      borderRadius: 16,
      marginTop: 24,
      shadowColor:
        '#4338CA',
      shadowOpacity: 0.25,
      shadowRadius: 10,
      elevation: 5,
    },

    loginTxt: {
      color: '#fff',
      textAlign: 'center',
      fontWeight: '900',
      fontSize: 16,
    },

    bottomTxt: {
      textAlign: 'center',
      marginTop: 28,
      color: '#64748B',
      fontSize: 14,
      marginBottom: 10,
    },

    link: {
      color: '#4338CA',
      fontWeight: '900',
    },
  });