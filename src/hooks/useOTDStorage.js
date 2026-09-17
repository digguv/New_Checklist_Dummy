import { useState, useEffect } from 'react';
import { getData, STORAGE_KEYS } from '../services/otdStorageService';

export function useOTDStorage(storageKey, defaultValue = []) {
  const [data, setDataState] = useState(() => getData(storageKey, defaultValue));

  useEffect(() => {
    const handleUpdate = (e) => {
      if (!e.detail || e.detail.key === storageKey || e.detail.key === 'ALL') {
        setDataState(getData(storageKey, defaultValue));
      }
    };

    window.addEventListener('otd_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('otd_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [storageKey, defaultValue]);

  return data;
}
