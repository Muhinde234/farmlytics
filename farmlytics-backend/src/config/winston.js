const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const config = require('./index'); 
const fs = require('fs');
const logDirectory = path.join(__dirname, '../../logs'); 


if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}


const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }), 
  winston.format.splat(), 
  winston.format.colorize(),
  winston.format.printf(info => {
    const message = typeof info.message === 'object' ? JSON.stringify(info.message, null, 2) : info.message;
    const meta = info.meta ? JSON.stringify(info.meta, null, 2) : '';
    return `${info.timestamp} ${info.level}: ${message} ${meta}`;
  })
);

const jsonLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);


const transports = [
  new winston.transports.Console({
    format: logFormat,
    level: config.nodeEnv === 'production' ? 'info' : 'debug', 
    handleExceptions: true, 
  }),
  new DailyRotateFile({
    filename: path.join(logDirectory, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m', 
    maxFiles: '14d', 
    level: 'info',
    format: jsonLogFormat, 
  }),
  new DailyRotateFile({
    filename: path.join(logDirectory, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error', 
    format: jsonLogFormat, 
  }),
];

const logger = winston.createLogger({
  levels: winston.config.npm.levels, 
  transports: transports,
  exitOnError: false, 
});


logger.stream = {
  write: function(message, encoding) {
    logger.info(message.trim()); 
  },
};

module.exports = logger;
