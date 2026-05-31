import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testSelectRelation() {
  const client = new GassmaClient();

  testSelectWithRelationTrue(client);
  testSelectWithRelationWhere(client);
  testSelectWithRelationOrderBy(client);
  testSelectOnlyRelation(client);
  testSelectRelationWithCount(client);
  testSelectRelationManyToOne(client);
  testSelectNestedSelect(client);
  testSelectDeeplyNested(client);
  testSelectFindMany(client);
  testSelectFindManyNested(client);

  Logger.log("✅ testSelectRelation: all passed");
}

function testSelectWithRelationTrue(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    select: { id: true, name: true, posts: true },
  });
  if (user === null) throw new Error("selectRelTrue: user not found");

  assertEquals("id" in user, true, "selectRelTrue: has id");
  assertEquals("name" in user, true, "selectRelTrue: has name");
  assertEquals("email" in user, false, "selectRelTrue: no email");
  assertEquals("age" in user, false, "selectRelTrue: no age");

  if (!Array.isArray(user.posts))
    throw new Error("selectRelTrue: posts not array");
  user.posts.forEach((post) => {
    assertEquals(post.authorId, 1, "selectRelTrue: post authorId");
  });
}

function testSelectWithRelationWhere(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    select: {
      id: true,
      posts: { where: { published: true } },
    },
  });
  if (user === null) throw new Error("selectRelWhere: user not found");
  assertEquals("id" in user, true, "selectRelWhere: has id");
  assertEquals("email" in user, false, "selectRelWhere: no email");

  if (!Array.isArray(user.posts))
    throw new Error("selectRelWhere: posts not array");
  user.posts.forEach((post) => {
    assertEquals(post.published, true, "selectRelWhere: published");
    assertEquals(post.authorId, 1, "selectRelWhere: authorId");
  });
}

function testSelectWithRelationOrderBy(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    select: {
      id: true,
      posts: { orderBy: { id: "asc" } },
    },
  });
  if (user === null) throw new Error("selectRelOrder: user not found");

  if (user.posts.length >= 2) {
    const ids: number[] = [];
    user.posts.forEach((p) => {
      if (p.id !== null) ids.push(p.id);
    });
    ids.reduce((prev, curr) => {
      if (curr < prev) throw new Error("selectRelOrder: not ascending");
      return curr;
    });
  }
}

function testSelectOnlyRelation(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    select: { posts: true },
  });
  if (user === null) throw new Error("selectOnlyRel: user not found");
  assertEquals("id" in user, false, "selectOnlyRel: no id");
  assertEquals("name" in user, false, "selectOnlyRel: no name");

  if (!Array.isArray(user.posts))
    throw new Error("selectOnlyRel: posts not array");
}

function testSelectRelationWithCount(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    select: {
      id: true,
      posts: true,
      _count: { select: { comments: true } },
    },
  });
  if (user === null) throw new Error("selectRelCount: user not found");
  assertEquals("id" in user, true, "selectRelCount: has id");
  assertEquals("email" in user, false, "selectRelCount: no email");

  if (!Array.isArray(user.posts))
    throw new Error("selectRelCount: posts not array");

  if (typeof user._count.comments !== "number")
    throw new Error("selectRelCount: comments count not number");
}

function testSelectRelationManyToOne(client: GassmaClient) {
  const post = client.Post.findFirst({
    where: { id: 1 },
    select: {
      id: true,
      title: true,
      author: true,
    },
  });
  if (post === null) throw new Error("selectRelM2O: post not found");
  assertEquals("id" in post, true, "selectRelM2O: has id");
  assertEquals("title" in post, true, "selectRelM2O: has title");
  assertEquals("content" in post, false, "selectRelM2O: no content");

  if (typeof post.author.id !== "number")
    throw new Error("selectRelM2O: author id not number");
}

function testSelectNestedSelect(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    select: {
      id: true,
      name: true,
      posts: {
        select: { id: true, title: true },
        where: { published: true },
      },
    },
  });
  if (user === null) throw new Error("selectNested: user not found");
  assertEquals("id" in user, true, "selectNested: has id");
  assertEquals("name" in user, true, "selectNested: has name");
  assertEquals("email" in user, false, "selectNested: no email");

  if (!Array.isArray(user.posts))
    throw new Error("selectNested: posts not array");
  user.posts.forEach((post) => {
    assertEquals("id" in post, true, "selectNested: post has id");
    assertEquals("title" in post, true, "selectNested: post has title");
    assertEquals("content" in post, false, "selectNested: post no content");
    assertEquals("authorId" in post, false, "selectNested: post no authorId");
  });
}

function testSelectDeeplyNested(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    select: {
      id: true,
      posts: {
        select: {
          id: true,
          title: true,
          comments: {
            select: { id: true, text: true },
          },
        },
      },
    },
  });
  if (user === null) throw new Error("selectDeep: user not found");
  assertEquals("id" in user, true, "selectDeep: has id");
  assertEquals("name" in user, false, "selectDeep: no name");

  if (!Array.isArray(user.posts))
    throw new Error("selectDeep: posts not array");
  user.posts.forEach((post) => {
    assertEquals("id" in post, true, "selectDeep: post has id");
    assertEquals("title" in post, true, "selectDeep: post has title");
    assertEquals("content" in post, false, "selectDeep: post no content");

    if (!Array.isArray(post.comments))
      throw new Error("selectDeep: comments not array");
    post.comments.forEach((comment) => {
      assertEquals("id" in comment, true, "selectDeep: comment has id");
      assertEquals("text" in comment, true, "selectDeep: comment has text");
      assertEquals(
        "authorId" in comment,
        false,
        "selectDeep: comment no authorId",
      );
      assertEquals("postId" in comment, false, "selectDeep: comment no postId");
    });
  });
}

function testSelectFindMany(client: GassmaClient) {
  const users = client.User.findMany({
    where: { role: "ADMIN" },
    select: {
      id: true,
      name: true,
      posts: { where: { published: true } },
    },
  });
  users.forEach((user) => {
    assertEquals("id" in user, true, "selectFM: has id");
    assertEquals("name" in user, true, "selectFM: has name");
    assertEquals("email" in user, false, "selectFM: no email");

    if (!Array.isArray(user.posts))
      throw new Error("selectFM: posts not array");
    user.posts.forEach((post) => {
      assertEquals(post.published, true, "selectFM: published");
    });
  });
}

function testSelectFindManyNested(client: GassmaClient) {
  const orders = client.Order.findMany({
    where: { userId: 1 },
    select: {
      id: true,
      items: {
        select: {
          id: true,
          quantity: true,
          product: {
            select: { id: true, name: true },
          },
        },
      },
    },
  });
  orders.forEach((order) => {
    assertEquals("id" in order, true, "selectFMN: has id");
    assertEquals("userId" in order, false, "selectFMN: no userId");
    assertEquals("totalAmount" in order, false, "selectFMN: no totalAmount");

    if (!Array.isArray(order.items))
      throw new Error("selectFMN: items not array");
    order.items.forEach((item) => {
      assertEquals("id" in item, true, "selectFMN: item has id");
      assertEquals("quantity" in item, true, "selectFMN: item has quantity");
      assertEquals("orderId" in item, false, "selectFMN: item no orderId");

      if (item.product !== null && item.product !== undefined) {
        assertEquals("id" in item.product, true, "selectFMN: product has id");
        assertEquals(
          "name" in item.product,
          true,
          "selectFMN: product has name",
        );
        assertEquals(
          "price" in item.product,
          false,
          "selectFMN: product no price",
        );
      }
    });
  });
}

export { testSelectRelation };
