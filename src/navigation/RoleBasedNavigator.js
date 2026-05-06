// src/navigation/RoleBasedNavigator.js

import React from 'react';

import OwnerStackNavigator from './OwnerStackNavigator';
import AdminStackNavigator from './AdminStackNavigator';
import UserNavigator from './UserNavigator';
import BottomTabs from './BottomTabs';
export default function RoleBasedNavigator({ role }) {
  /* NORMALIZE ROLE */
  
  let safeRole = String(role || '')
    .trim()
    .toUpperCase()
    .replace('ROLE_', '');

  console.log("NAV ROLE:", safeRole);

  /* ================= ADMIN ================= */
  // if (safeRole === 'ADMIN') {
  //   return <AdminStackNavigator />;
  // }
  if (safeRole === 'ADMIN') {
    return <BottomTabs />;
  }

  /* ================= OWNER ================= */
  if (safeRole === 'PROPERTY_OWNER') {
    return <OwnerStackNavigator />;
  }

  /* ================= USER (DEFAULT) ================= */
  return <UserNavigator />;
}