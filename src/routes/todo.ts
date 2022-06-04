import express, { NextFunction, Request, Response } from "express"
import { Todo } from "../models/todo";
import logger, {chalk} from "../logger"
import {todoChildRouter} from "./todo.child"

let routerLogPrefix = `${chalk.yellow("Todos Router Middleware")}`;

//#region Route Defenition & Middleware
const todosRouter = express.Router();
todosRouter.use(function (req, res, next) {
    // invoked for any requests passed to this router
    logger.debug(`${routerLogPrefix}`)
    next()
});
todosRouter.param('id', async (req : any, res: Response, next, id) => {
// this will get triggered for this route only anytime the 'id' param is present in the route.
// we can make a db call here and then add the item to the req object
logger.debug(`using param middleware , inside ${routerLogPrefix}, to capture id and get item from db`);
// fake db call, then add to req object
    const todo = await Todo.findById(id);
    req.todo = todo;
    next();
  })
//#endregion
  

//#region Route Endpoints
/* Get all tester */
todosRouter.post("/error", async (req: Request, res: Response,next:NextFunction) => {
    next( new Error("Error"));
});
todosRouter.post("/test", async (req: Request, res: Response) => {
    return res.status(200).send(req.body);
});

/* Get all */
todosRouter.get("/", async (req: Request, res: Response) => {
    const todos = await Todo.find({});
    return res.status(200).send(todos);
});

/* Get by Id*/
todosRouter.get("/:id", async (req: any, res: Response) => {

    return res.status(200).send(req.todo);
});

/* Create */
todosRouter.post("/", async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const todo = Todo.build({ title, description });
    await todo.save();
    return res.status(201).send(todo);
});

/* Update */
todosRouter.patch("/:id", async (req: Request, res: Response) => {
    let id = req.params.id;
    const { title, description } = req.body;
    const filter = { _id: id };
    const update = { $set: { title, description } };
    let status = await Todo.updateOne(filter, update);
    // get fresh copy
    const todo = await Todo.findById(id);
    return res.status(200).send(todo);
});
//#region 

//#region Define Child Routes
// you can nest routers by attaching them as middleware:
// passing id from parent route into child route
// child route must be dfined with {mergeParams: true}
todosRouter.use('/:id/child', todoChildRouter);
//#endregion

export { todosRouter as todoRouter }