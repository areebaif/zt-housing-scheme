import dayjs from "dayjs";

export const addMonth = (date: string, recurringMonthNumber: number) => {
  const start = dayjs(date);
  const result = start.add(recurringMonthNumber, "month");

  return result.toISOString();
};
