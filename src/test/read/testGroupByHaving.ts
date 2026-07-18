import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testGroupByHaving() {
  const client = new GassmaClient();

  testHavingCount(client);
  testHavingSum(client);
  testHavingAvg(client);
  testHavingAnd(client);
  testHavingOr(client);
  testHavingNot(client);

  Logger.log("✅ testGroupByHaving: all passed");
}

function testHavingCount(client: GassmaClient) {
  // role でグループ化し、ユーザー数が10以上のグループのみ
  const result = client.User.groupBy({
    by: "role",
    _count: { id: true },
    having: {
      id: { _count: { gte: 10 } },
    },
  });

  result.forEach((group) => {
    if (typeof group._count?.id !== "number") {
      throw new Error("having count: _count.id not number");
    }
    if (group._count.id < 10) {
      throw new Error(`having count: ${group.role} has count ${group._count.id} < 10`);
    }
  });
  if (result.length === 0) {
    throw new Error("having count: expected results");
  }
}

function testHavingSum(client: GassmaClient) {
  // userId でグループ化し、totalAmount の合計が 100000 以上のグループのみ
  const result = client.Order.groupBy({
    by: "userId",
    _sum: { totalAmount: true },
    having: {
      totalAmount: { _sum: { gte: 100000 } },
    },
  });

  result.forEach((group) => {
    if (typeof group._sum?.totalAmount !== "number") {
      throw new Error("having sum: _sum.totalAmount not number");
    }
    if (group._sum.totalAmount < 100000) {
      throw new Error(`having sum: userId ${group.userId} sum ${group._sum.totalAmount} < 100000`);
    }
  });
  if (result.length === 0) {
    throw new Error("having sum: expected results");
  }
}

function testHavingAvg(client: GassmaClient) {
  // status でグループ化し、平均 totalAmount が 50000 以上
  const result = client.Order.groupBy({
    by: "status",
    _avg: { totalAmount: true },
    _count: { id: true },
    having: {
      totalAmount: { _avg: { gte: 50000 } },
    },
  });

  result.forEach((group) => {
    if (typeof group._avg?.totalAmount !== "number") {
      throw new Error("having avg: _avg.totalAmount not number");
    }
    if (group._avg.totalAmount < 50000) {
      throw new Error(`having avg: status ${group.status} avg ${group._avg.totalAmount} < 50000`);
    }
  });
}

// role ごとの User 数は ADMIN=6, USER=32, MODERATOR=12 (consts userData より)

function testHavingAnd(client: GassmaClient) {
  const result = client.User.groupBy({
    by: "role",
    _count: { id: true },
    having: {
      AND: [
        { id: { _count: { gte: 10 } } },
        { id: { _count: { lte: 15 } } },
      ],
    },
  });

  assertEquals(result.length, 1, "having AND: group count");
  assertEquals(result[0].role, "MODERATOR", "having AND: role");
  assertEquals(result[0]._count.id, 12, "having AND: count");
}

function testHavingOr(client: GassmaClient) {
  const result = client.User.groupBy({
    by: "role",
    _count: { id: true },
    having: {
      OR: [
        { id: { _count: { lte: 6 } } },
        { id: { _count: { gte: 30 } } },
      ],
    },
  });

  assertEquals(result.length, 2, "having OR: group count");
  const roles = result.map((g) => g.role);
  if (roles.indexOf("ADMIN") === -1 || roles.indexOf("USER") === -1) {
    throw new Error(`having OR: unexpected roles ${JSON.stringify(roles)}`);
  }
  const admin = result.filter((g) => g.role === "ADMIN")[0];
  const user = result.filter((g) => g.role === "USER")[0];
  assertEquals(admin._count.id, 6, "having OR: ADMIN count");
  assertEquals(user._count.id, 32, "having OR: USER count");
}

function testHavingNot(client: GassmaClient) {
  const result = client.User.groupBy({
    by: "role",
    _count: { id: true },
    having: {
      NOT: {
        id: { _count: { gte: 10 } },
      },
    },
  });

  assertEquals(result.length, 1, "having NOT: group count");
  assertEquals(result[0].role, "ADMIN", "having NOT: role");
  assertEquals(result[0]._count.id, 6, "having NOT: count");
}

export { testGroupByHaving };
