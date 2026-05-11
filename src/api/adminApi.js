import api from './axiosConfig';

/* ================= FETCH REQUESTS ================= */

// Get Pending Users
export const getPendingUsers = async () => {
  try {
    const res = await api.get('/admin/pending-users');

    console.log('PENDING USERS:', res.data);

    // ✅ Backend returns array directly
    return res.data || [];

  } catch (error) {
    console.log('ERROR FETCH USERS:', error.response?.data || error.message);
    throw error;
  }
};


// Get Pending Owners
export const getPendingOwners = async () => {
  try {
    const res = await api.get('/admin/pending-owner');

    console.log('PENDING OWNERS:', res.data);

    // ✅ Direct array
    return res.data || [];

  } catch (error) {
    console.log('ERROR FETCH OWNERS:', error.response?.data || error.message);
    throw error;
  }
};


/* ================= APPROVE ================= */

// Approve User Premium
export const approveUser = async (id) => {
  try {
    return await api.post(`/admin/approveUserPremium/${id}`);
  } catch (error) {
    console.log('APPROVE USER ERROR:', error.response?.data || error.message);
    throw error;
  }
};


// Approve Owner Premium
export const approveOwner = async (id) => {
  try {
    return await api.post(`/admin/approveOwnerPremium/${id}`);
  } catch (error) {
    console.log('APPROVE OWNER ERROR:', error.response?.data || error.message);
    throw error;
  }
};


/* ================= REJECT ================= */

// Reject User Premium
export const rejectUser = async (id) => {
  try {
    return await api.post(`/admin/rejectUserPremium/${id}`);
  } catch (error) {
    console.log('REJECT USER ERROR:', error.response?.data || error.message);
    throw error;
  }
};


// Reject Owner Premium
export const rejectOwner = async (id) => {
  try {
    return await api.post(`/admin/rejectOwnerPremium/${id}`);
  } catch (error) {
    console.log('REJECT OWNER ERROR:', error.response?.data || error.message);
    throw error;
  }
};