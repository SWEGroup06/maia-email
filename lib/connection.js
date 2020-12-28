// Config
const CONFIG = require('../config.js');

// Modules
const axios = require('axios');

const context = {
    login: async (email) => {
        const res = await axios.get(CONFIG.serverURL + '/auth/login', { 
            params: {
                userID: encodeURIComponent(JSON.stringify(-1)),
                email: encodeURIComponent(JSON.stringify(email)),
            }
        });
        return res.data;
    },
    logout: async (email) => {
        const res = await axios.get(CONFIG.serverURL + '/auth/logout', { 
            params: {
                email: encodeURIComponent(JSON.stringify(email)),
            }
        });
        return res.data;
    }
}

module.exports = context;