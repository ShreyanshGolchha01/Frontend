// API Configuration
const API_BASE_URL = 'http://localhost:5000/api/v1';

// Debug logging
console.log('API Base URL:', API_BASE_URL);

// Token management utilities
const getAuthToken = () => localStorage.getItem('authToken');
const setAuthToken = (token: string) => localStorage.setItem('authToken', token);
const removeAuthToken = () => localStorage.removeItem('authToken');

// Enhanced API Headers helper
const getHeaders = () => ({
  'Content-Type': 'application/json',
  ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` })
});

// Admin API
export const adminAPI = {
  // Admin login
  login: async (credentials: { email: string; password: string }) => {
    try {
      console.log('Admin login attempt:', credentials.email);
      console.log('API URL:', `${API_BASE_URL}/user/admin/login`);
      
      const response = await fetch(`${API_BASE_URL}/user/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Admin login response:', result);
      
      // Store auth info only if login is successful
      if (result.success && result.user && result.user.role === 'admin') {
        setAuthToken(result.token);
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('userData', JSON.stringify(result.user));
        return { success: true, user: result.user, message: result.message };
      } else {
        // Clear any existing auth data
        removeAuthToken();
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        return { success: false, message: result.message || 'Invalid admin credentials' };
      }
    } catch (error: any) {
      console.error('Admin login error:', error);
      return { success: false, message: `Network error: ${error.message}. Please check if backend server is running on port 5000.` };
    }
  },

  // Get admin profile
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/profile`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });
      return await response.json();
    } catch (error) {
      console.error('Get admin profile error:', error);
      return { success: false, message: 'Failed to get profile' };
    }
  },

  // Get all users
  getAllUsers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });
      return await response.json();
    } catch (error) {
      console.error('Get users error:', error);
      return { success: false, message: 'Failed to get users' };
    }
  },

  // Get all doctors
  getAllDoctors: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/doctors`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });
      return await response.json();
    } catch (error) {
      console.error('Get doctors error:', error);
      return { success: false, message: 'Failed to get doctors' };
    }
  },

  // Create camp
  createCamp: async (campData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/camps/create`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(campData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create camp error:', error);
      return { success: false, message: 'Failed to create camp' };
    }
  },

  // Get all camps
  getAllCamps: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/camps/all`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });
      return await response.json();
    } catch (error) {
      console.error('Get camps error:', error);
      return { success: false, message: 'Failed to get camps' };
    }
  },

  // Create scheme
  createScheme: async (schemeData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/schemes`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(schemeData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create scheme error:', error);
      return { success: false, message: 'Failed to create scheme' };
    }
  },

  // Get all schemes
  getSchemes: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/schemes`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });
      return await response.json();
    } catch (error) {
      console.error('Get schemes error:', error);
      return { success: false, message: 'Failed to get schemes' };
    }
  },

  // Admin logout
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/logout`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
      });
      const result = await response.json();
      
      // Clear auth info regardless of response
      removeAuthToken();
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      
      return result;
    } catch (error) {
      console.error('Admin logout error:', error);
      // Clear auth info even on error
      removeAuthToken();
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      return { success: false, message: 'Logout failed' };
    }
  },
};

// Doctor API
export const doctorAPI = {
  // Doctor login
  login: async (credentials: { email: string; password: string }) => {
    try {
      console.log('Doctor login attempt:', credentials.email);
      console.log('API URL:', `${API_BASE_URL}/user/doctor/login`);
      
      const response = await fetch(`${API_BASE_URL}/user/doctor/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Doctor login response:', result);
      
      // Store auth info only if login is successful and user is doctor
      if (result.success && result.user && result.user.role === 'doctor') {
        setAuthToken(result.token);
        localStorage.setItem('isDoctorAuthenticated', 'true');
        localStorage.setItem('doctorInfo', JSON.stringify(result.user));
        localStorage.setItem('userRole', 'doctor');
        localStorage.setItem('userData', JSON.stringify(result.user));
        return { success: true, user: result.user, message: result.message };
      } else {
        // Clear any existing auth data
        removeAuthToken();
        localStorage.removeItem('isDoctorAuthenticated');
        localStorage.removeItem('doctorInfo');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
        return { success: false, message: result.message || 'Invalid doctor credentials' };
      }
    } catch (error: any) {
      console.error('Doctor login error:', error);
      return { success: false, message: `Network error: ${error.message}. Please check if backend server is running on port 5000.` };
    }
  },

  // Get doctor profile
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctor/profile`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });
      return await response.json();
    } catch (error) {
      console.error('Get doctor profile error:', error);
      return { success: false, message: 'Failed to get profile' };
    }
  },

  // Get assigned camps
  getAssignedCamps: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctor/camps`, {
        method: 'GET',
        headers: getHeaders(),
        credentials: 'include',
      });
      return await response.json();
    } catch (error) {
      console.error('Get assigned camps error:', error);
      return { success: false, message: 'Failed to get assigned camps' };
    }
  },

  // Create patient report
  createPatientReport: async (reportData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctor/patient-report`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(reportData),
      });
      return await response.json();
    } catch (error) {
      console.error('Create patient report error:', error);
      return { success: false, message: 'Failed to create patient report' };
    }
  },

  // Doctor logout
  logout: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/doctor/logout`, {
        method: 'POST',
        headers: getHeaders(),
        credentials: 'include',
      });
      const result = await response.json();
      
      // Clear auth info regardless of response
      removeAuthToken();
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      localStorage.removeItem('isDoctorAuthenticated');
      localStorage.removeItem('doctorInfo');
      
      return result;
    } catch (error) {
      console.error('Doctor logout error:', error);
      // Clear auth info even on error
      removeAuthToken();
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userData');
      localStorage.removeItem('isDoctorAuthenticated');
      localStorage.removeItem('doctorInfo');
      return { success: false, message: 'Logout failed' };
    }
  },
};

// Error handling utility
export const handleAPIError = (error: any) => {
  console.error('API Error:', error);
  if (error.message === 'Unauthorized') {
    // Handle logout or redirect to login
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userType');
    window.location.href = '/login';
    return 'Please login again';
  }
  return error.message || 'Something went wrong';
};
