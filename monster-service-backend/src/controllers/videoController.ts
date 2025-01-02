import { Request, Response, NextFunction } from "express";
import { VideoService } from "../services/VideoService";
import { RequestHandler } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}

export class VideoController {
  static upload: RequestHandler = async (
    req: RequestWithFile,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      console.log("Upload request headers:", req.headers);
      console.log("Upload request files:", req.files);
      console.log("Upload request file:", req.file);
      if (!req.file) {
        res.status(400).json({
          code: 400,
          msg: "没有上传文件",
        });
        return;
      }

      const video = await VideoService.uploadVideo(req.file);
      res.json({
        code: 0,
        data: video,
        msg: "上传成功",
      });
    } catch (error) {
      console.error("Upload video error:", error);
      res.status(500).json({
        code: 500,
        msg: "视频上传失败",
      });
    }
  };

  static delete: RequestHandler<ParamsDictionary> = async (
    req,
    res,
    next
  ): Promise<void> => {
    try {
      const videoId = parseInt(req.params.id);
      if (isNaN(videoId)) {
        res.status(400).json({
          code: 400,
          msg: "无效的视频ID",
        });
        return;
      }

      await VideoService.deleteVideo(videoId);
      res.json({
        code: 0,
        msg: "删除成功",
      });
    } catch (error) {
      console.error("Delete video error:", error);
      res.status(500).json({
        code: 500,
        msg: "视频删除失败",
      });
    }
  };

  static getAll: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const videos = await VideoService.getAllVideos();
      res.json({
        code: 0,
        data: videos,
        msg: "获取成功",
      });
    } catch (error) {
      console.error("Get videos error:", error);
      res.status(500).json({
        code: 500,
        msg: "获取视频列表失败",
      });
    }
  };

  static getOne: RequestHandler<ParamsDictionary> = async (
    req,
    res,
    next
  ): Promise<void> => {
    try {
      const videoId = parseInt(req.params.id);
      if (isNaN(videoId)) {
        res.status(400).json({
          code: 400,
          msg: "无效的视频ID",
        });
        return;
      }

      const video = await VideoService.getVideo(videoId);

      if (!video) {
        res.status(404).json({
          code: 404,
          msg: "视频不存在",
        });
        return;
      }

      res.json({
        code: 0,
        data: video,
        msg: "获取成功",
      });
    } catch (error) {
      console.error("Get video error:", error);
      res.status(500).json({
        code: 500,
        msg: "获取视频信息失败",
      });
    }
  };

  static uploadToDouyin: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const videoId = parseInt(req.params.id);
      const { accountName = "61032120108" } = req.body;

      if (isNaN(videoId)) {
        res.status(400).json({
          code: 400,
          msg: "无效的视频ID",
        });
        return;
      }

      if (!accountName) {
        res.status(400).json({
          code: 400,
          msg: "请提供抖音账号名称",
        });
        return;
      }

      await VideoService.uploadToDouyin(videoId, accountName);

      res.json({
        code: 0,
        msg: "上传成功",
      });
    } catch (error) {
      console.error("Upload to Douyin error:", error);
      res.status(500).json({
        code: 500,
        msg: error instanceof Error ? error.message : "上传失败",
      });
    }
  };
}

export default VideoController;
