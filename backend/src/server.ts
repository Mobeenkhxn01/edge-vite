import express from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import { authOptions } from "./auth";
import NextAuth from "next-auth";

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// Authentication route
app.use("/api/auth", NextAuth(authOptions));

app.get("/api/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
