import { Server } from 'azle';
import express, { Request } from 'express';



 type  User = {
    id: number;
    name: string;
    age: number;
    password: string;
    username: string;
};

let users : User[] = [{
    id: 1,
    name: 'John',
    age: 25,
    password: '1234',
    username: 'john123'
}];

export default Server(() => {
    const app = express();

    app.use(express.json());

    // Get
    app.get('/users', (req, res) => {
        res.send(users);
    });


    // Post
    app.post("/users", (req, res) => {
        users= {...users, ...req.body};
        res.send("User added");
    });    
       

    // Put
    app.put('/users/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const user = users.find(user => user.id === id);
        if (!user) {
            res.status(400).send('User not found');
            return;
        }
        const updatedUser = {...user, ...req.body};
        users = users.map(user => user.id === id ? updatedUser : user);
        res.send("User updated");
    });

    // Delete
    app.delete('/users/:username', (req, res) => {
        const username = req.params.username;
        users = users.filter(user => user.username !== username);
        res.send(username);
    });

    return app.listen();
});
