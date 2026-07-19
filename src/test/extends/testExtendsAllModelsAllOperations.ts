import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { assertDeepEquals } from "../../assert/assertDeepEquals";

function testExtendsAllModelsAllOperations() {
  const client = new GassmaClient();

  const operations: string[] = [];

  const extended = client.$extends({
    query: {
      $allModels: {
        $allOperations({ model, operation, args, query }) {
          operations.push(`${model}.${operation}`);
          return query(args);
        },
      },
    },
  });

  const users = extended.User.findMany({});
  assertEquals(users.length, 50, "extends allModels: User.findMany count");

  const postCount = extended.Post.count({});
  assertEquals(postCount, 200, "extends allModels: Post.count");

  const comment = extended.Comment.findFirst({ where: { id: 1 } });
  if (!comment) {
    throw new Error("extends allModels: Comment.findFirst returned null");
  }
  assertEquals(comment.id, 1, "extends allModels: Comment.findFirst id");

  assertDeepEquals(
    operations,
    ["User.findMany", "Post.count", "Comment.findFirst"],
    "extends allModels: all operations passed through hook",
  );

  Logger.log("✅ testExtendsAllModelsAllOperations: all passed");
}

export { testExtendsAllModelsAllOperations };
