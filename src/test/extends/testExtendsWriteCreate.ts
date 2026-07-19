import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { notificationData } from "../../consts/notificationData";

function testExtendsWriteCreate() {
  const client = new GassmaClient();

  const extended = client.$extends({
    query: {
      Notification: {
        create({ args, query }) {
          const data = Object.assign({}, args.data, { isRead: true });
          return query(Object.assign({}, args, { data }));
        },
      },
    },
  });

  const created = extended.Notification.create({
    data: { id: 9001, userId: 1, message: "extends write test" },
  });
  assertEquals(created.isRead, true, "extends writeCreate: return isRead injected");

  const snapshot = getSheetSnapshot("notifications");
  snapshot.assertRowEquals(
    { id: 9001 },
    { userId: 1, message: "extends write test", isRead: true },
  );

  resetSheet("notifications", notificationData);

  Logger.log("✅ testExtendsWriteCreate: all passed");
}

export { testExtendsWriteCreate };
