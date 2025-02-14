import databaseClient from "../../../database/client";
import type { Result, Rows } from "../../../database/client";

type Ranking = {
  id: number;
  user_id: number;
  item_id: number;
  ranking: number;
};

type CreateRankingInput = Omit<Ranking, "id">;

class RankingRepository {
  async create(ranking: CreateRankingInput) {
    const [result] = await databaseClient.query<Result>(
      `INSERT INTO ranking (user_id, item_id, ranking) 
       VALUES (?, ?, ?)`,
      [ranking.user_id, ranking.item_id, ranking.ranking],
    );

    return result.insertId;
  }

  async readByUserId(userId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM ranking WHERE user_id = ?",
      [userId],
    );
    return rows as Ranking[];
  }

  async update(ranking: CreateRankingInput) {
    await databaseClient.query(
      `UPDATE ranking 
       SET ranking = ? 
       WHERE user_id = ? AND item_id = ?`,
      [ranking.ranking, ranking.user_id, ranking.item_id],
    );
  }

  async delete(userId: number, itemId: number) {
    await databaseClient.query(
      "DELETE FROM ranking WHERE user_id = ? AND item_id = ?",
      [userId, itemId],
    );
  }

  async deleteAllByUserId(userId: number) {
    await databaseClient.query("DELETE FROM ranking WHERE user_id = ?", [
      userId,
    ]);
  }

  async exists(userId: number, itemId: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT id FROM ranking WHERE user_id = ? AND item_id = ?",
      [userId, itemId],
    );
    return rows.length > 0;
  }
}

export default new RankingRepository();
