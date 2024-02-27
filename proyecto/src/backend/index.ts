import { Server } from 'azle';
import { id } from 'azle/src/lib/ic/id';
import express, { Request, NextFunction, Response} from 'express';

type User = {
    id: number;
    name: string;
}

let users: User[] = [{
    id: 1,
    name: 'John Doe'
}];

function logger(req: Request, res: express.Response, next: express.NextFunction) {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
}


export default Server(() => {
    const app = express();

    app.use(express.json());

    //GET
    app.get('/users', (req, res) => {
        res.json(users);
    });

    app.post('/users', (req, res) => {
        const userExists = users.some(user => user.name === req.body.name);

        if (userExists) {
            res.status(400).send("User already exists");
            return;
        }

        users = [...users, req.body];
        res.send("User added");
    });

    //PUT
    app.put('/users/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const user = users.find(user => user.id === id);
        if (!user) {
            res.status(404).send('User not found');
        } else {
            user.name = req.body.name;
            res.send('User updated');
        }
    });  

    //DELETE
    app.delete('/users/:id', (req, res) => {
        const id = parseInt(req.params.id);
        users = users.filter(user => user.id !== id);
        res.send('User deleted');
    });

   
    app.use(logger);
    return app.listen();
});
