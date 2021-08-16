import ExpressController from "./controllers/express.controller";
import Logger from "./controllers/logger.controller";

const rootLogger = Logger.createChild({file: 'index.ts'});
const app = new ExpressController();
app.start();

rootLogger.info(`PayPal backend started under setting: ${process.env.NODE_ENV || 'development'}`);