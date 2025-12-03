// Authentication utilities for admin dashboard

export const isAuthenticated = (): boolean => {
  const token = sessionStorage.getItem('adminAuthToken');
  const email = sessionStorage.getItem('adminEmail');
  
  if (!token || !email) {
    return false;
  }

  // Verify token format (basic check)
  try {
    const decoded = atob(token);
    const [timestamp] = decoded.split('-');
    const tokenAge = Date.now() - parseInt(timestamp);
    
    // Token expires after 8 hours
    if (tokenAge > 8 * 60 * 60 * 1000) {
      sessionStorage.removeItem('adminAuthToken');
      sessionStorage.removeItem('adminEmail');
      return false;
    }
    
    return email === 'uli@art-of-nuts.com';
  } catch {
    return false;
  }
};

export const logout = (): void => {
  sessionStorage.removeItem('adminAuthToken');
  sessionStorage.removeItem('adminEmail');
};

export const getAdminEmail = (): string | null => {
  return sessionStorage.getItem('adminEmail');
};

