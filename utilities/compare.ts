import dayjs from "dayjs";

export const compare = (inputDate: string) => {
  const currentDate = dayjs(new Date());
  const currentDateValue = currentDate.toISOString();
  if (inputDate < currentDateValue) {
    return "late";
  } else {
    return "upcoming payment";
  }
};
