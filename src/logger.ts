import createDebugMessages from 'debug';
import chalk from "chalk"
const debug = createDebugMessages('my-node-app');


const logger ={
    debug,
    log: console.log,
    error: console.error
}


export {chalk };

export default logger