import { resetSheet } from "./resetSheet";
import { userData } from "../consts/userData";
import { profileData } from "../consts/profileData";
import { postData } from "../consts/postData";
import { commentData } from "../consts/commentData";
import { categoryData } from "../consts/categoryData";
import { tagData } from "../consts/tagData";
import { postToTagData } from "../consts/postToTagData";
import { productData } from "../consts/productData";
import { orderData } from "../consts/orderData";
import { orderItemData } from "../consts/orderItemData";
import { auditLogData } from "../consts/auditLogData";
import { notificationData } from "../consts/notificationData";

const sheetDataMap: [string, unknown[][]][] = [
  ["User", userData],
  ["Profile", profileData],
  ["Post", postData],
  ["Comment", commentData],
  ["Category", categoryData],
  ["Tag", tagData],
  ["_PostToTag", postToTagData],
  ["Product", productData],
  ["Order", orderData],
  ["OrderItem", orderItemData],
  ["AuditLog", auditLogData],
  ["notifications", notificationData],
];

function resetAllSheets() {
  sheetDataMap.forEach(([sheetName, data]) => {
    resetSheet(sheetName as string, data as unknown[][]);
  });
}

export { resetAllSheets };
