import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testExtendsResultNested() {
  const client = new GassmaClient();

  const extended = client.$extends({
    result: {
      User: {
        greeting: {
          needs: { name: true },
          compute: (user) => `Hi ${user.name}`,
        },
      },
      Post: {
        headline: {
          needs: { title: true },
          compute: (post) => `# ${post.title}`,
        },
      },
    },
  });

  const base = client.User.findFirst({ where: { id: 1 }, include: { posts: true } });
  if (!base) {
    throw new Error("extends resultNested: base user 1 not found");
  }
  if (base.posts.length <= 0) {
    throw new Error("extends resultNested: expected user 1 posts > 0");
  }

  const user = extended.User.findFirst({ where: { id: 1 }, include: { posts: true } });
  if (!user) {
    throw new Error("extends resultNested: extended user 1 not found");
  }

  assertEquals(user.greeting, `Hi ${base.name}`, "extends resultNested: top-level User computed");
  assertEquals(user.posts.length, base.posts.length, "extends resultNested: nested count preserved");
  user.posts.forEach((post, i) => {
    assertEquals(post.id, base.posts[i].id, "extends resultNested: nested order preserved");
    assertEquals(post.headline, `# ${base.posts[i].title}`, "extends resultNested: nested Post computed");
    assertEquals(post.title, base.posts[i].title, "extends resultNested: nested scalar kept");
  });

  assertEquals("headline" in user, false, "extends resultNested: computed stays model-scoped");

  Logger.log("✅ testExtendsResultNested: all passed");
}

export { testExtendsResultNested };
