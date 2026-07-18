// total 列は数式文字列。resetSheet(setValues) は "=" 始まりを数式として書き込むため復元できる
const formulaCellData = [
  ["id", "label", "amount", "total"],
  [1, "alpha", 100, "=C2*2"],
  [2, "beta", 250, "=C3*2"],
  [3, "gamma", 40, "=C4*2"],
];

export { formulaCellData };
