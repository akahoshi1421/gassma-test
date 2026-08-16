import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testGroupBy() {
  const client = new GassmaClient();

  testGroupByBasic(client);
  testGroupByWithAggregate(client);
  testGroupByMultipleFields(client);
  testGroupByTakeSkipOnGroups(client);
  testGroupByOrderByAggregate(client);
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
  // Post は 200 行 / [published, authorId] の組は 92 グループ (consts postData より)
  const result = client.Post.groupBy({
    by: ["published", "authorId"],
    _count: { id: true },
    orderBy: [{ published: "asc" }, { authorId: "asc" }],
    take: 10,
  });

  assertEquals(result.length, 10, "groupBy multiple: group count");
  result.forEach((group) => {
    if (typeof group.published !== "boolean") {
      throw new Error("groupBy multiple: published not boolean");
    }
    if (typeof group.authorId !== "number") {
      throw new Error("groupBy multiple: authorId not number");
    }
  });

  assertEquals(result[0].published, false, "groupBy multiple: first published");
  assertEquals(result[0].authorId, 1, "groupBy multiple: first authorId");
  assertEquals(result[0]._count.id, 2, "groupBy multiple: first count");

  // take が行でなくグループに効いている証拠: 10 グループの行数合計は 10 を超える
  const rowTotal = result.reduce((sum, group) => sum + group._count.id, 0);
  assertEquals(rowTotal, 15, "groupBy multiple: rows behind the first 10 groups");
}

function testGroupByTakeSkipOnGroups(client: GassmaClient) {
  // take/skip はグループに適用される (本体 #226)
  // role ごとの User 数は ADMIN=6, MODERATOR=12, USER=32 (consts userData より)

  const takeResult = client.User.groupBy({
    by: "role",
    orderBy: { role: "asc" },
    take: 2,
    _count: { id: true },
  });
  assertEquals(takeResult.length, 2, "groupBy take: group count");
  assertEquals(takeResult[0].role, "ADMIN", "groupBy take: first role");
  assertEquals(takeResult[0]._count.id, 6, "groupBy take: ADMIN count");
  assertEquals(takeResult[1].role, "MODERATOR", "groupBy take: second role");
  assertEquals(takeResult[1]._count.id, 12, "groupBy take: MODERATOR count");

  const skipResult = client.User.groupBy({
    by: "role",
    orderBy: { role: "asc" },
    skip: 2,
    _count: { id: true },
  });
  assertEquals(skipResult.length, 1, "groupBy skip: group count");
  assertEquals(skipResult[0].role, "USER", "groupBy skip: role");
  assertEquals(skipResult[0]._count.id, 32, "groupBy skip: USER count");
}

function testGroupByOrderByAggregate(client: GassmaClient) {
  const result = client.User.groupBy({
    by: "role",
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
  });

  assertEquals(result.length, 3, "groupBy orderBy aggregate: group count");
  assertEquals(result.map((g) => g.role).join(","), "USER,MODERATOR,ADMIN", "groupBy orderBy aggregate: order");
  assertEquals(result[0]._count.id, 32, "groupBy orderBy aggregate: USER count");
  assertEquals(result[2]._count.id, 6, "groupBy orderBy aggregate: ADMIN count");

  const top = client.User.groupBy({
    by: "role",
    _count: { id: true },
    orderBy: { _count: { id: "desc" } },
    take: 1,
  });
  assertEquals(top.length, 1, "groupBy orderBy aggregate + take: group count");
  assertEquals(top[0].role, "USER", "groupBy orderBy aggregate + take: role");
  assertEquals(top[0]._count.id, 32, "groupBy orderBy aggregate + take: count");
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
