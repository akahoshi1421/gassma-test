import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testExtendsResultBasic() {
  const client = new GassmaClient();

  const extended = client.$extends({
    result: {
      User: {
        greeting: {
          needs: { name: true },
          compute: (user) => `Hi ${user.name}`,
        },
      },
    },
  });

  const baseUsers = client.User.findMany({});
  if (baseUsers.length <= 0) {
    throw new Error("extends resultBasic: expected users > 0");
  }

  const users = extended.User.findMany({});
  assertEquals(users.length, baseUsers.length, "extends resultBasic: findMany count");
  users.forEach((user, i) => {
    assertEquals(user.id, baseUsers[i].id, "extends resultBasic: same row order");
    assertEquals(user.greeting, `Hi ${baseUsers[i].name}`, "extends resultBasic: greeting value");
  });

  const first = extended.User.findFirst({ where: { id: 1 } });
  if (!first) {
    throw new Error("extends resultBasic: findFirst returned null");
  }
  assertEquals(first.greeting, "Hi Chris Jackson", "extends resultBasic: findFirst greeting");
  assertEquals(first.name, "Chris Jackson", "extends resultBasic: base field kept");

  Logger.log("✅ testExtendsResultBasic: all passed");
}

export { testExtendsResultBasic };
