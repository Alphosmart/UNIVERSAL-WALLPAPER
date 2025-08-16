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
  
  // Western/Major Currencies
  USD: { code: 'USD', name: 'US Dollar', symbol: '$' },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€' },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£' },
  CAD: { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  MXN: { code: 'MXN', name: 'Mexican Peso', symbol: 'MX$' },
  
  // Asian Currencies
  INR: { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  CNY: { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  KRW: { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  THB: { code: 'THB', name: 'Thai Baht', symbol: '฿' },
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  
  // Middle Eastern Currencies
  AED: { code: 'AED', name: 'UAE Dirham', symbol: 'AED' },
  SAR: { code: 'SAR', name: 'Saudi Riyal', symbol: 'SAR' },
  
  // Oceania Currencies
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  
  // South American Currencies
  BRL: { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  ARS: { code: 'ARS', name: 'Argentine Peso', symbol: '$' }
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
  },

  Canada: {
    code: 'CA',
    currency: 'CAD',
    timezone: 'America/Toronto',
    states: [
      'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
      'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 
      'Nunavut', 'Ontario', 'Prince Edward Island', 'Quebec', 
      'Saskatchewan', 'Yukon'
    ],
    majorCities: [
      'Toronto', 'Montreal', 'Vancouver', 'Calgary', 'Edmonton', 'Ottawa', 
      'Winnipeg', 'Quebec City', 'Hamilton', 'Kitchener'
    ]
  },

  Mexico: {
    code: 'MX',
    currency: 'MXN',
    timezone: 'America/Mexico_City',
    states: [
      'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
      'Chiapas', 'Chihuahua', 'Coahuila', 'Colima', 'Durango', 'Guanajuato',
      'Guerrero', 'Hidalgo', 'Jalisco', 'Mexico', 'Michoacán', 'Morelos',
      'Nayarit', 'Nuevo León', 'Oaxaca', 'Puebla', 'Querétaro', 'Quintana Roo',
      'San Luis Potosí', 'Sinaloa', 'Sonora', 'Tabasco', 'Tamaulipas',
      'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas', 'Ciudad de México'
    ],
    majorCities: [
      'Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana', 
      'León', 'Juárez', 'Torreón', 'Querétaro', 'San Luis Potosí'
    ]
  },

  // European Countries
  'United Kingdom': {
    code: 'GB',
    currency: 'GBP',
    timezone: 'Europe/London',
    states: [
      'England', 'Scotland', 'Wales', 'Northern Ireland'
    ],
    majorCities: [
      'London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool', 
      'Edinburgh', 'Leeds', 'Sheffield', 'Bristol', 'Cardiff'
    ]
  },

  Germany: {
    code: 'DE',
    currency: 'EUR',
    timezone: 'Europe/Berlin',
    states: [
      'Baden-Württemberg', 'Bavaria', 'Berlin', 'Brandenburg', 'Bremen',
      'Hamburg', 'Hesse', 'Lower Saxony', 'Mecklenburg-Vorpommern',
      'North Rhine-Westphalia', 'Rhineland-Palatinate', 'Saarland',
      'Saxony', 'Saxony-Anhalt', 'Schleswig-Holstein', 'Thuringia'
    ],
    majorCities: [
      'Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt', 'Stuttgart',
      'Düsseldorf', 'Dortmund', 'Essen', 'Leipzig'
    ]
  },

  France: {
    code: 'FR',
    currency: 'EUR',
    timezone: 'Europe/Paris',
    states: [
      'Auvergne-Rhône-Alpes', 'Bourgogne-Franche-Comté', 'Brittany',
      'Centre-Val de Loire', 'Corsica', 'Grand Est', 'Hauts-de-France',
      'Île-de-France', 'Normandy', 'Nouvelle-Aquitaine', 'Occitanie',
      'Pays de la Loire', 'Provence-Alpes-Côte d\'Azur'
    ],
    majorCities: [
      'Paris', 'Marseille', 'Lyon', 'Toulouse', 'Nice', 'Nantes',
      'Strasbourg', 'Montpellier', 'Bordeaux', 'Lille'
    ]
  },

  Italy: {
    code: 'IT',
    currency: 'EUR',
    timezone: 'Europe/Rome',
    states: [
      'Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna',
      'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardy', 'Marche',
      'Molise', 'Piedmont', 'Puglia', 'Sardinia', 'Sicily', 'Tuscany',
      'Trentino-Alto Adige', 'Umbria', 'Valle d\'Aosta', 'Veneto'
    ],
    majorCities: [
      'Rome', 'Milan', 'Naples', 'Turin', 'Palermo', 'Genoa',
      'Bologna', 'Florence', 'Bari', 'Catania'
    ]
  },

  Spain: {
    code: 'ES',
    currency: 'EUR',
    timezone: 'Europe/Madrid',
    states: [
      'Andalusia', 'Aragon', 'Asturias', 'Balearic Islands', 'Basque Country',
      'Canary Islands', 'Cantabria', 'Castile and León', 'Castile-La Mancha',
      'Catalonia', 'Extremadura', 'Galicia', 'La Rioja', 'Madrid',
      'Murcia', 'Navarre', 'Valencia'
    ],
    majorCities: [
      'Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza',
      'Málaga', 'Murcia', 'Palma', 'Las Palmas', 'Bilbao'
    ]
  },

  // Asian Countries
  China: {
    code: 'CN',
    currency: 'CNY',
    timezone: 'Asia/Shanghai',
    states: [
      'Beijing', 'Shanghai', 'Tianjin', 'Chongqing', 'Hebei', 'Shanxi',
      'Liaoning', 'Jilin', 'Heilongjiang', 'Jiangsu', 'Zhejiang',
      'Anhui', 'Fujian', 'Jiangxi', 'Shandong', 'Henan', 'Hubei',
      'Hunan', 'Guangdong', 'Guangxi', 'Hainan', 'Sichuan', 'Guizhou',
      'Yunnan', 'Tibet', 'Shaanxi', 'Gansu', 'Qinghai', 'Ningxia', 'Xinjiang'
    ],
    majorCities: [
      'Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen', 'Tianjin',
      'Wuhan', 'Dongguan', 'Chengdu', 'Nanjing', 'Xi\'an'
    ]
  },

  Japan: {
    code: 'JP',
    currency: 'JPY',
    timezone: 'Asia/Tokyo',
    states: [
      'Hokkaido', 'Aomori', 'Iwate', 'Miyagi', 'Akita', 'Yamagata',
      'Fukushima', 'Ibaraki', 'Tochigi', 'Gunma', 'Saitama', 'Chiba',
      'Tokyo', 'Kanagawa', 'Niigata', 'Toyama', 'Ishikawa', 'Fukui',
      'Yamanashi', 'Nagano', 'Gifu', 'Shizuoka', 'Aichi', 'Mie',
      'Shiga', 'Kyoto', 'Osaka', 'Hyogo', 'Nara', 'Wakayama',
      'Tottori', 'Shimane', 'Okayama', 'Hiroshima', 'Yamaguchi',
      'Tokushima', 'Kagawa', 'Ehime', 'Kochi', 'Fukuoka', 'Saga',
      'Nagasaki', 'Kumamoto', 'Oita', 'Miyazaki', 'Kagoshima', 'Okinawa'
    ],
    majorCities: [
      'Tokyo', 'Yokohama', 'Osaka', 'Nagoya', 'Sapporo', 'Fukuoka',
      'Kobe', 'Kawasaki', 'Kyoto', 'Saitama'
    ]
  },

  'South Korea': {
    code: 'KR',
    currency: 'KRW',
    timezone: 'Asia/Seoul',
    states: [
      'Seoul', 'Busan', 'Daegu', 'Incheon', 'Gwangju', 'Daejeon', 'Ulsan',
      'Sejong', 'Gyeonggi', 'Gangwon', 'North Chungcheong', 'South Chungcheong',
      'North Jeolla', 'South Jeolla', 'North Gyeongsang', 'South Gyeongsang', 'Jeju'
    ],
    majorCities: [
      'Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju',
      'Ulsan', 'Suwon', 'Changwon', 'Goyang'
    ]
  },

  Thailand: {
    code: 'TH',
    currency: 'THB',
    timezone: 'Asia/Bangkok',
    states: [
      'Bangkok', 'Central Thailand', 'Eastern Thailand', 'Northern Thailand',
      'Northeastern Thailand', 'Southern Thailand', 'Western Thailand'
    ],
    majorCities: [
      'Bangkok', 'Nonthaburi', 'Pak Kret', 'Hat Yai', 'Chiang Mai',
      'Phuket', 'Pattaya', 'Udon Thani', 'Surat Thani', 'Khon Kaen'
    ]
  },

  Singapore: {
    code: 'SG',
    currency: 'SGD',
    timezone: 'Asia/Singapore',
    states: [
      'Central Region', 'East Region', 'North Region', 'Northeast Region', 'West Region'
    ],
    majorCities: [
      'Singapore'
    ]
  },

  // Middle Eastern Countries
  'United Arab Emirates': {
    code: 'AE',
    currency: 'AED',
    timezone: 'Asia/Dubai',
    states: [
      'Abu Dhabi', 'Ajman', 'Dubai', 'Fujairah', 'Ras Al Khaimah', 
      'Sharjah', 'Umm Al Quwain'
    ],
    majorCities: [
      'Dubai', 'Abu Dhabi', 'Sharjah', 'Al Ain', 'Ajman', 'Ras Al Khaimah'
    ]
  },

  'Saudi Arabia': {
    code: 'SA',
    currency: 'SAR',
    timezone: 'Asia/Riyadh',
    states: [
      'Riyadh', 'Makkah', 'Madinah', 'Eastern Province', 'Asir', 'Tabuk',
      'Qassim', 'Ha\'il', 'Jizan', 'Najran', 'Al Bahah', 'Northern Borders', 'Al Jawf'
    ],
    majorCities: [
      'Riyadh', 'Jeddah', 'Mecca', 'Medina', 'Dammam', 'Khobar', 'Tabuk'
    ]
  },

  // Oceania
  Australia: {
    code: 'AU',
    currency: 'AUD',
    timezone: 'Australia/Sydney',
    states: [
      'New South Wales', 'Victoria', 'Queensland', 'Western Australia',
      'South Australia', 'Tasmania', 'Northern Territory', 
      'Australian Capital Territory'
    ],
    majorCities: [
      'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 
      'Gold Coast', 'Newcastle', 'Canberra', 'Wollongong', 'Geelong'
    ]
  },

  'New Zealand': {
    code: 'NZ',
    currency: 'NZD',
    timezone: 'Pacific/Auckland',
    states: [
      'North Island', 'South Island'
    ],
    majorCities: [
      'Auckland', 'Wellington', 'Christchurch', 'Hamilton', 'Tauranga', 'Dunedin'
    ]
  },

  // South American Countries
  Brazil: {
    code: 'BR',
    currency: 'BRL',
    timezone: 'America/Sao_Paulo',
    states: [
      'Acre', 'Alagoas', 'Amapá', 'Amazonas', 'Bahia', 'Ceará',
      'Distrito Federal', 'Espírito Santo', 'Goiás', 'Maranhão',
      'Mato Grosso', 'Mato Grosso do Sul', 'Minas Gerais', 'Pará',
      'Paraíba', 'Paraná', 'Pernambuco', 'Piauí', 'Rio de Janeiro',
      'Rio Grande do Norte', 'Rio Grande do Sul', 'Rondônia',
      'Roraima', 'Santa Catarina', 'São Paulo', 'Sergipe', 'Tocantins'
    ],
    majorCities: [
      'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza',
      'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Goiânia'
    ]
  },

  Argentina: {
    code: 'AR',
    currency: 'ARS',
    timezone: 'America/Argentina/Buenos_Aires',
    states: [
      'Buenos Aires', 'Catamarca', 'Chaco', 'Chubut', 'Córdoba',
      'Corrientes', 'Entre Ríos', 'Formosa', 'Jujuy', 'La Pampa',
      'La Rioja', 'Mendoza', 'Misiones', 'Neuquén', 'Río Negro',
      'Salta', 'San Juan', 'San Luis', 'Santa Cruz', 'Santa Fe',
      'Santiago del Estero', 'Tierra del Fuego', 'Tucumán'
    ],
    majorCities: [
      'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'San Miguel de Tucumán',
      'La Plata', 'Mar del Plata', 'Salta', 'Santa Fe', 'San Juan'
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

export const getPopularCountries = () => {
  return [
    'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
    'Australia', 'Japan', 'South Korea', 'Singapore', 'United Arab Emirates',
    'Nigeria', 'South Africa', 'Egypt', 'Kenya', 'Ghana', 'India', 'China', 'Brazil'
  ];
};

export const getCountriesByRegion = () => {
  return {
    'North America': ['United States', 'Canada', 'Mexico'],
    'Europe': ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain'],
    'Asia': ['India', 'China', 'Japan', 'South Korea', 'Thailand', 'Singapore'],
    'Middle East': ['United Arab Emirates', 'Saudi Arabia'],
    'Africa': ['Nigeria', 'South Africa', 'Egypt', 'Kenya', 'Ghana', 'Morocco', 'Ethiopia'],
    'Oceania': ['Australia', 'New Zealand'],
    'South America': ['Brazil', 'Argentina']
  };
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
  const westernCurrencies = ['USD', 'EUR', 'GBP', 'CAD', 'MXN'];
  const asianCurrencies = ['INR', 'CNY', 'JPY', 'KRW', 'THB', 'SGD'];
  const middleEasternCurrencies = ['AED', 'SAR'];
  const oceaniaCurrencies = ['AUD', 'NZD'];
  const southAmericanCurrencies = ['BRL', 'ARS'];
  
  return {
    African: africanCurrencies.map(code => CURRENCIES[code]),
    Western: westernCurrencies.map(code => CURRENCIES[code]),
    Asian: asianCurrencies.map(code => CURRENCIES[code]),
    'Middle Eastern': middleEasternCurrencies.map(code => CURRENCIES[code]),
    Oceania: oceaniaCurrencies.map(code => CURRENCIES[code]),
    'South American': southAmericanCurrencies.map(code => CURRENCIES[code])
  };
};
