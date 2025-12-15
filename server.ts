import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { connectDB } from "./src/databases/connection";
import { App } from "./src/app";

dotenv.config();

const port = Number(process.env.PORT) || 4001;
const base_url = process.env.BASE_URL || "";

const myApp = new App(port, base_url);
const app = myApp.app;
const server = http.createServer(app);

app.use(
    cors({
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true,
    })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

const startServer = async () => {
    try {
        await connectDB();
        await myApp.initialize();

        server.listen(port, () => {
            console.log(` Server running at ${port}`);
        });
    } catch (err) {
        console.error("Server startup failed:", err);
        process.exit(1);
    }
};

startServer();
