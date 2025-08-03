// Geographic data for international support including African countries

export const TIMEZONES = {
  UTC: 'UTC',
  // African Timezones
  'Africa/Lagos': 'Africa/Lagos (WAT) - Nigeria, Chad, Niger',
  'Africa/Cairo': 'Africa/Cairo (EET) - Egypt',
  'Africa/Johannesburg': 'Africa/Johannesburg (SAST) - South Africa, Botswana, Zimbabwe',
  'Africa/Nairobi': 'Africa/Nairobi (EAT) - Kenya, Tanzania, Uganda',
  'Africa/Accra': 'Africa/Accra (GMT) - Ghana',
  'Africa/Casablanca': 'Africa/Casablanca (WET) - Morocco',
  'Africa/Tunis': 'Africa/Tunis (CET) - Tunisia',
  'Africa/Algiers': 'Africa/Algiers (CET) - Algeria',
  'Africa/Addis_Ababa': 'Africa/Addis_Ababa (EAT) - Ethiopia',
  'Africa/Khartoum': 'Africa/Khartoum (CAT) - Sudan',
  
  // American Timezones (existing)
  'America/New_York': 'Eastern Time (ET)',
  'America/Chicago': 'Central Time (CT)',
  'America/Denver': 'Mountain Time (MT)',
  'America/Los_Angeles': 'Pacific Time (PT)',
  'America/Phoenix': 'Mountain Standard Time',
  
  // European Timezones
  'Europe/London': 'Greenwich Mean Time (GMT)',
  'Europe/Berlin': 'Central European Time (CET)',
  'Europe/Paris': 'Central European Time (CET)',
  
  // Asian Timezones
  'Asia/Kolkata': 'India Standard Time (IST)',
  'Asia/Dubai': 'Gulf Standard Time (GST)',
  'Asia/Tokyo': 'Japan Standard Time (JST)'
};

export const CURRENCIES = {
  // African Currencies
  NGN: { code: 'NGN', name: 'Nigerian Naira', symbol: '₦' },
  ZAR: { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  EGP: { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£' },
  KES: { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh' },
  GHS: { code: 'GHS', name: 'Ghanaian Cedi', symbol: 'GH₵' },
  MAD: { code: 'MAD', name: 'Moroccan Dirham', symbol: 'MAD' },
  ETB: { code: 'ETB', name: 'Ethiopian Birr', symbol: 'Br' },
  TND: { code: 'TND', name: 'Tunisian Dinar', symbol: 'TND' },
  DZD: { code: 'DZD', name: 'Algerian Dinar', symbol: 'DA' },
  
  // Western Currencies (existing)
  USD: { code: 'USD', name: 'US Dollar', symbol: '$' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  
  // Other Major Currencies
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥' }
};

export const COUNTRIES_AND_STATES = {
  // African Countries
  Nigeria: {
    code: 'NG',
    currency: 'NGN',
    timezone: 'Africa/Lagos',
    states: [
      'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 
      'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 
      'FCT Abuja', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 
      'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 
      'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'
    ],
    majorCities: [
      'Lagos', 'Kano', 'Ibadan', 'Abuja', 'Port Harcourt', 'Benin City', 
      'Maiduguri', 'Zaria', 'Aba', 'Jos', 'Ilorin', 'Oyo', 'Enugu', 'Abeokuta'
    ]
  },
  
  'South Africa': {
    code: 'ZA',
    currency: 'ZAR',
    timezone: 'Africa/Johannesburg',
    states: [
      'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 
      'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape'
    ],
    majorCities: [
      'Johannesburg', 'Cape Town', 'Durban', 'Pretoria', 'Port Elizabeth', 
      'Bloemfontein', 'East London', 'Nelspruit', 'Kimberley'
    ]
  },
  
  Egypt: {
    code: 'EG',
    currency: 'EGP',
    timezone: 'Africa/Cairo',
    states: [
      'Cairo', 'Alexandria', 'Giza', 'Aswan', 'Asyut', 'Beheira', 'Beni Suef',
      'Dakahlia', 'Damietta', 'Fayyum', 'Gharbia', 'Ismailia', 'Kafr el-Sheikh',
      'Luxor', 'Matruh', 'Minya', 'Monufia', 'New Valley', 'North Sinai',
      'Port Said', 'Qalyubia', 'Qena', 'Red Sea', 'Sharqia', 'Sohag',
      'South Sinai', 'Suez'
    ],
    majorCities: [
      'Cairo', 'Alexandria', 'Giza', 'Shubra El-Kheima', 'Port Said', 
      'Suez', 'Luxor', 'Aswan', 'Hurghada'
    ]
  },
  
  Kenya: {
    code: 'KE',
    currency: 'KES',
    timezone: 'Africa/Nairobi',
    states: [
      'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu',
      'Garissa', 'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho',
      'Kiambu', 'Kilifi', 'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui',
      'Kwale', 'Laikipia', 'Lamu', 'Machakos', 'Makueni', 'Mandera',
      'Marsabit', 'Meru', 'Migori', 'Mombasa', 'Murang\'a', 'Nairobi',
      'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua', 'Nyeri',
      'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
      'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot'
    ],
    majorCities: [
      'Nairobi', 'Mombasa', 'Nakuru', 'Eldoret', 'Kisumu', 'Thika', 'Malindi'
    ]
  },
  
  Ghana: {
    code: 'GH',
    currency: 'GHS',
    timezone: 'Africa/Accra',
    states: [
      'Ahafo', 'Ashanti', 'Bono', 'Bono East', 'Central', 'Eastern',
      'Greater Accra', 'North East', 'Northern', 'Oti', 'Savannah',
      'Upper East', 'Upper West', 'Volta', 'Western', 'Western North'
    ],
    majorCities: [
      'Accra', 'Kumasi', 'Tamale', 'Takoradi', 'Cape Coast', 'Tema', 'Koforidua'
    ]
  },
  
  // Other major African countries
  Morocco: {
    code: 'MA',
    currency: 'MAD',
    timezone: 'Africa/Casablanca',
    states: [
      'Casablanca-Settat', 'Rabat-Salé-Kénitra', 'Marrakech-Safi',
      'Fès-Meknès', 'Tanger-Tétouan-Al Hoceïma', 'Oriental',
      'Souss-Massa', 'Drâa-Tafilalet', 'Béni Mellal-Khénifra',
      'Guelmim-Oued Noun', 'Laâyoune-Sakia El Hamra', 'Dakhla-Oued Ed-Dahab'
    ],
    majorCities: [
      'Casablanca', 'Rabat', 'Fez', 'Marrakech', 'Agadir', 'Tangier', 'Meknes'
    ]
  },
  
  Ethiopia: {
    code: 'ET',
    currency: 'ETB',
    timezone: 'Africa/Addis_Ababa',
    states: [
      'Addis Ababa', 'Afar', 'Amhara', 'Benishangul-Gumuz', 'Dire Dawa',
      'Gambela', 'Harari', 'Oromia', 'Sidama', 'SNNPR', 'Somali', 'Tigray'
    ],
    majorCities: [
      'Addis Ababa', 'Dire Dawa', 'Mekelle', 'Gondar', 'Hawassa', 'Bahir Dar'
    ]
  },
  
  // Non-African countries (existing data)
  India: {
    code: 'IN',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
    states: [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
      'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
      'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
      'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
      'Delhi', 'Puducherry', 'Chandigarh', 'Dadra and Nagar Haveli', 'Daman and Diu',
      'Lakshadweep', 'Ladakh', 'Jammu and Kashmir'
    ],
    majorCities: [
      'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad', 'Chennai', 
      'Kolkata', 'Pune', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur'
    ]
  },
  
  'United States': {
    code: 'US',
    currency: 'USD',
    timezone: 'America/New_York',
    states: [
      'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
      'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
      'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
      'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
      'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
      'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
      'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
      'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
      'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
      'West Virginia', 'Wisconsin', 'Wyoming'
    ],
    majorCities: [
      'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
      'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville'
    ]
  }
};

// Helper functions
export const getCountriesList = () => {
  return Object.keys(COUNTRIES_AND_STATES);
};

export const getStatesByCountry = (country) => {
  return COUNTRIES_AND_STATES[country]?.states || [];
};

export const getCitiesByCountry = (country) => {
  return COUNTRIES_AND_STATES[country]?.majorCities || [];
};

export const getCountryInfo = (country) => {
  return COUNTRIES_AND_STATES[country] || null;
};

export const getAfricanCountries = () => {
  const africanCountries = ['Nigeria', 'South Africa', 'Egypt', 'Kenya', 'Ghana', 'Morocco', 'Ethiopia'];
  return africanCountries.filter(country => COUNTRIES_AND_STATES[country]);
};

export const getTimezonesByRegion = () => {
  return {
    Africa: Object.keys(TIMEZONES).filter(tz => tz.startsWith('Africa/')),
    America: Object.keys(TIMEZONES).filter(tz => tz.startsWith('America/')),
    Europe: Object.keys(TIMEZONES).filter(tz => tz.startsWith('Europe/')),
    Asia: Object.keys(TIMEZONES).filter(tz => tz.startsWith('Asia/')),
    Other: ['UTC']
  };
};

export const getCurrenciesByRegion = () => {
  const africanCurrencies = ['NGN', 'ZAR', 'EGP', 'KES', 'GHS', 'MAD', 'ETB', 'TND', 'DZD'];
  const westernCurrencies = ['USD', 'EUR', 'GBP', 'CAD'];
  const otherCurrencies = ['INR', 'AED', 'JPY'];
  
  return {
    African: africanCurrencies.map(code => CURRENCIES[code]),
    Western: westernCurrencies.map(code => CURRENCIES[code]),
    Other: otherCurrencies.map(code => CURRENCIES[code])
  };
};
