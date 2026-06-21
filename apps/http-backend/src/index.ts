import express from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '@repo/backend-common/config';
import { middleware } from './middleware';
import {CreateUserSchema, SignInSchema , CreateRoomSchema} from '@repo/zod-validation/types';
import { getPrismaClient } from '@repo/db/client';
import cors from "cors";
const app = express();

app.use(express.json());
app.use(cors())
app.get("/test-db", async (req, res) => {
    const users = await getPrismaClient().user.findMany();

    console.log(users);

    res.json(users);
});

app.post("/signup", async (req, res) => {
    try {
        const data = CreateUserSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ error: data.error.flatten() });
        }

        // Check if user already exists
        const existingUser = await getPrismaClient().user.findUnique({
            where: { email: data.data.email }
        });

        if (existingUser) {
            return res.status(409).json({ error: "User with this email already exists" });
        }

        // Create user
        const user = await getPrismaClient().user.create({
            data: {
                email: data.data.email,
                password: data.data.password,
                name: data.data.username
            }
        });
        
        res.status(201).json({
            userId: user.id,
            message: "User created successfully"
        });
    }catch (error) {
    console.error("========== SIGNUP ERROR ==========");
    console.error(error);

    if (error instanceof Error) {
        console.error("MESSAGE:", error.message);
        console.error("STACK:", error.stack);
    }

    res.status(500).json({ error: "Internal server error" });
}
});



app.post("/signin", async (req, res) => {
    try {
        const data = SignInSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ error: data.error.flatten() });
        }

        // Find user by email
        const user = await getPrismaClient().user.findUnique({
            where: { email: data.data.email }
        });

        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Validate password
        if (user.password !== data.data.password) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // Generate JWT token
        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET);

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.post("/room", middleware, async (req, res) => {
    try {
        const data = CreateRoomSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ error: data.error.flatten() });
        }

        // Get userId from middleware (should be attached to req)
        const userId = (req as any).userId;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Create room
        const room = await getPrismaClient().room.create({
            data: {
                slug: data.data.name.toLowerCase().replace(/\s+/g, '-'),
                adminId: userId
            }
        });

        res.status(201).json({ 
            message: "Room created successfully",
            roomId: room.id,
            slug: room.slug
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal server error" });
    }
});

app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        
        const messages = await getPrismaClient().chat.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
    
})

app.get("/room/:slug", async (req, res) => {
    const slug = req.params.slug;
    const room = await getPrismaClient().room.findFirst({
        where: {
            slug
        }
    });

    res.json({
        room
    })
})



app.listen(3001, () => {
    console.log("Server running on port 3001");
});
