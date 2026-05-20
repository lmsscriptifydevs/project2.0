import { useState, useEffect } from 'react';

/**
 * PERF STARTUP: Non-blocking localStorage hook - reads after first paint
 * Prevents synchronous localStorage access from blocking initial render
 */
export const useLocalStorageData = (key, defaultValue = null) => {
  const [value, setValue] = useState(defaultValue);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // PERF: Defer localStorage read until after first paint
    const readValue = () => {
      try {
        const item = localStorage.getItem(key);
        setValue(item ? JSON.parse(item) : defaultValue);
      } catch (error) {
        console.error(`Error parsing localStorage key "${key}":`, error);
        setValue(defaultValue);
      } finally {
        setIsLoaded(true);
      }
    };

    // Use requestIdleCallback or setTimeout to defer read
    if ('requestIdleCallback' in window) {
      requestIdleCallback(readValue, { timeout: 0 });
    } else {
      setTimeout(readValue, 0);
    }
  }, [key, defaultValue]);

  // Return defaultValue immediately for first render, then actual value
  return isLoaded ? value : defaultValue;
};

/**
 * PERF STARTUP: Non-blocking UserData hook - reads after first paint
 */
export const useUserData = () => {
  return useLocalStorageData('UserData', {});
};

/**
 * PERF STARTUP: Non-blocking Role hook - reads after first paint
 */
export const useUserRole = () => {
  const [role, setRole] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const readRole = () => {
      try {
        setRole(localStorage.getItem('Role') || '');
      } catch {
        setRole('');
      } finally {
        setIsLoaded(true);
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(readRole, { timeout: 0 });
    } else {
      setTimeout(readRole, 0);
    }
  }, []);

  return isLoaded ? role : '';
};

/**
 * PERF STARTUP: Non-blocking access token hook - reads after first paint
 * Returns null immediately, then actual token after read
 */
export const useAccessToken = () => {
  const [token, setToken] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const readToken = () => {
      try {
        setToken(localStorage.getItem('accessToken') || null);
      } catch {
        setToken(null);
      } finally {
        setIsLoaded(true);
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(readToken, { timeout: 0 });
    } else {
      setTimeout(readToken, 0);
    }
  }, []);

  return isLoaded ? token : null;
};
