import "dotenv/config";
import env from "../src/utils/validateENV";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import noteRoutes from "./routes/note";
import userRoutes from "./routes/user";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import session from "express-session";
import MongoStore from "connect-mongo";
import { requiresAuth } from "./middleware/auth";
const app = express();

console.log("Frontend URL:", env.FRONTEND_URL);

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);

//Backend Decodes the JSON:
app.use(express.json());

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json("Hello");
});

// Health check endpoint (moved to the top)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(
  session({
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : undefined, // Apply `sameSite: none` only in production // allow cross-origin
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: env.MONGO_CONNECTION_STRING,
    }),
  })
);

app.use("/api/users", userRoutes);
app.use("/api/notes", requiresAuth, noteRoutes);

// Express processes middleware and routes in the order they are defined
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error("Error encountered: ", error);
  let errorMsg = "An unknown error occurred";
  let statusCode = 500;

  if (isHttpError(error)) {
    statusCode = error.status;
    errorMsg = error.message;
  }

  res.status(statusCode).json({ error: errorMsg });
});

export default app;
