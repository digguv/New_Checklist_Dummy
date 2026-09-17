import { useState, useEffect } from 'react';
import {
  getPurchaseData,
  initializePurchaseData,
  PURCHASE_STORAGE_KEYS
} from '../services/purchaseStorageService';

export function usePurchaseStorage(key, defaultValue = []) {
  const [data, setData] = useState(() => {
    initializePurchaseData();
    return getPurchaseData(key, defaultValue);
  });

  useEffect(() => {
    const handleUpdate = (e) => {
      if (!e?.detail || e.detail.key === key) {
        setData(getPurchaseData(key, defaultValue));
      }
    };

    window.addEventListener('purchase_storage_update', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('purchase_storage_update', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [key]);

  return data;
}
