/**
 * Storage Service for Order to Delivery (OTD) Management System
 * Pure LocalStorage driven implementation. Zero external backend.
 */

// LocalStorage Keys
export const STORAGE_KEYS = {
  ORDERS: 'otd_orders',
  ORDER_ITEMS: 'otd_order_items',
  CUSTOMERS: 'otd_customers',
  PURCHASE_VENDORS: 'otd_purchase_vendors',
  COMPANY_DETAILS: 'otd_company_details',
  PRODUCTS: 'otd_products',
  TRANSPORTERS: 'otd_transporters',
  DEPARTMENTS: 'otd_departments',
  EMPLOYEES: 'otd_employees',
  HOLIDAYS: 'otd_holidays',
  SYSTEMS: 'otd_systems',
  STAGES: 'otd_stages',
  TAT: 'otd_tat',
  PAYMENTS: 'otd_payments',
  STAGE_HISTORY: 'otd_stage_history',
  NOTIFICATIONS: 'otd_notifications',
  AUDIT_LOGS: 'otd_audit_logs',
  SETTINGS: 'otd_settings',
  CURRENT_USER: 'otd_current_user',
  ORDER_COUNTER: 'otd_order_counter'
};

// Default Company Details for Master & PO
export const DEFAULT_COMPANY_DETAILS = {
  companyName: 'Acme Corporate Enterprise Ltd',
  brandName: 'GimBooks',
  gstin: '07AAACA1234F1Z8',
  address: 'Plot No. 42, Udyog Vihar Phase IV',
  city: 'Gurugram',
  state: 'Haryana',
  pincode: '122015',
  email: 'purchase@gimbooks.com',
  contactNumber: '+91 (0124) 450-8900',
  phone: '+91 (0124) 450-8900',
  website: 'www.gimbooks.com',
  fax: '(0124) 450-8999',
  pan: 'AAACA1234F',
  bankName: 'HDFC Bank Ltd',
  accountNumber: '50200012345678',
  ifsc: 'HDFC0000123'
};

// Default Purchase Vendors
export const DEFAULT_PURCHASE_VENDORS = [
  {
    id: 'VND-1001',
    code: 'VND-1001',
    name: 'Tata Steel Ltd',
    contactPerson: 'Rakesh Sharma (Industrial Sales)',
    mobile: '+91 98765 43210',
    email: 'sales.industrial@tatasteel.com',
    gstin: '20AAACT2727Q1ZW',
    address: 'Tata Steel Works, P.O. Bistupur',
    city: 'Jamshedpur, Jharkhand 831001',
    status: 'Active'
  },
  {
    id: 'VND-1002',
    code: 'VND-1002',
    name: 'Havells Industrial Cables',
    contactPerson: 'Sunil Mathur (Regional Sales Head)',
    mobile: '+91 98110 55443',
    email: 'industrial.cables@havells.com',
    gstin: '07AAACH0098A1ZT',
    address: 'QRG Towers, 2D Sector 126, Expressway',
    city: 'Noida, Uttar Pradesh 201304',
    status: 'Active'
  },
  {
    id: 'VND-1003',
    code: 'VND-1003',
    name: 'SKF Bearings India',
    contactPerson: 'Amitabh Joshi (Product Engineer)',
    mobile: '+91 98230 11223',
    email: 'orders.india@skf.com',
    gstin: '27AAACS1234F1Z5',
    address: 'Plot 2, Chinchwad MIDC Industrial Area',
    city: 'Pune, Maharashtra 411033',
    status: 'Active'
  },
  {
    id: 'VND-1004',
    code: 'VND-1004',
    name: 'Bosch Rexroth Pneumatics',
    contactPerson: 'Vikram Malhotra (Automation Head)',
    mobile: '+91 99001 88776',
    email: 'sales.rexroth@bosch.com',
    gstin: '29AAACB1987M1Z2',
    address: 'Post Box No. 3000, Hosur Road, Adugodi',
    city: 'Bangalore, Karnataka 560030',
    status: 'Active'
  },
  {
    id: 'VND-1005',
    code: 'VND-1005',
    name: 'Corrugation Packaging Krafts',
    contactPerson: 'Pooja Agarwal (Client Relations)',
    mobile: '+91 97112 33445',
    email: 'kraftbox@corrugation.com',
    gstin: '06AAACC5544B1ZV',
    address: 'Plot 44, Sector 24 Industrial Area',
    city: 'Faridabad, Haryana 121005',
    status: 'Active'
  }
];

// Generic LocalStorage Utilities
export function getData(key, defaultValue = []) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${key} from LocalStorage:`, err);
    return defaultValue;
  }
}

export function setData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    // Trigger custom window event so UI components can re-render reactively
    window.dispatchEvent(new CustomEvent('otd_storage_update', { detail: { key } }));
    return true;
  } catch (err) {
    console.error(`Error saving ${key} to LocalStorage:`, err);
    return false;
  }
}

export function updateData(key, updateFn) {
  const current = getData(key, []);
  const updated = updateFn(current);
  setData(key, updated);
  return updated;
}

export function generateId(prefix = 'ID') {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

// Generate unique sequential order number ORD-0001, ORD-0002...
export function generateOrderNumber() {
  const counter = parseInt(localStorage.getItem(STORAGE_KEYS.ORDER_COUNTER) || '0', 10) + 1;
  localStorage.setItem(STORAGE_KEYS.ORDER_COUNTER, counter.toString());
  const numStr = counter.toString().padStart(4, '0');
  return `ORD-${numStr}`;
}

// Audit Log Helper
export function logAuditAction(action, moduleName, recordId, details = {}, previousValue = null, newValue = null) {
  const currentUser = getCurrentUser();
  const logs = getData(STORAGE_KEYS.AUDIT_LOGS, []);
  const newLog = {
    id: generateId('LOG'),
    action,
    module: moduleName,
    recordId,
    user: currentUser?.name || currentUser?.userName || 'System Admin',
    userId: currentUser?.id || 'admin',
    timestamp: new Date().toISOString(),
    details,
    previousValue,
    newValue
  };
  logs.unshift(newLog);
  setData(STORAGE_KEYS.AUDIT_LOGS, logs);
}

// Current User Management (For local testing)
export function getCurrentUser() {
  const user = getData(STORAGE_KEYS.CURRENT_USER, null);
  if (!user) {
    // Default fallback local test user if no employee created yet
    return { id: 'EMP-001', code: 'EMP-001', name: 'Default Admin', department: 'Management', designation: 'System Admin', userGroup: 'Admin' };
  }
  return user;
}

export function setCurrentUser(user) {
  setData(STORAGE_KEYS.CURRENT_USER, user);
}

// TAT & Planned Completion Calculations
export function calculatePlannedDate(startDateStr, tatValue, tatUnit) {
  if (!startDateStr || !tatValue) return null;
  const start = new Date(startDateStr);
  if (isNaN(start.getTime())) return null;

  const val = parseFloat(tatValue);
  const result = new Date(start);

  const unitLower = (tatUnit || 'hours').toLowerCase();
  if (unitLower.startsWith('minute')) {
    result.setMinutes(result.getMinutes() + val);
  } else if (unitLower.startsWith('hour')) {
    result.setHours(result.getHours() + val);
  } else if (unitLower.startsWith('day')) {
    result.setDate(result.getDate() + val);
  } else {
    result.setHours(result.getHours() + val);
  }

  return result.toISOString();
}

export function calculateRemainingTime(plannedDateStr, isCompleted = false) {
  if (!plannedDateStr) return { text: 'N/A', minutes: 0, isOverdue: false };
  if (isCompleted) return { text: 'Completed', minutes: 0, isOverdue: false };

  const planned = new Date(plannedDateStr).getTime();
  const now = new Date().getTime();
  const diffMs = planned - now;
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 0) {
    const absMins = Math.abs(diffMins);
    const hrs = Math.floor(absMins / 60);
    const mins = absMins % 60;
    const days = Math.floor(hrs / 24);
    let timeStr = `${mins}m`;
    if (hrs > 0) timeStr = `${hrs % 24}h ${mins}m`;
    if (days > 0) timeStr = `${days}d ${hrs % 24}h`;
    return { text: `Overdue by ${timeStr}`, minutes: diffMins, isOverdue: true };
  } else {
    const hrs = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    const days = Math.floor(hrs / 24);
    let timeStr = `${mins}m`;
    if (hrs > 0) timeStr = `${hrs % 24}h ${mins}m`;
    if (days > 0) timeStr = `${days}d ${hrs % 24}h`;
    return { text: `${timeStr} left`, minutes: diffMins, isOverdue: false };
  }
}

export function calculateTATStatus(startDateStr, plannedDateStr, actualCompletionDateStr = null) {
  if (!startDateStr) return 'Not Started';
  
  if (actualCompletionDateStr && plannedDateStr) {
    const actual = new Date(actualCompletionDateStr).getTime();
    const planned = new Date(plannedDateStr).getTime();
    return actual <= planned ? 'Completed Within TAT' : 'Completed Late';
  }

  if (!plannedDateStr) return 'On Track';

  const planned = new Date(plannedDateStr).getTime();
  const now = new Date().getTime();
  const diffMins = (planned - now) / (1000 * 60);

  if (diffMins < 0) return 'Overdue';
  if (diffMins <= 60) return 'Due Soon';
  return 'On Track';
}

// Stage Progression Utility
export function getTATConfigForStage(systemName, stageName) {
  const tatConfigs = getData(STORAGE_KEYS.TAT, []);
  return tatConfigs.find(
    (t) =>
      t.status === 'Active' &&
      t.systemName?.toLowerCase() === systemName?.toLowerCase() &&
      t.stageName?.toLowerCase() === stageName?.toLowerCase()
  );
}

export const OTD_STAGE_ORDER = [
  'New Order',
  'Order Verification',
  'Order Approval',
  'Advance Payment',
  'Stock Check',
  'Order Processing',
  'Quality Check (QC)',
  'Ready for Dispatch',
  'Dispatch',
  'Delivered',
  'Payment Collection',
  'Order Closed'
];

// Complete Order Stage & Move to Next Stage
export function advanceOrderStage(orderId, updatedStageData, remarks = '') {
  const orders = getData(STORAGE_KEYS.ORDERS, []);
  const orderIndex = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
  if (orderIndex === -1) return null;

  const order = orders[orderIndex];
  const nowStr = new Date().toISOString();

  // Find Stages for the Order's System
  const stages = getData(STORAGE_KEYS.STAGES, [])
    .filter((s) => s.status === 'Active' && s.systemName === (order.systemName || 'Order To Delivery'))
    .sort((a, b) => (parseInt(a.sequence, 10) || 0) - (parseInt(b.sequence, 10) || 0));

  const currentStageName = order.currentStage || 'New Order';

  // Identify Next Stage
  let nextStageName = currentStageName;
  let isClosed = false;

  if (updatedStageData?.nextStage) {
    nextStageName = updatedStageData.nextStage;
  } else if (stages.length > 0) {
    const currentStageIdx = stages.findIndex((s) => s.stageName === currentStageName);
    if (currentStageIdx >= 0 && currentStageIdx < stages.length - 1) {
      nextStageName = stages[currentStageIdx + 1].stageName;
    } else if (currentStageIdx === stages.length - 1) {
      nextStageName = stages[currentStageIdx].stageName;
      if (updatedStageData?.closeOrder || currentStageName === 'Order Closed' || currentStageName === 'Delivered') {
        isClosed = true;
      }
    }
  } else {
    // Fallback to standard 12 OTD sequential stages
    const currentStageIdx = OTD_STAGE_ORDER.findIndex(
      (s) => s.toLowerCase() === currentStageName.toLowerCase()
    );
    if (currentStageIdx >= 0 && currentStageIdx < OTD_STAGE_ORDER.length - 1) {
      nextStageName = OTD_STAGE_ORDER[currentStageIdx + 1];
    } else if (currentStageIdx === OTD_STAGE_ORDER.length - 1) {
      nextStageName = OTD_STAGE_ORDER[currentStageIdx];
      isClosed = true;
    }
  }

  if (currentStageName === 'Order Closed' || updatedStageData?.closeOrder || updatedStageData?.finalOrderStatus === 'Closed') {
    isClosed = true;
    nextStageName = 'Order Closed';
  }

  // Record Stage Completion in History
  const history = getData(STORAGE_KEYS.STAGE_HISTORY, []);
  const stageHistoryEntry = {
    id: generateId('HIS'),
    orderId: order.id,
    orderNumber: order.orderNumber,
    system: order.systemName || 'Order To Delivery',
    stage: currentStageName,
    employee: getCurrentUser()?.name || 'System User',
    startDate: order.stageStartDate || order.createdAt || nowStr,
    plannedDate: order.plannedCompletionDate || null,
    completionDate: nowStr,
    tatValue: order.currentTatValue || null,
    tatUnit: order.currentTatUnit || null,
    actualTimeMinutes: order.stageStartDate ? Math.round((new Date(nowStr) - new Date(order.stageStartDate)) / 60000) : 0,
    tatStatus: calculateTATStatus(order.stageStartDate, order.plannedCompletionDate, nowStr),
    remarks: remarks || updatedStageData?.remarks || 'Stage Completed'
  };
  history.push(stageHistoryEntry);
  setData(STORAGE_KEYS.STAGE_HISTORY, history);

  // Look up TAT for Next Stage
  const nextTat = getTATConfigForStage(order.systemName || 'Order To Delivery', nextStageName);
  const nextPlannedDate = nextTat ? calculatePlannedDate(nowStr, nextTat.tatValue, nextTat.tatUnit) : null;

  // Update Order
  const prevStage = order.currentStage;
  order.currentStage = nextStageName;
  order.stageStartDate = nowStr;
  order.plannedCompletionDate = nextPlannedDate;
  order.currentTatValue = nextTat ? nextTat.tatValue : null;
  order.currentTatUnit = nextTat ? nextTat.tatUnit : null;
  order.status = isClosed ? 'Closed' : updatedStageData?.status || 'In Progress';
  order.updatedAt = nowStr;
  
  // Merge stage specific details
  if (updatedStageData) {
    Object.assign(order, updatedStageData);
    order.currentStage = nextStageName; // Preserve determined nextStageName
    order.stageDetails = {
      ...(order.stageDetails || {}),
      [currentStageName]: updatedStageData
    };
  }

  orders[orderIndex] = order;
  setData(STORAGE_KEYS.ORDERS, orders);

  logAuditAction('Stage Completed', 'Order Workflow', order.orderNumber, {
    fromStage: prevStage,
    toStage: nextStageName,
    remarks
  });

  return order;
}

// Backup & Data Management Utility
export function exportAllData() {
  const exportPayload = {
    appName: 'Order To Delivery Management System',
    exportedAt: new Date().toISOString(),
    data: {}
  };
  Object.values(STORAGE_KEYS).forEach((key) => {
    exportPayload.data[key] = getData(key, null);
  });
  return JSON.stringify(exportPayload, null, 2);
}

export function importAllData(jsonString) {
  try {
    const payload = JSON.parse(jsonString);
    if (!payload.data || typeof payload.data !== 'object') {
      throw new Error('Invalid backup file format');
    }
    Object.entries(payload.data).forEach(([key, val]) => {
      if (val !== null) {
        localStorage.setItem(key, JSON.stringify(val));
      }
    });
    window.dispatchEvent(new CustomEvent('otd_storage_update', { detail: { key: 'ALL' } }));
    return { success: true, message: 'Data imported successfully' };
  } catch (err) {
    return { success: false, message: err.message || 'Failed to parse JSON file' };
  }
}

export function clearAllOTDData() {
  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
  window.dispatchEvent(new CustomEvent('otd_storage_update', { detail: { key: 'ALL' } }));
}
