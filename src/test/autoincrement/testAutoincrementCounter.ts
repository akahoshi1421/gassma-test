import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { notificationData } from "../../consts/notificationData";

// notificationData の最大 id。$syncAutoincrement が返す値の根拠
const NOTIFICATION_MAX_ID = 5;

function testAutoincrementCounter(client: GassmaClient) {
  testGetIsNextIssuedValue(client);
  testSetMovesCounter(client);
  testSyncFollowsColumnMax(client);

  Logger.log("✅ testAutoincrementCounter: all passed");
}

function testGetIsNextIssuedValue(client: GassmaClient) {
  // $getAutoincrement は「次に発行される値」= 直後の create が受け取る id
  const next = client.Notification.$getAutoincrement("id");

  const created = client.Notification.create({
    data: { userId: 1, message: "counter get" },
  });

  assertEquals(
    created.id,
    next,
    "counter get: create issues the value $getAutoincrement returned",
  );
  assertEquals(
    client.Notification.$getAutoincrement("id"),
    next + 1,
    "counter get: the counter advances by one",
  );

  resetSheet("notifications", notificationData);
}

function testSetMovesCounter(client: GassmaClient) {
  client.Notification.$setAutoincrement("id", 7000);

  assertEquals(
    client.Notification.$getAutoincrement("id"),
    7000,
    "counter set: $getAutoincrement returns what was set",
  );

  const created = client.Notification.create({
    data: { userId: 1, message: "counter set" },
  });

  assertEquals(
    created.id,
    7000,
    "counter set: create issues the value that was set",
  );
  getSheetSnapshot("notifications").assertRowEquals(
    { message: "counter set" },
    { id: 7000 },
  );
  assertEquals(
    client.Notification.$getAutoincrement("id"),
    7001,
    "counter set: the counter advances from the value that was set",
  );

  resetSheet("notifications", notificationData);
}

function testSyncFollowsColumnMax(client: GassmaClient) {
  // シートと無関係な値へずらしてから、列の実態に引き戻せることを見る
  client.Notification.$setAutoincrement("id", 7000);

  const synced = client.Notification.$syncAutoincrement("id");

  assertEquals(
    synced,
    NOTIFICATION_MAX_ID + 1,
    "counter sync: $syncAutoincrement returns the column max plus one",
  );
  assertEquals(
    client.Notification.$getAutoincrement("id"),
    NOTIFICATION_MAX_ID + 1,
    "counter sync: the synced value is what will be issued next",
  );

  const created = client.Notification.create({
    data: { userId: 1, message: "counter sync" },
  });

  assertEquals(
    created.id,
    NOTIFICATION_MAX_ID + 1,
    "counter sync: create issues the synced value",
  );
  getSheetSnapshot("notifications").assertRowEquals(
    { message: "counter sync" },
    { id: NOTIFICATION_MAX_ID + 1 },
  );

  resetSheet("notifications", notificationData);
}

export { testAutoincrementCounter };
