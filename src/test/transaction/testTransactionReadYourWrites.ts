import { GassmaClient } from "../../generated/gassma/gassmaClient";
import { assertEquals } from "../../assert/assertEquals";
import { resetSheet } from "../../reset/resetSheet";
import { tagData } from "../../consts/tagData";
import { categoryData } from "../../consts/categoryData";
import { notificationData } from "../../consts/notificationData";
import { postData } from "../../consts/postData";

function testTransactionReadYourWrites() {
  const client = new GassmaClient();

  client.$transaction((tx) => {
    // create したバッファ上の行が同一 tx の読み取りに見える
    tx.Tag.create({ data: { name: "TxRywTag" } });
    assertEquals(
      tx.Tag.findMany({ where: { name: "TxRywTag" } }).length,
      1,
      "ryw: created row visible in findMany",
    );
    assertEquals(tx.Tag.count({}), 31, "ryw: count includes buffered create");

    // update は新値で見える
    tx.Category.update({ where: { id: 1 }, data: { name: "TxRywCategory" } });
    const category = tx.Category.findFirstOrThrow({ where: { id: 1 } });
    assertEquals(category.name, "TxRywCategory", "ryw: updated value visible");

    // delete した行は見えない
    tx.Notification.delete({ where: { id: 5 } });
    assertEquals(
      tx.Notification.findMany({ where: { id: 5 } }).length,
      0,
      "ryw: deleted row invisible",
    );
    assertEquals(tx.Notification.count({}), 4, "ryw: count after delete");

    // include / where relation でもバッファが効く
    const post = tx.Post.create({
      data: { title: "TxRywPost", authorId: 1, categoryId: 1 },
      include: { author: true },
    });
    if (!post.author) throw new Error("ryw: include author missing");
    assertEquals(post.author.id, 1, "ryw: include author id");
    assertEquals(
      tx.Post.findMany({
        where: { author: { is: { id: 1 } }, title: "TxRywPost" },
      }).length,
      1,
      "ryw: where relation sees buffered post",
    );
  });

  resetSheet("Tag", tagData);
  resetSheet("Category", categoryData);
  resetSheet("notifications", notificationData);
  resetSheet("Post", postData);

  Logger.log("✅ testTransactionReadYourWrites: all passed");
}

export { testTransactionReadYourWrites };
