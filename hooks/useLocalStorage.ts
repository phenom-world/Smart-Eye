'use client';
import { useEffect, useState } from 'react';

const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T | null>(null);
  const [removeStoredValue, setRemoveStoredValue] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    const item = window.localStorage.getItem(key);
    setStoredValue(item ? JSON.parse(item) : initialValue);
  }, [key, initialValue]);

  useEffect(() => {
    const setValue = (value: T) => {
      window.localStorage.setItem(key, JSON.stringify(value));
    };

    if (removeStoredValue) {
      window.localStorage.removeItem(key);
      setRemoveStoredValue(false);
      setStoredValue(null);
    } else if (storedValue) {
      setValue(storedValue);
    }
  }, [storedValue, key, removeStoredValue, initialValue]);

  const removeItem = () => {
    setRemoveStoredValue(!removeStoredValue);
  };

  return { state: storedValue, setState: setStoredValue, removeItem };
};

export default useLocalStorage;
