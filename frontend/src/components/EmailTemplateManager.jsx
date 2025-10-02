import React, { useState, useEffect } from 'react';

const EmailTemplateManager = () => {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingTemplate, setEditingTemplate] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        subject: '',
        htmlContent: '',
        type: 'general'
    });

    useEffect(() => {
        // Default email templates
        const defaultTemplates = [
            {
                id: 'password-reset',
                name: 'Password Reset',
                subject: 'Reset Your Password',
                type: 'authentication',
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Password Reset Request</h2>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                Hello,
                            </p>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                We received a request to reset your password. Click the button below to reset it:
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{{resetLink}}" style="background-color: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                                    Reset Password
                                </a>
                            </div>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                If you didn't request this password reset, please ignore this email. The link will expire in 1 hour.
                            </p>
                            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
                                <p style="color: #999; font-size: 14px; margin: 0;">
                                    This is an automated message, please do not reply to this email.
                                </p>
                            </div>
                        </div>
                    </div>
                `
            },
            {
                id: 'welcome',
                name: 'Welcome Email',
                subject: 'Welcome to Our Platform',
                type: 'general',
                htmlContent: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                            <h2 style="color: #333; text-align: center; margin-bottom: 30px;">Welcome to Our Platform!</h2>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                Hello {{userName}},
                            </p>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                Thank you for joining our platform. We're excited to have you on board!
                            </p>
                            <div style="text-align: center; margin: 30px 0;">
                                <a href="{{loginLink}}" style="background-color: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                                    Get Started
                                </a>
                            </div>
                            <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
                                If you have any questions, feel free to contact our support team.
                            </p>
                            <div style="border-top: 1px solid #eee; margin-top: 30px; padding-top: 20px; text-align: center;">
                                <p style="color: #999; font-size: 14px; margin: 0;">
                                    Best regards,<br>The Team
                                </p>
                            </div>
                        </div>
                    </div>
                `
            }
        ];

        // Initialize with default templates
        setTemplates(defaultTemplates);
        setLoading(false);
    }, []);

    const handleEdit = (template) => {
        setEditingTemplate(template.id);
        setFormData({
            name: template.name,
            subject: template.subject,
            htmlContent: template.htmlContent,
            type: template.type
        });
    };

    const handleSave = () => {
        if (!formData.name || !formData.subject || !formData.htmlContent) {
            setError('Please fill in all fields');
            return;
        }

        setTemplates(templates.map(template => 
            template.id === editingTemplate 
                ? { ...template, ...formData }
                : template
        ));

        setEditingTemplate(null);
        setFormData({
            name: '',
            subject: '',
            htmlContent: '',
            type: 'general'
        });
        setError('');
    };

    const handleCancel = () => {
        setEditingTemplate(null);
        setFormData({
            name: '',
            subject: '',
            htmlContent: '',
            type: 'general'
        });
        setError('');
    };

    const previewTemplate = (template) => {
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(template.htmlContent);
        previewWindow.document.close();
    };

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '16px', color: '#666' }}>Loading email templates...</div>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
            <div style={{ 
                marginBottom: '30px',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
                <h2 style={{ margin: '0 0 10px 0', color: '#333' }}>Email Template Manager</h2>
                <p style={{ margin: '0', color: '#666' }}>Manage email templates used throughout the system</p>
            </div>

            {error && (
                <div style={{
                    backgroundColor: '#f8d7da',
                    color: '#721c24',
                    padding: '12px 20px',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    border: '1px solid #f5c6cb'
                }}>
                    {error}
                </div>
            )}

            <div className="templates-grid">
                {templates.map((template) => (
                    <div key={template.id} className="template-card">
                        <div className="template-header">
                            <h3>{template.name}</h3>
                            <span className={`template-type ${template.type}`}>
                                {template.type}
                            </span>
                        </div>
                        
                        <div className="template-info">
                            <p><strong>Subject:</strong> {template.subject}</p>
                        </div>

                        <div className="template-actions">
                            <button 
                                className="btn btn-secondary"
                                onClick={() => previewTemplate(template)}
                            >
                                Preview
                            </button>
                            <button 
                                className="btn btn-primary"
                                onClick={() => handleEdit(template)}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {editingTemplate && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h3>Edit Email Template</h3>
                            <button className="close-btn" onClick={handleCancel}>×</button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Template Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    placeholder="Enter template name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Subject Line</label>
                                <input
                                    type="text"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    placeholder="Enter email subject"
                                />
                            </div>

                            <div className="form-group">
                                <label>Template Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                                >
                                    <option value="general">General</option>
                                    <option value="authentication">Authentication</option>
                                    <option value="notification">Notification</option>
                                    <option value="marketing">Marketing</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>HTML Content</label>
                                <textarea
                                    value={formData.htmlContent}
                                    onChange={(e) => setFormData({...formData, htmlContent: e.target.value})}
                                    placeholder="Enter HTML content..."
                                    rows="15"
                                    style={{fontFamily: 'monospace', fontSize: '14px'}}
                                />
                            </div>

                            <div className="template-variables">
                                <h4>Available Variables:</h4>
                                <div className="variables-list">
                                    <span className="variable">{'{{userName}}'}</span>
                                    <span className="variable">{'{{resetLink}}'}</span>
                                    <span className="variable">{'{{loginLink}}'}</span>
                                    <span className="variable">{'{{supportEmail}}'}</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                            <button className="btn btn-primary" onClick={handleSave}>
                                Save Template
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .templates-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .template-card {
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .template-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                .template-header h3 {
                    margin: 0;
                    color: #333;
                }

                .template-type {
                    padding: 4px 8px;
                    border-radius: 12px;
                    font-size: 12px;
                    font-weight: 500;
                    text-transform: capitalize;
                }

                .template-type.general {
                    background-color: #e3f2fd;
                    color: #1976d2;
                }

                .template-type.authentication {
                    background-color: #f3e5f5;
                    color: #7b1fa2;
                }

                .template-type.notification {
                    background-color: #e8f5e8;
                    color: #388e3c;
                }

                .template-type.marketing {
                    background-color: #fff3e0;
                    color: #f57c00;
                }

                .template-info p {
                    margin: 0;
                    color: #666;
                    font-size: 14px;
                }

                .template-actions {
                    display: flex;
                    gap: 10px;
                    margin-top: 15px;
                }

                .template-actions .btn {
                    flex: 1;
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                }

                .btn-secondary {
                    background-color: #6c757d;
                    color: white;
                }

                .btn-primary {
                    background-color: #007bff;
                    color: white;
                }

                .btn:hover {
                    opacity: 0.9;
                }

                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background-color: rgba(0,0,0,0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .modal-content {
                    background: white;
                    border-radius: 8px;
                    width: 90%;
                    max-width: 800px;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #ddd;
                }

                .modal-header h3 {
                    margin: 0;
                }

                .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                }

                .modal-body {
                    padding: 20px;
                }

                .form-group {
                    margin-bottom: 20px;
                }

                .form-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: #333;
                }

                .form-group input,
                .form-group select,
                .form-group textarea {
                    width: 100%;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                }

                .form-group textarea {
                    resize: vertical;
                    min-height: 200px;
                }

                .template-variables {
                    margin-top: 20px;
                    padding: 15px;
                    background-color: #f8f9fa;
                    border-radius: 4px;
                }

                .template-variables h4 {
                    margin: 0 0 10px 0;
                    color: #333;
                    font-size: 14px;
                }

                .variables-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .variable {
                    background-color: #e9ecef;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-family: monospace;
                    font-size: 12px;
                    color: #495057;
                }

                .modal-footer {
                    padding: 20px;
                    border-top: 1px solid #ddd;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                }
            `}</style>
        </div>
    );
};

export default EmailTemplateManager;