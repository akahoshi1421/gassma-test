import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testInclude() {
  const client = new GassmaClient();

  testIncludeOneToOne(client);
  testIncludeOneToMany(client);
  testIncludeManyToOne(client);
  testIncludeManyToMany(client);
  testIncludeWithWhere(client);
  testIncludeNested(client);
  testIncludeCount(client);

  Logger.log("✅ testInclude: all passed");
}

function testIncludeOneToOne(client: GassmaClient) {
  const user = client.sheets.User.findFirst({
    where: { id: 1 },
    include: { profile: true },
  });
  if (user === null) throw new Error("include 1:1: user not found");
  if (!("profile" in user)) throw new Error("include 1:1: profile missing");
  const profile = user.profile as Record<string, unknown>;
  assertEquals(profile.userId, 1, "include 1:1 profile userId");
}

function testIncludeOneToMany(client: GassmaClient) {
  const user = client.sheets.User.findFirst({
    where: { id: 1 },
    include: { posts: true },
  });
  if (user === null) throw new Error("include 1:M: user not found");
  if (!("posts" in user)) throw new Error("include 1:M: posts missing");
  const posts = user.posts as Record<string, unknown>[];
  if (!Array.isArray(posts)) throw new Error("include 1:M: posts not array");
  posts.forEach((post) => {
    assertEquals(post.authorId, 1, "include 1:M post authorId");
  });
}

function testIncludeManyToOne(client: GassmaClient) {
  const post = client.sheets.Post.findFirst({
    where: { id: 1 },
    include: { author: true },
  });
  if (post === null) throw new Error("include M:1: post not found");
  if (!("author" in post)) throw new Error("include M:1: author missing");
  const author = post.author as Record<string, unknown>;
  assertEquals(author.id, post.authorId, "include M:1 author id matches authorId");
}

function testIncludeManyToMany(client: GassmaClient) {
  const post = client.sheets.Post.findFirst({
    where: { id: 1 },
    include: { tags: true },
  });
  if (post === null) throw new Error("include M:M: post not found");
  if (!("tags" in post)) throw new Error("include M:M: tags missing");
  const tags = post.tags as Record<string, unknown>[];
  if (!Array.isArray(tags)) throw new Error("include M:M: tags not array");
}

function testIncludeWithWhere(client: GassmaClient) {
  const user = client.sheets.User.findFirst({
    where: { id: 1 },
    include: {
      posts: {
        where: { published: true },
      },
    },
  });
  if (user === null) throw new Error("include where: user not found");
  const posts = (user as Record<string, unknown>).posts as Record<string, unknown>[];
  posts.forEach((post) => {
    assertEquals(post.published, true, "include where published");
  });
}

function testIncludeNested(client: GassmaClient) {
  const user = client.sheets.User.findFirst({
    where: { id: 1 },
    include: {
      posts: {
        include: { comments: true },
      },
    },
  });
  if (user === null) throw new Error("include nested: user not found");
  const posts = (user as Record<string, unknown>).posts as Record<string, unknown>[];
  if (posts.length > 0) {
    const firstPost = posts[0];
    if (!("comments" in firstPost)) {
      throw new Error("include nested: comments missing in post");
    }
  }
}

function testIncludeCount(client: GassmaClient) {
  const user = client.sheets.User.findFirst({
    where: { id: 1 },
    include: {
      _count: {
        select: {
          posts: true,
          comments: true,
        },
      },
    },
  });
  if (user === null) throw new Error("include _count: user not found");
  if (!("_count" in user)) throw new Error("include _count: _count missing");
  const count = (user as Record<string, unknown>)._count as Record<string, number>;
  if (typeof count.posts !== "number") throw new Error("include _count: posts not number");
  if (typeof count.comments !== "number") throw new Error("include _count: comments not number");
}

export { testInclude };
