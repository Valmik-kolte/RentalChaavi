import React, { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import {
  View,
  Text,
  StatusBar,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function OwnerHomeScreen() {

  const { userData, userRole } = useContext(AuthContext);

  return (
    <SafeAreaView
      style={styles.container}
      edges={['top', 'left', 'right']}
    >

      <StatusBar
        backgroundColor="#F8FAFC"
        barStyle="dark-content"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >

        {/* HEADER */}

        <View style={styles.header}>

          <View>

            <Text style={styles.brand}>
              Caryanam Broker
            </Text>

            <Text style={styles.welcome}>
              Welcome back, Owner 👋
            </Text>

            {/* <Text style={styles.email}>
              {userData?.email || 'owner@gmail.com'}
            </Text> */}

          </View>

          <View style={styles.profileCircle}>
            <Text style={styles.profileLetter}>
              {(userData?.email || 'O').charAt(0).toUpperCase()}
            </Text>
          </View>

        </View>

        {/* HERO CARD */}

        <View style={styles.heroCard}>

          <View style={styles.heroTop}>

            <View>

              <Text style={styles.heroMini}>
                DASHBOARD
              </Text>

              <Text style={styles.heroTitle}>
                Owner Panel
              </Text>

            </View>

            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {userRole || 'OWNER'}
              </Text>
            </View>

          </View>

          <Text style={styles.heroSub}>
            Manage your properties and rental activities
            with a professional and streamlined dashboard.
          </Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroBottom}>

            <View style={styles.heroInfo}>
              <Text style={styles.heroInfoLabel}>
                Platform
              </Text>

              <Text style={styles.heroInfoValue}>
                Caryanam Broker
              </Text>
            </View>

            <View style={styles.heroInfo}>
              <Text style={styles.heroInfoLabel}>
                Access
              </Text>

              <Text style={styles.heroInfoValue}>
                Full Owner Access
              </Text>
            </View>

          </View>

        </View>

        {/* SECTION */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Dashboard Features
          </Text>

          <Text style={styles.sectionSub}>
            Everything you can manage from your account
          </Text>

        </View>

        {/* CARDS */}

        <View style={styles.card}>

          <View style={styles.cardAccent} />

          <View style={{ flex: 1 }}>

            <Text style={styles.cardTitle}>
              Property Management
            </Text>

            <Text style={styles.cardText}>
              Add, manage, and organize your rental property listings.
            </Text>

          </View>

        </View>

        <View style={styles.card}>

          <View style={styles.cardAccent} />

          <View style={{ flex: 1 }}>

            <Text style={styles.cardTitle}>
              Tenant Communication
            </Text>

            <Text style={styles.cardText}>
              Connect and communicate with tenants directly from the platform.
            </Text>

          </View>

        </View>

        <View style={styles.card}>

          <View style={styles.cardAccent} />

          <View style={{ flex: 1 }}>

            <Text style={styles.cardTitle}>
              Business Insights
            </Text>

            <Text style={styles.cardText}>
              Monitor rental activity and improve listing visibility.
            </Text>

          </View>

        </View>

        {/* INFO CARD */}

        <View style={styles.infoCard}>

          <Text style={styles.infoTitle}>
            Professional Rental Management
          </Text>

          <Text style={styles.infoText}>
            Caryanam Broker helps owners manage properties,
            connect with tenants, and maintain rental activities
            through a modern and secure platform.
          </Text>

        </View>

        {/* FOOTER */}

        <View style={styles.footer}>

          <Text style={styles.footerText}>
            Caryanam Broker • Smart Rental Management
          </Text>

        </View>

      </ScrollView>

    </SafeAreaView>
  );
}

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

  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  scroll: {
    paddingBottom: 40,
  },

  /* HEADER */

  header: {
    marginHorizontal: 16,
    marginTop: 12,

    paddingHorizontal: 18,
    paddingVertical: 18,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    backgroundColor: '#ffffff',

    borderRadius: 28,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },

  brand: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: -0.6,
  },

  welcome: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.lightText,
    fontWeight: '600',
  },

  email: {
    marginTop: 5,
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },

  profileCircle: {
    width: 58,
    height: 58,

    borderRadius: 29,

    backgroundColor: '#fff1e8',

    justifyContent: 'center',
    alignItems: 'center',

    borderWidth: 2,
    borderColor: '#ffe2cf',
  },

  profileLetter: {
    color: COLORS.primary,
    fontSize: 22,
    fontWeight: '900',
  },

  /* HERO CARD */

  heroCard: {
    marginHorizontal: 16,
    marginTop: 22,

    backgroundColor: '#ffffff',

    borderRadius: 32,

    padding: 26,

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  heroMini: {
    color: COLORS.primary,
    fontSize: 11,
    letterSpacing: 1.1,
    fontWeight: '800',
  },

  heroTitle: {
    marginTop: 8,
    color: COLORS.secondary,
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.8,
  },

  roleBadge: {
    backgroundColor: '#fff1e8',

    paddingHorizontal: 15,
    paddingVertical: 8,

    borderRadius: 30,
  },

  roleBadgeText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  heroSub: {
    marginTop: 18,
    color: COLORS.lightText,
    lineHeight: 24,
    fontSize: 14,
  },

  heroDivider: {
    height: 1,
    backgroundColor: '#f1e6dc',
    marginVertical: 22,
  },

  heroBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  heroInfo: {
    flex: 1,
  },

  heroInfoLabel: {
    color: COLORS.lightText,
    fontSize: 12,
    fontWeight: '600',
  },

  heroInfoValue: {
    marginTop: 6,
    color: COLORS.secondary,
    fontSize: 15,
    fontWeight: '800',
  },

  /* SECTION */

  sectionHeader: {
    marginTop: 32,
    marginBottom: 18,
    paddingHorizontal: 18,
  },

  sectionTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.secondary,
    letterSpacing: -0.4,
  },

  sectionSub: {
    marginTop: 6,
    color: COLORS.lightText,
    fontSize: 13,
    lineHeight: 20,
  },

  /* FEATURE CARD */

  card: {
    backgroundColor: '#ffffff',

    marginHorizontal: 16,
    marginBottom: 16,

    borderRadius: 28,

    padding: 22,

    flexDirection: 'row',
    alignItems: 'flex-start',

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },

  cardAccent: {
    width: 6,
    height: '100%',

    backgroundColor: COLORS.primary,

    borderRadius: 10,

    marginRight: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.secondary,
    marginBottom: 8,
  },

  cardText: {
    color: COLORS.lightText,
    fontSize: 14,
    lineHeight: 23,
  },

  /* INFO CARD */

  infoCard: {
    backgroundColor: '#fff1e8',

    marginHorizontal: 16,
    marginTop: 10,

    borderRadius: 28,

    padding: 24,

    borderWidth: 1,
    borderColor: '#ffe2cf',
  },

  infoTitle: {
    color: COLORS.secondary,
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 12,
  },

  infoText: {
    color: '#4b5563',
    lineHeight: 24,
    fontSize: 14,
  },

  /* FOOTER */

  footer: {
    marginTop: 34,
    alignItems: 'center',
    paddingBottom: 20,
  },

  footerText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.3,
  },

});