import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { userData } from "../../consts/userData";

function testUndefinedData() {
  const client = new GassmaClient();

  testUpdateUndefinedKeepsCell(client);
  testUpdateManyUndefinedKeepsCell(client);

  Logger.log("✅ testUndefinedData: all passed");
}

// data の undefined は「そのフィールドを更新しない」。以前はセルの値が消えていた
function testUpdateUndefinedKeepsCell(client: GassmaClient) {
  const updated = client.User.update({
    where: { id: 1 },
    data: {
      name: "UndefinedKeepsCell",
      age: undefined,
      email: undefined,
      isActive: undefined,
    },
  });

  if (!updated) throw new Error("update undefined data: expected result");
  assertEquals(updated.name, "UndefinedKeepsCell", "undefined data: name updated");
  assertEquals(updated.age, 39, "undefined data: age kept in return value");
  assertEquals(
    updated.email,
    "user1@company.co.jp",
    "undefined data: email kept in return value",
  );

  // 実シートのセルが保持されていること(以前は age / email / isActive が空になっていた)
  const snapshot = getSheetSnapshot("User");
  snapshot.assertRowEquals(
    { id: 1 },
    {
      name: "UndefinedKeepsCell",
      age: 39,
      email: "user1@company.co.jp",
      isActive: true,
    },
  );
  snapshot.assertCount(50);

  resetSheet("User", userData);
}

// updateMany でも同じ。undefined のフィールドは全対象行で据え置かれる
function testUpdateManyUndefinedKeepsCell(client: GassmaClient) {
  const result = client.User.updateMany({
    where: { id: { in: [2, 3] } },
    data: { name: "ManyUndefinedKeepsCell", age: undefined },
  });
  assertEquals(result.count, 2, "updateMany undefined data: count");

  const snapshot = getSheetSnapshot("User");
  snapshot.assertRowEquals(
    { id: 2 },
    { name: "ManyUndefinedKeepsCell", age: 31 },
  );
  snapshot.assertRowEquals(
    { id: 3 },
    { name: "ManyUndefinedKeepsCell", age: 59 },
  );
  snapshot.assertCount(50);

  resetSheet("User", userData);
}

export { testUndefinedData };
