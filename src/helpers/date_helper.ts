import { Timestamp } from "firebase/firestore";
/**
 * Formats timestamp into correct string format for our app.
 * @param {Timestamp} Timestamp - Firestore Timestamp Object.
 * @returns {string} [Date, Time].
 */
export function formatDateTime(
  timestamp: Timestamp,
): [String | null, String | null] {
  if (!timestamp) {
    return [null, null];
  }
  const date = timestamp.toDate();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is 0-indexed (January is 0)
  const day = String(date.getDate()).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // '0' hour should be '12'
  return [`${month}/${day}/${year}`, `${hours}:${minutes} ${ampm}`];
};
export function isInThePast(timestamp: Timestamp) {
  console.log("isInThePast")
  const groupDate = timestamp.toDate();
  const now = new Date();
  if (groupDate.getFullYear() > now.getFullYear()) {
    return false;
  } else if (groupDate.getFullYear() === now.getFullYear()) {
    if (groupDate.getMonth() > now.getMonth()) {
      return false;
    } else if (groupDate.getMonth() === now.getMonth()) {
      return !(groupDate.getDate() >= now.getDate());
    }
  }
  return true;
};
