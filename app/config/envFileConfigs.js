require('../config/env'); //gets from paths.js called from env.js file

const ENV_FILE = {
    appPort: process.env.APP_PORT,
    apiUrl: process.env.API_URL
}

module.exports = ENV_FILE

//https://codingsans.com/blog/node-config-best-practices
// REACT ACCESS CONFIG https://github.com/react-boilerplate/react-boilerplate/issues/1250
