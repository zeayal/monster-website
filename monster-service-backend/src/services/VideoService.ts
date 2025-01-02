import OSS from "ali-oss";
import { prisma } from "../utils/prisma";
import { Video } from "@prisma/client";
import path from "path";

interface OSSPutResult extends OSS.PutObjectResult {
  url: string;
}

export class VideoService {
  private static client: OSS;

  static initialize(): void {
    if (
      !process.env.OSS_REGION ||
      !process.env.OSS_ACCESS_KEY_ID ||
      !process.env.OSS_ACCESS_KEY_SECRET ||
      !process.env.OSS_BUCKET
    ) {
      throw new Error("Missing OSS configuration");
    }

    this.client = new OSS({
      region: process.env.OSS_REGION,
      accessKeyId: process.env.OSS_ACCESS_KEY_ID,
      accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
      bucket: process.env.OSS_BUCKET,
    });
  }

  private static ensureInitialized(): void {
    if (!this.client) {
      this.initialize();
    }
  }

  static async uploadVideo(file: Express.Multer.File): Promise<Video> {
    this.ensureInitialized();

    const filename = `videos/${Date.now()}-${file.originalname}`;

    try {
      // 上传视频文件
      const result = (await this.client.put(
        filename,
        file.buffer
      )) as OSSPutResult;

      // 构建基础URL（去除查询参数）
      const baseUrl = result.url.split("?")[0];

      // 生成缩略图 URL（使用阿里云 OSS 的视频截帧功能）
      const thumbnailUrl = `${baseUrl}?x-oss-process=video/snapshot,t_1000,f_jpg,w_0,h_0,m_fast`;

      // 保存视频信息到数据库
      const video = await prisma.video.create({
        data: {
          title: file.originalname,
          url: baseUrl,
          thumbnailUrl,
          filename: filename,
        },
      });

      return video;
    } catch (error) {
      console.error("Upload video error:", error);
      throw new Error(error instanceof Error ? error.message : "视频上传失败");
    }
  }

  static async deleteVideo(videoId: number): Promise<void> {
    this.ensureInitialized();

    try {
      const video = await prisma.video.findUnique({
        where: { id: videoId },
      });

      if (!video) {
        throw new Error("Video not found");
      }

      // 从 OSS 删除视频
      await this.client.delete(video.filename);

      // 从数据库删除记录
      await prisma.video.delete({
        where: { id: videoId },
      });
    } catch (error) {
      console.error("Delete video error:", error);
      throw new Error(error instanceof Error ? error.message : "视频删除失败");
    }
  }

  static async getAllVideos(): Promise<Video[]> {
    try {
      return await prisma.video.findMany({
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Get videos error:", error);
      throw new Error(
        error instanceof Error ? error.message : "获取视频列表失败"
      );
    }
  }

  static async getVideo(videoId: number): Promise<Video | null> {
    try {
      return await prisma.video.findUnique({
        where: { id: videoId },
      });
    } catch (error) {
      console.error("Get video error:", error);
      throw new Error(
        error instanceof Error ? error.message : "获取视频信息失败"
      );
    }
  }

  static async downloadVideo(videoId: number): Promise<{ filePath: string }> {
    try {
      const video = await prisma.video.findUnique({
        where: { id: videoId },
      });

      if (!video) {
        throw new Error("Video not found");
      }

      // 创建临时目录
      const tmpDir = path.resolve(__dirname, "../../../tmp/videos");
      const fs = require("fs");
      if (!fs.existsSync(tmpDir)) {
        fs.mkdirSync(tmpDir, { recursive: true });
      }

      // 使用视频的完整URL路径从OSS下载
      const filePath = path.join(
        tmpDir,
        path.basename(video.url.split("?")[0])
      );

      const video_name = path.basename(video.url.split("?")[0], ".mp4");
      const desc_text_name = video_name + ".txt";
      const desc_text_path = path.join(tmpDir, desc_text_name);
      await fs.promises.writeFile(
        desc_text_path,
        `${video.title}\n#我们在环游中国`
      );

      // 从OSS下载文件到本地
      const result = await this.client.get(video.filename);
      await fs.promises.writeFile(filePath, result.content);

      // await fs.promises.writeFile(filePath, result.content);

      return { filePath };
    } catch (error) {
      console.error("Download video error:", error);
      throw new Error(error instanceof Error ? error.message : "下载视频失败");
    }
  }

  static async uploadToDouyin(
    videoId: number,
    accountName: string
  ): Promise<void> {
    try {
      // 先下载视频
      const { filePath } = await this.downloadVideo(videoId);

      // 构建上传命令
      const uploadCommand = "python3";
      const args = ["cli_main.py", "douyin", accountName, "upload", filePath];

      // 执行上传命令
      const { spawn } = require("child_process");
      const socialAutoUploadPath = path.resolve(
        __dirname,
        "../../../social-auto-upload"
      );

      return new Promise((resolve, reject) => {
        const process = spawn(uploadCommand, args, {
          cwd: socialAutoUploadPath,
        });

        let output = "";

        process.stdout.on("data", (data: any) => {
          output += data.toString();
          console.log("Upload stdout:", data.toString());
        });

        process.stderr.on("data", (data: any) => {
          output += data.toString();
          console.error("Upload stderr:", data.toString());
        });

        process.on("close", (code: any) => {
          if (code === 0) {
            resolve();
          } else {
            reject(new Error(`Upload failed with code ${code}: ${output}`));
          }
        });

        process.on("error", (err: any) => {
          reject(err);
        });
      });
    } catch (error) {
      console.error("Upload to Douyin error:", error);
      throw error;
    }
  }
}
