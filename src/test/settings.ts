import { testChangeSettings } from "./settings/testChangeSettings";
import { resetSheet } from "../reset/resetSheet";
import { resetSheetWithOffset } from "../reset/resetSheetWithOffset";
import { tagData } from "../consts/tagData";
import {
  offsetNoteData,
  OFFSET_NOTE_START_ROW,
  OFFSET_NOTE_START_COLUMN,
} from "../consts/offsetNoteData";

function testSettingsAll() {
  resetSheet("Tag", tagData);
  resetSheetWithOffset(
    "OffsetNote",
    offsetNoteData,
    OFFSET_NOTE_START_ROW,
    OFFSET_NOTE_START_COLUMN,
  );
  testChangeSettings();

  Logger.log("🎉 All settings tests passed!");
}

export { testSettingsAll };
