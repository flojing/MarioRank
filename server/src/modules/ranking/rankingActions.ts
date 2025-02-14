import type { RequestHandler } from "express";
import rankingRepository from "./rankingRepository";

const add: RequestHandler = async (req, res) => {
  try {
    const { userId, itemId, ranking } = req.body;

    const exists = await rankingRepository.exists(userId, itemId);

    if (exists) {
      await rankingRepository.update({
        user_id: userId,
        item_id: itemId,
        ranking: ranking,
      });
      res.status(200).json({ message: "Ranking updated successfully" });
    } else {
      const rankingId = await rankingRepository.create({
        user_id: userId,
        item_id: itemId,
        ranking: ranking,
      });
      res.status(201).json({ rankingId });
    }
  } catch (err) {
    console.error("Error saving ranking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserRankings: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const rankings = await rankingRepository.readByUserId(Number(userId));
    res.json(rankings);
  } catch (err) {
    console.error("Error fetching rankings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const remove: RequestHandler = async (req, res) => {
  try {
    const { userId, itemId } = req.params;
    await rankingRepository.delete(Number(userId), Number(itemId));
    res.status(200).json({ message: "Ranking deleted successfully" });
  } catch (err) {
    console.error("Error deleting ranking:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const removeAllByUserId: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    await rankingRepository.deleteAllByUserId(Number(userId));
    res.status(200).json({ message: "All rankings deleted successfully" });
  } catch (err) {
    console.error("Error deleting all rankings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default { add, getUserRankings, remove, removeAllByUserId };
