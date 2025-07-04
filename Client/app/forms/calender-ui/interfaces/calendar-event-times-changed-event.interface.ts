import { CalendarEvent } from 'calendar-utils';

/**
 * The output `$event` type when an event is resized or dragged and dropped.
 */
export interface CalendarEventTimesChangedEvent {
  event: CalendarEvent<any>;
  newStart: Date;
  newEnd?: Date;
}
