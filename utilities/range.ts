import dayjs from "dayjs";

export const beforeDateInput = (inputDate: string, maxday: number) => {
  const currentDate = dayjs(new Date());
  const maxDate = currentDate.add(maxday, "day");

  const maxDateValue = maxDate.toISOString();
  if (inputDate <= maxDateValue) {
    return inputDate;
  } else {
    return undefined;
  }
};
