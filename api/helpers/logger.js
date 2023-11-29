const winston = require('winston');


const logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
});


const logRequestBody = (req, res, next) => {
    logger.info('Request Body:', req.body);
    next();
}


module.exports = { logRequestBody }