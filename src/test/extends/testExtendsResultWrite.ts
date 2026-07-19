import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { notificationData } from "../../consts/notificationData";

function testExtendsResultWrite() {
  const client = new GassmaClient();

  const extended = client.$extends({
    result: {
      Notification: {
        summary: {
          needs: { message: true, isRead: true },
          compute: (notification) => `${notification.message} [isRead=${notification.isRead}]`,
        },
      },
    },
  });

  const created = extended.Notification.create({
    data: { id: 9101, userId: 1, message: "extends result write" },
  });
  assertEquals(
    created.summary,
    "extends result write [isRead=false]",
    "extends resultWrite: create return has computed field",
  );
  assertEquals(created.message, "extends result write", "extends resultWrite: base field kept");

  const snapshot = getSheetSnapshot("notifications");
  snapshot.assertRowEquals(
    { id: 9101 },
    { userId: 1, message: "extends result write", isRead: false },
  );

  resetSheet("notifications", notificationData);

  Logger.log("✅ testExtendsResultWrite: all passed");
}

export { testExtendsResultWrite };
