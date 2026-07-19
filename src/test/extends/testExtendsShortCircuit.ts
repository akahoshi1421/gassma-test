import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";

function testExtendsShortCircuit() {
  const client = new GassmaClient();

  const extended = client.$extends({
    query: {
      User: {
        findMany() {
          return [];
        },
        deleteMany() {
          return { count: 0 };
        },
      },
    },
  });

  const users = extended.User.findMany({});
  assertEquals(users.length, 0, "extends shortCircuit: findMany stub result");

  const deleted = extended.User.deleteMany({});
  assertEquals(deleted.count, 0, "extends shortCircuit: deleteMany stub result");

  const snapshot = getSheetSnapshot("User");
  snapshot.assertCount(50);

  Logger.log("✅ testExtendsShortCircuit: all passed");
}

export { testExtendsShortCircuit };
