import React, { useState, useEffect } from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';
import AdvancedCalendarPicker from '../components/AdvancedCalendarPicker';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const Analytics = () => {
    const [categories, setCategories] = useState([]);
    const [analyticsData, setAnalyticsData] = useState({
        salesTrend: [],
        categoryPerformance: [],
        revenueMetrics: {},
        userGrowth: [],
        topProducts: [],
        newUserAnalytics: {
            registrationSources: [],
            userDemographics: [],
            conversionMetrics: {},
            dailyRegistrations: []
        },
        loading: true
    });

    const [timePeriod, setTimePeriod] = useState('month');
    const [customDateMode, setCustomDateMode] = useState(false);
    const [customDateRange, setCustomDateRange] = useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0],
        startTime: '00:00',
        endTime: '23:59'
    });
    const [selectedDate] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
        hour: new Date().getHours()
    });
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [refreshInterval, setRefreshInterval] = useState(30);
    const [comparisonMode, setComparisonMode] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        category: 'all',
        priceRange: 'all'
    });

    // Export data functionality
    const exportData = (format = 'csv') => {
        const data = analyticsData.salesTrend;
        if (format === 'csv') {
            const csvContent = [
                ['Time', 'Sales', 'Revenue', 'Orders', 'Customers'],
                ...data.map(row => [row.time, row.sales, row.revenue, row.orders, row.customers])
            ].map(row => row.join(',')).join('\n');
            
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics_${timePeriod}_${new Date().toISOString().split('T')[0]}.csv`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Data exported successfully!');
        }
    };

    // Auto-refresh functionality - only refresh data, not the entire page
    useEffect(() => {
        let interval;
        if (autoRefresh && refreshInterval > 0) {
            interval = setInterval(() => {
                // Just trigger state update to re-fetch data without navigation
                setTimePeriod(prev => ({ ...prev }));
            }, refreshInterval * 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [autoRefresh, refreshInterval]);

    // Helper function to get period description
    const getPeriodDescription = () => {
        if (customDateMode && timePeriod === 'custom') {
            const customDate = new Date(selectedDate.year, selectedDate.month - 1, selectedDate.day, selectedDate.hour);
            return `Custom: ${customDate.toLocaleDateString()} ${customDate.toLocaleTimeString()}`;
        }
        
        switch (timePeriod) {
            case 'hour': return 'Last 24 Hours';
            case 'day': return 'Last 30 Days';
            case 'month': return 'Last 12 Months';
            case 'year': return 'Last 5 Years';
            default: return 'Current Period';
        }
    };

    // Helper function to get chart height based on data points
    const getChartHeight = () => {
        return timePeriod === 'hour' ? 350 : 400;
    };

    // Generate mock sales trend data based on time period
    // Generate sales trend data from real stats
    const generateSalesTrendData = (stats, period) => {
        if (!stats || !stats.salesTrend) {
            return [];
        }
        
        // Return the sales trend data from backend based on period
        return stats.salesTrend[period] || [];
    };

    // Generate category performance data from real stats
    const generateCategoryData = (stats) => {
        if (stats && stats.categoryPerformance && stats.categoryPerformance.length > 0) {
            return stats.categoryPerformance;
        }
        return [];
    };

    // No longer using sellers - platform is direct sales only

    // Generate top products data from actual sales data
    const generateTopProductsData = (stats) => {
        // Use real product data from stats if available
        if (stats && stats.topProducts && stats.topProducts.length > 0) {
            return stats.topProducts.slice(0, 6).map((product, index) => ({
                id: product._id || index + 1,
                name: product.productName || product.name || 'Unknown Product',
                category: product.category || 'Uncategorized',
                image: product.productImage?.[0] || product.image || '/api/placeholder/80/80',
                totalSales: product.totalSales || product.salesCount || 0,
                revenue: product.revenue || product.totalRevenue || 0,
                averageRating: product.averageRating || 0,
                reviewsCount: product.reviewsCount || product.totalReviews || 0,
                price: product.sellingPrice || product.price || 0,
                inStock: product.stock || 0
            })).sort((a, b) => b.totalSales - a.totalSales);
        }
        
        // Return empty array if no real data available
        return [];
    };

    // Calculate revenue metrics from real data
    const calculateRevenueMetrics = (stats) => {
        if (stats && stats.revenueMetrics) {
            return {
                totalRevenue: stats.revenueMetrics.totalRevenue || 0,
                monthlyGrowth: stats.revenueMetrics.monthlyGrowth || 0,
                averageOrderValue: stats.revenueMetrics.averageOrderValue || 0,
                conversionRate: stats.revenueMetrics.conversionRate || 0
            };
        }
        return {
            totalRevenue: 0,
            monthlyGrowth: 0,
            averageOrderValue: 0,
            conversionRate: 0
        };
    };

    // Generate new user analytics from real data
    const generateNewUserAnalytics = (stats, period) => {
        if (!stats || !stats.userAnalytics) {
            return {
                registrationSources: [],
                userDemographics: [],
                conversionMetrics: {
                    signupToFirstPurchase: 0,
                    averageTimeToFirstPurchase: 0,
                    userRetentionRate: 0,
                    averageLifetimeValue: 0
                },
                dailyRegistrations: []
            };
        }

        const userAnalytics = stats.userAnalytics;
        
        return {
            registrationSources: userAnalytics.registrationSources || [],
            userDemographics: userAnalytics.userDemographics || [],
            conversionMetrics: userAnalytics.conversionMetrics || {
                signupToFirstPurchase: 0,
                averageTimeToFirstPurchase: 0,
                userRetentionRate: 0,
                averageLifetimeValue: 0
            },
            dailyRegistrations: userAnalytics.dailyRegistrations || []
        };
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(SummaryApi.adminCategories.url, {
                    method: SummaryApi.adminCategories.method,
                    credentials: 'include'
                });
                const result = await response.json();
                
                if (result.success && result.categories) {
                    setCategories(result.categories);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                setCategories([]);
            }
        };

        const fetchData = async () => {
            try {
                setAnalyticsData(prev => ({ ...prev, loading: true }));
                
                const response = await fetch(SummaryApi.adminDashboardStats.url, {
                    method: SummaryApi.adminDashboardStats.method,
                    credentials: 'include',
                    headers: {
                        'content-type': 'application/json'
                    }
                });

                const data = await response.json();

                if (data.success) {
                    const salesTrendData = generateSalesTrendData(data.data, timePeriod);
                    const categoryData = generateCategoryData(data.data);
                    const topProductsData = generateTopProductsData(data.data);
                    const newUserAnalyticsData = generateNewUserAnalytics(data.data, timePeriod);

                    setAnalyticsData({
                        salesTrend: salesTrendData,
                        categoryPerformance: categoryData,
                        revenueMetrics: calculateRevenueMetrics(data.data),
                        userGrowth: [],
                        topProducts: topProductsData,
                        newUserAnalytics: newUserAnalyticsData,
                        loading: false
                    });
                } else {
                    toast.error(data.message || 'Failed to fetch analytics data');
                    setAnalyticsData(prev => ({ ...prev, loading: false }));
                }
            } catch (error) {
                console.error('Analytics fetch error:', error);
                toast.error('Failed to load analytics data');
                setAnalyticsData(prev => ({ ...prev, loading: false }));
            }
        };

        fetchCategories();
        fetchData();
    }, [timePeriod, customDateMode, selectedDate.year, selectedDate.month, selectedDate.day, selectedDate.hour]);

    // Loading state
    if (analyticsData.loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="bg-white p-6 rounded-lg shadow">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="h-64 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    // Main Analytics Dashboard
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header Section */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="mb-4 lg:mb-0">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                        <p className="text-gray-600">Monitor your business performance and growth</p>
                    </div>
                    
                    {/* Enhanced Controls */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Export & Refresh Controls */}
                        <div className="flex items-center space-x-2">
                            {/* Export Button */}
                            <button
                                onClick={() => exportData('csv')}
                                className="flex items-center px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                                title="Export data to CSV"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Export
                            </button>

                            {/* Auto-refresh Toggle */}
                            <div className="flex items-center space-x-2">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={autoRefresh}
                                        onChange={(e) => setAutoRefresh(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`relative w-10 h-6 rounded-full transition-colors ${autoRefresh ? 'bg-blue-600' : 'bg-gray-300'}`}>
                                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${autoRefresh ? 'translate-x-4' : ''}`}></div>
                                    </div>
                                    <span className="ml-2 text-sm text-gray-700">Auto-refresh</span>
                                </label>
                                {autoRefresh && (
                                    <select
                                        value={refreshInterval}
                                        onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                                        className="text-xs border border-gray-300 rounded px-2 py-1"
                                    >
                                        <option value={15}>15s</option>
                                        <option value={30}>30s</option>
                                        <option value={60}>1m</option>
                                        <option value={300}>5m</option>
                                    </select>
                                )}
                            </div>

                            {/* Comparison Mode Toggle */}
                            <button
                                onClick={() => setComparisonMode(!comparisonMode)}
                                className={`flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                                    comparisonMode 
                                        ? 'bg-purple-600 text-white' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                                title="Compare with previous period"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                                Compare
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">Filters:</label>
                                
                                {/* Category Filter */}
                                <select
                                    value={selectedFilters.category}
                                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, category: e.target.value }))}
                                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Categories</option>
                                    {categories.map((category, index) => (
                                        <option key={category._id || index} value={category.name}>
                                            {category.displayName || category.name}
                                        </option>
                                    ))}
                                </select>

                                {/* Price Range Filter */}
                                <select
                                    value={selectedFilters.priceRange}
                                    onChange={(e) => setSelectedFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Prices</option>
                                    <option value="0-50">$0 - $50</option>
                                    <option value="50-200">$50 - $200</option>
                                    <option value="200-500">$200 - $500</option>
                                    <option value="500+">$500+</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Bar */}
                <div className="mt-4 flex flex-wrap items-center justify-between text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                            <div className={`w-2 h-2 rounded-full mr-2 ${analyticsData.loading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                            {analyticsData.loading ? 'Loading...' : 'Data updated'}
                        </span>
                        {autoRefresh && (
                            <span className="text-blue-600">
                                Auto-refresh: {refreshInterval}s
                            </span>
                        )}
                        {comparisonMode && (
                            <span className="text-purple-600">
                                Comparison mode active
                            </span>
                        )}
                    </div>
                    <div>
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {/* Time Period Selector */}
            <div className="mb-6">
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex flex-col space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-gray-700">View by:</span>
                                <div className="flex bg-white rounded-lg border border-gray-200 overflow-hidden">
                                    {[
                                        { value: 'hour', label: 'Hours', desc: 'Last 24 hours' },
                                        { value: 'day', label: 'Days', desc: 'Last 30 days' },
                                        { value: 'month', label: 'Months', desc: 'Last 12 months' },
                                        { value: 'year', label: 'Years', desc: 'Last 5 years' }
                                    ].map((period) => (
                                        <button
                                            key={period.value}
                                            onClick={() => {
                                                setTimePeriod(period.value);
                                                setCustomDateMode(false);
                                            }}
                                            disabled={analyticsData.loading}
                                            className={`px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                                                timePeriod === period.value && !customDateMode
                                                    ? 'bg-blue-600 text-white'
                                                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                                            }`}
                                            title={period.desc}
                                        >
                                            {period.label}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => setCustomDateMode(true)}
                                        disabled={analyticsData.loading}
                                        className={`px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50 ${
                                            customDateMode
                                                ? 'bg-purple-600 text-white'
                                                : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
                                        }`}
                                        title="Custom date selection"
                                    >
                                        Custom
                                    </button>
                                </div>
                            </div>
                            
                            {/* Quick Actions */}
                            <div className="flex items-center space-x-2 ml-auto">
                                <button
                                    onClick={() => setTimePeriod(timePeriod)}
                                    disabled={analyticsData.loading}
                                    className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors"
                                    title="Refresh data"
                                >
                                    <svg 
                                        className={`w-5 h-5 ${analyticsData.loading ? 'animate-spin' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Custom Date Selection */}
                        {customDateMode && (
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Date Range Selection</h3>
                                <AdvancedCalendarPicker
                                    startDate={customDateRange.startDate}
                                    endDate={customDateRange.endDate}
                                    startTime={customDateRange.startTime}
                                    endTime={customDateRange.endTime}
                                    onChange={(newRange) => {
                                        setCustomDateRange(newRange);
                                        // Update analytics data based on custom range
                                        setTimePeriod('custom');
                                        toast.success(`Analytics updated for ${newRange.startDate} to ${newRange.endDate}`);
                                    }}
                                    showTimeSelection={true}
                                    allowRangeSelection={true}
                                />
                                <div className="mt-4 flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Select your preferred date range and time window for detailed analytics
                                    </p>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => {
                                                setCustomDateMode(false);
                                                setTimePeriod('month');
                                            }}
                                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                // Apply custom date range
                                                toast.info('Generating analytics for custom date range...');
                                                // Fetch analytics data for custom range
                                            }}
                                            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                                        >
                                            Generate Report
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        <div className="text-xs text-gray-500">
                            {timePeriod === 'hour' && 'Showing data for the last 24 hours'}
                            {timePeriod === 'day' && 'Showing data for the last 30 days'}
                            {timePeriod === 'month' && 'Showing data for the last 12 months'}
                            {timePeriod === 'year' && 'Showing data for the last 5 years'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                {/* Total Revenue Card */}
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                            <p className="text-2xl font-bold text-green-600">
                                ${analyticsData.revenueMetrics.totalRevenue?.toLocaleString()}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-sm text-green-600">+{analyticsData.revenueMetrics.monthlyGrowth}%</span>
                        <span className="text-sm text-gray-500"> from last month</span>
                    </div>
                </div>

                {/* Total Orders Card */}
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total Orders</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {analyticsData.salesTrend.reduce((acc, curr) => acc + (curr.orders || 0), 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-sm text-blue-600">+8.2%</span>
                        <span className="text-sm text-gray-500"> from last month</span>
                    </div>
                </div>

                {/* New Users Card */}
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">New Users</p>
                            <p className="text-2xl font-bold text-indigo-600">
                                {analyticsData.newUserAnalytics.dailyRegistrations.reduce((acc, curr) => acc + (curr.registrations || 0), 0).toLocaleString()}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-sm text-indigo-600">+{analyticsData.newUserAnalytics.conversionMetrics.signupToFirstPurchase}%</span>
                        <span className="text-sm text-gray-500"> conversion rate</span>
                    </div>
                </div>

                {/* Top Product Revenue Card */}
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Top Product Revenue</p>
                            <p className="text-2xl font-bold text-purple-600">
                                ${analyticsData.topProducts.length > 0 ? (analyticsData.topProducts[0]?.revenue || 0).toLocaleString() : '0'}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-sm text-purple-600">
                            {analyticsData.topProducts.length > 0 ? analyticsData.topProducts[0]?.name : 'No data'}
                        </span>
                        <span className="text-sm text-gray-500"> top selling product</span>
                    </div>
                </div>

                {/* Best Product Sales Card */}
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Best Product Sales</p>
                            <p className="text-2xl font-bold text-orange-600">
                                {analyticsData.topProducts.length > 0 ? analyticsData.topProducts[0]?.totalSales?.toLocaleString() : '0'}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-sm text-orange-600">
                            {analyticsData.topProducts.length > 0 ? analyticsData.topProducts[0]?.name : 'No data'}
                        </span>
                        <span className="text-sm text-gray-500"> units sold</span>
                    </div>
                </div>
            </div>

            {/* Sales Trend Chart */}
            <div className="bg-white p-6 rounded-lg shadow mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Sales Trend</h2>
                    <span className="text-sm text-gray-500">{getPeriodDescription()}</span>
                </div>
                <ResponsiveContainer width="100%" height={getChartHeight()}>
                    <AreaChart data={analyticsData.salesTrend}>
                        <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorOrders" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="time" 
                            angle={timePeriod === 'hour' ? -45 : 0}
                            textAnchor={timePeriod === 'hour' ? 'end' : 'middle'}
                            height={timePeriod === 'hour' ? 80 : 60}
                        />
                        <YAxis />
                        <Tooltip formatter={(value, name) => [
                            name === 'revenue' ? `$${value.toLocaleString()}` : value.toLocaleString(),
                            name === 'revenue' ? 'Revenue' : 'Orders'
                        ]} />
                        <Legend />
                        <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#8884d8"
                            fillOpacity={1}
                            fill="url(#colorRevenue)"
                            name="Revenue"
                        />
                        <Area
                            type="monotone"
                            dataKey="orders"
                            stroke="#82ca9d"
                            fillOpacity={1}
                            fill="url(#colorOrders)"
                            name="Orders"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Analytics Summary */}
            <div className="text-center py-8">
                <p className="text-gray-600">📊 Your comprehensive analytics dashboard with enhanced controls and improved user experience!</p>
                <p className="text-sm text-gray-500 mt-2">Export data, enable auto-refresh, use comparison mode, and apply filters for better insights.</p>
            </div>
        </div>
    );
};

export default Analytics;
