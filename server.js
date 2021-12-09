import express from "express";
import router from "./routes/todo.routes.js";

const app = express();

app.use(express.json()) /// Parsing data of request

app.use('/todos', router) //routing 

app.get('*', (req, res) => {
    res.send('only /todos endpoints are available')
})

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.status || 500;
    const message = err.message || 'Something went wrong, try again later'
    res.status(status).json({message});
})
app.listen(3000, () => {
    console.log('Server listening on port 3000 ...')
})