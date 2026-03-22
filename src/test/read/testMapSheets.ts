import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testMapSheets() {
  testMapSheetsFindFirst();
  testMapSheetsFindMany();
  testMapSheetsWhere();
  testMapSheetsCreate();
  testMapSheetsCodeNameAccess();

  Logger.log("✅ testMapSheets: all passed");
}

function testMapSheetsFindFirst() {
  // @@map("notifications") により、コード上は Notification でアクセスし、
  // 実際のシート名は "notifications"
  const client = new GassmaClient();

  const notification = client.Notification.findFirst({ where: { id: 1 } });
  if (!notification) throw new Error("mapSheets findFirst: got null");

  assertEquals(notification.id, 1, "mapSheets findFirst: id");
  assertEquals(notification.userId, 1, "mapSheets findFirst: userId");
  assertEquals(notification.message, "Welcome to the platform!", "mapSheets findFirst: message");
  assertEquals(notification.isRead, true, "mapSheets findFirst: isRead");
}

function testMapSheetsFindMany() {
  const client = new GassmaClient();

  const notifications = client.Notification.findMany({
    where: { userId: 2 },
  });
  assertEquals(notifications.length, 2, "mapSheets findMany: count for userId=2");
  assertEquals(notifications[0].message, "You have a new follower.", "mapSheets findMany: first message");
  assertEquals(notifications[1].message, "New comment on your post.", "mapSheets findMany: second message");
}

function testMapSheetsWhere() {
  // isRead で検索できる
  const client = new GassmaClient();

  const readNotifications = client.Notification.findMany({
    where: { isRead: true },
  });
  assertEquals(readNotifications.length, 2, "mapSheets where: isRead true count");
}

function testMapSheetsCreate() {
  // @@map されたモデルで create/delete ができる
  const client = new GassmaClient();

  const created = client.Notification.create({
    data: {
      id: 9999,
      userId: 1,
      message: "Test notification",
    },
  });

  assertEquals(created.id, 9999, "mapSheets create: id");
  assertEquals(created.message, "Test notification", "mapSheets create: message");
  assertEquals(created.isRead, false, "mapSheets create: default isRead");

  // 後片付け
  client.Notification.delete({ where: { id: 9999 } });
}

function testMapSheetsCodeNameAccess() {
  // クライアント上のキーは "Notification"（コード名）であり "notifications"（シート名）ではない
  const client = new GassmaClient();
  const clientRecord = client as unknown as Record<string, unknown>;

  if (clientRecord["Notification"] === undefined) {
    throw new Error("mapSheets codeName: Notification should be accessible");
  }
  // "notifications" というキーではアクセスできないことを確認
  if (clientRecord["notifications"] !== undefined) {
    throw new Error("mapSheets codeName: raw sheet name 'notifications' should not be a key");
  }
}

export { testMapSheets };
