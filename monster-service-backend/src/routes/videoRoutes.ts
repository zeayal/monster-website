import { Router } from "express";
import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import VideoController from "../controllers/videoController";

const router = Router();

// 配置 multer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1000 * 1024 * 1024, // 限制文件大小为 1000MB
  },
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ) => {
    // 检查文件类型
    if (file.mimetype.startsWith("video/")) {
      callback(null, true);
    } else {
      callback(new Error("只允许上传视频文件"));
    }
  },
});

// 上传视频
router.post("/upload", upload.single("file"), VideoController.upload);

// 获取视频列表
router.get("/", VideoController.getAll);

// 获取单个视频信息
router.get("/:id", VideoController.getOne);

// 删除视频
router.delete("/:id", VideoController.delete);

// 上传视频到抖音
router.post("/upload-to-douyin/:id", VideoController.uploadToDouyin);

export default router;
