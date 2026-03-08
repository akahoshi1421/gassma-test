import { testFindMany } from "./read/testFindMany";
import { testFindFirst } from "./read/testFindFirst";
import { testCount } from "./read/testCount";
import { testInclude } from "./read/testInclude";
import { testAggregate } from "./read/testAggregate";
import { testGroupBy } from "./read/testGroupBy";
import { testWhereRelation } from "./read/testWhereRelation";
import { testCursor } from "./read/testCursor";
import { testGlobalOmit } from "./read/testGlobalOmit";

function testRead() {
  testFindMany();
  testFindFirst();
  testCount();
  testInclude();
  testAggregate();
  testGroupBy();
  testWhereRelation();
  testCursor();
  testGlobalOmit();

  Logger.log("🎉 All read tests passed!");
}

export { testRead };
