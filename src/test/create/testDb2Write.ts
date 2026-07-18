import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { GassmaClient as GassmaClientDb2 } from "../../generated/gassma2/schemaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { itemData } from "../../consts/itemData";
import { notificationData } from "../../consts/notificationData";
import { SPREADSHEET_ID_DB2 } from "../../consts/spreadsheetIds";

function testDb2Write() {
  resetSheet("Item", itemData, SPREADSHEET_ID_DB2);

  const db2 = new GassmaClientDb2();
  const db1 = new GassmaClient();

  // autoincrement は永続カウンタのため id は名前ではなく増分のみ検証する
  const first = db2.Item.create({ data: { name: "d5-auto-1", price: 990 } });
  if (typeof first.id !== "number" || first.id <= 0) {
    throw new Error(`db2 autoincrement: invalid id ${first.id}`);
  }

  // Db1 側の採番を挟んでも Db2 のカウンタが独立していること
  db1.Notification.create({ data: { userId: 1, message: "d5 interleave" } });
  const second = db2.Item.create({ data: { name: "d5-auto-2", price: 991 } });
  assertEquals(second.id, first.id + 1, "db2 autoincrement: independent sequence");

  const explicit = db2.Item.create({
    data: { id: 990, name: "d5-explicit", price: 992 },
  });
  assertEquals(explicit.id, 990, "db2 create: explicit id");

  const snapshot = getSheetSnapshot("Item", SPREADSHEET_ID_DB2);
  snapshot.assertCount(6);
  snapshot.assertRowEquals({ name: "d5-auto-1" }, { price: 990 });
  snapshot.assertRowEquals({ name: "d5-auto-2" }, { price: 991 });
  snapshot.assertRowEquals({ name: "d5-explicit" }, { id: 990, price: 992 });

  const found = db2.Item.findFirstOrThrow({ where: { name: "d5-explicit" } });
  assertEquals(found.id, 990, "db2 read back: id");
  assertEquals(found.price, 992, "db2 read back: price");

  const deleted = db2.Item.deleteMany({
    where: { name: { startsWith: "d5-" } },
  });
  assertDeepEquals(deleted, { count: 3 }, "db2 deleteMany: count");

  const after = getSheetSnapshot("Item", SPREADSHEET_ID_DB2);
  after.assertCount(3);
  after.assertRowNotExists({ id: 990 });
  after.assertRowEquals({ id: 1 }, { name: "Apple", price: 120 });
  after.assertRowEquals({ id: 3 }, { name: "Cherry", price: 300 });

  resetSheet("notifications", notificationData);

  Logger.log("✅ testDb2Write: all passed");
}

export { testDb2Write };
