import { Pipe, PipeTransform } from '@angular/core';
// import { CalendarEvent } from 'calendar-utils';
import { CalendarEventTitleFormatter } from '../providers/calendar-event-title-formatter.provider';

@Pipe({
  name: 'calendarEventTitle'
})
export class CalendarEventTitlePipe implements PipeTransform {
  constructor(private calendarEventTitle: CalendarEventTitleFormatter) {}

  transform(title: string, titleType: string, event: any): string {
    return this.calendarEventTitle[titleType](event);
  }
}
