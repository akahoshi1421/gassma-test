import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testExtendsResultTransform() {
  const client = new GassmaClient();

  let findManyRows = -1;
  let countValue = -1;

  const extended = client.$extends({
    query: {
      User: {
        findMany({ args, query }) {
          const rows = query(args);
          findManyRows = rows.length;
          return rows;
        },
        count({ args, query }) {
          const value = query(args);
          countValue = value;
          return value;
        },
      },
    },
  });

  const users = extended.User.findMany({});
  assertEquals(users.length, 50, "extends resultTransform: findMany result");
  assertEquals(findManyRows, 50, "extends resultTransform: hook saw rows");

  const count = extended.User.count({});
  assertEquals(count, 50, "extends resultTransform: count result");
  assertEquals(countValue, 50, "extends resultTransform: hook saw count");

  Logger.log("✅ testExtendsResultTransform: all passed");
}

export { testExtendsResultTransform };
