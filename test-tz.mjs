import { toZonedTime, fromZonedTime, format } from "date-fns-tz";

const naive = "2026-12-18T15:30";
const tz = "America/New_York";

const absoluteDate = fromZonedTime(naive, tz);
console.log("Absolute UTC:", absoluteDate.toISOString());
console.log("Diff with now:", absoluteDate - new Date());

const format1 = format(absoluteDate, "h:mm a", { timeZone: tz });
console.log("Formatted in target TZ:", format1);

const shiftedDate = toZonedTime(naive, tz);
console.log("Shifted Date (wrong):", shiftedDate.toISOString());
