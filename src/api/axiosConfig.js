import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({

  // baseURL: 'http://192.168.1.6:8080',
  baseURL: 'http://192.168.0.133:8080',

  timeout: 15000,

  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

console.log(
  'BASE URL:',
  api.defaults.baseURL
);

// ================= REQUEST INTERCEPTOR =================

api.interceptors.request.use(

  async config => {

    try {

      const token =
        await AsyncStorage.getItem(
          'userToken'
        );

      console.log(
        'REQUEST URL:',
        config.url
      );

      console.log(
        'REQUEST METHOD:',
        config.method
      );

      console.log(
        'TOKEN FROM STORAGE:',
        token
      );

      if (token) {

        config.headers.Authorization =
          `Bearer ${token}`;
      }

      console.log(
        'FINAL REQUEST HEADERS:',
        config.headers
      );

      return config;

    } catch (error) {

      console.log(
        'REQUEST INTERCEPTOR ERROR:',
        error
      );

      return config;
    }
  },

  error => {

    console.log(
      'REQUEST ERROR:',
      error
    );

    return Promise.reject(error);
  }
);

// ================= RESPONSE INTERCEPTOR =================

api.interceptors.response.use(

  response => {

    console.log(
      'RESPONSE SUCCESS:',
      {
        url: response?.config?.url,
        status: response?.status,
        data: response?.data,
      }
    );

    return response;
  },

  async error => {

    console.log(
      'RESPONSE ERROR:',
      {
        url:
          error?.config?.url,

        status:
          error?.response?.status,

        data:
          error?.response?.data,

        headers:
          error?.response?.headers,
      }
    );

    // ================= AUTO LOGOUT =================

    if (
      error?.response?.status === 401
    ) {

      console.log(
        '401 DETECTED -> CLEARING STORAGE'
      );

      await AsyncStorage.multiRemove([
        'userToken',
        'userRole',
        'userData',
      ]);
    }

    return Promise.reject(error);
  }
);

export default api;