import databaseClient from "../../../database/client";

import type { Rows } from "../../../database/client";

type Item = {
  id: number;
  item_name: string;
  item_description: string;
  item_image: string;
};

class ItemRepository {
  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM item");
    return rows as Item[];
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM item WHERE id = ?",
      [id],
    );
    return rows[0] as Item;
  }
}

export default new ItemRepository();
