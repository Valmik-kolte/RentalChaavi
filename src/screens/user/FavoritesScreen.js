import React, { useState } from 'react';

import {
  StatusBar,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function FavoritesScreen({ navigation }) {
  const [favorites] = useState([
    {
      id: 1,
      title: '2 BHK Apartment',
      price: '₹18,000 / month',
      location: 'Baner, Pune',
      type: 'Family',
    },
    {
      id: 2,
      title: '1 BHK Flat',
      price: '₹13,500 / month',
      location: 'Wakad, Pune',
      type: 'Bachelor',
    },
    {
      id: 3,
      title: 'PG Room',
      price: '₹8,000 / month',
      location: 'Hinjewadi',
      type: 'Boys PG',
    },
  ]);

  const isEmpty = favorites.length === 0;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar backgroundColor="#F8FAFC" barStyle="dark-content" />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Saved Rentals</Text>
          <Text style={styles.sub}>Your favourite homes</Text>
        </View>

        <View style={styles.badge}>
          <Text style={styles.badgeTxt}>{favorites.length}</Text>
        </View>
      </View>

      {/* BODY */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={styles.container}>
          {!isEmpty ? (
            favorites.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.card}
                onPress={() =>
                  navigation.navigate('PropertyDetails', {
                    property: item,
                  })
                }
              >
                {/* IMAGE */}
                <View style={styles.imageBox}>
                  <Text style={styles.imageTxt}>Saved</Text>
                </View>

                {/* DETAILS */}
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{item.title}</Text>

                  <Text style={styles.price}>{item.price}</Text>

                  <Text style={styles.location}>{item.location}</Text>

                  <Text style={styles.type}>{item.type}</Text>
                </View>

                {/* HEART */}
                <TouchableOpacity>
                  <Text style={styles.heart}>♥</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyIcon}>♡</Text>

              <Text style={styles.emptyTitle}>No Saved Rentals</Text>

              <Text style={styles.emptySub}>
                Explore homes and save your favorite rentals.
              </Text>

              <TouchableOpacity
                style={styles.exploreBtn}
                onPress={() => navigation.navigate('PropertyList')}
              >
                <Text style={styles.exploreTxt}>Explore Rentals</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: '900',
    color: '#0F172A',
  },

  sub: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  badge: {
    backgroundColor: '#4338CA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
  },

  badgeTxt: {
    color: '#fff',
    fontWeight: '800',
  },

  container: {
    paddingHorizontal: 18,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E7FF',
  },

  imageBox: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  imageTxt: {
    color: '#4338CA',
    fontWeight: '800',
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#0F172A',
  },

  price: {
    color: '#4338CA',
    fontWeight: '900',
    marginTop: 6,
  },

  location: {
    color: '#64748B',
    marginTop: 4,
  },

  type: {
    marginTop: 4,
    color: '#4338CA',
    fontSize: 12,
    fontWeight: '700',
  },

  heart: {
    fontSize: 20,
    color: '#4338CA',
  },

  /* EMPTY STATE */
  emptyWrap: {
    marginTop: 80,
    alignItems: 'center',
  },

  emptyIcon: {
    fontSize: 50,
    color: '#4338CA',
  },

  emptyTitle: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
  },

  emptySub: {
    marginTop: 8,
    color: '#64748B',
    textAlign: 'center',
    paddingHorizontal: 30,
  },

  exploreBtn: {
    marginTop: 18,
    backgroundColor: '#4338CA',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 14,
  },

  exploreTxt: {
    color: '#fff',
    fontWeight: '800',
  },
});