import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testSelfRelation() {
  const client = new GassmaClient();

  testIncludeChildren(client);
  testIncludeParent(client);
  testIncludeParentAndChildren(client);
  testIncludeNestedSelfRelation(client);
  testSelectSelfRelation(client);
  testSelectNestedSelfRelation(client);
  testWhereRelationSelfRelation(client);
  testFindManySelfRelation(client);

  Logger.log("✅ testSelfRelation: all passed");
}

// 親カテゴリからchildren（子カテゴリ一覧）をinclude
function testIncludeChildren(client: GassmaClient) {
  const category = client.Category.findFirst({
    where: { id: 1 }, // テクノロジー（子: AI/ML=10, 映画=14, 国内旅行=19）
    include: { children: true },
  });

  if (category === null) throw new Error("self include children: not found");
  if (!("children" in category)) throw new Error("self include children: missing");

  const children = category.children as Record<string, unknown>[];
  if (!Array.isArray(children)) throw new Error("self include children: not array");

  children.forEach((child) => {
    assertEquals(child.parentId, 1, "self include children: parentId should be 1");
  });
}

// 子カテゴリからparent（親カテゴリ）をinclude
function testIncludeParent(client: GassmaClient) {
  const category = client.Category.findFirst({
    where: { id: 10 }, // AI/ML（親: テクノロジー=1）
    include: { parent: true },
  });

  if (category === null) throw new Error("self include parent: not found");
  if (!("parent" in category)) throw new Error("self include parent: missing");

  const parent = category.parent as Record<string, unknown>;
  assertEquals(parent.id, 1, "self include parent: id should be 1");
  assertEquals(parent.name, "テクノロジー", "self include parent: name");
}

// parentとchildrenを同時にinclude
function testIncludeParentAndChildren(client: GassmaClient) {
  // id=7 教育 → 親なし、子: プログラミング=9, Fitness=17, 海外旅行=20
  const category = client.Category.findFirst({
    where: { id: 7 },
    include: { parent: true, children: true },
  });

  if (category === null) throw new Error("self include both: not found");

  const parent = (category as Record<string, unknown>).parent;
  assertEquals(parent, null, "self include both: parent should be null (root)");

  const children = (category as Record<string, unknown>).children as Record<string, unknown>[];
  if (!Array.isArray(children)) throw new Error("self include both: children not array");

  const childIds = children.map((c) => c.id);
  if (childIds.indexOf(9) === -1) throw new Error("self include both: should contain id=9");
  if (childIds.indexOf(17) === -1) throw new Error("self include both: should contain id=17");
  if (childIds.indexOf(20) === -1) throw new Error("self include both: should contain id=20");
}

// ネストされたセルフリレーション: 親 → children → children（孫）
function testIncludeNestedSelfRelation(client: GassmaClient) {
  const category = client.Category.findFirst({
    where: { id: 1 }, // テクノロジー
    include: {
      children: {
        include: { children: true },
      },
    },
  });

  if (category === null) throw new Error("self nested include: not found");

  const children = (category as Record<string, unknown>).children as Record<string, unknown>[];
  if (!Array.isArray(children)) throw new Error("self nested include: children not array");

  // 各子カテゴリにもchildrenが含まれている
  children.forEach((child) => {
    if (!("children" in child)) {
      throw new Error(`self nested include: child id=${child.id} should have children key`);
    }
    const grandchildren = child.children as Record<string, unknown>[];
    if (!Array.isArray(grandchildren)) {
      throw new Error(`self nested include: child id=${child.id} grandchildren not array`);
    }
  });
}

// selectでセルフリレーション: nameとchildren(select: name)のみ取得
function testSelectSelfRelation(client: GassmaClient) {
  const category = client.Category.findFirst({
    where: { id: 1 },
    select: {
      name: true,
      children: {
        select: { id: true, name: true },
      },
    },
  });

  if (category === null) throw new Error("self select: not found");

  // nameが含まれている
  assertEquals((category as Record<string, unknown>).name, "テクノロジー", "self select: name");

  // idは含まれていない（selectしていない）
  if ("id" in category) throw new Error("self select: id should not be included");

  // childrenが含まれている
  const children = (category as Record<string, unknown>).children as Record<string, unknown>[];
  if (!Array.isArray(children)) throw new Error("self select: children not array");

  children.forEach((child) => {
    if (!("id" in child)) throw new Error("self select: child should have id");
    if (!("name" in child)) throw new Error("self select: child should have name");
    if ("parentId" in child) throw new Error("self select: child should not have parentId");
  });
}

// 3段ネストselect: Category → children → children（select限定）
function testSelectNestedSelfRelation(client: GassmaClient) {
  const category = client.Category.findFirst({
    where: { id: 1 },
    select: {
      name: true,
      children: {
        select: {
          name: true,
          children: {
            select: { name: true },
          },
        },
      },
    },
  });

  if (category === null) throw new Error("self nested select: not found");

  const cat = category as Record<string, unknown>;
  assertEquals(cat.name, "テクノロジー", "self nested select: name");

  const children = cat.children as Record<string, unknown>[];
  if (!Array.isArray(children)) throw new Error("self nested select: children not array");

  children.forEach((child) => {
    if (!("name" in child)) throw new Error("self nested select: child should have name");
    if ("id" in child) throw new Error("self nested select: child should not have id");

    const grandchildren = child.children as Record<string, unknown>[];
    if (!Array.isArray(grandchildren)) {
      throw new Error("self nested select: grandchildren not array");
    }
    grandchildren.forEach((gc) => {
      if (!("name" in gc)) throw new Error("self nested select: grandchild should have name");
      if ("id" in gc) throw new Error("self nested select: grandchild should not have id");
    });
  });
}

// whereRelationでセルフリレーション: 子カテゴリを持つカテゴリを検索
function testWhereRelationSelfRelation(client: GassmaClient) {
  const categories = client.Category.findMany({
    where: {
      children: { some: {} },
    },
  });

  // 子を持つカテゴリのみ（parentIdがnullの全てではなく、実際にchildrenがあるもの）
  categories.forEach((cat) => {
    const withChildren = client.Category.findFirst({
      where: { id: cat.id },
      include: { children: true },
    });
    const children = (withChildren as Record<string, unknown>).children as Record<string, unknown>[];
    if (children.length === 0) {
      throw new Error(`self whereRelation: id=${cat.id} should have children`);
    }
  });
}

// findManyでセルフリレーション: ルートカテゴリ一覧（parentId === null）にchildren付き
function testFindManySelfRelation(client: GassmaClient) {
  const roots = client.Category.findMany({
    where: { parentId: null },
    include: { children: true },
  });

  if (roots.length === 0) throw new Error("self findMany: no root categories");

  roots.forEach((root) => {
    assertEquals(root.parentId, null, "self findMany: root parentId should be null");
    const children = (root as Record<string, unknown>).children as Record<string, unknown>[];
    if (!Array.isArray(children)) {
      throw new Error(`self findMany: root id=${root.id} children not array`);
    }
    children.forEach((child) => {
      assertEquals(child.parentId, root.id, `self findMany: child parentId should be ${root.id}`);
    });
  });
}

export { testSelfRelation };
