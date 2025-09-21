// Utility functions for accessing user settings

export const getStoredSettings = () => {
  try {
    const settings = localStorage.getItem('adminSettings');
    if (settings) {
      return JSON.parse(settings);
    }
  } catch (error) {
    console.warn('Failed to parse stored settings:', error);
  }
  
  // Return default settings with Nigerian locale as fallback
  return {
    general: {
      siteName: 'AshAmSmart',
      siteDescription: 'Your trusted e-commerce marketplace',
      maintenanceMode: false,
      allowRegistration: true,
      defaultLanguage: 'en',
      timezone: 'Africa/Lagos',
      currency: 'NGN'
    }
  };
};

export const getCurrentCurrency = () => {
  const settings = getStoredSettings();
  return settings?.general?.currency || 'NGN';
};

export const getCurrentTimezone = () => {
  const settings = getStoredSettings();
  return settings?.general?.timezone || 'Africa/Lagos';
};

export const formatCurrency = (amount, currency = null) => {
  const currencyCode = currency || getCurrentCurrency();
  
  // Currency formatting options for different regions
  const currencyOptions = {
    NGN: { locale: 'en-NG', symbol: '₦' },
    USD: { locale: 'en-US', symbol: '$' },
    EUR: { locale: 'en-EU', symbol: '€' },
    GBP: { locale: 'en-GB', symbol: '£' },
    ZAR: { locale: 'en-ZA', symbol: 'R' },
    EGP: { locale: 'ar-EG', symbol: 'E£' },
    KES: { locale: 'en-KE', symbol: 'KSh' },
    GHS: { locale: 'en-GH', symbol: 'GH₵' },
    CAD: { locale: 'en-CA', symbol: 'C$' },
    INR: { locale: 'en-IN', symbol: '₹' },
    AED: { locale: 'ar-AE', symbol: 'AED' },
    JPY: { locale: 'ja-JP', symbol: '¥' },
    MAD: { locale: 'ar-MA', symbol: 'MAD' },
    ETB: { locale: 'am-ET', symbol: 'Br' },
    TND: { locale: 'ar-TN', symbol: 'TND' },
    DZD: { locale: 'ar-DZ', symbol: 'DA' }
  };

  const options = currencyOptions[currencyCode] || currencyOptions.NGN;
  
  try {
    return new Intl.NumberFormat(options.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount);
  } catch (error) {
    // Fallback for unsupported locales
    return `${options.symbol}${amount.toLocaleString()}`;
  }
};

export const formatDate = (date, timezone = null) => {
  const tz = timezone || getCurrentTimezone();
  
  try {
    return new Intl.DateTimeFormat('en-US', {
      timeZone: tz,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  } catch (error) {
    return new Date(date).toLocaleString();
  }
};
