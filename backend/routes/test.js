const express = require('express');

const router = express.Router();

// Test with minimal routes first
router.get('/test', (req, res) => {
    res.json({ message: 'Test route working' });
});

module.exports = router
