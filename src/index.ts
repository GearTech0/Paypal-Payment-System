import ExpressController from "./controllers/express.controller";
import Logger from "./controllers/logger.controller";

const logIndex = Logger.createChild({file: 'index.ts'});
const app = new ExpressController();
app.start();

Logger.children[logIndex].info(`PayPal backend started under setting: ${process.env.NODE_ENV || 'development'}`);