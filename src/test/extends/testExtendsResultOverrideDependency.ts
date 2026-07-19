import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testExtendsResultOverrideDependency() {
  const client = new GassmaClient();

  // greeting を name 上書きより先に宣言し、宣言順でなく needs 依存順で解決されることを見る
  const extended = client.$extends({
    result: {
      User: {
        greeting: {
          needs: { name: true },
          compute: (user) => `Hello, ${user.name}`,
        },
        name: {
          needs: { name: true },
          compute: (user) => user.name.toUpperCase(),
        },
      },
    },
  });

  const base = client.User.findFirst({ where: { id: 1 } });
  if (!base) {
    throw new Error("extends resultOverrideDependency: base user not found");
  }

  const row = extended.User.findFirst({ where: { id: 1 } });
  if (!row) {
    throw new Error("extends resultOverrideDependency: extended user not found");
  }
  assertEquals(row.name, base.name.toUpperCase(), "extends resultOverrideDependency: name overridden");
  assertEquals(
    row.greeting,
    `Hello, ${base.name.toUpperCase()}`,
    "extends resultOverrideDependency: dependent field sees overridden value",
  );

  const baseRows = client.User.findMany({ take: 5 });
  const rows = extended.User.findMany({ take: 5 });
  assertEquals(rows.length, baseRows.length, "extends resultOverrideDependency: findMany count");
  rows.forEach((user, i) => {
    assertEquals(user.name, baseRows[i].name.toUpperCase(), "extends resultOverrideDependency: each name overridden");
    assertEquals(
      user.greeting,
      `Hello, ${baseRows[i].name.toUpperCase()}`,
      "extends resultOverrideDependency: each greeting from overridden name",
    );
  });

  Logger.log("✅ testExtendsResultOverrideDependency: all passed");
}

export { testExtendsResultOverrideDependency };
