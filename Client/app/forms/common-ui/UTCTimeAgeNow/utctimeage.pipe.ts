import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

@Pipe({
    name: 'utctimeage',
    pure: true
})
export class UTCTimeAgeNowPipe implements PipeTransform {
    //always show time relative to local - hence subtracting offset
    transform(utcdate: any, args?: any): string {
       let utcDate = new Date(utcdate);
        let timelapse = moment(new Date(utcDate.getTime() - (utcDate.getTimezoneOffset()*60*1000))).fromNow();
     //   moment(new Date(utcDate.getTime() + utcDate.getTimezoneOffset() * 60 * 1000)).fromNow();
        return timelapse;
    
  }

}
