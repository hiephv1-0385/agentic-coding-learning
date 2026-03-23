export function formatPrizeValue(value: number): string {
  return `${new Intl.NumberFormat("vi-VN").format(value)} VNĐ`;
}
