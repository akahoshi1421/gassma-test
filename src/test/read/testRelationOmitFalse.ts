import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testRelationOmitFalse() {
  testIncludeRelationOmitFalse();
  testIncludeRelationOmitFalseTrueMixed();
  testSelectRelationOmitFalse();
  testNestedIncludeRelationOmitFalse();
  testIncludeRelationOmitTruthy();

  Logger.log("✅ testRelationOmitFalse: all passed");
}

// include 内 relation の omit: { field: false } でターゲットの globalOmit を解除できる
function testIncludeRelationOmitFalse() {
  const client = new GassmaClient({ omit: { Post: { content: true } } });

  // 前提: include: { posts: true } では globalOmit が適用される
  const baseline = client.User.findFirst({
    where: { id: 1 },
    include: { posts: true },
  });
  if (!baseline) throw new Error("relation omit false baseline: user null");
  if (baseline.posts.length === 0)
    throw new Error("relation omit false baseline: no posts");
  baseline.posts.forEach((post) => {
    assertEquals("content" in post, false, "relation omit false baseline: content omitted");
  });

  const user = client.User.findFirst({
    where: { id: 1 },
    include: { posts: { omit: { content: false } } },
  });
  if (!user) throw new Error("relation omit false: user null");
  if (user.posts.length === 0) throw new Error("relation omit false: no posts");
  user.posts.forEach((post) => {
    assertEquals("content" in post, true, "relation omit false: content present");
    assertEquals("title" in post, true, "relation omit false: title present");
  });
}

// false（解除）と true（除外）の混在
function testIncludeRelationOmitFalseTrueMixed() {
  const client = new GassmaClient({ omit: { Post: { content: true } } });

  const user = client.User.findFirst({
    where: { id: 1 },
    include: { posts: { omit: { content: false, published: true } } },
  });
  if (!user) throw new Error("relation omit mixed: user null");
  if (user.posts.length === 0) throw new Error("relation omit mixed: no posts");
  user.posts.forEach((post) => {
    assertEquals("content" in post, true, "relation omit mixed: content present (false)");
    assertEquals("published" in post, false, "relation omit mixed: published omitted (true)");
    assertEquals("title" in post, true, "relation omit mixed: title present");
  });
}

// select 内 relation の omit: { field: false } でも解除できる
function testSelectRelationOmitFalse() {
  const client = new GassmaClient({ omit: { Post: { content: true } } });

  const user = client.User.findFirst({
    where: { id: 1 },
    select: { id: true, posts: { omit: { content: false } } },
  });
  if (!user) throw new Error("select relation omit false: user null");
  assertEquals("id" in user, true, "select relation omit false: has id");
  assertEquals("email" in user, false, "select relation omit false: no email");
  if (user.posts.length === 0)
    throw new Error("select relation omit false: no posts");
  user.posts.forEach((post) => {
    assertEquals("content" in post, true, "select relation omit false: content present");
  });
}

// 2段ネスト（User → comments → post）でも globalOmit 解除が効く
function testNestedIncludeRelationOmitFalse() {
  const client = new GassmaClient({ omit: { Post: { content: true } } });

  // 前提: 2段ネストでも globalOmit が適用される
  const baseline = client.User.findFirst({
    where: { id: 1 },
    include: { comments: { include: { post: true } } },
  });
  if (!baseline) throw new Error("nested relation omit baseline: user null");
  if (baseline.comments.length === 0)
    throw new Error("nested relation omit baseline: no comments");
  baseline.comments.forEach((comment) => {
    if (!comment.post)
      throw new Error("nested relation omit baseline: post missing");
    assertEquals("content" in comment.post, false, "nested relation omit baseline: content omitted");
  });

  const user = client.User.findFirst({
    where: { id: 1 },
    include: { comments: { include: { post: { omit: { content: false } } } } },
  });
  if (!user) throw new Error("nested relation omit false: user null");
  if (user.comments.length === 0)
    throw new Error("nested relation omit false: no comments");
  user.comments.forEach((comment) => {
    if (!comment.post)
      throw new Error("nested relation omit false: post missing");
    assertEquals("content" in comment.post, true, "nested relation omit false: content present");
    assertEquals("title" in comment.post, true, "nested relation omit false: title present");
  });
}

// 非回帰: omit: { field: true } は従来通り除外される
function testIncludeRelationOmitTruthy() {
  const client = new GassmaClient({ omit: { Post: { content: true } } });

  const user = client.User.findFirst({
    where: { id: 1 },
    include: { posts: { omit: { content: true } } },
  });
  if (!user) throw new Error("relation omit truthy: user null");
  if (user.posts.length === 0) throw new Error("relation omit truthy: no posts");
  user.posts.forEach((post) => {
    assertEquals("content" in post, false, "relation omit truthy: content omitted");
    assertEquals("title" in post, true, "relation omit truthy: title present");
  });
}

export { testRelationOmitFalse };
