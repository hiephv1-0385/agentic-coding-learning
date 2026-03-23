import { describe, it, expect } from "vitest";
import { formatPrizeValue } from "@/utils/formatPrizeValue";

describe("formatPrizeValue", () => {
  it("formats 7000000 to '7.000.000 VNĐ'", () => {
    expect(formatPrizeValue(7000000)).toBe("7.000.000 VNĐ");
  });

  it("formats 15000000 to '15.000.000 VNĐ'", () => {
    expect(formatPrizeValue(15000000)).toBe("15.000.000 VNĐ");
  });

  it("formats 0 to '0 VNĐ'", () => {
    expect(formatPrizeValue(0)).toBe("0 VNĐ");
  });

  it("formats 5000000 to '5.000.000 VNĐ'", () => {
    expect(formatPrizeValue(5000000)).toBe("5.000.000 VNĐ");
  });

  it("formats 8000000 to '8.000.000 VNĐ'", () => {
    expect(formatPrizeValue(8000000)).toBe("8.000.000 VNĐ");
  });

  it("formats 10000000 to '10.000.000 VNĐ'", () => {
    expect(formatPrizeValue(10000000)).toBe("10.000.000 VNĐ");
  });
});
