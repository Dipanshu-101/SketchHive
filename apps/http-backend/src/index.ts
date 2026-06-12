import express from 'express';
import jwt from 'jsonwebtoken';     
import { JWT_SECRET } from './config';
import { middleware } from './middleware';
const app = express();

app.post("/signup", (req, res) => {
    // I have to add zod validation here to validate the request body
    res.json({
        userId: 1,  //this will come from the database after creating the user (no need to send as response)
        message: "User created successfully"
    })
});

app.post("/signin", (req, res) => {
        const userId = 1; // this will come from the database after validating the user credentials
        const token = jwt.sign({
            userId
        },JWT_SECRET);

        res.json({ token });
});

app.post("/room", middleware , (req, res) => {
    //db call
    res.json({ message: "Room created successfully" });
    
});
app.listen(3001);