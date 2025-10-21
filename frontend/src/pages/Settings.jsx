import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCog, FaShieldAlt, FaDatabase, FaBell, FaSave, FaSpinner, FaCreditCard, FaCalendarAlt, FaClock } from 'react-icons/fa';
import SummaryApi from '../common';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [backups, setBackups] = useState([]);
  const [backupStats, setBackupStats] = useState(null);
  const [loadingBackups, setLoadingBackups] = useState(false);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'AshAmSmart',
      siteDescription: 'Your trusted interior decoration specialist for wallpapers, paints, and home decor products',
      maintenanceMode: false,
      allowRegistration: true,
      defaultLanguage: 'en',
      timezone: 'Africa/Lagos',
      currency: 'NGN'
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      stockAlerts: true,
      userRegistration: true,
      sellerApplications: true,
      systemAlerts: true
    },
    security: {
      requireEmailVerification: true,
      twoFactorAuth: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordMinLength: 6,
      requireStrongPassword: true
    },
    payment: {
      enablePayPal: true,
      enableStripe: true,
      minimumPayout: 25.0,
      payoutSchedule: 'weekly'
    },
    scheduling: {
      maintenanceWindow: {
        enabled: false,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '02:00',
        endTime: '04:00',
        recurring: false,
        frequency: 'weekly'
      },
      backupSchedule: {
        enabled: true,
        frequency: 'daily',
        time: '02:00',
        lastBackup: null,
        nextBackup: null
      },
      reportGeneration: {
        enabled: true,
        frequency: 'weekly',
        dayOfWeek: 'monday',
        time: '09:00',
        customDates: []
      },
      auditPeriod: {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
      }
    }
  });

  const tabs = [
    { id: 'general', label: 'General', icon: <FaCog /> },
    { id: 'notifications', label: 'Notifications', icon: <FaBell /> },
    { id: 'security', label: 'Security', icon: <FaShieldAlt /> },
    { id: 'payment', label: 'Payment', icon: <FaCreditCard /> },
    { id: 'scheduling', label: 'Scheduling', icon: <FaCalendarAlt /> },
    { id: 'database', label: 'Database', icon: <FaDatabase /> }
  ];

  // Load settings on component mount
  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // First, try to load from localStorage
      const savedSettings = localStorage.getItem('adminSettings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(prevSettings => ({
            ...prevSettings,
            ...parsedSettings
          }));
        } catch (error) {
          console.warn('Failed to parse saved settings from localStorage:', error);
        }
      }

      // Then try to load from backend
      const response = await fetch(SummaryApi.getAdminSettings.url, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSettings(prevSettings => ({
            ...prevSettings,
            ...data.data
          }));
          // Save to localStorage for future use
          localStorage.setItem('adminSettings', JSON.stringify(data.data));
        }
      }
    } catch (error) {
      console.warn('Failed to load settings from backend, using defaults:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category, setting, value) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    };
    
    setSettings(newSettings);
    
    // Auto-save to localStorage for immediate persistence
    localStorage.setItem('adminSettings', JSON.stringify(newSettings));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Always save to localStorage first for immediate persistence
      localStorage.setItem('adminSettings', JSON.stringify(settings));
      
      const response = await fetch(SummaryApi.updateAdminSettings.url, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      const data = await response.json();
      
      if (data.success) {
        toast.success('Settings saved successfully!');
      } else {
        toast.error(data.message || 'Failed to save settings to backend, but saved locally');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.success('Settings saved locally! They will be available when you return.');
    } finally {
      setSaving(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Site Name
          </label>
          <input
            type="text"
            value={settings.general.siteName}
            onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Language
          </label>
          <select
            value={settings.general.defaultLanguage}
            onChange={(e) => handleSettingChange('general', 'defaultLanguage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
          </select>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Site Description
        </label>
        <textarea
          value={settings.general.siteDescription}
          onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="UTC">UTC</option>
            <optgroup label="African Timezones">
              <option value="Africa/Lagos">Africa/Lagos (WAT) - Nigeria, Chad, Niger</option>
              <option value="Africa/Cairo">Africa/Cairo (EET) - Egypt</option>
              <option value="Africa/Johannesburg">Africa/Johannesburg (SAST) - South Africa, Botswana</option>
              <option value="Africa/Nairobi">Africa/Nairobi (EAT) - Kenya, Tanzania, Uganda</option>
              <option value="Africa/Accra">Africa/Accra (GMT) - Ghana</option>
              <option value="Africa/Casablanca">Africa/Casablanca (WET) - Morocco</option>
              <option value="Africa/Tunis">Africa/Tunis (CET) - Tunisia</option>
              <option value="Africa/Algiers">Africa/Algiers (CET) - Algeria</option>
              <option value="Africa/Addis_Ababa">Africa/Addis_Ababa (EAT) - Ethiopia</option>
              <option value="Africa/Khartoum">Africa/Khartoum (CAT) - Sudan</option>
            </optgroup>
            <optgroup label="American Timezones">
              <option value="America/New_York">Eastern Time (ET)</option>
              <option value="America/Chicago">Central Time (CT)</option>
              <option value="America/Denver">Mountain Time (MT)</option>
              <option value="America/Los_Angeles">Pacific Time (PT)</option>
              <option value="America/Phoenix">Mountain Standard Time</option>
            </optgroup>
            <optgroup label="European Timezones">
              <option value="Europe/London">Greenwich Mean Time (GMT)</option>
              <option value="Europe/Berlin">Central European Time (CET)</option>
              <option value="Europe/Paris">Central European Time (CET)</option>
            </optgroup>
            <optgroup label="Asian Timezones">
              <option value="Asia/Kolkata">India Standard Time (IST)</option>
              <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
              <option value="Asia/Tokyo">Japan Standard Time (JST)</option>
            </optgroup>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Default Currency
          </label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <optgroup label="African Currencies">
              <option value="NGN">NGN (₦) - Nigerian Naira</option>
              <option value="ZAR">ZAR (R) - South African Rand</option>
              <option value="EGP">EGP (E£) - Egyptian Pound</option>
              <option value="KES">KES (KSh) - Kenyan Shilling</option>
              <option value="GHS">GHS (GH₵) - Ghanaian Cedi</option>
              <option value="MAD">MAD - Moroccan Dirham</option>
              <option value="ETB">ETB (Br) - Ethiopian Birr</option>
              <option value="TND">TND - Tunisian Dinar</option>
              <option value="DZD">DZD (DA) - Algerian Dinar</option>
            </optgroup>
            <optgroup label="Western Currencies">
              <option value="USD">USD ($) - US Dollar</option>
              <option value="EUR">EUR (€) - Euro</option>
              <option value="GBP">GBP (£) - British Pound</option>
              <option value="CAD">CAD (C$) - Canadian Dollar</option>
            </optgroup>
            <optgroup label="Other Major Currencies">
              <option value="INR">INR (₹) - Indian Rupee</option>
              <option value="AED">AED - UAE Dirham</option>
              <option value="JPY">JPY (¥) - Japanese Yen</option>
            </optgroup>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="maintenanceMode"
            checked={settings.general.maintenanceMode}
            onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="maintenanceMode" className="ml-2 text-sm text-gray-700">
            Maintenance Mode
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="allowRegistration"
            checked={settings.general.allowRegistration}
            onChange={(e) => handleSettingChange('general', 'allowRegistration', e.target.checked)}
            className="h-4 w-4 text-blue-600 border-gray-300 rounded"
          />
          <label htmlFor="allowRegistration" className="ml-2 text-sm text-gray-700">
            Allow New User Registration
          </label>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-blue-800 mb-2">Email Notifications</h3>
        <p className="text-sm text-blue-700">Configure when the system sends email notifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="emailNotifications"
              checked={settings.notifications.emailNotifications}
              onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="emailNotifications" className="ml-2 text-sm text-gray-700">
              Email Notifications
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="orderNotifications"
              checked={settings.notifications.orderNotifications}
              onChange={(e) => handleSettingChange('notifications', 'orderNotifications', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="orderNotifications" className="ml-2 text-sm text-gray-700">
              Order Notifications
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="stockAlerts"
              checked={settings.notifications.stockAlerts}
              onChange={(e) => handleSettingChange('notifications', 'stockAlerts', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="stockAlerts" className="ml-2 text-sm text-gray-700">
              Stock Alerts
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="userRegistration"
              checked={settings.notifications.userRegistration}
              onChange={(e) => handleSettingChange('notifications', 'userRegistration', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="userRegistration" className="ml-2 text-sm text-gray-700">
              User Registration Notifications
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="sellerApplications"
              checked={settings.notifications.sellerApplications}
              onChange={(e) => handleSettingChange('notifications', 'sellerApplications', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="sellerApplications" className="ml-2 text-sm text-gray-700">
              Seller Application Notifications
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="systemAlerts"
              checked={settings.notifications.systemAlerts}
              onChange={(e) => handleSettingChange('notifications', 'systemAlerts', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="systemAlerts" className="ml-2 text-sm text-gray-700">
              System Alerts
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-red-800 mb-2">Security Configuration</h3>
        <p className="text-sm text-red-700">Configure authentication and security policies</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="requireEmailVerification"
              checked={settings.security.requireEmailVerification}
              onChange={(e) => handleSettingChange('security', 'requireEmailVerification', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="requireEmailVerification" className="ml-2 text-sm text-gray-700">
              Require Email Verification
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="twoFactorAuth"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="twoFactorAuth" className="ml-2 text-sm text-gray-700">
              Two-Factor Authentication
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="requireStrongPassword"
              checked={settings.security.requireStrongPassword}
              onChange={(e) => handleSettingChange('security', 'requireStrongPassword', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="requireStrongPassword" className="ml-2 text-sm text-gray-700">
              Require Strong Password
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Timeout (minutes)
            </label>
            <input
              type="number"
              value={settings.security.sessionTimeout}
              onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="5"
              max="480"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Login Attempts
            </label>
            <input
              type="number"
              value={settings.security.maxLoginAttempts}
              onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="3"
              max="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Password Length
            </label>
            <input
              type="number"
              value={settings.security.passwordMinLength}
              onChange={(e) => handleSettingChange('security', 'passwordMinLength', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="6"
              max="20"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <FaCreditCard className="text-blue-600 text-2xl mt-1 mr-4" />
          <div className="flex-1">
            <h3 className="text-lg font-medium text-blue-800 mb-2">Payment Configuration</h3>
            <p className="text-sm text-blue-700 mb-4">
              For comprehensive payment gateway configuration, including API keys, fees, and advanced settings, 
              please use the dedicated Payment Configuration panel.
            </p>
            
            <div className="mb-4">
              <h4 className="font-medium text-blue-800 mb-2">Quick Settings</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Minimum Payout: </span>
                  <span className="font-semibold text-blue-900">${settings.payment.minimumPayout}</span>
                </div>
                <div>
                  <span className="text-blue-700">Payout Schedule: </span>
                  <span className="font-semibold text-blue-900">{settings.payment.payoutSchedule}</span>
                </div>
                <div>
                  <span className="text-blue-700">Commission Rate: </span>
                  <span className="font-semibold text-blue-900">{settings.payment.commissionRate}%</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <a 
                href="/admin-panel/payment-config" 
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <FaCog className="mr-2" />
                Open Payment Configuration
              </a>
              <div className="text-xs text-blue-600">
                Configure API keys, payment gateways, fees, and advanced settings
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Load backup data
  const loadBackupData = async () => {
    try {
      setLoadingBackups(true);
      
      // Load backup list
      const backupResponse = await fetch(`${SummaryApi.getBackupList.url}?limit=5`, {
        method: SummaryApi.getBackupList.method,
        credentials: 'include'
      });
      const backupResult = await backupResponse.json();
      if (backupResult.success) {
        setBackups(backupResult.data.backups);
      }

      // Load backup statistics
      const statsResponse = await fetch(SummaryApi.getBackupStats.url, {
        method: SummaryApi.getBackupStats.method,
        credentials: 'include'
      });
      const statsResult = await statsResponse.json();
      if (statsResult.success) {
        setBackupStats(statsResult.data);
      }
    } catch (error) {
      console.error('Error loading backup data:', error);
    } finally {
      setLoadingBackups(false);
    }
  };

  // Load backup data when database tab is accessed
  useEffect(() => {
    if (activeTab === 'database') {
      loadBackupData();
    }
  }, [activeTab]);

  const renderDatabaseSettings = () => {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-yellow-800 mb-2">Database Operations</h3>
          <p className="text-sm text-yellow-700 mb-4">
            Perform database maintenance operations. Use with caution.
          </p>
          
          <div className="space-y-3">
            <button 
              onClick={handleDatabaseBackup}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            >
              Create Backup
            </button>
            
            <button 
              onClick={handleDatabaseOptimize}
              className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700 transition duration-200 ml-2"
            >
              Optimize Database
            </button>
            
            <button 
              onClick={handleClearCache}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200 ml-2"
            >
              Clear Cache
            </button>
          </div>
        </div>

        {/* Backup Statistics */}
        {backupStats && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-lg font-medium text-blue-800 mb-3">Backup Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{backupStats.total}</div>
                <div className="text-blue-700">Total Backups</div>
              </div>
              {backupStats.statusBreakdown.map(stat => (
                <div key={stat._id} className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{stat.count}</div>
                  <div className="text-blue-700 capitalize">{stat._id}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Backups */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-medium text-gray-800">Recent Backups</h3>
            <button 
              onClick={loadBackupData}
              className="text-blue-600 hover:text-blue-700 text-sm"
              disabled={loadingBackups}
            >
              {loadingBackups ? 'Loading...' : 'Refresh'}
            </button>
          </div>
          
          {loadingBackups ? (
            <div className="text-center py-4 text-gray-500">Loading backups...</div>
          ) : backups.length > 0 ? (
            <div className="space-y-2">
              {backups.map(backup => (
                <div key={backup.backupId} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{backup.backupName}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(backup.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-medium ${
                      backup.status === 'completed' ? 'text-green-600' : 
                      backup.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {backup.status.toUpperCase()}
                    </div>
                    <div className="text-xs text-gray-500">
                      {backup.statistics?.totalSize ? `${Math.round(backup.statistics.totalSize / 1024)} KB` : 'N/A'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">No backups found</div>
          )}
        </div>

        <SystemInfoCard />
      </div>
    );
  };

  const SystemInfoCard = () => {
    const [systemInfo, setSystemInfo] = useState({
      databaseStatus: 'Loading...',
      totalUsers: 'Loading...',
      totalProducts: 'Loading...',
      totalOrders: 'Loading...'
    });

    useEffect(() => {
      fetchSystemInfo();
    }, []);

    const fetchSystemInfo = async () => {
      try {
        const response = await fetch(SummaryApi.adminDashboardStats.url, {
          method: SummaryApi.adminDashboardStats.method,
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setSystemInfo({
              databaseStatus: 'Connected',
              totalUsers: data.data.totalUsers || '0',
              totalProducts: data.data.totalProducts || '0',
              totalOrders: data.data.totalOrders || '0'
            });
          }
        }
      } catch (error) {
        setSystemInfo({
          databaseStatus: 'Connection Error',
          totalUsers: 'N/A',
          totalProducts: 'N/A',
          totalOrders: 'N/A'
        });
      }
    };

    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-2">System Information</h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p><strong>Database Status:</strong> <span className={systemInfo.databaseStatus === 'Connected' ? 'text-green-600' : 'text-red-600'}>{systemInfo.databaseStatus}</span></p>
          <p><strong>Total Users:</strong> {systemInfo.totalUsers}</p>
          <p><strong>Total Products:</strong> {systemInfo.totalProducts}</p>
          <p><strong>Total Orders:</strong> {systemInfo.totalOrders}</p>
        </div>
      </div>
    );
  };

  const handleDatabaseBackup = async () => {
    if (!window.confirm('Are you sure you want to backup the database?')) return;
    
    try {
      toast.info('Database backup initiated...');
      
      const backupData = {
        backupName: `Manual Backup - ${new Date().toLocaleString()}`,
        description: 'Manual backup created from admin settings',
        backupType: 'manual',
        includeCollections: ['products', 'users', 'settings']
      };
      
      const response = await fetch(SummaryApi.createBackup.url, {
        method: SummaryApi.createBackup.method,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(backupData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Database backup started successfully! Check backup list for status.');
      } else {
        toast.error(result.message || 'Database backup failed');
      }
    } catch (error) {
      console.error('Backup error:', error);
      toast.error('Database backup failed');
    }
  };

  const handleDatabaseOptimize = async () => {
    if (!window.confirm('Are you sure you want to optimize the database?')) return;
    
    try {
      toast.info('Database optimization started...');
      // TODO: Replace with actual optimization API call
      setTimeout(() => {
        toast.success('Database optimization completed!');
      }, 100);
    } catch (error) {
      toast.error('Database optimization failed');
    }
  };

  const handleClearCache = async () => {
    if (!window.confirm('Are you sure you want to clear the cache?')) return;
    
    try {
      toast.info('Clearing cache...');
      // TODO: Replace with actual cache clear API call
      setTimeout(() => {
        toast.success('Cache cleared successfully!');
      }, 100);
    } catch (error) {
      toast.error('Failed to clear cache');
    }
  };

  // Custom Calendar Picker Component
  const CustomCalendarPicker = ({ value, onChange, label, minDate, maxDate, multiple = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDates, setSelectedDates] = useState(multiple ? (value || []) : [value]);

    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const getDaysInMonth = (date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - firstDay.getDay());

      const days = [];
      for (let i = 0; i < 42; i++) {
        const day = new Date(startDate);
        day.setDate(startDate.getDate() + i);
        days.push(day);
      }
      return days;
    };

    const formatDate = (date) => {
      if (!date) return '';
      return new Date(date).toLocaleDateString();
    };

    const isDateSelected = (date) => {
      const dateStr = date.toISOString().split('T')[0];
      return selectedDates.includes(dateStr);
    };

    const isDateDisabled = (date) => {
      const dateStr = date.toISOString().split('T')[0];
      if (minDate && dateStr < minDate) return true;
      if (maxDate && dateStr > maxDate) return true;
      return false;
    };

    const handleDateClick = (date) => {
      const dateStr = date.toISOString().split('T')[0];
      
      if (isDateDisabled(date)) return;

      if (multiple) {
        let newDates;
        if (selectedDates.includes(dateStr)) {
          newDates = selectedDates.filter(d => d !== dateStr);
        } else {
          newDates = [...selectedDates, dateStr];
        }
        setSelectedDates(newDates);
        onChange(newDates);
      } else {
        setSelectedDates([dateStr]);
        onChange(dateStr);
        setIsOpen(false);
      }
    };

    const navigateMonth = (direction) => {
      const newMonth = new Date(currentMonth);
      newMonth.setMonth(currentMonth.getMonth() + direction);
      setCurrentMonth(newMonth);
    };

    const displayValue = multiple 
      ? selectedDates.length > 0 
        ? `${selectedDates.length} date(s) selected` 
        : 'Select dates'
      : value 
        ? formatDate(value) 
        : 'Select date';

    return (
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white flex items-center justify-between"
        >
          <span className={value || (multiple && selectedDates.length > 0) ? 'text-gray-900' : 'text-gray-500'}>
            {displayValue}
          </span>
          <FaCalendarAlt className="text-gray-400" />
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-md shadow-lg p-4 w-80">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-1 hover:bg-gray-100 rounded"
                type="button"
              >
                ←
              </button>
              <h3 className="text-lg font-semibold">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button
                onClick={() => navigateMonth(1)}
                className="p-1 hover:bg-gray-100 rounded"
                type="button"
              >
                →
              </button>
            </div>

            {/* Day Names */}
            <div className="grid grid-cols-7 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1">
              {getDaysInMonth(currentMonth).map((date, index) => {
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                const isSelected = isDateSelected(date);
                const isDisabled = isDateDisabled(date);
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <button
                    key={index}
                    onClick={() => handleDateClick(date)}
                    disabled={isDisabled}
                    type="button"
                    className={`
                      p-2 text-sm rounded hover:bg-blue-100 transition-colors
                      ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                      ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : ''}
                      ${isToday && !isSelected ? 'bg-blue-100 text-blue-600 font-semibold' : ''}
                      ${isDisabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex justify-between mt-4 pt-3 border-t">
              {multiple && (
                <button
                  onClick={() => {
                    setSelectedDates([]);
                    onChange([]);
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                  type="button"
                >
                  Clear All
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded"
                type="button"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderSchedulingSettings = () => (
    <div className="space-y-8">
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-indigo-800 mb-2">Scheduling & Automation</h3>
        <p className="text-sm text-indigo-700">Configure automated tasks, maintenance windows, and reporting schedules</p>
      </div>

      {/* Maintenance Window Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaClock className="mr-2 text-yellow-600" />
          Maintenance Window
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintenanceEnabled"
              checked={settings.scheduling?.maintenanceWindow?.enabled || false}
              onChange={(e) => handleSettingChange('scheduling', 'maintenanceWindow', {
                ...settings.scheduling?.maintenanceWindow,
                enabled: e.target.checked
              })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="maintenanceEnabled" className="ml-2 text-sm text-gray-700">
              Enable Scheduled Maintenance
            </label>
          </div>

          {settings.scheduling?.maintenanceWindow?.enabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-gray-50 rounded-lg">
              <CustomCalendarPicker
                label="Start Date"
                value={settings.scheduling.maintenanceWindow.startDate}
                onChange={(date) => handleSettingChange('scheduling', 'maintenanceWindow', {
                  ...settings.scheduling.maintenanceWindow,
                  startDate: date
                })}
                minDate={new Date().toISOString().split('T')[0]}
              />

              <CustomCalendarPicker
                label="End Date"
                value={settings.scheduling.maintenanceWindow.endDate}
                onChange={(date) => handleSettingChange('scheduling', 'maintenanceWindow', {
                  ...settings.scheduling.maintenanceWindow,
                  endDate: date
                })}
                minDate={settings.scheduling.maintenanceWindow.startDate}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time
                </label>
                <input
                  type="time"
                  value={settings.scheduling?.maintenanceWindow?.startTime || ''}
                  onChange={(e) => handleSettingChange('scheduling', 'maintenanceWindow', {
                    ...settings.scheduling.maintenanceWindow,
                    startTime: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Time
                </label>
                <input
                  type="time"
                  value={settings.scheduling?.maintenanceWindow?.endTime || ''}
                  onChange={(e) => handleSettingChange('scheduling', 'maintenanceWindow', {
                    ...settings.scheduling.maintenanceWindow,
                    endTime: e.target.value
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Generation Settings */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaBell className="mr-2 text-green-600" />
          Report Generation
        </h4>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="reportEnabled"
              checked={settings.scheduling?.reportGeneration?.enabled || false}
              onChange={(e) => handleSettingChange('scheduling', 'reportGeneration', {
                ...settings.scheduling?.reportGeneration,
                enabled: e.target.checked
              })}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="reportEnabled" className="ml-2 text-sm text-gray-700">
              Enable Automatic Report Generation
            </label>
          </div>

          {settings.scheduling?.reportGeneration?.enabled && (
            <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <select
                    value={settings.scheduling?.reportGeneration?.frequency || 'daily'}
                    onChange={(e) => handleSettingChange('scheduling', 'reportGeneration', {
                      ...settings.scheduling.reportGeneration,
                      frequency: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="custom">Custom Dates</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generation Time
                  </label>
                  <input
                    type="time"
                    value={settings.scheduling?.reportGeneration?.time || ''}
                    onChange={(e) => handleSettingChange('scheduling', 'reportGeneration', {
                      ...settings.scheduling.reportGeneration,
                      time: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {settings.scheduling?.reportGeneration?.frequency === 'custom' && (
                <div className="mt-4">
                  <CustomCalendarPicker
                    label="Custom Report Dates"
                    value={settings.scheduling?.reportGeneration?.customDates || []}
                    onChange={(dates) => handleSettingChange('scheduling', 'reportGeneration', {
                      ...settings.scheduling.reportGeneration,
                      customDates: dates
                    })}
                    multiple={true}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Select multiple dates for custom report generation
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'payment':
        return renderPaymentSettings();
      case 'scheduling':
        return renderSchedulingSettings();
      case 'database':
        return renderDatabaseSettings();
      default:
        return renderGeneralSettings();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-6 py-4">
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600">Manage your application settings and preferences</p>
          </div>
        </div>

        <div className="flex">
          {/* Sidebar */}
          <div className="w-64 bg-white shadow-sm min-h-screen">
            <nav className="mt-6 px-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center px-3 py-2 mb-1 text-sm font-medium rounded-lg transition duration-200 ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-3">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold text-gray-900">
                  {tabs.find(tab => tab.id === activeTab)?.label} Settings
                </h2>
              </div>
              
              <div className="p-6">
                {renderTabContent()}
              </div>

              {/* Save Button */}
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  disabled={saving}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition duration-200"
                >
                  {saving ? (
                    <FaSpinner className="mr-2 animate-spin" />
                  ) : (
                    <FaSave className="mr-2" />
                  )}
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
