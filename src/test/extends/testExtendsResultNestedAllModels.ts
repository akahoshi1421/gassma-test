import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testExtendsResultNestedAllModels() {
  const client = new GassmaClient();

  const extended = client.$extends({
    result: {
      $allModels: {
        _tag: { compute: () => "gassma" },
      },
    },
  });

  const user = extended.User.findFirst({
    where: { id: 1 },
    include: { posts: { include: { comments: true } } },
  });
  if (!user) {
    throw new Error("extends resultNestedAllModels: user 1 not found");
  }
  if (user.posts.length <= 0) {
    throw new Error("extends resultNestedAllModels: expected user 1 posts > 0");
  }

  assertEquals(user._tag, "gassma", "extends resultNestedAllModels: top-level User _tag");

  let commentCount = 0;
  user.posts.forEach((post) => {
    assertEquals(post._tag, "gassma", "extends resultNestedAllModels: nested Post _tag");
    post.comments.forEach((comment) => {
      assertEquals(comment._tag, "gassma", "extends resultNestedAllModels: deep nested Comment _tag");
      commentCount += 1;
    });
  });

  if (commentCount <= 0) {
    throw new Error("extends resultNestedAllModels: expected at least one nested comment");
  }

  Logger.log("✅ testExtendsResultNestedAllModels: all passed");
}

export { testExtendsResultNestedAllModels };
