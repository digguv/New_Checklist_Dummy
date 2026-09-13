const LOCAL_HOLIDAYS_KEY = 'corporate_system_holidays';

const INITIAL_HOLIDAYS = [
  {
    id: 'hol-1',
    name: 'Independence Day',
    date: '2026-08-15',
    description: 'National Holiday',
  },
  {
    id: 'hol-2',
    name: 'Gandhi Jayanti',
    date: '2026-10-02',
    description: 'National Holiday',
  },
  {
    id: 'hol-3',
    name: 'Diwali Festival',
    date: '2026-11-08',
    description: 'Corporate Festival Holiday',
  },
  {
    id: 'hol-4',
    name: 'Christmas Day',
    date: '2026-12-25',
    description: 'Public Holiday',
  },
];

function getStoredHolidays() {
  const stored = localStorage.getItem(LOCAL_HOLIDAYS_KEY);
  if (!stored) {
    localStorage.setItem(LOCAL_HOLIDAYS_KEY, JSON.stringify(INITIAL_HOLIDAYS));
    return INITIAL_HOLIDAYS;
  }
  try {
    return JSON.parse(stored);
  } catch (e) {
    return INITIAL_HOLIDAYS;
  }
}

function saveHolidays(holidays) {
  localStorage.setItem(LOCAL_HOLIDAYS_KEY, JSON.stringify(holidays));
}

export const holidayService = {
  async getHolidays() {
    return getStoredHolidays();
  },

  async addHoliday(holidayData) {
    const list = getStoredHolidays();
    const newHol = {
      id: `hol-${Date.now()}`,
      name: holidayData.name,
      date: holidayData.date,
      description: holidayData.description || '',
      created_at: new Date().toISOString(),
    };
    list.unshift(newHol);
    saveHolidays(list);
    return newHol;
  },

  async deleteHoliday(id) {
    const list = getStoredHolidays();
    const filtered = list.filter((h) => h.id !== id);
    saveHolidays(filtered);
  },

  isHolidayDate(dateStr) {
    if (!dateStr) return false;
    const list = getStoredHolidays();
    const formatted = new Date(dateStr).toISOString().split('T')[0];
    return list.some((h) => h.date === formatted);
  },
};
