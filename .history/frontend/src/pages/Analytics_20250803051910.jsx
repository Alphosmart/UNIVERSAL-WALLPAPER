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
import { FaCalendarAlt, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import SummaryApi from '../common';
import { toast } from 'react-toastify';

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState({
        salesTrend: [],
        categoryPerformance: [],
        revenueMetrics: {},
        userGrowth: [],
        topSellers: [],
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
        seller: 'all',
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

    // Auto-refresh functionality
    useEffect(() => {
        let interval;
        if (autoRefresh && refreshInterval > 0) {
            interval = setInterval(() => {
                setTimePeriod(prev => prev);
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
    const generateSalesTrendData = (stats, period) => {
        let dataPoints = [];
        let count = 0;

        switch (period) {
            case 'hour':
                count = 24;
                dataPoints = Array.from({ length: count }, (_, i) => {
                    const date = new Date();
                    date.setHours(date.getHours() - (count - 1 - i));
                    return {
                        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                        sales: Math.floor(Math.random() * 5000) + 1000,
                        revenue: Math.floor(Math.random() * 10000) + 2000,
                        orders: Math.floor(Math.random() * 50) + 10,
                        customers: Math.floor(Math.random() * 20) + 5
                    };
                });
                break;
            
            case 'day':
                count = 30;
                dataPoints = Array.from({ length: count }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (count - 1 - i));
                    return {
                        time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        sales: Math.floor(Math.random() * 20000) + 5000,
                        revenue: Math.floor(Math.random() * 40000) + 10000,
                        orders: Math.floor(Math.random() * 200) + 50,
                        customers: Math.floor(Math.random() * 100) + 20
                    };
                });
                break;
            
            case 'month':
                count = 12;
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                dataPoints = months.map((month, index) => ({
                    time: month,
                    sales: Math.floor(Math.random() * 50000) + 10000,
                    revenue: Math.floor(Math.random() * 100000) + 20000,
                    orders: Math.floor(Math.random() * 500) + 100,
                    customers: Math.floor(Math.random() * 200) + 50
                }));
                break;
            
            case 'year':
                count = 5;
                dataPoints = Array.from({ length: count }, (_, i) => {
                    const year = new Date().getFullYear() - (count - 1 - i);
                    return {
                        time: year.toString(),
                        sales: Math.floor(Math.random() * 500000) + 100000,
                        revenue: Math.floor(Math.random() * 1000000) + 200000,
                        orders: Math.floor(Math.random() * 5000) + 1000,
                        customers: Math.floor(Math.random() * 2000) + 500
                    };
                });
                break;
            
            default:
                return [];
        }

        return dataPoints;
    };

    // Generate category performance data
    const generateCategoryData = (stats) => {
        const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Beauty'];
        return categories.map(category => ({
            name: category,
            sales: Math.floor(Math.random() * 30000) + 5000,
            products: Math.floor(Math.random() * 100) + 20
        }));
    };

    // Generate top sellers data
    const generateTopSellersData = (stats) => {
        const sellerNames = [
            'TechStore Pro', 'Fashion Hub', 'Home Essentials', 'Sports World', 
            'Electronics Plus', 'Garden Centre', 'Book Corner', 'Beauty Spot',
            'Mobile Zone', 'Gaming Central'
        ];
        
        return sellerNames.slice(0, 8).map((name, index) => ({
            id: index + 1,
            name,
            totalSales: Math.floor(Math.random() * 150000) + 50000,
            totalOrders: Math.floor(Math.random() * 500) + 100,
            averageRating: (Math.random() * 1.5 + 3.5).toFixed(1),
            productsCount: Math.floor(Math.random() * 50) + 10,
            revenue: Math.floor(Math.random() * 200000) + 75000,
            growth: (Math.random() * 50 - 10).toFixed(1)
        })).sort((a, b) => b.totalSales - a.totalSales);
    };

    // Generate top products data
    const generateTopProductsData = (stats) => {
        const products = [
            { name: 'iPhone 15 Pro Max', category: 'Electronics', image: '/api/placeholder/80/80' },
            { name: 'Samsung Galaxy S24', category: 'Electronics', image: '/api/placeholder/80/80' },
            { name: 'MacBook Air M3', category: 'Electronics', image: '/api/placeholder/80/80' },
            { name: 'Nike Air Max 270', category: 'Footwear', image: '/api/placeholder/80/80' },
            { name: 'Sony WH-1000XM5', category: 'Electronics', image: '/api/placeholder/80/80' },
            { name: 'iPad Pro 12.9"', category: 'Electronics', image: '/api/placeholder/80/80' }
        ];

        return products.slice(0, 6).map((product, index) => ({
            id: index + 1,
            ...product,
            totalSales: Math.floor(Math.random() * 5000) + 1000,
            revenue: Math.floor(Math.random() * 500000) + 100000,
            averageRating: (Math.random() * 1.5 + 3.5).toFixed(1),
            reviewsCount: Math.floor(Math.random() * 1000) + 100,
            price: Math.floor(Math.random() * 1000) + 50,
            inStock: Math.floor(Math.random() * 100) + 10
        })).sort((a, b) => b.totalSales - a.totalSales);
    };

    // Calculate revenue metrics
    const calculateRevenueMetrics = (stats) => {
        return {
            totalRevenue: 245680,
            monthlyGrowth: 12.5,
            averageOrderValue: 85.32,
            conversionRate: 3.2
        };
    };

    // Generate new user analytics data
    const generateNewUserAnalytics = (stats, period) => {
        const registrationSources = [
            { name: 'Direct', users: Math.floor(Math.random() * 300) + 200, percentage: 35 },
            { name: 'Social Media', users: Math.floor(Math.random() * 200) + 150, percentage: 25 },
            { name: 'Search Engine', users: Math.floor(Math.random() * 180) + 120, percentage: 20 },
            { name: 'Email Campaign', users: Math.floor(Math.random() * 100) + 80, percentage: 12 },
            { name: 'Referral', users: Math.floor(Math.random() * 80) + 40, percentage: 8 }
        ];

        const userDemographics = [
            { ageGroup: '18-24', users: Math.floor(Math.random() * 150) + 100, percentage: 22 },
            { ageGroup: '25-34', users: Math.floor(Math.random() * 200) + 180, percentage: 35 },
            { ageGroup: '35-44', users: Math.floor(Math.random() * 120) + 100, percentage: 20 },
            { ageGroup: '45-54', users: Math.floor(Math.random() * 80) + 60, percentage: 13 },
            { ageGroup: '55+', users: Math.floor(Math.random() * 60) + 40, percentage: 10 }
        ];

        const conversionMetrics = {
            signupToFirstPurchase: (Math.random() * 15 + 10).toFixed(1),
            averageTimeToFirstPurchase: Math.floor(Math.random() * 5) + 2,
            userRetentionRate: (Math.random() * 20 + 70).toFixed(1),
            averageLifetimeValue: Math.floor(Math.random() * 200) + 150
        };

        let dailyRegistrations = [];
        switch (period) {
            case 'hour':
                dailyRegistrations = Array.from({ length: 24 }, (_, i) => {
                    const date = new Date();
                    date.setHours(date.getHours() - (23 - i));
                    return {
                        time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
                        registrations: Math.floor(Math.random() * 10) + 2,
                        activations: Math.floor(Math.random() * 8) + 1
                    };
                });
                break;
            
            case 'day':
                dailyRegistrations = Array.from({ length: 30 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (29 - i));
                    return {
                        time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                        registrations: Math.floor(Math.random() * 50) + 20,
                        activations: Math.floor(Math.random() * 40) + 15
                    };
                });
                break;
            
            case 'month':
                const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                dailyRegistrations = months.map((month) => ({
                    time: month,
                    registrations: Math.floor(Math.random() * 800) + 400,
                    activations: Math.floor(Math.random() * 600) + 300
                }));
                break;
            
            case 'year':
                dailyRegistrations = Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - (4 - i);
                    return {
                        time: year.toString(),
                        registrations: Math.floor(Math.random() * 8000) + 4000,
                        activations: Math.floor(Math.random() * 6000) + 3000
                    };
                });
                break;
            
            default:
                dailyRegistrations = [];
        }

        return {
            registrationSources,
            userDemographics,
            conversionMetrics,
            dailyRegistrations
        };
    };

    useEffect(() => {
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
                    const topSellersData = generateTopSellersData(data.data);
                    const topProductsData = generateTopProductsData(data.data);
                    const newUserAnalyticsData = generateNewUserAnalytics(data.data, timePeriod);

                    setAnalyticsData({
                        salesTrend: salesTrendData,
                        categoryPerformance: categoryData,
                        revenueMetrics: calculateRevenueMetrics(data.data),
                        userGrowth: [],
                        topSellers: topSellersData,
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

        fetchData();
    }, [timePeriod, customDateMode, selectedDate.year, selectedDate.month, selectedDate.day, selectedDate.hour]);

    };

    // Advanced Calendar Picker Component
    const AdvancedCalendarPicker = ({ 
        startDate, 
        endDate, 
        startTime, 
        endTime, 
        onChange, 
        showTimeSelection = true,
        allowRangeSelection = true 
    }) => {
        const [isOpen, setIsOpen] = useState(false);
        const [currentMonth, setCurrentMonth] = useState(new Date());
        const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
        const [viewMode, setViewMode] = useState('calendar'); // 'calendar', 'month', 'year'
        const [tempRange, setTempRange] = useState({
            startDate: startDate || '',
            endDate: endDate || '',
            startTime: startTime || '00:00',
            endTime: endTime || '23:59'
        });

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        const years = Array.from({ length: 21 }, (_, i) => currentYear - 10 + i);

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

        const formatDateDisplay = () => {
            if (!tempRange.startDate && !tempRange.endDate) return 'Select date range';
            if (allowRangeSelection && tempRange.startDate && tempRange.endDate) {
                const start = new Date(tempRange.startDate).toLocaleDateString();
                const end = new Date(tempRange.endDate).toLocaleDateString();
                return `${start} - ${end}`;
            }
            if (tempRange.startDate) {
                return new Date(tempRange.startDate).toLocaleDateString();
            }
            return 'Select date';
        };

        const isDateInRange = (date) => {
            if (!tempRange.startDate || !tempRange.endDate) return false;
            const dateStr = date.toISOString().split('T')[0];
            return dateStr >= tempRange.startDate && dateStr <= tempRange.endDate;
        };

        const isDateSelected = (date) => {
            const dateStr = date.toISOString().split('T')[0];
            return dateStr === tempRange.startDate || dateStr === tempRange.endDate;
        };

        const handleDateClick = (date) => {
            const dateStr = date.toISOString().split('T')[0];
            
            if (!allowRangeSelection) {
                setTempRange(prev => ({ ...prev, startDate: dateStr, endDate: dateStr }));
                return;
            }

            if (!tempRange.startDate || (tempRange.startDate && tempRange.endDate)) {
                setTempRange(prev => ({ ...prev, startDate: dateStr, endDate: '' }));
            } else if (tempRange.startDate && !tempRange.endDate) {
                if (dateStr >= tempRange.startDate) {
                    setTempRange(prev => ({ ...prev, endDate: dateStr }));
                } else {
                    setTempRange(prev => ({ ...prev, startDate: dateStr, endDate: prev.startDate }));
                }
            }
        };

        const navigateMonth = (direction) => {
            const newMonth = new Date(currentMonth);
            newMonth.setMonth(currentMonth.getMonth() + direction);
            setCurrentMonth(newMonth);
        };

        const handleMonthSelect = (monthIndex) => {
            const newMonth = new Date(currentYear, monthIndex, 1);
            setCurrentMonth(newMonth);
            setViewMode('calendar');
        };

        const handleYearSelect = (year) => {
            setCurrentYear(year);
            const newMonth = new Date(year, currentMonth.getMonth(), 1);
            setCurrentMonth(newMonth);
            setViewMode('month');
        };

        const applyChanges = () => {
            onChange(tempRange);
            setIsOpen(false);
        };

        const resetToToday = () => {
            const today = new Date().toISOString().split('T')[0];
            const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
            setTempRange({
                startDate: lastWeek,
                endDate: today,
                startTime: '00:00',
                endTime: '23:59'
            });
        };

        const presetRanges = [
            { label: 'Today', start: 0, end: 0 },
            { label: 'Yesterday', start: 1, end: 1 },
            { label: 'Last 7 days', start: 7, end: 0 },
            { label: 'Last 30 days', start: 30, end: 0 },
            { label: 'This month', start: 'month', end: 0 },
            { label: 'Last month', start: 'lastMonth', end: 0 }
        ];

        const applyPreset = (preset) => {
            const today = new Date();
            let startDate, endDate;

            if (preset.start === 'month') {
                startDate = new Date(today.getFullYear(), today.getMonth(), 1);
                endDate = today;
            } else if (preset.start === 'lastMonth') {
                startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                endDate = new Date(today.getFullYear(), today.getMonth(), 0);
            } else {
                startDate = new Date(today.getTime() - preset.start * 24 * 60 * 60 * 1000);
                endDate = new Date(today.getTime() - preset.end * 24 * 60 * 60 * 1000);
            }

            setTempRange(prev => ({
                ...prev,
                startDate: startDate.toISOString().split('T')[0],
                endDate: endDate.toISOString().split('T')[0]
            }));
        };

        return (
            <div className="relative">
                <div
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer bg-white flex items-center justify-between hover:border-blue-400 transition-colors"
                >
                    <div className="flex items-center space-x-2">
                        <FaCalendarAlt className="text-blue-500" />
                        <span className={tempRange.startDate ? 'text-gray-900' : 'text-gray-500'}>
                            {formatDateDisplay()}
                        </span>
                        {showTimeSelection && (tempRange.startTime || tempRange.endTime) && (
                            <span className="text-sm text-gray-600">
                                {tempRange.startTime} - {tempRange.endTime}
                            </span>
                        )}
                    </div>
                    <FaChevronRight className={`text-gray-400 transform transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                </div>

                {isOpen && (
                    <div className="absolute z-50 mt-2 bg-white border border-gray-300 rounded-lg shadow-xl p-6 min-w-[600px]">
                        <div className="flex space-x-6">
                            {/* Preset Ranges */}
                            <div className="w-48">
                                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Select</h3>
                                <div className="space-y-1">
                                    {presetRanges.map((preset) => (
                                        <button
                                            key={preset.label}
                                            onClick={() => applyPreset(preset)}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded transition-colors"
                                            type="button"
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                    <button
                                        onClick={resetToToday}
                                        className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded transition-colors font-medium"
                                        type="button"
                                    >
                                        Reset to Last Week
                                    </button>
                                </div>
                            </div>

                            {/* Calendar */}
                            <div className="flex-1">
                                {/* Calendar Header */}
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => navigateMonth(-1)}
                                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                                            type="button"
                                        >
                                            <FaChevronLeft className="text-gray-600" />
                                        </button>
                                        
                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => setViewMode('month')}
                                                className="px-3 py-1 text-lg font-semibold text-gray-800 hover:bg-gray-100 rounded transition-colors"
                                                type="button"
                                            >
                                                {monthNames[currentMonth.getMonth()]}
                                            </button>
                                            <button
                                                onClick={() => setViewMode('year')}
                                                className="px-3 py-1 text-lg font-semibold text-gray-800 hover:bg-gray-100 rounded transition-colors"
                                                type="button"
                                            >
                                                {currentMonth.getFullYear()}
                                            </button>
                                        </div>

                                        <button
                                            onClick={() => navigateMonth(1)}
                                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                                            type="button"
                                        >
                                            <FaChevronRight className="text-gray-600" />
                                        </button>
                                    </div>
                                </div>

                                {/* Calendar Views */}
                                {viewMode === 'calendar' && (
                                    <>
                                        {/* Day Names */}
                                        <div className="grid grid-cols-7 mb-2">
                                            {dayNames.map(day => (
                                                <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                                                    {day}
                                                </div>
                                            ))}
                                        </div>

                                        {/* Calendar Days */}
                                        <div className="grid grid-cols-7 gap-1">
                                            {getDaysInMonth(currentMonth).map((date, index) => {
                                                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                                                const isSelected = isDateSelected(date);
                                                const isInRange = isDateInRange(date);
                                                const isToday = date.toDateString() === new Date().toDateString();

                                                return (
                                                    <button
                                                        key={index}
                                                        onClick={() => handleDateClick(date)}
                                                        type="button"
                                                        className={`
                                                            p-2 text-sm rounded transition-colors relative
                                                            ${!isCurrentMonth ? 'text-gray-300' : 'text-gray-900'}
                                                            ${isSelected ? 'bg-blue-600 text-white font-semibold' : ''}
                                                            ${isInRange && !isSelected ? 'bg-blue-100 text-blue-700' : ''}
                                                            ${isToday && !isSelected && !isInRange ? 'bg-blue-50 text-blue-600 font-semibold' : ''}
                                                            ${isCurrentMonth && !isSelected && !isInRange ? 'hover:bg-gray-100' : ''}
                                                        `}
                                                    >
                                                        {date.getDate()}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}

                                {viewMode === 'month' && (
                                    <div className="grid grid-cols-3 gap-2">
                                        {monthNames.map((month, index) => (
                                            <button
                                                key={month}
                                                onClick={() => handleMonthSelect(index)}
                                                className={`p-3 text-sm rounded transition-colors ${
                                                    index === currentMonth.getMonth()
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                                type="button"
                                            >
                                                {month}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {viewMode === 'year' && (
                                    <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                                        {years.map((year) => (
                                            <button
                                                key={year}
                                                onClick={() => handleYearSelect(year)}
                                                className={`p-3 text-sm rounded transition-colors ${
                                                    year === currentYear
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-gray-700 hover:bg-gray-100'
                                                }`}
                                                type="button"
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Time Selection */}
                                {showTimeSelection && viewMode === 'calendar' && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center">
                                            <FaClock className="mr-2" />
                                            Time Range
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">Start Time</label>
                                                <input
                                                    type="time"
                                                    value={tempRange.startTime}
                                                    onChange={(e) => setTempRange(prev => ({ ...prev, startTime: e.target.value }))}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1">End Time</label>
                                                <input
                                                    type="time"
                                                    value={tempRange.endTime}
                                                    onChange={(e) => setTempRange(prev => ({ ...prev, endTime: e.target.value }))}
                                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                {tempRange.startDate && tempRange.endDate && (
                                    <span>
                                        {Math.ceil((new Date(tempRange.endDate) - new Date(tempRange.startDate)) / (1000 * 60 * 60 * 24)) + 1} days selected
                                    </span>
                                )}
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded transition-colors"
                                    type="button"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={applyChanges}
                                    disabled={!tempRange.startDate}
                                    className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    type="button"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

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
                                    <option value="electronics">Electronics</option>
                                    <option value="clothing">Clothing</option>
                                    <option value="home">Home & Garden</option>
                                    <option value="sports">Sports</option>
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

                {/* Top Seller Revenue Card */}
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Top Seller Revenue</p>
                            <p className="text-2xl font-bold text-purple-600">
                                ${analyticsData.topSellers.length > 0 ? analyticsData.topSellers[0]?.totalSales?.toLocaleString() : '0'}
                            </p>
                        </div>
                        <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 100-8 4 4 0 000 8zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-sm text-purple-600">
                            {analyticsData.topSellers.length > 0 ? analyticsData.topSellers[0]?.name : 'No data'}
                        </span>
                        <span className="text-sm text-gray-500"> leading seller</span>
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
