import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testExtendsBaseImmutable() {
  const client = new GassmaClient();

  const extended = client.$extends({
    query: {
      User: {
        findMany({ args, query }) {
          return query(Object.assign({}, args, { take: 5 }));
        },
      },
    },
  });

  const extendedUsers = extended.User.findMany({});
  assertEquals(extendedUsers.length, 5, "extends baseImmutable: extended take applied");

  const baseUsers = client.User.findMany({});
  assertEquals(baseUsers.length, 50, "extends baseImmutable: base client unaffected");

  Logger.log("✅ testExtendsBaseImmutable: all passed");
}

export { testExtendsBaseImmutable };
