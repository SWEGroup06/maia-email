// Config
const CONFIG = require('../config.js');

// Modules
const axios = require('axios');

const context = {
    _request: async function(path, params) {
        // Encode each parameter for each request
        Object.keys(params).forEach(p => params[p] = encodeURIComponent(JSON.stringify(params[p])));
    
        // Make GET request
        const res = await axios.get(CONFIG.serverURL + path, {params});
        return res.data;
    },
    login: function(googleEmail) {
        return context._request('/auth/login', {googleEmail});
    },
    logout: function(googleEmail) {
        return context._request('/auth/logout', {googleEmail});
    },
    nlp: function(text) {
        return context._request('/nlp', {text});
    }
}

module.exports = context;