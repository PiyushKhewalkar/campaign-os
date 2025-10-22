const API_BASE_URL = 'http://localhost:3001/api';

export interface User {
  id: string;
  email: string;
  isVerified: boolean;
}

export interface AuthResponse {
  message: string;
  token?: string;
  user?: User;
}

export interface SignupData {
  email: string;
  password: string;
}

export interface SigninData {
  email: string;
  password: string;
}

export interface Campaign {
  _id: string;
  title: string;
  description: string;
  userId: string;
  postIds: string[];
  startDate: string;
  endDate: string;
  platforms: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Post {
    _id: string;
    userId: string;
    campaignId: string;
    platform: string;
    script: any[];
    scheduled_on?: string;
    status: "draft" | "scheduled" | "published" | "failed";
    createdAt: string;
    updatedAt: string;
}

export interface CreateCampaignData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  platforms: string[];
}

export interface UpdateCampaignData {
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  platforms?: string[];
}

export interface UpdatePostData {
  script?: any[];
}

// Auth API functions
export const authAPI = {
  // Sign up a new user
  signup: async (data: SignupData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signup failed');
    }

    return response.json();
  },

  // Sign in an existing user
  signin: async (data: SigninData): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Signin failed');
    }

    return response.json();
  },

  // Verify email
  verifyEmail: async (userId: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Email verification failed');
    }

    return response.json();
  },

  // Sign in with Google (Firebase ID token -> backend verifies -> returns app JWT)
  signinWithGoogle: async (idToken: string): Promise<AuthResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Google sign-in failed');
    }

    return response.json();
  },
};

// Campaign API functions
export const campaignAPI = {
  // Get all campaigns for the authenticated user
  getAllCampaigns: async (): Promise<{ success: boolean; campaigns: Campaign[] }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/campaign`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch campaigns');
    }

    return response.json();
  },

  // Get a specific campaign by ID
  getCampaign: async (id: string): Promise<{ success: boolean; campaign: Campaign }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/campaign/${id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch campaign');
    }

    return response.json();
  },

  // Create a new campaign
  createCampaign: async (data: CreateCampaignData): Promise<{ success: boolean; newCampaign: Campaign }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/campaign/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    console.log("api response, ", response)

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create campaign');
    }

    return response.json();
  },

  // Update an existing campaign
  updateCampaign: async (id: string, data: UpdateCampaignData): Promise<{ success: boolean; updatedCampaign: Campaign }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/campaign/${id}/update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update campaign');
    }

    return response.json();
  },

  // Delete a campaign
  deleteCampaign: async (id: string): Promise<{ success: boolean; deletedCampaign: Campaign }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/campaign/${id}/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete campaign');
    }

    return response.json();
  },
};

export const postAPI = {
  // Get a single post by id
  getPost: async (postId: string): Promise<{ success: boolean; post: Post }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/post/id/${postId}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch post');
    }

    return response.json();
  },

      // Get all posts for the campaign
  getAllPosts: async (campaignId: string): Promise<{ success: boolean; posts: Post[] }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/post/${campaignId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch posts');
    }

    return response.json();
  },

  // Schedule a post
  schedulePost: async (postId: string, scheduledDate: string): Promise<{ success: boolean; post: Post }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/post/${postId}/schedule`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ scheduledDate }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to schedule post');
    }

    return response.json();
  },

  // Generate posts for a campaign
  generatePosts: async (campaignId: string): Promise<{ message: string; posts: Post[] }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/post/${campaignId}/generate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to generate posts');
    }

    return response.json();
  },

  // Update a post
  updatePost: async (postId: string, data: UpdatePostData): Promise<{ success: boolean; post: Post }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/post/${postId}/update`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update post');
    }

    return response.json();
  },

  // Delete a post
  deletePost: async (postId: string): Promise<{ success: boolean; deletedPost: Post }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/post/${postId}/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete post');
    }

    return response.json();
  },

  // Get all scheduled posts for calendar view
  getAllScheduledPosts: async (): Promise<{ success: boolean; posts: Post[] }> => {
    const token = getAuthToken();
    if (!token) throw new Error('No authentication token found');

    const response = await fetch(`${API_BASE_URL}/post/scheduled/all`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch scheduled posts');
    }

    return response.json();
  },

}

// Utility function to get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Utility function to set auth token in localStorage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

// Utility function to remove auth token from localStorage
export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Utility function to get user data from localStorage
export const getUserData = (): User | null => {
  const userData = localStorage.getItem('userData');
  return userData ? JSON.parse(userData) : null;
};

// Utility function to set user data in localStorage
export const setUserData = (user: User): void => {
  localStorage.setItem('userData', JSON.stringify(user));
};

// Utility function to remove user data from localStorage
export const removeUserData = (): void => {
  localStorage.removeItem('userData');
};

// Utility function to validate token with backend
export const validateToken = async (): Promise<boolean> => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Token validation failed:', error);
    return false;
  }
};

// Utility function to check if token is expired (basic JWT check)
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error parsing token:', error);
    return true; // Consider invalid tokens as expired
  }
};
