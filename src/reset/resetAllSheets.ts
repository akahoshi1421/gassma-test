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
import { sensorReadingData } from "../consts/sensorReadingData";
import { timeSlotData } from "../consts/timeSlotData";
import { reservationData } from "../consts/reservationData";

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
  ["SensorReading", sensorReadingData],
  ["TimeSlot", timeSlotData],
  ["Reservation", reservationData],
];

function resetAllSheets() {
  sheetDataMap.forEach(([sheetName, data]) => {
    resetSheet(sheetName, data);
  });
}

export { resetAllSheets };
