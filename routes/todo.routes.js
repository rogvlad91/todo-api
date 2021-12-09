import { Router } from "express";
import db from '../db/index.js'

const router = Router();

router.get('/', async (req, res, next) => {
    try { 
        ///db init
        await db.read();

        if(db.data.length) {
            ///sending data 
            res.send(200).json(db.data);
        }else{
            res.send(200).json({message: 'There is no tasks'})
        }
    }
    catch (err){
        console.log('Get all tasks err')
        next(err);
    }
})

router.get('/:id', async (req, res, next) => {
    const id = req.params.id;
    try {
        await db.read();

        if (!db.data.length){
            return res.status(400).json({message: 'There are no todos'});
        }
        const todo = db.data.find( task => task.id === id);

        if (!todo){
            return res.status(400).json({message: 'NO TASK WITH THAT ID'})
        }

        res.status(200).json(todo)
    } catch (err) {
            console.log('Error in get todo by id')
            next(err)
        }
})

router.post('/', async (req, res, next) => {
    const text = res.body.text

    if(!text){
        return res.status(400).json('The text for task must be provided')
    }

    try {
        await db.read()

        const newTodo = {
            id: String(db.data.length + 1),
            text, 
            done: false
        }
        /// add new task to db
        db.data.push(newTodo);
        ///waiting for db to write task
        await db.write()
        ///return updated tasks
        res.status(201).json(db.data)
    } catch(err){
        console.log('Error in create todo')
        next(err);
    }
})
router.put('/:id', async (req, res, next) => {
    const id = req.params.id;

    if (!id){
        return res
            .status(400)
            .json({message: 'No id of task was provided'})
    }
    const changes = res.body.changes

    if (!changes){
        return res
            .status(400)
            .json({message: 'No changes were provided'})
    }

    try {
        await db.read()

        const todo = db.data.find((task) => task.id === id)
        
        if (!todo){
            return res
            .status(400)
            .json({message: 'No task with provided id was found'})
        }

        const updatedTodo = {...todo, ...changes}
        ///Update task list
        const newTodos = db.data.map((task)=> (task.id === id ? updatedTodo:task))

        db.data = newTodos;
        await db.write()

        res.status(201).json(db.data)
    } catch (err){
        console.log('Error in update todo')
        next(err);
    }
})
router.delete('/:id', async (req, res, next) => {
    const id = req.params.id;

    if(!id){
        return res
            .status(400)
            .json({message: 'No id of task was provided'})
    }
    try{
        await db.read

        const todo = db.data.find((task) => task.id === id)
        if (!todo){
            return res
            .status(400)
            .json({message: 'No task with provided id was found'})
        }
        const newTodos = db.data.filter((task) => task.id !== id);
        db.data = newTodos

        await db.write();
        res.status(201).json(db.data)
    } catch (err){
        console.log('Deleting todo error')
    }
})
export default router;