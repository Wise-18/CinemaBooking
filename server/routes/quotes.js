const express = require('express');
const router = express.Router();
const axios = require('axios');

// Route to get a random cat fact
router.get('/quote', async (req, res) => {
    try {
        const response = await axios.get('https://catfact.ninja/fact');
        res.json({ content: response.data.fact, author: 'Cat Fact' });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching quote' });
    }
});


// Route to get exchange rate
router.get('/exchange-rate', async (req, res) => {
    try {
        const response = await axios.get('https://open.er-api.com/v6/latest/USD');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exchange rate' });
    }
});

module.exports = router;
