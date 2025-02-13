import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type User = {
  id: number;
  username: string;
  email: string;
  password_hash: string;
  profile_pic?: string | null;
};

type CreateUserInput = Omit<User, "id" | "password_hash"> & {
  password_hash: string;
};

class userRepository {
  async create(user: CreateUserInput) {
    const profilePic = user.profile_pic || "../assets/images/avatars/av01.png";
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO user (
            username, email, password_hash, profile_pic
          ) VALUES (?, ?, ?, ?)`,
      [user.username, user.email, user.password_hash, profilePic],
    );

    return result.insertId;
  }

  async readByEmail(email: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE email = ?",
      [email],
    );
    return rows[0] as User | undefined;
  }

  async readByUsername(username: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE username = ?",
      [username],
    );
    return rows[0] as User | undefined;
  }

  async readByEmailWithPassword(email: string) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id, username, email, password_hash, profile_pic FROM user WHERE email = ?",
      [email],
    );
    return rows[0] as User | undefined;
  }

  async readById(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE id = ?",
      [id],
    );
    return rows[0] as User | undefined;
  }

  async updateAvatar(userId: number, profilePic: string) {
    await databaseClient.query("UPDATE user SET profile_pic = ? WHERE id = ?", [
      profilePic,
      userId,
    ]);
  }
}

export default new userRepository();
