const timeSlotData = [
  ["id", "label", "slotAt"],
  [1, "Morning Slot", "2025-09-01T09:00:00"],
  [2, "Afternoon Slot", "2025-09-01T13:00:00"],
  // 日時未定の枠。被参照キー(slotAt)が null の親として some / none / every の検証に使う
  [3, "Unscheduled Slot", null],
];

export { timeSlotData };
