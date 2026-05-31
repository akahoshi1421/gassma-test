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
  const user = client.User.findFirst({
    where: { id: 1 },
    include: { profile: true },
  });
  if (user === null) throw new Error("include 1:1: user not found");
  if (!user.profile) throw new Error("include 1:1: profile missing");
  assertEquals(user.profile.userId, 1, "include 1:1 profile userId");
}

function testIncludeOneToMany(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    include: { posts: true },
  });
  if (user === null) throw new Error("include 1:M: user not found");
  if (!Array.isArray(user.posts))
    throw new Error("include 1:M: posts not array");
  user.posts.forEach((post) => {
    assertEquals(post.authorId, 1, "include 1:M post authorId");
  });
}

function testIncludeManyToOne(client: GassmaClient) {
  const post = client.Post.findFirst({
    where: { id: 1 },
    include: { author: true },
  });
  if (post === null) throw new Error("include M:1: post not found");
  assertEquals(
    post.author.id,
    post.authorId,
    "include M:1 author id matches authorId",
  );
}

function testIncludeManyToMany(client: GassmaClient) {
  const post = client.Post.findFirst({
    where: { id: 1 },
    include: { tags: true },
  });
  if (post === null) throw new Error("include M:M: post not found");
  if (!Array.isArray(post.tags))
    throw new Error("include M:M: tags not array");
}

function testIncludeWithWhere(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    include: {
      posts: {
        where: { published: true },
      },
    },
  });
  if (user === null) throw new Error("include where: user not found");
  user.posts.forEach((post) => {
    assertEquals(post.published, true, "include where published");
  });
}

function testIncludeNested(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    include: {
      posts: {
        include: { comments: true },
      },
    },
  });
  if (user === null) throw new Error("include nested: user not found");
  if (user.posts.length > 0) {
    const firstPost = user.posts[0];
    if (!Array.isArray(firstPost.comments)) {
      throw new Error("include nested: comments missing in post");
    }
  }
}

function testIncludeCount(client: GassmaClient) {
  const user = client.User.findFirst({
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
  if (typeof user._count.posts !== "number")
    throw new Error("include _count: posts not number");
  if (typeof user._count.comments !== "number")
    throw new Error("include _count: comments not number");
}

export { testInclude };
