import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testExtendsChaining() {
  const client = new GassmaClient();

  let innerRole = "";

  const extendedA = client.$extends({
    query: {
      User: {
        findMany({ args, query }) {
          const where = Object.assign({}, args.where, { role: "ADMIN" });
          return query(Object.assign({}, args, { where }));
        },
      },
    },
  });

  const extendedB = extendedA.$extends({
    query: {
      User: {
        findMany({ args, query }) {
          const where = args.where;
          if (where && typeof where.role === "string") {
            innerRole = where.role;
          }
          return query(Object.assign({}, args, { take: 3 }));
        },
      },
    },
  });

  const expected = client.User.findMany({ where: { role: "ADMIN" }, take: 3 });
  if (expected.length <= 0) {
    throw new Error("extends chaining: expected admin users > 0");
  }

  const actual = extendedB.User.findMany({});
  assertEquals(innerRole, "ADMIN", "extends chaining: A(outer) args reach B(inner)");
  assertEquals(actual.length, expected.length, "extends chaining: both rewrites applied");
  actual.forEach((user) => {
    assertEquals(user.role, "ADMIN", "extends chaining: role filtered");
  });

  Logger.log("✅ testExtendsChaining: all passed");
}

export { testExtendsChaining };
