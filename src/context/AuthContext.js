import React, {
  createContext,
  useEffect,
  useState,
} from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import {
  loginApi,
  registerUserApi,
  registerOwnerApi,
  registerAdminApi,
} from '../api/authApi';

export const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {
  const [userToken,
    setUserToken] =
    useState(null);

  const [userRole,
    setUserRole] =
    useState('USER');

  const [userData,
    setUserData] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

  /* ================= INIT ================= */

  useEffect(() => {
    restoreSession();
  }, []);

  /* ================= RESTORE SESSION ================= */

  const restoreSession =
    async () => {
      try {
        const token =
          await AsyncStorage.getItem(
            'userToken'
          );

        const role =
          await AsyncStorage.getItem(
            'userRole'
          );

        const user =
          await AsyncStorage.getItem(
            'userData'
          );

        if (token) {
          setUserToken(
            token
          );
        }

        setUserRole(
          role || 'USER'
        );

        if (user) {
          setUserData(
            JSON.parse(
              user
            )
          );
        }
      } catch (error) {
        console.log(
          'RESTORE ERROR:',
          error
        );
      } finally {
        setLoading(
          false
        );
      }
    };

  /* ================= SAFE ROLE DETECT ================= */

  const detectRole = (value) => {
  const text = String(value || '').toUpperCase();

    if (text.includes('ADMIN')) return 'ADMIN';

    if (text.includes('OWNER')) return 'PROPERTY_OWNER';

    return 'USER';
  };
    /* ================= LOGIN ================= */

  
      const login = async (data) => {
        try {
          setLoading(true);

          const res = await loginApi({
            email: data.email.trim().toLowerCase(),
            password: data.password,
          });

          const result = res?.data || {};
          console.log('LOGIN RESPONSE:', result);

          // 🔑 TOKEN
          const token =
            result?.token ||
            result?.jwtToken ||
            result?.accessToken ||
            result?.data?.token ||
            '';

          if (!token) {
            return {
              success: false,
              message: 'Token not received',
            };
          }

          /* ========================================= */
          /* 🔥 NEW: ROLE FROM JWT TOKEN (FIXED)       */
          /* ========================================= */

              let role = 'USER';
              let user = {};

              try {
                const decoded = jwtDecode(token);

                console.log("DECODED TOKEN:", decoded);

                // ✅ ROLE FIX
                role = decoded?.role || 'USER';
                role = role.toUpperCase().replace('ROLE_', '');

                // ✅ USER DATA FIX (IMPORTANT)
                user = {
                  id: decoded?.id,          // 🔥 THIS FIXES YOUR ISSUE
                  email: decoded?.sub,
                  role: role,
                };

              } catch (e) {
                console.log("JWT decode failed:", e);

                user = {
                  email: data.email,
                };
              }

              console.log("FINAL ROLE:", role);
              console.log("FINAL USER:", user);

              
          // 💾 STORE
          await AsyncStorage.setItem('userToken', String(token));
          await AsyncStorage.setItem('userRole', String(role));
          await AsyncStorage.setItem('userData', JSON.stringify(user));
          await AsyncStorage.setItem(
  'ownerId',
  String(user.id)
);

          // 🔄 UPDATE STATE
          setUserToken(String(token));
          setUserRole(String(role));
          setUserData(user);

          return {
            success: true,
            token: token,
            role: role,
          };

        } catch (error) {
          console.log('LOGIN ERROR:', error?.response?.data);

          const msg =
            error?.response?.data?.message ||
            error?.response?.data ||
            'Login Failed';

          return {
            success: false,
            message:
              typeof msg === 'string'
                ? msg
                : JSON.stringify(msg),
          };
        } finally {
          setLoading(false);
        }
      };

  /* ================= REGISTER ================= */

  const register =
    async data => {
      try {
        setLoading(true);

        const payload = {
          fullName:
            data.fullName
              .trim(),
          mobileNumber:
            data.mobile
              .trim(),
          email:
            data.email
              .trim()
              .toLowerCase(),
          password:
            data.password,
          role:
            data.role,
        };

        let res;

        if (
          data.role ===
          'ADMIN'
        ) {
          res =
            await registerAdminApi(
              payload
            );
        } else if (
          data.role ===
          'PROPERTY_OWNER'
        ) {
          res =
            await registerOwnerApi(
              payload
            );
        } else {
          res =
            await registerUserApi(
              payload
            );
        }

        return {
          success: true,
          message:
            res?.data
              ?.message ||
            'Registration Successful',
        };
      } catch (error) {
        console.log(
          'REGISTER ERROR:',
          error?.response
            ?.data
        );

        const msg =
          error?.response?.data
            ?.message ||
          error?.response?.data ||
          'Registration Failed';

        return {
          success: false,
          message:
            typeof msg ===
            'string'
              ? msg
              : JSON.stringify(
                  msg
                ),
        };
      } finally {
        setLoading(
          false
        );
      }
    };

  /* ================= LOGOUT ================= */

  const logout =
    async () => {
      try {
        await AsyncStorage.multiRemove(
          [
            'userToken',
            'userRole',
            'userData',
          ]
        );

        setUserToken(
          null
        );

        setUserRole(
          'USER'
        );

        setUserData(
          null
        );
      } catch (error) {
        console.log(
          'LOGOUT ERROR:',
          error
        );
      }
    };

  return (
    <AuthContext.Provider
      value={{
        userToken,
        userRole,
        userData,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};