import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testExtendsResultNestedBoundary() {
  const client = new GassmaClient();

  const extended = client.$extends({
    result: {
      Post: {
        headline: {
          needs: { title: true },
          compute: (post) => `# ${post.title}`,
        },
      },
    },
  });

  const topPost = extended.Post.findFirst({ where: { id: 1 } });
  if (!topPost) {
    throw new Error("extends resultNestedBoundary: post 1 not found");
  }
  assertEquals(topPost.headline, "# Building Scalable APIs #1", "extends resultNestedBoundary: top-level Post computed");

  const withInclude = extended.Post.findFirst({ where: { id: 1 }, include: { author: true } });
  if (!withInclude) {
    throw new Error("extends resultNestedBoundary: post 1 with include not found");
  }
  assertEquals(
    withInclude.headline,
    "# Building Scalable APIs #1",
    "extends resultNestedBoundary: top-level computed with include",
  );

  const users = extended.User.findMany({ where: { id: 1 }, include: { posts: true } });
  assertEquals(users.length, 1, "extends resultNestedBoundary: user found");
  assertEquals("headline" in users[0], false, "extends resultNestedBoundary: other model untouched");

  const posts = users[0].posts;
  if (posts.length <= 0) {
    throw new Error("extends resultNestedBoundary: expected user 1 posts > 0");
  }
  posts.forEach((post) => {
    assertEquals("headline" in post, false, "extends resultNestedBoundary: nested Post has no computed");
    assertEquals("title" in post, true, "extends resultNestedBoundary: nested Post keeps scalars");
  });

  Logger.log("✅ testExtendsResultNestedBoundary: all passed");
}

export { testExtendsResultNestedBoundary };
