import express, { Request, Response } from "express"
import { Todo } from "../models/todo";
const router = express.Router();

/* Get all */
router.get("/api/todos", async (req: Request, res: Response) => {
    const todos = await Todo.find({});
    return res.status(200).send(todos);
});

/* Get by Id*/
router.get("/api/todo/:id", async (req: Request, res: Response) => {
    let id = req.params.id;
    const todo = await Todo.findById(id);
    return res.status(200).send(todo);
});

/* Create */
router.post("/api/todo", async (req: Request, res: Response) => {
    const { title, description } = req.body;
    const todo = Todo.build({ title, description });
    await todo.save();
    return res.status(201).send(todo);
});

/* Update */
router.patch("/api/todo/:id", async (req: Request, res: Response) => {
    let id = req.params.id;
    const { title, description } = req.body;
    const filter = { _id: id };
    const update = { $set: { title, description } };
    let status = await Todo.updateOne(filter, update);
    // get fresh copy
    const todo = await Todo.findById(id);
    return res.status(200).send(todo);
});


export { router as todoRouter }