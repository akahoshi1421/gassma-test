// acceptDataLoss ケース専用のモデル群。既存ケースの ALL_MODELS には混ぜない
// (混ぜると testMigrateIdempotent の対象が変わってしまうため)。

// schema に無い列を持たせたまま、フラグ無しで流しても何も消えないことを見る
const GUARD_MODEL: Gassma.MigrateModel = {
  name: "MigrateDropGuard",
  columns: ["id"],
};
const GUARD_INITIAL_HEADERS = ["id", "extra"];
const GUARD_INITIAL_ROWS: unknown[][] = [
  [1, "keep-1"],
  [2, "keep-2"],
];

export { GUARD_MODEL, GUARD_INITIAL_HEADERS, GUARD_INITIAL_ROWS };
