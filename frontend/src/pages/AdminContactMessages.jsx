import React, { useState, useEffect } from 'react';

const AdminContactMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [adminNotes, setAdminNotes] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    const fetchMessages = async () => {
        try {
            setLoading(true);
            const url = filterStatus === 'all' 
                ? 'http://localhost:8080/api/admin/contact-messages'
                : `http://localhost:8080/api/admin/contact-messages?status=${filterStatus}`;
            
            const response = await fetch(url, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                const data = await response.json();
                // The backend returns data in data.messages, not data.data
                const messagesArray = Array.isArray(data.data?.messages) ? data.data.messages : 
                                     Array.isArray(data.messages) ? data.messages : 
                                     Array.isArray(data.data) ? data.data : 
                                     Array.isArray(data) ? data : [];
                setMessages(messagesArray);
            } else {
                console.error('API Error:', response.status, response.statusText);
                setMessages([]); // Ensure array is set
                setError('Failed to fetch messages');
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
            setMessages([]); // Ensure array is set on error
            setError('Network error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterStatus]);

    const updateMessageStatus = async (messageId, status, notes = '') => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/admin/contact-messages/${messageId}/status`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status,
                    adminNotes: notes
                })
            });

            if (response.ok) {
                fetchMessages(); // Refresh the list
                setSelectedMessage(null);
                setAdminNotes('');
            } else {
                setError('Failed to update message status');
            }
        } catch (error) {
            console.error('Error updating message:', error);
            setError('Network error occurred');
        }
    };

    const deleteMessage = async (messageId) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/admin/contact-messages/${messageId}`, {
                method: 'DELETE',
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                fetchMessages(); // Refresh the list
                setSelectedMessage(null);
            } else {
                setError('Failed to delete message');
            }
        } catch (error) {
            console.error('Error deleting message:', error);
            setError('Network error occurred');
        }
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'unread':
                return 'bg-red-100 text-red-800';
            case 'read':
                return 'bg-yellow-100 text-yellow-800';
            case 'replied':
                return 'bg-green-100 text-green-800';
            case 'archived':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString();
    };

    // Ensure messages is always an array
    const safeMessages = Array.isArray(messages) ? messages : [];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading contact messages...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
                    <p className="text-gray-600 mt-2">Manage customer inquiries and support requests</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                {/* Filter Controls */}
                <div className="bg-white rounded-lg shadow mb-6 p-4">
                    <div className="flex flex-wrap gap-4 items-center">
                        <label className="font-medium text-gray-700">Filter by status:</label>
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">All Messages</option>
                            <option value="unread">Unread</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                        </select>
                        <button
                            onClick={fetchMessages}
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                        >
                            Refresh
                        </button>
                    </div>
                </div>

                {safeMessages.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center">
                        <p className="text-gray-500 text-lg">No contact messages found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Messages List */}
                        <div className="space-y-4">
                            {Array.isArray(safeMessages) && safeMessages.length > 0 ? (
                                safeMessages.map((message) => (
                                <div
                                    key={message._id}
                                    className={`bg-white rounded-lg shadow p-6 cursor-pointer transition duration-200 hover:shadow-md ${
                                        selectedMessage?._id === message._id ? 'ring-2 ring-blue-500' : ''
                                    }`}
                                    onClick={() => setSelectedMessage(message)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{message.name}</h3>
                                            <p className="text-sm text-gray-600">{message.email}</p>
                                        </div>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(message.status)}`}>
                                            {message.status}
                                        </span>
                                    </div>
                                    <h4 className="font-medium text-gray-800 mb-2">{message.subject}</h4>
                                    <p className="text-gray-600 text-sm line-clamp-3">{message.message}</p>
                                    <p className="text-xs text-gray-500 mt-3">{formatDate(message.createdAt)}</p>
                                </div>
                            ))
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No messages found</p>
                                </div>
                            )}
                        </div>

                        {/* Message Details */}
                        <div className="lg:sticky lg:top-4">
                            {selectedMessage ? (
                                <div className="bg-white rounded-lg shadow p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-semibold text-gray-900">Message Details</h2>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(selectedMessage.status)}`}>
                                            {selectedMessage.status}
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">From:</label>
                                            <p className="text-gray-900">{selectedMessage.name}</p>
                                            <p className="text-gray-600 text-sm">{selectedMessage.email}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Subject:</label>
                                            <p className="text-gray-900">{selectedMessage.subject}</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Message:</label>
                                            <div className="bg-gray-50 p-3 rounded-md">
                                                <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Received:</label>
                                            <p className="text-gray-600">{formatDate(selectedMessage.createdAt)}</p>
                                        </div>

                                        {selectedMessage.adminNotes && (
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700">Admin Notes:</label>
                                                <div className="bg-blue-50 p-3 rounded-md">
                                                    <p className="text-gray-900">{selectedMessage.adminNotes}</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Admin Actions */}
                                        <div className="border-t pt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes:</label>
                                            <textarea
                                                value={adminNotes}
                                                onChange={(e) => setAdminNotes(e.target.value)}
                                                placeholder="Add notes about this message..."
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => updateMessageStatus(selectedMessage._id, 'read', adminNotes)}
                                                className="bg-yellow-600 text-white px-3 py-2 rounded-md hover:bg-yellow-700 transition duration-200 text-sm"
                                            >
                                                Mark Read
                                            </button>
                                            <button
                                                onClick={() => updateMessageStatus(selectedMessage._id, 'replied', adminNotes)}
                                                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition duration-200 text-sm"
                                            >
                                                Mark Replied
                                            </button>
                                            <button
                                                onClick={() => updateMessageStatus(selectedMessage._id, 'archived', adminNotes)}
                                                className="bg-gray-600 text-white px-3 py-2 rounded-md hover:bg-gray-700 transition duration-200 text-sm"
                                            >
                                                Archive
                                            </button>
                                            <button
                                                onClick={() => deleteMessage(selectedMessage._id)}
                                                className="bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700 transition duration-200 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>

                                        <div className="mt-4">
                                            <a
                                                href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                                className="inline-flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                                            >
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                </svg>
                                                Reply via Email
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow p-6 text-center">
                                    <p className="text-gray-500">Select a message to view details</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminContactMessages;
