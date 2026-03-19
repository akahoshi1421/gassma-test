import { testFindMany } from "./read/testFindMany";
import { testFindFirst } from "./read/testFindFirst";
import { testCount } from "./read/testCount";
import { testInclude } from "./read/testInclude";
import { testIncludeAdvanced } from "./read/testIncludeAdvanced";
import { testAggregate } from "./read/testAggregate";
import { testGroupBy } from "./read/testGroupBy";
import { testGroupByHaving } from "./read/testGroupByHaving";
import { testWhereRelation } from "./read/testWhereRelation";
import { testCursor } from "./read/testCursor";
import { testGlobalOmit } from "./read/testGlobalOmit";
import { testFilterConditions } from "./read/testFilterConditions";
import { testOrderByAdvanced } from "./read/testOrderByAdvanced";
import { testTakeNegative } from "./read/testTakeNegative";
import { testFields } from "./read/testFields";
import { testIgnore } from "./read/testIgnore";
import { testMap } from "./read/testMap";
import { testIgnoreSheets } from "./read/testIgnoreSheets";
import { testMapSheets } from "./read/testMapSheets";
import { testEnumConstants } from "./read/testEnumConstants";
import { testFindManyDb2 } from "./read/testFindManyDb2";

function testRead() {
  testFindMany();
  testFindFirst();
  testCount();
  testInclude();
  testIncludeAdvanced();
  testAggregate();
  testGroupBy();
  testGroupByHaving();
  testWhereRelation();
  testCursor();
  testGlobalOmit();
  testFilterConditions();
  testOrderByAdvanced();
  testTakeNegative();
  testFields();
  testIgnore();
  testMap();
  testIgnoreSheets();
  testMapSheets();
  testEnumConstants();
  testFindManyDb2();

  Logger.log("🎉 All read tests passed!");
}

export { testRead };
