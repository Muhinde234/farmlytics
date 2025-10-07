const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const config = require('./index'); // Import our config for NODE_ENV
const fs = require('fs');
const logDirectory = path.join(__dirname, '../../logs'); // Log files will be in farmlytics-backend/logs

// Ensure the log directory exists
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

// Define log formats
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }), // Include stack trace for errors
  winston.format.splat(), // Enable string interpolation
  winston.format.colorize(), // Colorize output for console
  winston.format.printf(info => {
    // If log is an object, stringify it
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

// Define transports
const transports = [
  new winston.transports.Console({
    format: logFormat,
    level: config.nodeEnv === 'production' ? 'info' : 'debug', // Console shows info in prod, debug in dev
    handleExceptions: true, // Catch uncaught exceptions
  }),
  new DailyRotateFile({
    filename: path.join(logDirectory, 'application-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m', // Rotate file if size exceeds 20MB
    maxFiles: '14d', // Keep logs for 14 days
    level: 'info', // File logs all info and above
    format: jsonLogFormat, // Use JSON format for file logs
  }),
  new DailyRotateFile({
    filename: path.join(logDirectory, 'error-%DATE%.log'),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
    level: 'error', // Error file logs only errors
    format: jsonLogFormat, // Use JSON format for file logs
  }),
];

const logger = winston.createLogger({
  levels: winston.config.npm.levels, // Use standard npm log levels (error, warn, info, http, verbose, debug, silly)
  transports: transports,
  exitOnError: false, // Do not exit on handled exceptions.
});

// Create a stream object that Winston can log to, compatible with Morgan or Express
logger.stream = {
  write: function(message, encoding) {
    logger.info(message.trim()); // Morgan passes a newline at the end, so trim it
  },
};

module.exports = logger;