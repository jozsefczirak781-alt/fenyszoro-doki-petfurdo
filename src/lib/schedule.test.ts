import { describe, expect, it } from "vitest";
import { isBookableDate, isValidSlot, slotsForDate } from "./schedule";

// Friday 2026-11-13, 23:27 UTC = Saturday 00:27 in Budapest
const now = new Date("2026-11-13T23:27:00Z");

describe("booking schedule", () => {
  it("weekdays offer hourly slots from 8:00 to 16:00", () => {
    expect(slotsForDate("2026-11-16")).toEqual([
      "08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00",
    ]);
  });

  it("Saturday offers slots from 8:00 to 11:00", () => {
    expect(slotsForDate("2026-11-21")).toEqual(["08:00", "09:00", "10:00", "11:00"]);
  });

  it("Sunday is closed", () => {
    expect(slotsForDate("2026-11-22")).toEqual([]);
    expect(isBookableDate("2026-11-22", now)).toBe(false);
  });

  it("today (Budapest time) cannot be booked, tomorrow can", () => {
    expect(isBookableDate("2026-11-14", now)).toBe(false);
    expect(isBookableDate("2026-11-16", now)).toBe(true);
  });

  it("bookings are limited to 60 days ahead", () => {
    expect(isBookableDate("2027-01-13", now)).toBe(true);
    expect(isBookableDate("2027-01-14", now)).toBe(false);
  });

  it("rejects a time outside opening hours", () => {
    expect(isValidSlot("2026-11-21", "14:00", now)).toBe(false);
    expect(isValidSlot("2026-11-16", "14:00", now)).toBe(true);
  });
});
