import React from 'react';

import {
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function AdminDashboardScreen({ navigation }) {

  const managementSections = [
    {
      title: 'User Management',
      desc: 'Manage and monitor registered platform users.',
    },
    {
      title: 'Owner Approvals',
      desc: 'Review and verify owner registration requests.',
    },
    // {
    //   title: 'Property Monitoring',
    //   desc: 'Review uploaded properties and listing activity.',
    // },
    {
      title: 'Premium Requests',
      desc: 'Handle premium plans and upgrade requests.',
    },
    // {
    //   title: 'Reports & Analytics',
    //   desc: 'Access reports and monitor platform activity.',
    // },
  ];

  return (

    <SafeAreaView
      style={styles.safeArea}
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
              Admin Panel
            </Text>

            <Text style={styles.tag}>
              Welcome back, Administrator 👋
            </Text>

          </View>

          <TouchableOpacity
            style={styles.profileBtn}
            onPress={() => navigation.navigate('ProfileTab')}
          >

            <Text style={styles.profileTxt}>
              Profile
            </Text>

          </TouchableOpacity>

        </View>

        {/* HERO */}

        <View style={styles.heroCard}>

          <View style={styles.heroTop}>

            <View>

              <Text style={styles.heroMini}>
                ADMINISTRATION
              </Text>

              <Text style={styles.heroTitle}>
                Control Center
              </Text>

            </View>

            <View style={styles.badge}>
              <Text style={styles.badgeTxt}>
                ADMIN
              </Text>
            </View>

          </View>

          <Text style={styles.heroSub}>
            Manage platform operations, monitor activities,
            and maintain the Caryanam Broker ecosystem
            from one centralized dashboard.
          </Text>

          <View style={styles.heroDivider} />

          <View style={styles.heroBottom}>

            <View>
              <Text style={styles.heroLabel}>
                Platform
              </Text>

              <Text style={styles.heroValue}>
                Caryanam Broker
              </Text>
            </View>

            <View>
              <Text style={styles.heroLabel}>
                Access Level
              </Text>

              <Text style={styles.heroValue}>
                Full Access
              </Text>
            </View>

          </View>

        </View>

        {/* SECTION */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Administrative Controls
          </Text>

          <Text style={styles.sectionSub}>
            Core management tools available to administrators
          </Text>

        </View>

        {/* MANAGEMENT CARDS */}

        <View style={styles.cardWrap}>

          {managementSections.map((item, index) => (

            <View
              key={index}
              style={styles.card}
            >

              <View style={styles.cardAccent} />

              <View style={{ flex: 1 }}>

                <Text style={styles.cardTitle}>
                  {item.title}
                </Text>

                <Text style={styles.cardText}>
                  {item.desc}
                </Text>

              </View>

            </View>

          ))}

        </View>

        {/* STATUS CARD */}

        <View style={styles.statusCard}>

          <Text style={styles.statusTitle}>
            Platform Status
          </Text>

          <Text style={styles.statusText}>
            All systems are operational and platform
            services are running normally.
          </Text>

        </View>

        {/* FOOTER */}

        <View style={styles.footer}>

          <Text style={styles.footerText}>
            Caryanam Broker • Administration Dashboard
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

  safeArea: {
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

  tag: {
    marginTop: 6,
    fontSize: 14,
    color: COLORS.lightText,
    fontWeight: '600',
  },

  profileBtn: {
    backgroundColor: COLORS.primary,

    paddingHorizontal: 18,
    paddingVertical: 11,

    borderRadius: 18,

    shadowColor: COLORS.primary,
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 2,
  },

  profileTxt: {
    color: '#ffffff',
    fontWeight: '800',
    fontSize: 13,
  },

  /* HERO */

  heroCard: {
    marginHorizontal: 16,
    marginTop: 24,

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

  badge: {
    backgroundColor: '#fff1e8',

    paddingHorizontal: 15,
    paddingVertical: 8,

    borderRadius: 30,
  },

  badgeTxt: {
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

  heroLabel: {
    color: COLORS.lightText,
    fontSize: 12,
    fontWeight: '600',
  },

  heroValue: {
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

  /* CARDS */

  cardWrap: {
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: '#ffffff',

    borderRadius: 28,

    padding: 22,

    marginBottom: 16,

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

  /* STATUS CARD */

  statusCard: {
    backgroundColor: '#fff1e8',

    marginHorizontal: 16,
    marginTop: 12,

    borderRadius: 28,

    padding: 24,

    borderWidth: 1,
    borderColor: '#ffe2cf',
  },

  statusTitle: {
    color: COLORS.secondary,
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 12,
  },

  statusText: {
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