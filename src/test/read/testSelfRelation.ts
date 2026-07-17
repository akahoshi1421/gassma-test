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

function testIncludeChildren(client: GassmaClient) {
  const category = client.Category.findFirst({
    where: { id: 1 },
    include: { children: true },
  });
  if (category === null) throw new Error("self include children: not found");
  if (!Array.isArray(category.children))
    throw new Error("self include children: not array");
  category.children.forEach((child) => {
    assertEquals(
      child.parentId,
      1,
      "self include children: parentId should be 1",
    );
  });
}

function testIncludeParent(client: GassmaClient) {
  const category = client.Category.findFirst({
    where: { id: 10 },
    include: { parent: true },
  });
  if (category === null) throw new Error("self include parent: not found");
  if (!category.parent) throw new Error("self include parent: missing");
  assertEquals(category.parent.id, 1, "self include parent: id should be 1");
  assertEquals(
    category.parent.name,
    "テクノロジー",
    "self include parent: name",
  );
}

function testIncludeParentAndChildren(client: GassmaClient) {
  const category = client.Category.findFirst({
    where: { id: 7 },
    include: { parent: true, children: true },
  });
  if (category === null) throw new Error("self include both: not found");
  assertEquals(
    category.parent,
    null,
    "self include both: parent should be null (root)",
  );
  if (!Array.isArray(category.children))
    throw new Error("self include both: children not array");
  const childIds = category.children.map((c) => c.id);
  if (childIds.indexOf(9) === -1)
    throw new Error("self include both: should contain id=9");
  if (childIds.indexOf(17) === -1)
    throw new Error("self include both: should contain id=17");
  if (childIds.indexOf(20) === -1)
    throw new Error("self include both: should contain id=20");
}

function testIncludeNestedSelfRelation(client: GassmaClient) {
  const category = client.Category.findFirst({
    where: { id: 1 },
    include: {
      children: {
        include: { children: true },
      },
    },
  });
  if (category === null) throw new Error("self nested include: not found");
  if (!Array.isArray(category.children))
    throw new Error("self nested include: children not array");
  category.children.forEach((child) => {
    if (!Array.isArray(child.children))
      throw new Error(
        `self nested include: child id=${child.id} grandchildren not array`,
      );
  });
}

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
  assertEquals(category.name, "テクノロジー", "self select: name");
  const children = category.children;
  if (!Array.isArray(children))
    throw new Error("self select: children not array");
  children.forEach((child) => {
    if (typeof child.id !== "number")
      throw new Error("self select: child should have id");
    if (typeof child.name !== "string")
      throw new Error("self select: child should have name");
  });
}

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
  assertEquals(category.name, "テクノロジー", "self nested select: name");
  const children = category.children;
  if (!Array.isArray(children))
    throw new Error("self nested select: children not array");
  children.forEach((child) => {
    if (typeof child.name !== "string")
      throw new Error("self nested select: child should have name");
    const grandchildren = child.children;
    if (!Array.isArray(grandchildren))
      throw new Error("self nested select: grandchildren not array");
    grandchildren.forEach((gc) => {
      if (typeof gc.name !== "string")
        throw new Error("self nested select: grandchild should have name");
    });
  });
}

function testWhereRelationSelfRelation(client: GassmaClient) {
  const categories = client.Category.findMany({
    where: { children: { some: {} } },
  });
  categories.forEach((cat) => {
    const withChildren = client.Category.findFirst({
      where: { id: cat.id },
      include: { children: true },
    });
    if (!withChildren) throw new Error("self whereRelation: category not found");
    if (withChildren.children.length === 0)
      throw new Error(`self whereRelation: id=${cat.id} should have children`);
  });
}

function testFindManySelfRelation(client: GassmaClient) {
  const roots = client.Category.findMany({
    where: { parentId: null },
    include: { children: true },
  });
  if (roots.length === 0)
    throw new Error("self findMany: no root categories");
  roots.forEach((root) => {
    assertEquals(
      root.parentId,
      null,
      "self findMany: root parentId should be null",
    );
    if (!Array.isArray(root.children))
      throw new Error(`self findMany: root id=${root.id} children not array`);
    root.children.forEach((child) => {
      assertEquals(
        child.parentId,
        root.id,
        `self findMany: child parentId should be ${root.id}`,
      );
    });
  });
}

export { testSelfRelation };
