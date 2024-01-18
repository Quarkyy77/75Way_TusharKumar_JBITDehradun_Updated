import express from "express";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDatabase } from "./database/connection";
import authRoutes from "./routes/authRoute";
import userRoutes from "./routes/userRoute";
import jobCategoryRoutes from "./routes/jobCategory.route";
import jobRoutes from "./routes/jobRoute";
import applyRoutes from "./routes/appRoute";

declare global {
  namespace Express {
    interface Request {
      userId: string;
      job: any
    }
  }
}

const PORT = process.env.PORT || 5000
const app = express();
dotenv.config();

app.use(
  cors({
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.json());

// Connect to the database
connectToDatabase(process.env.MONGO_URL as string);

app.get("/", (req: express.Request, res: express.Response) => {
  res.send("Job App!");
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

// Routes
app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/jobCategory", jobCategoryRoutes)
app.use("/job", jobRoutes);
app.use("/apply", applyRoutes);