import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaCog, FaShieldAlt, FaDatabase, FaBell, FaSave, FaSpinner, FaCreditCard, FaCalendarAlt, FaClock } from 'react-icons/fa';
import SummaryApi from '../common';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      siteName: 'E-Commerce Platform',
      siteDescription: 'Your trusted online marketplace',
      maintenanceMode: false,
      allowRegistration: true,
      defaultLanguage: 'en',
      timezone: 'UTC',
      currency: 'USD'
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
      commissionRate: 3.0,
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
      const response = await fetch(SummaryApi.getAdminSettings?.url || `${SummaryApi.adminDashboardStats.url.replace('/dashboard-stats', '/settings')}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSettings(data.data);
        }
      }
    } catch (error) {
      console.warn('Failed to load settings from backend, using defaults:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettingChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch(SummaryApi.updateAdminSettings?.url || `${SummaryApi.adminDashboardStats.url.replace('/dashboard-stats', '/settings')}`, {
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
        toast.error(data.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings to backend. Changes saved locally.');
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
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
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
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="CAD">CAD (C$)</option>
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
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-green-800 mb-2">Payment Configuration</h3>
        <p className="text-sm text-green-700">Configure payment methods and commission settings</p>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="enablePayPal"
              checked={settings.payment.enablePayPal}
              onChange={(e) => handleSettingChange('payment', 'enablePayPal', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="enablePayPal" className="ml-2 text-sm text-gray-700">
              Enable PayPal Payments
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="enableStripe"
              checked={settings.payment.enableStripe}
              onChange={(e) => handleSettingChange('payment', 'enableStripe', e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="enableStripe" className="ml-2 text-sm text-gray-700">
              Enable Stripe Payments
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Commission Rate (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.payment.commissionRate}
              onChange={(e) => handleSettingChange('payment', 'commissionRate', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Payout ($)
            </label>
            <input
              type="number"
              step="5"
              value={settings.payment.minimumPayout}
              onChange={(e) => handleSettingChange('payment', 'minimumPayout', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="10"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payout Schedule
            </label>
            <select
              value={settings.payment.payoutSchedule}
              onChange={(e) => handleSettingChange('payment', 'payoutSchedule', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-800 mb-2">Current Commission Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
            <p>Platform Commission: <span className="font-semibold text-green-600">{settings.payment.commissionRate}%</span></p>
            <p>Minimum Payout: <span className="font-semibold text-green-600">${settings.payment.minimumPayout}</span></p>
            <p>Payout Schedule: <span className="font-semibold text-green-600">{settings.payment.payoutSchedule}</span></p>
            <p>Payment Methods: <span className="font-semibold text-green-600">
              {[settings.payment.enablePayPal && 'PayPal', settings.payment.enableStripe && 'Stripe'].filter(Boolean).join(', ') || 'None'}
            </span></p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDatabaseSettings = () => (
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
            Backup Database
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

      <SystemInfoCard />
    </div>
  );

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
      // Add your backup API call here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
      toast.success('Database backup completed successfully!');
    } catch (error) {
      toast.error('Database backup failed');
    }
  };

  const handleDatabaseOptimize = async () => {
    if (!window.confirm('Are you sure you want to optimize the database?')) return;
    
    try {
      toast.info('Database optimization started...');
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate API call
      toast.success('Database optimization completed!');
    } catch (error) {
      toast.error('Database optimization failed');
    }
  };

  const handleClearCache = async () => {
    if (!window.confirm('Are you sure you want to clear the cache?')) return;
    
    try {
      toast.info('Clearing cache...');
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success('Cache cleared successfully!');
    } catch (error) {
      toast.error('Failed to clear cache');
    }
  };

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
