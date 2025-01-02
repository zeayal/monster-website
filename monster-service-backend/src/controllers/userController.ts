import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const secretKey = process.env.JWT_SECRET_KEY || "default_secret_key";

class UserController {
  login = async (req: Request, res: Response) => {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        res.status(400).json({
          code: 400,
          msg: "用户名或密码不能为空",
        });
        return;
      }

      const user = await UserService.findByUserName(username);
      console.log("user", user);
      if (!user) {
        res.status(401).json({
          code: 401,
          msg: "用户名或密码错误1",
        });
        return;
      }

      // 比对密码，如果密码正确，需要返回 jwt token
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        res.status(401).json({
          code: 401,
          msg: "用户名或密码错误2",
        });

        return;
      }
      // 生成token，这里可以根据需求往payload中添加更多用户相关信息，比如用户ID等
      const token = jwt.sign({ username: user.username }, secretKey, {
        expiresIn: "2h",
      });

      const { password: PWD, ...rest } = user;
      res.status(200).json({
        code: 0,
        msg: "登录成功",
        data: {
          ...rest,
          token,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ msg: "服务器错误" });
    }
  };
}

export default new UserController();
