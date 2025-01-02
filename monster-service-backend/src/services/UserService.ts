import { Prisma, User } from "@prisma/client";
import { prisma } from "../utils/prisma";

export class UserService {
  static async findByUserName(username: string): Promise<User | null> {
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      return user;
    } catch (error) {
      console.error("Error finding user by username", error);
      throw error;
    }
  }
}
