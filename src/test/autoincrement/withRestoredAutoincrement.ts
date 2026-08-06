type AutoincrementCounter = {
  $getAutoincrement(field: "id"): number;
  $setAutoincrement(field: "id", next: number): void;
};

// カウンタは ScriptProperties にあり resetSheet では戻らないため、
// 実行前の値を控えて必ず戻す(アサーション失敗時も finally で戻す)。
function withRestoredAutoincrement<T>(
  counter: AutoincrementCounter,
  fn: () => T,
): T {
  const original = counter.$getAutoincrement("id");
  try {
    return fn();
  } finally {
    counter.$setAutoincrement("id", original);
  }
}

export { withRestoredAutoincrement };
export type { AutoincrementCounter };
