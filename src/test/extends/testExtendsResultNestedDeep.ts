import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testExtendsResultNestedDeep() {
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
      Comment: {
        preview: {
          needs: { text: true },
          compute: (comment) => `> ${comment.text}`,
        },
      },
    },
  });

  const base = client.User.findFirst({
    where: { id: 1 },
    include: { posts: { include: { comments: true } } },
  });
  if (!base) {
    throw new Error("extends resultNestedDeep: base user 1 not found");
  }

  const user = extended.User.findFirst({
    where: { id: 1 },
    include: { posts: { include: { comments: true } } },
  });
  if (!user) {
    throw new Error("extends resultNestedDeep: extended user 1 not found");
  }

  assertEquals(user.greeting, `Hi ${base.name}`, "extends resultNestedDeep: top-level User computed");

  let commentCount = 0;
  user.posts.forEach((post, i) => {
    const basePost = base.posts[i];
    assertEquals(post.id, basePost.id, "extends resultNestedDeep: nested Post order preserved");
    assertEquals(post.headline, `# ${basePost.title}`, "extends resultNestedDeep: nested Post computed");
    post.comments.forEach((comment, j) => {
      const baseComment = basePost.comments[j];
      assertEquals(comment.id, baseComment.id, "extends resultNestedDeep: nested Comment order preserved");
      assertEquals(comment.preview, `> ${baseComment.text}`, "extends resultNestedDeep: deep nested Comment computed");
      commentCount += 1;
    });
  });

  if (commentCount <= 0) {
    throw new Error("extends resultNestedDeep: expected at least one nested comment");
  }

  Logger.log("✅ testExtendsResultNestedDeep: all passed");
}

export { testExtendsResultNestedDeep };
