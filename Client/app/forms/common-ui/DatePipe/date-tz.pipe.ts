declare var require;
import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
const moment = require('moment-timezone');
/**
* A moment timezone pipe to support parsing based on time zone abbreviations
* covers all cases of offset variation due to daylight saving.
*
* Same API as DatePipe with additional timezone abbreviation support
* Official date pipe dropped support for abbreviations names from Angular V5
*/
@Pipe({
  name: 'dateTz'
})
export class DateTzPipe extends DatePipe implements PipeTransform {

  transform(
    value: string | Date,
    format: string = 'MM/dd/yyyy hh:mm a',
    timezone: string = ''
  ): string {
      //check for default or buggy date value - 0001-01-01 05:53:28
      if (!value  || (typeof(value) === "string" && value.indexOf("0001") > -1))
          return "-";
    if (timezone.trim().toLowerCase() == 'local') {
      const date_local = moment.utc(moment(value).format('YYYY-MM-DD HH:mm:ss')).local().format('YYYY-MM-DD HH:mm:ss');
      const timezoneOffset: any = moment(date_local);
      return timezoneOffset.format(format);
    } else if (timezone) {
      const date_local = moment.utc(moment(value).format('YYYY-MM-DD HH:mm:ss')).local().format('YYYY-MM-DD HH:mm:ss');
      const timezoneOffset: any = moment(date_local).tz(timezone);
      return timezoneOffset.format(format);
    } else {
      return super.transform(value, format);
    }
  }

}
