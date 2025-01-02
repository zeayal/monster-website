import express, { Request, Response } from "express";
import cors from "cors";
import routes from "./routes";
import { VideoService } from './services/VideoService';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors<Request>());
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, TypeScript Express!");
});

// 初始化 VideoService
try {
  VideoService.initialize();
  console.log('VideoService initialized successfully');
} catch (error) {
  console.error('Failed to initialize VideoService:', error);
  process.exit(1);
}

// 路由
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
