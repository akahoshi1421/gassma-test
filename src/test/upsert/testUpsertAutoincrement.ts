import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { notificationData } from "../../consts/notificationData";

function testUpsertAutoincrement() {
  const client = new GassmaClient();

  testUpsertCreatePathAssignsId(client);
  testUpsertUpdatePathKeepsIdAndCounter(client);

  Logger.log("✅ testUpsertAutoincrement: all passed");
}

// カウンターは ScriptProperties で永続するため絶対値ではなく相対値で検証する
function testUpsertCreatePathAssignsId(client: GassmaClient) {
  const base = client.Notification.create({
    data: { userId: 1, message: "upsert ai base" },
  });
  if (typeof base.id !== "number" || base.id <= 0) {
    throw new Error(`upsert ai base: invalid id ${base.id}`);
  }

  // where ミス + create に id 省略 → create 経路で採番される
  const created = client.Notification.upsert({
    where: { message: "upsert ai missing" },
    create: { userId: 2, message: "upsert ai created" },
    update: { message: "should not update" },
  });

  if (typeof created.id !== "number") {
    throw new Error(
      `upsert ai create: expected id to be number, got ${typeof created.id}`,
    );
  }
  assertEquals(created.id, base.id + 1, "upsert ai create: id increments from base");

  const snapshot = getSheetSnapshot("notifications");
  snapshot.assertRowEquals(
    { message: "upsert ai created" },
    { id: created.id, userId: 2 },
  );

  resetSheet("notifications", notificationData);
}

function testUpsertUpdatePathKeepsIdAndCounter(client: GassmaClient) {
  const before = client.Notification.create({
    data: { userId: 1, message: "upsert ai before" },
  });

  // where ヒット → update 経路。id は不変
  const updated = client.Notification.upsert({
    where: { message: "Welcome to the platform!" },
    create: { userId: 9, message: "should not create" },
    update: { message: "upsert ai updated" },
  });
  assertEquals(updated.id, 1, "upsert ai update: id unchanged");

  const snapshot = getSheetSnapshot("notifications");
  snapshot.assertRowNotExists({ message: "should not create" });
  snapshot.assertRowEquals(
    { message: "upsert ai updated" },
    { id: 1, userId: 1 },
  );

  // update 経路はカウンターを消費しない → 直後の create の採番が +1 のまま
  const after = client.Notification.create({
    data: { userId: 1, message: "upsert ai after" },
  });
  if (before.id == null || after.id == null) {
    throw new Error("upsert ai counter: id should not be null");
  }
  assertEquals(after.id, before.id + 1, "upsert ai counter: update path must not consume");

  resetSheet("notifications", notificationData);
}

export { testUpsertAutoincrement };
