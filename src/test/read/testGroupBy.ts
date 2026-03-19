import { GassmaClient } from "../../generated/gassma/gassmaClient";

function testGroupBy() {
  const client = new GassmaClient();

  testGroupByBasic(client);
  testGroupByWithAggregate(client);
  testGroupByMultipleFields(client);

  Logger.log("✅ testGroupBy: all passed");
}

function testGroupByBasic(client: GassmaClient) {
  const result = client.sheets.User.groupBy({
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
  const result = client.sheets.Order.groupBy({
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
  const result = client.sheets.Post.groupBy({
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

export { testGroupBy };
