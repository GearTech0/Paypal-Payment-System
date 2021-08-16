import winston from 'winston';

const logFormat = winston.format.printf(({level, message, file, app, timestamp}) => {
    return `${timestamp} [${level}] ${app} <${file}> ${message}`;
});

class LoggerController {
    private logger: winston.Logger;
    
    constructor(opts: winston.LoggerOptions) {
        this.logger = winston.createLogger(opts);
    }

    public GetLogger(): winston.Logger {
        return this.logger;
    }

    public createChild(opts: Object): winston.Logger {
        return this.logger.child(opts);
    }
}

const Logger = new LoggerController({
    level:(process.env.NODE_ENV == 'production') ? 'info' : 'debug',
    defaultMeta: {
        app: 'EBPI API Application'
    },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: `debug.log` })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        logFormat
    )
});
console.log('Logger created');
export default Logger;