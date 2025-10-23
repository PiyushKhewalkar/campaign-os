import { toast } from 'sonner';

// Smart error filtering - don't show errors for expected empty states
const shouldShowError = (error: string, context?: string): boolean => {
  const errorLower = error.toLowerCase();
  
  // Don't show errors for empty campaigns or posts - these are expected for new users
  if (errorLower.includes('no campaigns') || errorLower.includes('no posts') || errorLower.includes('not found')) {
    return false;
  }
  
  // Don't show errors for empty results that are expected
  if (errorLower.includes('empty') && (context === 'campaigns' || context === 'posts')) {
    return false;
  }
  
  // Show all other errors
  return true;
};

export const showToast = {
  success: (message: string, description?: string) => {
    toast.success(message, {
      description,
      duration: 4000,
    });
  },

  error: (message: string, description?: string, context?: string) => {
    // Only show error if it's a genuine error, not an expected empty state
    if (shouldShowError(message, context)) {
      toast.error(message, {
        description,
        duration: 5000,
      });
    }
  },

  warning: (message: string, description?: string) => {
    toast.warning(message, {
      description,
      duration: 4000,
    });
  },

  info: (message: string, description?: string) => {
    toast.info(message, {
      description,
      duration: 3000,
    });
  },

  loading: (message: string) => {
    return toast.loading(message);
  },

  dismiss: (toastId?: string | number) => {
    toast.dismiss(toastId);
  },

  // Specific toast functions for common actions
  campaignCreated: () => {
    showToast.success('Campaign created successfully!', 'Your new campaign is ready to go.');
  },

  campaignUpdated: () => {
    showToast.success('Campaign updated successfully!', 'Your changes have been saved.');
  },

  campaignDeleted: () => {
    showToast.success('Campaign deleted successfully!', 'The campaign has been removed.');
  },

  postScheduled: () => {
    showToast.success('Post scheduled successfully!', 'Your post will be published at the scheduled time.');
  },

  postUpdated: () => {
    showToast.success('Post updated successfully!', 'Your changes have been saved.');
  },

  postDeleted: () => {
    showToast.success('Post deleted successfully!', 'The post has been removed.');
  },

  postsGenerated: (count: number) => {
    showToast.success(`${count} posts generated successfully!`, 'Your campaign posts are ready to review.');
  },

  authSuccess: (action: 'signin' | 'signup' | 'signout') => {
    const messages = {
      signin: 'Welcome back!',
      signup: 'Account created successfully!',
      signout: 'Signed out successfully!'
    };
    showToast.success(messages[action]);
  },

  authError: (error: string) => {
    showToast.error('Authentication failed', error);
  },

  networkError: () => {
    showToast.error('Network error', 'Please check your internet connection and try again.');
  },

  genericError: (error: string, context?: string) => {
    showToast.error(error, undefined, context);
  }
};

// Helper function to handle API errors with smart filtering
export const handleApiError = (error: unknown, context?: string): string => {
  let errorMessage = 'An unexpected error occurred';
  
  if (error instanceof Error) {
    errorMessage = error.message;
  } else if (typeof error === 'string') {
    errorMessage = error;
  }
  
  // Show toast for genuine errors
  showToast.genericError(errorMessage, context);
  
  return errorMessage;
};

// Helper function to handle API success
export const handleApiSuccess = (message: string, description?: string) => {
  showToast.success(message, description);
};
