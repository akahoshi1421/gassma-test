import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testExtendsResultAllModels() {
  const client = new GassmaClient();

  const extended = client.$extends({
    result: {
      $allModels: {
        _tag: { compute: () => "gassma" },
      },
    },
  });

  const users = extended.User.findMany({ take: 3 });
  assertEquals(users.length, 3, "extends resultAllModels: User rows");
  users.forEach((user) => {
    assertEquals(user._tag, "gassma", "extends resultAllModels: User _tag");
  });

  const posts = extended.Post.findMany({ take: 3 });
  assertEquals(posts.length, 3, "extends resultAllModels: Post rows");
  posts.forEach((post) => {
    assertEquals(post._tag, "gassma", "extends resultAllModels: Post _tag");
  });

  Logger.log("✅ testExtendsResultAllModels: all passed");
}

export { testExtendsResultAllModels };
