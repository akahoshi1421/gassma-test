import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";

function testGetColumnHeaders() {
  const client = new GassmaClient();

  testGetColumnHeadersBasic(client);
  testGetColumnHeadersMapped(client);

  Logger.log("✅ testGetColumnHeaders: all passed");
}

// getColumnHeaders は生成型に未定義のため、実行時に存在検証して呼び出す
function callGetColumnHeaders(controller: unknown, label: string): string[] {
  const record = controller as unknown as Record<string, unknown>;
  const fn = record["getColumnHeaders"];
  if (typeof fn !== "function") {
    throw new Error(`${label}: getColumnHeaders is not a function`);
  }
  const raw: unknown = fn.call(controller);
  if (!Array.isArray(raw)) {
    throw new Error(`${label}: expected string[] but got ${JSON.stringify(raw)}`);
  }
  return raw.map((value) => String(value));
}

function testGetColumnHeadersBasic(client: GassmaClient) {
  // シートの見出し行がそのまま返る (@ignore の internalNote も含む)
  const headers = callGetColumnHeaders(client.User, "getColumnHeaders User");
  assertEquals(
    headers.join(","),
    "id,email,name,age,isActive,role,createdAt,internalNote",
    "getColumnHeaders User",
  );
}

function testGetColumnHeadersMapped(client: GassmaClient) {
  // @map された列 (total_amount) はコード名 (totalAmount) に変換される
  const headers = callGetColumnHeaders(client.Order, "getColumnHeaders Order");
  assertEquals(
    headers.join(","),
    "id,userId,totalAmount,quantity,status,createdAt",
    "getColumnHeaders Order",
  );
}

export { testGetColumnHeaders };
