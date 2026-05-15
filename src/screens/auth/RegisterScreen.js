import React, {
  useState,
  useContext,
} from 'react';

import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  AuthContext,
} from '../../context/AuthContext';

export default function RegisterScreen({
  navigation,
}) {
  const {
    register,
    sendEmailOtp,
    verifyEmailOtp,
  } = useContext(AuthContext);

  const [role, setRole] =
    useState('USER');

  const [fullName,
    setFullName] =
    useState('');

  const [mobile,
    setMobile] =
    useState('');

  const [email,
    setEmail] =
    useState('');

  const [password,
    setPassword] =
    useState('');

  const [otp,
  setOtp] =
  useState('');

  const [otpSent,
    setOtpSent] =
    useState(false);

  const [emailVerified,
    setEmailVerified] =
    useState(false);

  const [otpLoading,
    setOtpLoading] =
    useState(false);

  const [verifyLoading,
    setVerifyLoading] =
    useState(false);

  const [loading,
    setLoading] =
    useState(false);

  const [showPassword,
    setShowPassword] =
    useState(false);

  const roles = [
    {
      label: 'User',
      value: 'USER',
    },
    {
      label: 'Owner',
      value:
        'PROPERTY_OWNER',
    },
    // {
    //   label: 'Admin',
    //   value:
    //     'ADMIN',
    // },
  ];

  const validateEmail =
    value => {
      return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(
        value
      );
    };

  const validateName =
    value => {
      return /^[A-Za-z ]+$/.test(
        value
      );
    };

    const handleSendOtp =
      async () => {

        const mail =
          email
            .trim()
            .toLowerCase();

        if (
          !validateEmail(mail)
        ) {

          Alert.alert(
            'Invalid Email',
            'Enter valid gmail address.'
          );

          return;
        }

        try {

          setOtpLoading(true);

          const response =
            await sendEmailOtp({
            email: mail,
            });

          if (
              response?.success === true
            ) {

            setOtpSent(true);

            Alert.alert(
              'Success',
              response.message
            );

          } else {

            Alert.alert(
              'Failed',
              response.message
            );
          }

        } catch (error) {

          Alert.alert(
            'Failed',
            'Unable to send OTP.'
          );

        } finally {

          setOtpLoading(false);
        }
      };

      const handleVerifyOtp =
        async () => {

          if (
            !otp.trim()
          ) {

            Alert.alert(
              'Required',
              'Please enter OTP.'
            );

            return;
          }

          try {

            setVerifyLoading(true);

            const response =
              await verifyEmailOtp({
                email:
                  email
                    .trim()
                    .toLowerCase(),
                otp:
                  otp.trim(),
              });

            if (
              response.success
            ) {

              setEmailVerified(
                true
              );

              Alert.alert(
                'Success',
                'Email verified successfully.'
              );

            } else {

              Alert.alert(
                'Failed',
                response.message
              );
            }

          } catch (error) {

            Alert.alert(
              'Failed',
              'OTP verification failed.'
            );

          } finally {

            setVerifyLoading(
              false
            );
          }
        };
        const handleRegister =
          async () => {
            const name =
              fullName.trim();

            const phone =
              mobile.trim();

            const mail =
              email
                .trim()
                .toLowerCase();

            if (
              !name ||
              !phone ||
              !mail ||
              !password.trim()
            ) {
              Alert.alert(
                'Required',
                'Please fill all fields.'
              );
              return;
            }

            if (
              !validateName(
                name
              )
            ) {
              Alert.alert(
                'Invalid Name',
                'Only letters and spaces allowed.'
              );
              return;
            }

            if (
              phone.length !==
                10 ||
              !/^\d+$/.test(
                phone
              )
            ) {
              Alert.alert(
                'Invalid Mobile',
                'Enter valid 10 digit mobile number.'
              );
              return;
            }

            if (
              !validateEmail(
                mail
              )
            ) {
              Alert.alert(
                'Invalid Email',
                'Only Gmail addresses allowed.'
              );
              return;
            }

            if (
              password.length <
              6
            ) {
              Alert.alert(
                'Weak Password',
                'Password must be minimum 6 characters.'
              );
              return;
            }

            if (!emailVerified) {

        Alert.alert(
          'Verify Email',
          'Please verify your email first.'
        );

        return;
      }
      try {
        setLoading(true);

        const response =
          await register({
            role,
            fullName:
              name,
            mobile:
              phone,
            email:
              mail,
            password,
          });

        if (
          response?.success
        ) {
          Alert.alert(
            'Success',
            response?.message ||
              'Registration successful.',
            [
              {
                text: 'Login',
                onPress:
                  () =>
                    navigation.navigate(
                      'Login'
                    ),
              },
            ]
          );
        } else {
          Alert.alert(
            'Failed',
            response?.message ||
              'Registration failed.'
          );
        }
      } catch (error) {
        Alert.alert(
          'Failed',
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
              Create Account
            </Text>

            <Text style={styles.sub}>
              Join trusted home rental
              marketplace today.
            </Text>
          </View>

          {/* CARD */}
          <View style={styles.card}>
            <Text style={styles.label}>
              Select Role
            </Text>

            <View style={styles.roleRow}>
              {roles.map(
                item => (
                  <TouchableOpacity
                    key={
                      item.value
                    }
                    style={[
                      styles.roleBtn,
                      role ===
                        item.value &&
                        styles.roleActive,
                    ]}
                    onPress={() =>
                      setRole(
                        item.value
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.roleTxt,
                        role ===
                          item.value &&
                          styles.roleTxtActive,
                      ]}
                    >
                      {
                        item.label
                      }
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>

            <Text style={styles.label}>
              Full Name
            </Text>

            <TextInput
              placeholder="Enter full name"
              placeholderTextColor="#94A3B8"
              value={fullName}
              onChangeText={
                setFullName
              }
              style={styles.input}
            />

            <Text style={styles.label}>
              Mobile Number
            </Text>

            <TextInput
              placeholder="Enter mobile number"
              placeholderTextColor="#94A3B8"
              keyboardType="number-pad"
              maxLength={10}
              value={mobile}
              onChangeText={
                setMobile
              }
              style={styles.input}
            />

            <Text style={styles.label}>
              Gmail Address
            </Text>

            <TextInput
              placeholder="Enter gmail"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={
                setEmail
              }
              style={styles.input}
            />

            <TouchableOpacity
              style={[
                styles.otpBtn,
                emailVerified &&
                  styles.verifiedBtn,
              ]}
              onPress={
                handleSendOtp
              }
              disabled={
                otpLoading ||
                emailVerified
              }
            >
              {otpLoading ? (

                <ActivityIndicator
                  color="#fff"
                />

              ) : (

                <Text
                  style={
                    styles.otpBtnTxt
                  }
                >
                  {emailVerified
                    ? 'Email Verified'
                    : 'Send OTP'}
                </Text>
              )}
            </TouchableOpacity>

            {otpSent &&
              !emailVerified && (
                <>
                  <Text
                    style={
                      styles.label
                    }
                  >
                    Enter OTP
                  </Text>

                  <TextInput
                    placeholder="Enter 6 digit OTP"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otp}
                    onChangeText={
                      setOtp
                    }
                    style={
                      styles.input
                    }
                  />

                  <TouchableOpacity
                    style={
                      styles.verifyBtn
                    }
                    onPress={
                      handleVerifyOtp
                    }
                    disabled={
                      verifyLoading
                    }
                  >
                    {verifyLoading ? (

                      <ActivityIndicator
                        color="#fff"
                      />

                    ) : (

                      <Text
                        style={
                          styles.btnTxt
                        }
                      >
                        Verify OTP
                      </Text>
                    )}
                  </TouchableOpacity>
                </>
            )}

            <Text style={styles.label}>
              Password
            </Text>

            <View
              style={
                styles.passWrap
              }
            >
              <TextInput
                placeholder="Create password"
                placeholderTextColor="#94A3B8"
                secureTextEntry={
                  !showPassword
                }
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

            <TouchableOpacity
              style={styles.btn}
              onPress={
                handleRegister
              }
              disabled={
                loading
              }
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnTxt}>
                  Register
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate(
                'Login'
              )
            }
          >
            <Text style={styles.bottomTxt}>
              Already have account?{' '}
              <Text style={styles.link}>
                Login
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
    },

    /* TOP */

    top: {
      alignItems: 'center',
      marginBottom: 24,
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
      fontSize: 32,
      fontWeight: '900',
      color: COLORS.secondary,
      letterSpacing: -1,
    },

    sub: {
      marginTop: 12,

      color: COLORS.lightText,

      textAlign: 'center',

      fontSize: 14,
      lineHeight: 24,

      paddingHorizontal: 12,
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

      marginTop: 14,
      marginBottom: 8,
    },

    /* ROLE */

    roleRow: {
      flexDirection: 'row',
      gap: 10,
    },

    roleBtn: {
      flex: 1,

      paddingVertical: 14,

      borderRadius: 16,

      backgroundColor: '#faf7f2',

      alignItems: 'center',

      borderWidth: 1,
      borderColor: COLORS.border,
    },

    roleActive: {
      backgroundColor: COLORS.primary,
      borderColor: COLORS.primary,
    },

    roleTxt: {
      color: COLORS.secondary,
      fontWeight: '700',
      fontSize: 14,
    },

    roleTxtActive: {
      color: '#fff',
    },

    /* INPUT */

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

    /* MAIN BUTTON */

    btn: {
      backgroundColor: COLORS.primary,

      paddingVertical: 17,

      borderRadius: 18,

      marginTop: 28,

      shadowColor: COLORS.primary,
      shadowOpacity: 0.18,
      shadowRadius: 8,
      elevation: 3,
    },

    btnTxt: {
      color: '#fff',

      textAlign: 'center',

      fontWeight: '800',
      fontSize: 15,
    },

    /* OTP BUTTON */

    otpBtn: {
      height: 52,

      backgroundColor: COLORS.primary,

      borderRadius: 16,

      justifyContent: 'center',
      alignItems: 'center',

      marginTop: 14,

      shadowColor: COLORS.primary,
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 2,
    },

    otpBtnTxt: {
      color: '#fff',
      fontSize: 14,
      fontWeight: '700',
    },

    verifyBtn: {
      height: 52,

      backgroundColor: '#111111',

      borderRadius: 16,

      justifyContent: 'center',
      alignItems: 'center',

      marginTop: 14,
    },

    verifiedBtn: {
      backgroundColor: '#16A34A',
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