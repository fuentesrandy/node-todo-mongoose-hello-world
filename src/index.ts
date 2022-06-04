import express, { Request, Response, NextFunction } from 'express';
import dotenv from "dotenv";
import mongoose from "mongoose"
import morgan from 'morgan'; // app level logging
import logger, {chalk} from "./logger"
//routes
import { todoRouter } from "./routes/todo"

// initialize configuration
dotenv.config();

const PORT = process.env.SERVER_PORT || 8181;


const main = express();


//#region  Testing Sub App
const subApp = express();
subApp.on('mount', function (parent) {
    logger.debug(`** Sub App Mounted on path's ${chalk.yellow(subApp.mountpath)}`)
});
subApp.use(function (req, res, next) {
    logger.debug(`${chalk.whiteBright("subApp")} Middleware `)
    next()
});
//#endregion

//#region Middleware registration ,** order matters **
main.use(morgan('tiny')); // app level logging
main.use(express.json()); // to support JSON - encoded bodies,application/json
main.use(express.urlencoded({     // to support URL-encoded bodies,application/x-www-form-urlencoded
    extended: true
}));
main.all('*',function(req, res, next){
    logger.debug(`${chalk.white(`All routes pass through here. ${chalk.bold(chalk.yellow("Main App"))}`)} Middleware`)

    // can use something like this to check auth status ? the redirect if needed
    //res.redirect(401,'/login')

    next() // pass control to the next handler
});

//#region Define Routes Middleware
main.use('/admin', subApp) 
main.use('/api/todos',todoRouter);
//#endregion

//#region Error Middleware last
main.use(function (err: Error, req: any, res: any, next:any) {
    logger.debug(chalk.red("Main app Error middleware"));
    logger.error(err.stack)
    res.status(500).send('Something broke! Intercepted by error middelware')
  })
//#endregion

//#endregion




mongoose.connect(`${process.env.CONNECTION_STR}`, {

}, () => {
    logger.debug('Connected to db');
});







// define a route handler for the default home page
main.get("/", (req, res) => {
    res.send("Hello world!");
});


// start listening
main.listen(PORT, () => {
    logger.debug(`Application is running on port ${chalk.yellow(PORT)}.`);
});


  