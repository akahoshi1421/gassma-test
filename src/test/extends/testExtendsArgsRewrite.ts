import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testExtendsArgsRewrite() {
  const client = new GassmaClient();

  const extended = client.$extends({
    query: {
      User: {
        findMany({ args, query }) {
          const where = Object.assign({}, args.where, { role: "ADMIN" });
          return query(Object.assign({}, args, { where }));
        },
      },
    },
  });

  const expected = client.User.findMany({ where: { role: "ADMIN" } });
  if (expected.length <= 0) {
    throw new Error("extends argsRewrite: expected admin users > 0");
  }

  const actual = extended.User.findMany({});
  assertEquals(actual.length, expected.length, "extends argsRewrite: admin count");
  actual.forEach((user) => {
    assertEquals(user.role, "ADMIN", "extends argsRewrite: role filtered");
  });

  Logger.log("✅ testExtendsArgsRewrite: all passed");
}

export { testExtendsArgsRewrite };
