import express, { Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose"

//routes
import { todoRouter } from "./routes/todo"

// initialize configuration
dotenv.config();

const app = express();
app.use(bodyParser.json()); // to support JSON - encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use(todoRouter);

mongoose.connect(`${process.env.CONNECTION_STR}`, {

}, () => {
    console.log('Connected to db');
});



const port = process.env.SERVER_PORT;


// define a route handler for the default home page
app.get("/", (req, res) => {
    res.send("Hello world!");
});



app.listen(port, () => {
    console.log(`Application is running on port ${port}.`);
});