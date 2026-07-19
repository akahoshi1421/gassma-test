import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testExtendsModelOperation() {
  const client = new GassmaClient();

  let seenModel = "";
  let seenOperation = "";

  const extended = client.$extends({
    query: {
      User: {
        findMany({ model, operation, args, query }) {
          seenModel = model;
          seenOperation = operation;
          return query(args);
        },
      },
    },
  });

  extended.User.findMany({ take: 1 });

  assertEquals(seenModel, "User", "extends modelOperation: model");
  assertEquals(seenOperation, "findMany", "extends modelOperation: operation");

  Logger.log("✅ testExtendsModelOperation: all passed");
}

export { testExtendsModelOperation };
