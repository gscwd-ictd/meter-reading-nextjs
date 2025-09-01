import { Holiday, HolidayFromHrms } from "@mr/components/features/(general)/scheduler/holidays";
import { format } from "date-fns";

export function transformHolidays(holidaysFromHrms: HolidayFromHrms[]): Holiday[] {
  return holidaysFromHrms.map((holiday) => ({
    id: holiday.id,
    name: holiday.name,
    date: format(holiday.holidayDate, "yyyy-MM-dd"), // rename the property here
    type: holiday.type,
  }));
}
