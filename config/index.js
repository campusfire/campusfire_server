let env = process.env.NODE_ENV || 'prod';

console.log('env: ' + env);

let config = require(`./${env}`);

module.exports = config;
