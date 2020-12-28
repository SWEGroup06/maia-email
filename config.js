
const DEBUG = process.argv.includes('--dev') || false;

module.exports = {
    DEBUG,
    url:  DEBUG ? 'http://localhost:3000' : 'https://maia-email.herokuapp.com',
    serverURL: 'https://maia-server.herokuapp.com',
    email: 'maiacalendar123@gmail.com'
};
