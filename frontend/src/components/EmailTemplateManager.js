import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SummaryApi from '../common';

const EmailTemplateManager = () => {
    const [templates, setTemplates] = useState([]);
    const [activeTab, setActiveTab] = useState('list');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [previewData, setPreviewData] = useState(null);

    const [formData, setFormData] = useState({
        templateType: '',
        subject: '',
        htmlContent: '',
        variables: []
    });

    const templateTypes = [
        { value: 'orderConfirmation', label: 'Order Confirmation' },
        { value: 'passwordReset', label: 'Password Reset' },
        { value: 'contactForm', label: 'Contact Form' },
        { value: 'orderUpdate', label: 'Order Update' }
    ];

    useEffect(() => {
        fetchTemplates();
    }, []);

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const response = await fetch(SummaryApi.getAllEmailTemplates.url, {
                method: SummaryApi.getAllEmailTemplates.method,
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setTemplates(data.data);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to fetch email templates');
        } finally {
            setLoading(false);
        }
    };

    const fetchTemplate = async (templateType) => {
        try {
            const response = await fetch(SummaryApi.getEmailTemplate.url.replace(':templateType', templateType), {
                method: SummaryApi.getEmailTemplate.method,
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                setFormData({
                    templateType: data.data.templateType,
                    subject: data.data.subject,
                    htmlContent: data.data.htmlContent,
                    variables: data.data.variables || []
                });
                setActiveTab('edit');
                setIsEditing(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to fetch template');
        }
    };

    const saveTemplate = async () => {
        if (!formData.templateType || !formData.subject || !formData.htmlContent) {
            toast.error('Please fill in all required fields');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(SummaryApi.saveEmailTemplate.url, {
                method: SummaryApi.saveEmailTemplate.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            
            if (data.success) {
                toast.success('Template saved successfully');
                fetchTemplates();
                setActiveTab('list');
                resetForm();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to save template');
        } finally {
            setLoading(false);
        }
    };

    const deleteTemplate = async (templateType) => {
        if (!window.confirm('Are you sure you want to delete this template? The default template will be used instead.')) {
            return;
        }

        try {
            const response = await fetch(SummaryApi.deleteEmailTemplate.url.replace(':templateType', templateType), {
                method: SummaryApi.deleteEmailTemplate.method,
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                toast.success('Template deleted successfully');
                fetchTemplates();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to delete template');
        }
    };

    const toggleTemplateStatus = async (templateType) => {
        try {
            const response = await fetch(SummaryApi.toggleEmailTemplate.url.replace(':templateType', templateType), {
                method: SummaryApi.toggleEmailTemplate.method,
                credentials: 'include'
            });
            const data = await response.json();
            
            if (data.success) {
                toast.success(data.message);
                fetchTemplates();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to update template status');
        }
    };

    const previewTemplate = async () => {
        if (!formData.htmlContent || !formData.subject) {
            toast.error('Please enter subject and content to preview');
            return;
        }

        try {
            const response = await fetch(SummaryApi.previewEmailTemplate.url, {
                method: SummaryApi.previewEmailTemplate.method,
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    templateType: formData.templateType,
                    subject: formData.subject,
                    htmlContent: formData.htmlContent
                })
            });
            const data = await response.json();
            
            if (data.success) {
                setPreviewData(data.data);
                setActiveTab('preview');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error('Failed to generate preview');
        }
    };

    const resetForm = () => {
        setFormData({
            templateType: '',
            subject: '',
            htmlContent: '',
            variables: []
        });
        setIsEditing(false);
        setPreviewData(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const insertVariable = (variable) => {
        const textarea = document.getElementById('htmlContent');
        const cursorPosition = textarea.selectionStart;
        const textBefore = formData.htmlContent.substring(0, cursorPosition);
        const textAfter = formData.htmlContent.substring(cursorPosition);
        
        setFormData(prev => ({
            ...prev,
            htmlContent: textBefore + variable.placeholder + textAfter
        }));
    };

    const getAvailableVariables = () => {
        const commonVariables = [
            { name: 'customerName', placeholder: '{{customerName}}', description: 'Customer name' },
            { name: 'userName', placeholder: '{{userName}}', description: 'User name' }
        ];

        switch (formData.templateType) {
            case 'orderConfirmation':
                return [
                    ...commonVariables,
                    { name: 'orderId', placeholder: '{{orderId}}', description: 'Order ID' },
                    { name: 'trackingNumber', placeholder: '{{trackingNumber}}', description: 'Tracking number' },
                    { name: 'totalAmount', placeholder: '{{totalAmount}}', description: 'Total amount' },
                    { name: 'productName', placeholder: '{{productName}}', description: 'Product name' },
                    { name: 'brandName', placeholder: '{{brandName}}', description: 'Brand name' },
                    { name: 'quantity', placeholder: '{{quantity}}', description: 'Quantity' },
                    { name: 'orderDate', placeholder: '{{orderDate}}', description: 'Order date' },
                    { name: 'estimatedDelivery', placeholder: '{{estimatedDelivery}}', description: 'Estimated delivery' }
                ];
            case 'passwordReset':
                return [
                    ...commonVariables,
                    { name: 'resetLink', placeholder: '{{resetLink}}', description: 'Password reset link' }
                ];
            case 'contactForm':
                return [
                    { name: 'senderName', placeholder: '{{senderName}}', description: 'Sender name' },
                    { name: 'senderEmail', placeholder: '{{senderEmail}}', description: 'Sender email' },
                    { name: 'messageSubject', placeholder: '{{messageSubject}}', description: 'Message subject' },
                    { name: 'messageContent', placeholder: '{{messageContent}}', description: 'Message content' }
                ];
            default:
                return commonVariables;
        }
    };

    return (
        <div className="p-6 bg-white">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Email Template Manager</h2>
                <button
                    onClick={() => {
                        resetForm();
                        setActiveTab('edit');
                    }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Create New Template
                </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex space-x-1 mb-6">
                <button
                    onClick={() => setActiveTab('list')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'list' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Templates List
                </button>
                <button
                    onClick={() => setActiveTab('edit')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'edit' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Edit Template
                </button>
                {previewData && (
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            activeTab === 'preview' 
                                ? 'bg-blue-600 text-white' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Preview
                    </button>
                )}
            </div>

            {/* Templates List Tab */}
            {activeTab === 'list' && (
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Existing Templates</h3>
                    {loading ? (
                        <div className="text-center py-8">Loading templates...</div>
                    ) : (
                        <div className="grid gap-4">
                            {templates.map((template) => (
                                <div key={template.templateType} className="bg-white p-4 rounded-lg border">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-lg">
                                                {templateTypes.find(t => t.value === template.templateType)?.label || template.templateType}
                                            </h4>
                                            <p className="text-gray-600 mb-2">{template.subject}</p>
                                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                                <span>Status: 
                                                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                                        template.isActive 
                                                            ? 'bg-green-100 text-green-800' 
                                                            : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {template.isActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </span>
                                                <span>Modified: {new Date(template.lastModified).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => fetchTemplate(template.templateType)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => toggleTemplateStatus(template.templateType)}
                                                className={`px-3 py-1 rounded text-sm ${
                                                    template.isActive 
                                                        ? 'bg-orange-500 text-white hover:bg-orange-600' 
                                                        : 'bg-green-500 text-white hover:bg-green-600'
                                                }`}
                                            >
                                                {template.isActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                            <button
                                                onClick={() => deleteTemplate(template.templateType)}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {templates.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    No custom templates found. Default templates will be used.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Edit Template Tab */}
            {activeTab === 'edit' && (
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">
                        {isEditing ? 'Edit Template' : 'Create New Template'}
                    </h3>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Form */}
                        <div className="lg:col-span-2 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Template Type *
                                </label>
                                <select
                                    name="templateType"
                                    value={formData.templateType}
                                    onChange={handleInputChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={isEditing}
                                >
                                    <option value="">Select template type</option>
                                    {templateTypes.map(type => (
                                        <option key={type.value} value={type.value}>
                                            {type.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="Email subject line"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    HTML Content *
                                </label>
                                <textarea
                                    id="htmlContent"
                                    name="htmlContent"
                                    value={formData.htmlContent}
                                    onChange={handleInputChange}
                                    placeholder="HTML email template content"
                                    rows={20}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                                />
                            </div>

                            <div className="flex space-x-3">
                                <button
                                    onClick={saveTemplate}
                                    disabled={loading}
                                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    {loading ? 'Saving...' : 'Save Template'}
                                </button>
                                <button
                                    onClick={previewTemplate}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Preview
                                </button>
                                <button
                                    onClick={() => {
                                        resetForm();
                                        setActiveTab('list');
                                    }}
                                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>

                        {/* Variables Sidebar */}
                        <div className="bg-white p-4 rounded-lg border">
                            <h4 className="font-semibold mb-3">Available Variables</h4>
                            {formData.templateType ? (
                                <div className="space-y-2">
                                    {getAvailableVariables().map((variable) => (
                                        <div key={variable.name} className="border-b pb-2">
                                            <button
                                                onClick={() => insertVariable(variable)}
                                                className="w-full text-left p-2 hover:bg-gray-50 rounded transition-colors"
                                            >
                                                <div className="font-mono text-sm text-blue-600">
                                                    {variable.placeholder}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {variable.description}
                                                </div>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 text-sm">
                                    Select a template type to see available variables
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Preview Tab */}
            {activeTab === 'preview' && previewData && (
                <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold mb-4">Email Preview</h3>
                    <div className="bg-white rounded-lg border p-4 mb-4">
                        <div className="border-b pb-3 mb-4">
                            <div className="text-sm text-gray-600">Subject:</div>
                            <div className="font-semibold">{previewData.subject}</div>
                        </div>
                        <div className="border rounded p-4" style={{ maxHeight: '600px', overflow: 'auto' }}>
                            <div dangerouslySetInnerHTML={{ __html: previewData.htmlContent }} />
                        </div>
                    </div>
                    <button
                        onClick={() => setActiveTab('edit')}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Edit
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmailTemplateManager;
