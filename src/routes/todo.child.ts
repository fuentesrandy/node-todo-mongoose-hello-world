import express, { Request, Response } from "express"
import logger, {chalk} from "../logger"


// you need to set mergeParams: true on the router,
// if you want to access params from the parent router
const todosChildRouter = express.Router({mergeParams: true});

todosChildRouter.use(function (req, res, next) {
    // invoked for any requests passed to this router
    let id = req.params.id;
    logger.debug(`${chalk.yellow(`Todos Router ${chalk.bold("Child")} Middleware`)}`)
    if(!id){
        logger.debug(`${chalk.red("No Id provided in params")}`)
    }else{
        logger.debug(`${chalk.yellow(`id provided: ${id}`)}`)
    }
    next()
});


/* Get by parent Id, Child Id*/
todosChildRouter.get("/:childId", async (req: Request, res: Response) => {
    let id = req.params.id;
    let childId = req.params.childId;
    
    return res.status(200).send({
        id,
        childId
    });
});




export { todosChildRouter as todoChildRouter }