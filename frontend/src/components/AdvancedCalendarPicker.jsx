import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

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

export default AdvancedCalendarPicker;
