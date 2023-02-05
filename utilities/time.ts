import dayjs from "dayjs";

export const formatAddTime = (inputDate: string) => {
  const currentDate = dayjs(new Date());
  const currentHour = currentDate.get("hour");
  const currentMin = currentDate.get("minutes");
  const currentSec = currentDate.get("seconds");
  const date = dayjs(`${inputDate}`)
    .add(currentHour, "hour")
    .add(currentMin, "minutes")
    .add(currentSec, "seconds");
  return date.toISOString();
};
