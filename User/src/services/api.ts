// API Service for backend integration
const API_BASE_URL = 'http://localhost:5000/api/v1';

// User API endpoints
export const userAPI = {
  // User registration
  register: async (userData: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    password: string;
    dateOfBirth: string;
    gender: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  // User login with phone number and password
  login: async (credentials: { phoneNumber: string; password: string }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          phoneNumber: credentials.phoneNumber,
          password: credentials.password,
        }),
      });
      const result = await response.json();
      
      // Store role and auth info in localStorage
      if (result.success && result.user) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('userRole', result.user.role || 'user');
        localStorage.setItem('authToken', result.token);
        localStorage.setItem('userData', JSON.stringify(result.user));
      }
      
      return result;
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    }
  },

  // Get user profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/user/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    const response = await fetch(`${API_BASE_URL}/user/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(profileData),
    });
    return response.json();
  },

  // User logout
  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/user/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  },

  // Get health records
  getHealthRecords: async () => {
    const response = await fetch(`${API_BASE_URL}/user/health-records`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  },

  // Add family member
  addFamilyMember: async (familyMemberData: any) => {
    const response = await fetch(`${API_BASE_URL}/user/family-member`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(familyMemberData),
    });
    return response.json();
  },
};

// Admin API endpoints
export const adminAPI = {
  // Get all users
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  },

  // Create new camp
  createCamp: async (campData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/camp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(campData),
    });
    return response.json();
  },

  // Get all camps
  getAllCamps: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/camps`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  },

  getSchemes: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/schemes`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  },

  createScheme: async (schemeData: any) => {
    const response = await fetch(`${API_BASE_URL}/admin/schemes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(schemeData),
    });
    return response.json();
  },
};

// Doctor API endpoints
export const doctorAPI = {
  // Get doctor profile
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/doctor/profile`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  },

  // Update doctor profile
  updateProfile: async (profileData: any) => {
    const response = await fetch(`${API_BASE_URL}/doctor/update-profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(profileData),
    });
    return response.json();
  },
};

// Health reports API (if available)
export const reportsAPI = {
  // Get user health reports
  getUserReports: async () => {
    const response = await fetch(`${API_BASE_URL}/user/health-reports`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  },

  // Get specific report by ID
  getReportById: async (reportId: string) => {
    const response = await fetch(`${API_BASE_URL}/user/health-reports/${reportId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });
    return response.json();
  },

  // Create health report
  createReport: async (reportData: any) => {
    const response = await fetch(`${API_BASE_URL}/user/health-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(reportData),
    });
    return response.json();
  },
};

// Error handling utility
export const handleAPIError = (error: any) => {
  console.error('API Error:', error);
  if (error.message === 'Unauthorized') {
    // Handle logout or redirect to login
    return 'Please login again';
  }
  return error.message || 'Something went wrong';
};
