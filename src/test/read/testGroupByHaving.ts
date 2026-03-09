import { GassmaClient } from "../../generated/gassma/testClient";

function testGroupByHaving() {
  const client = new GassmaClient();

  testHavingCount(client);
  testHavingSum(client);
  testHavingAvg(client);

  Logger.log("✅ testGroupByHaving: all passed");
}

function testHavingCount(client: GassmaClient) {
  // role でグループ化し、ユーザー数が10以上のグループのみ
  const result = client.sheets.User.groupBy({
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
  const result = client.sheets.Order.groupBy({
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
  const result = client.sheets.Order.groupBy({
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

export { testGroupByHaving };
