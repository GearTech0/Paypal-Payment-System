import winston from 'winston';

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
    defaultMeta: {
        app: 'EBPI API Application'
    },
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: '../logs/debug.log' })
    ],
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
    )
});
console.log('Logger created');
export default Logger;