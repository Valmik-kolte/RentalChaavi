import api from './axiosConfig';

// Add Property (updated with error handling)
export const addProperty = async (ownerId, data) => {
  try {
    const res = await api.post(`/api/owner/addPropertyByOwner/${ownerId}`, data);
    return res.data;
  } catch (error) {
    console.log("ADD PROPERTY ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const getPropertyById = async (id) => {
  try {
    const res = await api.get(`/api/owner/getPropertyById/${id}`);
    return res.data;
  } catch (error) {
    console.log("GET PROPERTY ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const deleteProperty = async (id) => {
  try {
    const res = await api.delete(`/api/owner/deletePropertyById/${id}`);
    return res.data;
  } catch (error) {
    console.log("DELETE PROPERTY ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const updateProperty = async (id, data) => {
  try {
    const res = await api.put(`/api/owner/updatePropertyById/${id}`, data);
    return res.data;
  } catch (error) {
    console.log("UPDATE PROPERTY ERROR:", error.response?.data || error.message);
    throw error;
  }
};

export const uploadPropertyImages = async (propertyId, formData) => {
  try {
    const res = await api.post(
      `/api/owner/uploadPropertyImagesByPropertyId/${propertyId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return res.data;
  } catch (error) {
    console.log("UPLOAD IMAGE ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// 🔥 Already correct, just kept consistent
export const getOwnerProperties = async (ownerId) => {
  try {

    const res = await api.get(
      `/api/owner/getAllPropertiesByOwnerId/${ownerId}`
    );

    console.log(
      "OWNER PROPERTIES API:",
      res.data
    );

    return res.data;

  } catch (error) {

    console.log(
      "OWNER API ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// 🔥 Updated with handling
export const buyPremiumOwner = async (ownerId) => {
  try {
    const res = await api.post(`/api/owner/buyPremiumByOwner/${ownerId}`);
    return res.data;
  } catch (error) {
    console.log("BUY PREMIUM ERROR:", error.response?.data || error.message);
    throw error;
  }
};
export const getAllProperties = () =>
  api.get('/api/user/getAllProperties');
  
// ================= USER =================

export const buyPremiumUser = async (userId) => {
  try {

    const res = await api.post(
      `/api/user/buyPremium/${userId}`
    );

    return res.data;

  } catch (error) {

    console.log(
      "BUY PREMIUM USER ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getProperties = async (userId) => {
  try {
    const res = await api.get(`/api/user/properties/${userId}`);
    return res.data;
  } catch (error) {
    console.log("GET PROPERTIES ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// 🔥 Updated
export const filterProperties = async (userId, data) => {
  try {
    const res = await api.post(`/api/user/filter-properties/${userId}`, data);
    return res.data;
  } catch (error) {
    console.log("FILTER PROPERTIES ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// 🔥 Updated
export const searchCity = async (city) => {
  try {
    const res = await api.get(`/api/user/properties-by-city`, {
      params: { city },
    });
    return res.data;
  } catch (error) {
    console.log("SEARCH CITY ERROR:", error.response?.data || error.message);
    throw error;
  }
};



// Get Areas/Locations By City
export const getAreasByCity = async (city) => {
  try {
    const res = await api.get(
      `/api/owner/getAreasByCity/${city}`
    );

    return res.data;

  } catch (error) {

    console.log(
      "GET AREAS ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

// Get Pincode By City + Area
export const getPincode = async (city, area) => {
  try {

    const res = await api.get(
      `/api/owner/getPincode`,
      {
        params: {
          city,
          area,
        },
      }
    );

    return res.data;

  } catch (error) {

    console.log(
      "GET PINCODE ERROR:",
      error.response?.data || error.message
    );

    throw error;
  }
};

export const saveFacilities = async (payload) => {

  try {

    const res = await api.post(
      '/api/owner/save-facilities',
      payload
    );

    return res.data;

  } catch (error) {

    console.log(
      'SAVE FACILITIES ERROR:',
      error.response?.data || error.message
    );

    throw error;
  }
};

export const getFacilities = async (
  ownerId,
  propertyId
) => {

  try {

    const res = await api.get(
      `/api/owner/get-facilities`,
      {
        params: {
          ownerId,
          propertyId,
        },
      }
    );

    return res.data;

  } catch (error) {

    console.log(
      'GET FACILITIES ERROR:',
      error.response?.data || error.message
    );

    throw error;
  }
};

  // ================= ADMIN =================

// Get Pending Users
export const getPendingUsers = async () => {
  try {
    const res = await api.get('/admin/pending-users');
    return res.data;
  } catch (error) {
    console.log("PENDING USERS ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// Get Pending Owners
export const getPendingOwners = async () => {
  try {
    const res = await api.get('/admin/pending-Owner');
    return res.data;
  } catch (error) {
    console.log("PENDING OWNERS ERROR:", error.response?.data || error.message);
    throw error;
  }
};

// Approve User Premium
export const approveUser = (id) =>
  api.post(`/admin/approveUserPremium/${id}`);

// Reject User Premium
export const rejectUser = (id) =>
  api.post(`/admin/rejectUserPremium/${id}`);

// Approve Owner Premium
export const approveOwner = (id) =>
  api.post(`/admin/approveOwnerPremium/${id}`);

// Reject Owner Premium
export const rejectOwner = (id) =>
  api.post(`/admin/rejectOwnerPremium/${id}`);

// 🔥 Updated
export const getOwnerPropertiesByAdmin = async (ownerId) => {
  try {
    const res = await api.get(`/admin/owner/${ownerId}/properties`);
    return res.data;
  } catch (error) {
    console.log("ADMIN OWNER PROPERTIES ERROR:", error.response?.data || error.message);
    throw error;
  }
};