import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { resetSheet } from "../../reset/resetSheet";
import { notificationData } from "../../consts/notificationData";

function testAutoincrement() {
  const client = new GassmaClient();

  testAutoincrementCreate(client);
  testAutoincrementCreateExplicitId(client);
  testAutoincrementCreateMany(client);
  testAutoincrementCreateManyAndReturn(client);
  testAutoincrementSequential(client);

  Logger.log("✅ testAutoincrement: all passed");
}

function testAutoincrementCreate(client: GassmaClient) {
  // id を指定しなくても自動採番される
  const result = client.sheets.Notification.create({
    data: {
      userId: 1,
      message: "autoincrement test",
    },
  });

  if (typeof result.id !== "number") {
    throw new Error(`autoincrement create: expected id to be number, got ${typeof result.id}`);
  }
  if (result.id <= 0) {
    throw new Error(`autoincrement create: expected id > 0, got ${result.id}`);
  }
  assertEquals(result.message, "autoincrement test", "autoincrement create: message");

  resetSheet("notifications", notificationData);
}

function testAutoincrementCreateExplicitId(client: GassmaClient) {
  // 明示的に id を指定した場合はその値が使われる
  const result = client.sheets.Notification.create({
    data: {
      id: 9999,
      userId: 1,
      message: "explicit id test",
    },
  });

  assertEquals(result.id, 9999, "autoincrement explicit: id should be 9999");

  resetSheet("notifications", notificationData);
}

function testAutoincrementCreateMany(client: GassmaClient) {
  // createMany でも自動採番される
  client.sheets.Notification.createMany({
    data: [
      { userId: 1, message: "many 1" },
      { userId: 2, message: "many 2" },
      { userId: 3, message: "many 3" },
    ],
  });

  // 元データ 5 件 + 3 件 = 8 件のはず
  const all = client.sheets.Notification.findMany({});
  assertEquals(all.length, 8, "autoincrement createMany: total count");

  // 新規作成された 3 件は id が採番されている
  const newOnes = all.filter((n) => n.message.startsWith("many "));
  assertEquals(newOnes.length, 3, "autoincrement createMany: new count");

  newOnes.forEach((n) => {
    if (typeof n.id !== "number" || n.id <= 0) {
      throw new Error(`autoincrement createMany: invalid id ${n.id}`);
    }
  });

  resetSheet("notifications", notificationData);
}

function testAutoincrementCreateManyAndReturn(client: GassmaClient) {
  // createManyAndReturn の戻り値にも採番された id が含まれる
  const results = client.sheets.Notification.createManyAndReturn({
    data: [
      { userId: 1, message: "return 1" },
      { userId: 2, message: "return 2" },
    ],
  });

  assertEquals(results.length, 2, "autoincrement createManyAndReturn: count");

  results.forEach((r) => {
    if (typeof r.id !== "number" || r.id <= 0) {
      throw new Error(`autoincrement createManyAndReturn: invalid id ${r.id}`);
    }
  });

  // 2 つの id は異なるはず
  if (results[0].id === results[1].id) {
    throw new Error("autoincrement createManyAndReturn: ids should be unique");
  }

  resetSheet("notifications", notificationData);
}

function testAutoincrementSequential(client: GassmaClient) {
  // 連続 create で id が単調増加する
  const r1 = client.sheets.Notification.create({
    data: { userId: 1, message: "seq 1" },
  });
  const r2 = client.sheets.Notification.create({
    data: { userId: 1, message: "seq 2" },
  });

  if (r1.id == null || r2.id == null) {
    throw new Error("autoincrement sequential: id should not be null/undefined");
  }
  if (r2.id <= r1.id) {
    throw new Error(
      `autoincrement sequential: expected r2.id (${r2.id}) > r1.id (${r1.id})`,
    );
  }

  resetSheet("notifications", notificationData);
}

export { testAutoincrement };
