import { UpdateTime } from "../interfaces/incomeInterfaces";

// Used when updating an income: splits a cron string to create an object to be set into initial update income
// form data state as the value for the updateTime key
export function constructUpdateTimeObj(cronString: string): UpdateTime {
  let cronSplit: string[] = cronString.split(" ");
  let newUpdateTime: UpdateTime = {
    minute: cronSplit[0],
    hour: cronSplit[1],
    dayOfMonth: cronSplit[2],
    month: cronSplit[3],
    dayOfWeek: cronSplit[4],
  };
  return newUpdateTime;
}
