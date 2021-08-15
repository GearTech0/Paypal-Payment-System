import ExpressController from "./controllers/express.controller";

const app = new ExpressController();
app.start();

console.log(`PayPal backend started under setting: ${process.env.NODE_ENV || 'development'}`);