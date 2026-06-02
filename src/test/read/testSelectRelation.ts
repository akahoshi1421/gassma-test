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

// select 内でリレーションを true で取得
function testSelectWithRelationTrue(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    select: { id: true, name: true, posts: true },
  });
  if (user === null) throw new Error("selectRelTrue: user not found");

  // id と name だけがスカラーとして存在する
  assertEquals("id" in user, true, "selectRelTrue: has id");
  assertEquals("name" in user, true, "selectRelTrue: has name");
  assertEquals("email" in user, false, "selectRelTrue: no email");
  assertEquals("age" in user, false, "selectRelTrue: no age");

  // posts が配列で存在する
  const posts = (user as Record<string, unknown>).posts as Record<
    string,
    unknown
  >[];
  if (!Array.isArray(posts))
    throw new Error("selectRelTrue: posts not array");
  posts.forEach((post) => {
    assertEquals(post.authorId, 1, "selectRelTrue: post authorId");
  });
}

// select 内でリレーションに where 条件
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

  const posts = (user as Record<string, unknown>).posts as Record<
    string,
    unknown
  >[];
  if (!Array.isArray(posts))
    throw new Error("selectRelWhere: posts not array");
  posts.forEach((post) => {
    assertEquals(post.published, true, "selectRelWhere: published");
    assertEquals(post.authorId, 1, "selectRelWhere: authorId");
  });
}

// select 内でリレーションに orderBy
function testSelectWithRelationOrderBy(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    select: {
      id: true,
      posts: { orderBy: { id: "asc" } },
    },
  });
  if (user === null) throw new Error("selectRelOrder: user not found");

  const posts = (user as Record<string, unknown>).posts as Record<
    string,
    unknown
  >[];
  if (posts.length >= 2) {
    const ids = posts.map((p) => p.id as number);
    ids.reduce((prev, curr) => {
      if (curr < prev)
        throw new Error("selectRelOrder: not ascending");
      return curr;
    });
  }
}

// リレーションのみ select（スカラーなし）
function testSelectOnlyRelation(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    select: { posts: true },
  });
  if (user === null) throw new Error("selectOnlyRel: user not found");
  assertEquals("id" in user, false, "selectOnlyRel: no id");
  assertEquals("name" in user, false, "selectOnlyRel: no name");

  const posts = (user as Record<string, unknown>).posts as Record<
    string,
    unknown
  >[];
  if (!Array.isArray(posts))
    throw new Error("selectOnlyRel: posts not array");
}

// select 内でリレーション + _count の組み合わせ
function testSelectRelationWithCount(client: GassmaClient) {
  const user = client.User.findFirst({
    where: { id: 1 },
    select: {
      id: true,
      posts: true,
      _count: { select: { comments: true } },
    },
  });
  if (user === null)
    throw new Error("selectRelCount: user not found");
  assertEquals("id" in user, true, "selectRelCount: has id");
  assertEquals("email" in user, false, "selectRelCount: no email");

  const posts = (user as Record<string, unknown>).posts as Record<
    string,
    unknown
  >[];
  if (!Array.isArray(posts))
    throw new Error("selectRelCount: posts not array");

  const count = (user as Record<string, unknown>)._count as Record<
    string,
    number
  >;
  if (typeof count.comments !== "number")
    throw new Error("selectRelCount: comments count not number");
}

// ManyToOne リレーションの select
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

  const author = (post as Record<string, unknown>).author as Record<
    string,
    unknown
  >;
  if (typeof author.id !== "number")
    throw new Error("selectRelM2O: author id not number");
}

// select の中に select がネストされたパターン
// User → posts(Post) → select で title のみ取得
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
  if (user === null)
    throw new Error("selectNested: user not found");
  assertEquals("id" in user, true, "selectNested: has id");
  assertEquals("name" in user, true, "selectNested: has name");
  assertEquals("email" in user, false, "selectNested: no email");

  const posts = (user as Record<string, unknown>).posts as Record<
    string,
    unknown
  >[];
  if (!Array.isArray(posts))
    throw new Error("selectNested: posts not array");
  posts.forEach((post) => {
    assertEquals("id" in post, true, "selectNested: post has id");
    assertEquals(
      "title" in post,
      true,
      "selectNested: post has title",
    );
    assertEquals(
      "content" in post,
      false,
      "selectNested: post no content",
    );
    assertEquals(
      "authorId" in post,
      false,
      "selectNested: post no authorId",
    );
  });
}

// 3段ネスト: User → posts(Post) → comments(Comment)
// select の中の select の中の select
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
  if (user === null)
    throw new Error("selectDeep: user not found");
  assertEquals("id" in user, true, "selectDeep: has id");
  assertEquals("name" in user, false, "selectDeep: no name");

  const posts = (user as Record<string, unknown>).posts as Record<
    string,
    unknown
  >[];
  if (!Array.isArray(posts))
    throw new Error("selectDeep: posts not array");
  posts.forEach((post) => {
    assertEquals("id" in post, true, "selectDeep: post has id");
    assertEquals(
      "title" in post,
      true,
      "selectDeep: post has title",
    );
    assertEquals(
      "content" in post,
      false,
      "selectDeep: post no content",
    );

    const comments = post.comments as Record<string, unknown>[];
    if (!Array.isArray(comments))
      throw new Error("selectDeep: comments not array");
    comments.forEach((comment) => {
      assertEquals(
        "id" in comment,
        true,
        "selectDeep: comment has id",
      );
      assertEquals(
        "text" in comment,
        true,
        "selectDeep: comment has text",
      );
      assertEquals(
        "authorId" in comment,
        false,
        "selectDeep: comment no authorId",
      );
      assertEquals(
        "postId" in comment,
        false,
        "selectDeep: comment no postId",
      );
    });
  });
}

// findMany でのリレーション select
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

    const posts = (user as Record<string, unknown>).posts as Record<
      string,
      unknown
    >[];
    if (!Array.isArray(posts))
      throw new Error("selectFM: posts not array");
    posts.forEach((post) => {
      assertEquals(post.published, true, "selectFM: published");
    });
  });
}

// findMany で3段ネスト select
// Order → items(OrderItem) → product(Product)
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
    assertEquals(
      "userId" in order,
      false,
      "selectFMN: no userId",
    );
    assertEquals(
      "totalAmount" in order,
      false,
      "selectFMN: no totalAmount",
    );

    const items = (order as Record<string, unknown>).items as Record<
      string,
      unknown
    >[];
    if (!Array.isArray(items))
      throw new Error("selectFMN: items not array");
    items.forEach((item) => {
      assertEquals("id" in item, true, "selectFMN: item has id");
      assertEquals(
        "quantity" in item,
        true,
        "selectFMN: item has quantity",
      );
      assertEquals(
        "orderId" in item,
        false,
        "selectFMN: item no orderId",
      );

      const product = item.product as Record<string, unknown>;
      if (product !== null && product !== undefined) {
        assertEquals(
          "id" in product,
          true,
          "selectFMN: product has id",
        );
        assertEquals(
          "name" in product,
          true,
          "selectFMN: product has name",
        );
        assertEquals(
          "price" in product,
          false,
          "selectFMN: product no price",
        );
      }
    });
  });
}

export { testSelectRelation };
