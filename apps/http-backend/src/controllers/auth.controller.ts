import type { Request, Response } from "express";
import { CreateUserSchema, SignInSchema } from "@repo/zod-validation/types";
import { registerUser, authenticateUser } from "../services/auth.service";
import { badRequest } from "../services/http-error";

/** POST /signup — validate, delegate to the service, return the new userId. */
export async function signup(req: Request, res: Response): Promise<void> {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    throw badRequest("Invalid signup details");
  }

  const userId = await registerUser(parsed.data);
  res.status(201).json({ userId, message: "User created successfully" });
}

/** POST /signin — validate, delegate to the service, return a JWT. */
export async function signin(req: Request, res: Response): Promise<void> {
  const parsed = SignInSchema.safeParse(req.body);
  if (!parsed.success) {
    throw badRequest("Invalid sign-in details");
  }

  const token = await authenticateUser(parsed.data);
  res.json({ token });
}
