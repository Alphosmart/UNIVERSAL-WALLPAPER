import React, { useState } from 'react';
import useSiteContent from '../hooks/useSiteContent';
import SummaryApi from '../common';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState('');

    const { content, loading } = useSiteContent('contactUs');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitMessage('');

        try {
            const response = await fetch(SummaryApi.contactUs.url, {
                method: SummaryApi.contactUs.method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitMessage('Thank you for your message! We will get back to you soon.');
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            } else {
                setSubmitMessage(data.message || 'Something went wrong. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting contact form:', error);
            setSubmitMessage('Network error. Please check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Use dynamic content or fallback to defaults
    const defaultContent = {
        title: "Contact Us",
        subtitle: "We're here to help! Get in touch with our team for any questions, support, or feedback.",
        businessInfo: {
            address: "123 E-Commerce Street\nBusiness District\nCity, State 12345",
            phone: "+1 (555) 123-4567",
            email: "support@ashamsmart.com",
            hours: "Mon-Fri 9am-6pm"
        },
        responseInfo: {
            emailResponse: "24-48 hours",
            phoneHours: "Mon-Fri 9AM-6PM",
            liveChatHours: "Mon-Fri 9AM-6PM"
        }
    };

    const pageContent = {
        ...defaultContent,
        ...content,
        businessInfo: {
            ...defaultContent.businessInfo,
            ...(content?.businessInfo || {})
        },
        responseInfo: {
            ...defaultContent.responseInfo,
            ...(content?.responseInfo || {})
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        {pageContent.title}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {pageContent.subtitle}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Your full name"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="your.email@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="What's this about?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    required
                                    rows={6}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Tell us how we can help you..."
                                />
                            </div>

                            {submitMessage && (
                                <div className={`p-4 rounded-lg ${submitMessage.includes('Thank you') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                    {submitMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-3 px-6 rounded-lg font-medium transition duration-200 ${
                                    isSubmitting 
                                        ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-8">
                        {/* Business Info */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
                            <div className="space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Address</h3>
                                        <p className="text-gray-600 whitespace-pre-line">
                                            {pageContent.businessInfo.address}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Phone</h3>
                                        <p className="text-gray-600">{pageContent.businessInfo.phone}</p>
                                        <p className="text-sm text-gray-500">{pageContent.responseInfo.phoneHours}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Email</h3>
                                        <p className="text-gray-600">{pageContent.businessInfo.email}</p>
                                        <p className="text-sm text-gray-500">We'll respond within {pageContent.responseInfo.emailResponse}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">Business Hours</h3>
                                        <p className="text-gray-600">{pageContent.businessInfo.hours}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Help */}
                        <div className="bg-white rounded-lg shadow-lg p-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Help</h2>
                            <div className="space-y-4">
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <h3 className="font-medium text-gray-900">Order Support</h3>
                                    <p className="text-gray-600">Need help with an existing order? Track your package or get delivery updates.</p>
                                </div>
                                <div className="border-l-4 border-green-500 pl-4">
                                    <h3 className="font-medium text-gray-900">Product Questions</h3>
                                    <p className="text-gray-600">Have questions about a product? We're here to help you make the right choice.</p>
                                </div>
                                <div className="border-l-4 border-purple-500 pl-4">
                                    <h3 className="font-medium text-gray-900">Technical Support</h3>
                                    <p className="text-gray-600">Experiencing technical issues? Our support team can help resolve any problems.</p>
                                </div>
                                <div className="border-l-4 border-red-500 pl-4">
                                    <h3 className="font-medium text-gray-900">Returns & Refunds</h3>
                                    <p className="text-gray-600">Need to return an item? Learn about our return policy and process.</p>
                                </div>
                            </div>
                        </div>

                        {/* Response Time Info */}
                        <div className="bg-blue-50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-blue-900 mb-3">Response Times</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Email Support:</span>
                                    <span className="text-blue-900 font-medium">{pageContent.responseInfo.emailResponse}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Phone Support:</span>
                                    <span className="text-blue-900 font-medium">{pageContent.responseInfo.phoneHours}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-blue-700">Live Chat:</span>
                                    <span className="text-blue-900 font-medium">{pageContent.responseInfo.liveChatHours}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
