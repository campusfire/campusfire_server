const winston = require('winston');
const logger = winston.createLogger({
    format: winston.format.combine(winston.format.timestamp(),
    winston.format.simple())
});

logger.add(new winston.transports.File({ filename: 'error.log', level: 'error' }))

module.exports = logger;