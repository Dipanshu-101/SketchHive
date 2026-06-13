import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from './middleware';
import {CreateUserSchema, SignInSchema , CreateRoomSchema} from '@repo/zod-validation/types';
const app = express();

app.post("/signup", (req, res) => {
    
    const data = CreateUserSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ error: data.error.flatten() });
    }

    res.json({
        userId: 1,  //this will come from the database after creating the user (no need to send as response)
        message: "User created successfully"
    })
});

app.post("/signin", (req, res) => {
    const data = SignInSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ error: data.error.flatten() });
    }

        const userId = 1; // this will come from the database after validating the user credentials
        const token = jwt.sign({
            userId
        },JWT_SECRET);

        res.json({ token });
});

app.post("/room", middleware , (req, res) => {
    //db call

    const data = CreateRoomSchema.safeParse(req.body);
    if (!data.success) {
        return res.status(400).json({ error: data.error.flatten() });
    }

    res.json({ message: "Room created successfully" });
    
});
app.listen(3001);