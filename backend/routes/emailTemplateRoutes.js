const express = require('express');
const router = express.Router();

const {
    getAllTemplates,
    getTemplateByType,
    saveTemplate,
    deleteTemplate,
    toggleTemplateStatus,
    previewTemplate
} = require('../controller/emailTemplateController');

const authToken = require('../middleware/authToken');

// Get all email templates (admin only)
router.get('/templates', authToken, getAllTemplates);

// Get specific template by type (admin only)
router.get('/templates/:templateType', authToken, getTemplateByType);

// Create or update template (admin only)
router.post('/templates', authToken, saveTemplate);

// Delete template (admin only)
router.delete('/templates/:templateType', authToken, deleteTemplate);

// Toggle template active status (admin only)
router.patch('/templates/:templateType/toggle', authToken, toggleTemplateStatus);

// Preview template with sample data (admin only)
router.post('/templates/preview', authToken, previewTemplate);

module.exports = router;
