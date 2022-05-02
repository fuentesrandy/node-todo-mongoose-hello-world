import mongoose from "mongoose";


interface ITodo {
    title: string,
    description: string
}

interface TodoDoc extends mongoose.Document {
    title: string,
    description: string
}

interface TodoModelInterface extends mongoose.Model<any> {
    build(payload: ITodo): TodoDoc
}

const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});

todoSchema.statics.build = (payload: ITodo) => new Todo(payload);

const Todo = mongoose.model<any, TodoModelInterface>('Todo', todoSchema);



export { Todo }