const mongoose = require('mongoose');

// Admin-editable site content (footer, contact details, hero slides, pages...).
// Stored in MongoDB because the server's filesystem is reset on every deploy/restart,
// which silently discarded edits saved to data/siteContent.json.
const siteContentSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true,
        default: 'main'
    },
    sections: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true,
    minimize: false
});

module.exports = mongoose.model('SiteContent', siteContentSchema);
