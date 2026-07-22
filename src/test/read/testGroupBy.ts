import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testGroupBy() {
  const client = new GassmaClient();

  testGroupByBasic(client);
  testGroupByWithAggregate(client);
  testGroupByMultipleFields(client);
  testGroupByTakeSkipBeforeGrouping(client);
  testGroupByDateInstant(client);

  Logger.log("✅ testGroupBy: all passed");
}

function testGroupByBasic(client: GassmaClient) {
  const result = client.User.groupBy({
    by: "role",
  });
  if (result.length !== 3) {
    throw new Error(`groupBy basic: expected 3 groups (ADMIN/USER/MODERATOR), got ${result.length}`);
  }
  const roles = result.map((r) => r.role);
  if (!roles.includes("ADMIN") || !roles.includes("USER") || !roles.includes("MODERATOR")) {
    throw new Error(`groupBy basic: missing role in ${JSON.stringify(roles)}`);
  }
}

function testGroupByWithAggregate(client: GassmaClient) {
  const result = client.Order.groupBy({
    by: "status",
    _count: { id: true },
    _sum: { totalAmount: true },
  });
  result.forEach((group) => {
    if (typeof group._count?.id !== "number") {
      throw new Error("groupBy aggregate: _count.id not number");
    }
    if (typeof group._sum?.totalAmount !== "number") {
      throw new Error("groupBy aggregate: _sum.totalAmount not number");
    }
  });
}

function testGroupByMultipleFields(client: GassmaClient) {
  const result = client.Post.groupBy({
    by: ["published", "authorId"],
    _count: { id: true },
    take: 10,
  });
  if (result.length === 0) {
    throw new Error("groupBy multiple: expected results");
  }
  result.forEach((group) => {
    if (typeof group.published !== "boolean") {
      throw new Error("groupBy multiple: published not boolean");
    }
    if (typeof group.authorId !== "number") {
      throw new Error("groupBy multiple: authorId not number");
    }
  });
}

function testGroupByTakeSkipBeforeGrouping(client: GassmaClient) {
  // GASsma 固有仕様: take/skip/orderBy はグループ化前の行に適用される

  // id 昇順で先頭 5 行 (role: ADMIN,USER,USER,ADMIN,USER) → 2 グループ
  const takeResult = client.User.groupBy({
    by: "role",
    orderBy: { id: "asc" },
    take: 5,
    _count: { id: true },
  });
  assertEquals(takeResult.length, 2, "groupBy take: group count");
  const adminGroup = takeResult.filter((g) => g.role === "ADMIN")[0];
  const userGroup = takeResult.filter((g) => g.role === "USER")[0];
  if (!adminGroup || !userGroup) {
    throw new Error("groupBy take: expected ADMIN and USER groups");
  }
  assertEquals(adminGroup._count.id, 2, "groupBy take: ADMIN count");
  assertEquals(userGroup._count.id, 3, "groupBy take: USER count");

  // id 昇順で 48 行スキップ → 残り id 49(MODERATOR), 50(USER) → 2 グループ各 1 件
  const skipResult = client.User.groupBy({
    by: "role",
    orderBy: { id: "asc" },
    skip: 48,
    _count: { id: true },
  });
  assertEquals(skipResult.length, 2, "groupBy skip: group count");
  skipResult.forEach((group) => {
    assertEquals(group._count.id, 1, `groupBy skip: ${group.role} count`);
  });
  const skipRoles = skipResult.map((g) => g.role);
  if (skipRoles.indexOf("MODERATOR") === -1 || skipRoles.indexOf("USER") === -1) {
    throw new Error(`groupBy skip: unexpected roles ${JSON.stringify(skipRoles)}`);
  }
}

function testGroupByDateInstant(client: GassmaClient) {
  // SensorReading.recordedAt は同時刻（別インスタンス）の行を複数含む
  // groupBy は参照比較でなく時刻一致でグルーピングされる（本体 #159）
  const result = client.SensorReading.groupBy({
    by: "recordedAt",
    _count: { id: true },
  });

  assertEquals(result.length, 5, "groupBy date instant: group count");

  const countAt = (iso: string): number => {
    const group = result.filter(
      (g) => g.recordedAt.getTime() === new Date(iso).getTime(),
    )[0];
    return group ? group._count.id : 0;
  };

  assertEquals(countAt("2025-06-01T09:00:00"), 3, "groupBy date instant: 3-way tie");
  assertEquals(countAt("2025-06-01T09:00:01"), 1, "groupBy date instant: 1 second later stays separate");
  assertEquals(countAt("2025-06-02T10:15:30"), 2, "groupBy date instant: 2-way tie");
  assertEquals(countAt("2025-06-03T00:00:00"), 1, "groupBy date instant: solo row 1");
  assertEquals(countAt("2025-06-04T23:59:59"), 1, "groupBy date instant: solo row 2");

  const totalRows = result.reduce((sum, g) => sum + g._count.id, 0);
  assertEquals(totalRows, 8, "groupBy date instant: total row count preserved");
}

export { testGroupBy };
