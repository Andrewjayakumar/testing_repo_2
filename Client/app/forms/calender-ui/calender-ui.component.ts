// @ts-nocheck

import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import {
  Component,
  OnChanges,
  Input,
  Output,
  ChangeDetectorRef,
  OnDestroy,
  LOCALE_ID,
  Inject,
  EventEmitter
} from '@angular/core';
import {
  WeekDay,
  MonthView,
  MonthViewDay,
  WeekViewEvent,
  WeekViewEventRow
} from 'calendar-utils';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours
} from 'date-fns';
import { CalendarEventTitleFormatter } from './providers/calendar-event-title-formatter.provider';
import { CalendarDateFormatter } from './providers/calendar-date-formatter.provider';
import { CalendarUtils } from './providers/calendar-utils.provider';
import { CalendarDragHelper } from './providers/calendar-drag-helper.provider';
import { CalendarEventTimesChangedEvent } from './interfaces/calendar-event-times-changed-event.interface';
import {
  CalendarEvent
} from 'calendar-utils';
import { FormControlService } from '../form-control.service';
import { Subject } from 'rxjs/Subject';
import {
  DraggableHelper
} from 'angular-draggable-droppable';
export interface WeekViewEventResize {
  originalOffset: number;
  originalSpan: number;
  edge: string;
}

@Component({
  selector: 'app-calender-ui',
  templateUrl: './calender-ui.component.html',
  styleUrls: ['./calender-ui.component.scss'],
  providers: [
    CalendarEventTitleFormatter, CalendarDateFormatter, CalendarUtils, DraggableHelper
  ]
})
export class CalenderUiComponent implements OnChanges, OnDestroy {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public AuthService: any;

  title: any = "";
  image: any = "";
  description: any = "";
  html: any = "";
  mappingFields: any = [];

  public day: MonthViewDay;
  /**
* Called when an event is resized or dragged and dropped
*/
  @Output()
  eventTimesChanged: EventEmitter<
    CalendarEventTimesChangedEvent
    > = new EventEmitter<CalendarEventTimesChangedEvent>();

  events: CalendarEvent<any>[] = [];
  precision: any;
  //openDay: MonthViewDay;
  selectedDate: string = "";
  //monthNames = ["January", "February", "March", "April", "May", "June",
  //    "July", "August", "September", "October", "November", "December"
  //];
  monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  public viewDate: Date = new Date();
  public days: WeekDay[];
  public locale: string;
  private unsubscribe: Subject<true> = new Subject<true>();
  constructor(private _appService: DataService, @Inject(LOCALE_ID) locale: string, private cdr: ChangeDetectorRef,
    private utils: CalendarUtils, private _sanitizer: DomSanitizer, public _controlService: FormControlService,
    private _router: Router) {
    this._controlService.componentRefreshCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
        () => {
          if (this._controlService.dataModel.length > 0) {
            this.AddModelJson();
          } else {
            this.ApiCall();
          }
        }
      );
    this.locale = locale;
    // console.log(this.view);
    // console.log(JSON.stringify(this.view));
  }
  eventRows: WeekViewEventRow[] = [];
  columnHeaders: WeekDay[] = [];
  selectedView = 'month';

  /**
   * @hidden
   */
  view: any = [];

  /**
   * @hidden
   */
  openRowIndex: number;

  /**
   * @hidden
   */
  openDay: MonthViewDay;

  /**
   * @hidden
   */

  weekStartsOn: number = 0;
  excludeDays: number[] = [];
  weekendDays: number[] = [];
  activeDayIsOpen: boolean = false;

  colors: any = {
    red: {
      primary: '#ad2121',
      secondary: '#FAE3E3'
    },
    blue: {
      primary: '#1e90ff',
      secondary: '#D1E8FF'
    },
    yellow: {
      primary: '#e3bc08',
      secondary: '#FDF1BA'
    }
  };
  actions: any[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: any }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: any }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

  AddModelJson() {
    this._controlService.dataModel.forEach(item => {
      this.apiResult.push(item);
    });
    if (this.control.isNestedResult) {
      this.apiResult = this._controlService.formatResult(this.apiResult);
    }
  }
  ngOnChanges(changes: any) {
    this.ApiCall();
  }
  /**
 * @hidden
 */
  ngOnDestroy(): void {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
  public calendarPreviousView() {

    if (this.selectedView == 'month') {
      this.viewDate.setMonth(this.viewDate.getMonth() - 1);
      this.refreshAll();
    } else {
      this.viewDate.setDate(this.viewDate.getDate() - 7);
      this.refreshAllWeek();
    }
  }
  handleEvent(action: string, event: any): void {
    //this.modalData = { event, action };
    //this.modal.open(this.modalContent, { size: 'lg' });
  }
  getBackground(image) {
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }
  eventArray = {
    title: '',
    start: null,
    data: null,
    showcard: false,
    end: null,
    color: this.colors.blue,
    draggable: true,
    resizable: {
      beforeStart: true,
      afterEnd: true
    }
  }
  addEvent(): void {
    this.events.push({
      title: 'New event',
      start: startOfDay(new Date()),
      end: endOfDay(new Date()),
      color: this.colors.red,
      draggable: true,
      resizable: {
        beforeStart: true,
        afterEnd: true
      }
    });
    //this.refresh.next();
  }
  apiResult: any;
  ApiCall() {

    this.setMappingFields();
    if (this.control.filterresult == true) {
      this.apiResult = this.data[this.control.key] ? this.data[this.control.key] : [];
      this.setEventData();
    } else if (this.control.ResultApi) {
      let apiparam: any = {};
      this.control.ResultApiParam.forEach(item => {
        apiparam[item.key] = item.value;
      })
      //apiparam.size = 500;

      let currentUrl = this._router.url ? this._router.url : "/";
      if (currentUrl.indexOf('?') > -1) {
        currentUrl = currentUrl.split('?')[0];
      }
      let menu = this.AuthService.Menu;
      let page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
      if (page) {
        const activateParams = this._controlService.getQueryParams();
        page.Params.forEach(option => {
          var param = this.control.ResultApiParam.find(x => x.value == option.name);
          if (param) {
            let activeParam = activateParams.find(x => x[option.name]);
            if (activeParam) {
              apiparam[param.key] = activeParam[option.name];
            } else {
              apiparam[param.key] = option.value;
            }
          }
        })
      }
      if (this.control.rawquery) {
        var query = this.control.rawquery;

        this.control.ResultApiParam.forEach(option => {
          var value = option.value;
          if (page) {
            const activateParams = this._controlService.getQueryParams();
            page.Params.forEach(pageoption => {
              var param = this.control.ResultApiParam.find(x => x.value == pageoption.name);
              if (param) {
                let activeParam = activateParams.find(x => x[pageoption.name]);
                if (activeParam) {
                  value = activeParam[pageoption.name];
                } else {
                  value = pageoption.value;
                }
              }
            })
          }
          var param = "{{" + option.key + "}}";
          query = query.replace(param, value)
          // query.replace(param, value)

        })
        apiparam.query = query;
      }
      this._appService.get(this.control.ResultApi, apiparam, false)
        .subscribe(
          (data: any) => {
            if (this.control.isNestedResult) {
              this.apiResult = this._controlService.formatResult(data);
            } else {
              this.apiResult = data;
            }
            this.setEventData();
          },
          err => {
            console.log(err);
          },
          () => {
            //console.log("done")
          }
        );
    }
  }
  setMappingFields() {
    this.mappingFields = [];
    var arr: any = {};
    this.control.ResultDisplayField.forEach(item => {
      if (item.fieldtype == 'title') {
        arr = {};
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        arr.fieldtype = item.fieldtype;
        arr.redirecturl = item.redirecturl;
        arr.redirectparam = item.redirectparam;
        arr.webnametype = item.webnametype;
        arr.webicon = item.WebIcon;
        this.title = arr;
      } else if (item.fieldtype == 'description') {
        arr = {};
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        arr.fieldtype = item.fieldtype;
        arr.redirecturl = item.redirecturl;
        arr.redirectparam = item.redirectparam;
        arr.webnametype = item.webnametype;
        arr.webicon = item.WebIcon;
        this.description = arr;
      } else if (item.fieldtype == 'image') {
        arr = {};
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        arr.fieldtype = item.fieldtype;
        arr.redirecturl = item.redirecturl;
        arr.redirectparam = item.redirectparam;
        arr.webnametype = item.webnametype;
        arr.webicon = item.WebIcon;
        this.image = arr;
      }
      else if (item.fieldtype == 'html') {
        arr = {};
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        this.html = arr;
      } else {
        arr = {};
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        arr.fieldtype = item.fieldtype;
        arr.redirecturl = item.redirecturl;
        arr.redirectparam = item.redirectparam;
        arr.webnametype = item.webnametype;
        arr.webicon = item.WebIcon;
        this.mappingFields.push(arr);
      }
    });
  }
  setEventData() {
    this.events = [];
    this.apiResult.forEach(item => {
      var eventArr = JSON.parse(JSON.stringify(this.eventArray));
      eventArr.data = item;
      eventArr.start = startOfDay(item[this.control.calmappingdate]);
      eventArr.end = startOfDay(item[this.control.calmappingdate]);
      eventArr.title = item.Title;
      this.events.push(eventArr);
    })

    if (this.selectedView == 'month') {
      this.refreshAll();
    } else {
      this.refreshAllWeek();
    }
  }
  public calendarNextView() {

    if (this.selectedView == 'month') {
      this.viewDate.setMonth(this.viewDate.getMonth() + 1);
      this.refreshAll();
    } else {
      this.viewDate.setDate(this.viewDate.getDate() + 7);
      this.refreshAllWeek();
    }
  }

  public calendarToday() {
    this.viewDate = new Date();
    if (this.selectedView == 'month') {
      this.refreshAll();
    } else {
      this.refreshAllWeek();
    }
  }
  private refreshAll(): void {
    this.columnHeaders = null;
    this.view = null;
    this.refreshHeader();
    this.refreshBody();
    this.checkActiveDayIsOpen();
  }
  private refreshHeader(): void {
    this.days = this.utils.getWeekViewHeader({
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      weekendDays: this.weekendDays
    });

    this.selectedDate = this.monthNames[this.days[6].date.getMonth()] + " " + this.days[6].date.getFullYear();
    //this.emitBeforeViewRender();
  }

  private refreshBody(): void {

    this.view = this.utils.getMonthView({
      events: this.events,
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      weekendDays: this.weekendDays
    });
    //this.emitBeforeViewRender();
  }
  private checkActiveDayIsOpen(): void {
    if (this.activeDayIsOpen === true) {
      this.openDay = this.view.days.find(day =>
        isSameDay(day.date, this.viewDate)
      );
      const index: number = this.view.days.indexOf(this.openDay);
      this.openRowIndex =
        Math.floor(index / this.view.totalDaysVisibleInWeek) *
        this.view.totalDaysVisibleInWeek;
    } else {
      this.openRowIndex = null;
      this.openDay = null;
    }
  }

  private refreshHeaderWeek(): void {
    this.days = this.utils.getWeekViewHeader({
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      weekendDays: this.weekendDays
    });
    if (this.days[6].date.getMonth() == this.days[0].date.getMonth())
      this.selectedDate = this.days[0].date.getDate() + "-" + this.days[6].date.getDate() + " " + this.monthNames[this.days[6].date.getMonth()] + " " + this.days[6].date.getFullYear();
    else if (this.days[6].date.getMonth() != this.days[0].date.getMonth())
      this.selectedDate = this.days[0].date.getDate() + " " + this.monthNames[this.days[0].date.getMonth()] + "-" + this.days[6].date.getDate() + " " + this.monthNames[this.days[6].date.getMonth()] + " " + this.days[6].date.getFullYear();
  }

  private refreshBodyWeek(): void {
    this.eventRows = this.utils.getWeekView({
      events: this.events,
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      precision: this.precision,
      absolutePositionedEvents: true
    });
  }

  private refreshAllWeek(): void {
    this.refreshHeaderWeek();
    this.refreshBodyWeek();
  }
  getMonthTitle(title) {
    return title.length > 30 ? (title.substring(0, 30) + '..') : title;
  }

  //*****************drag drop***************************************************/
  eventDragged(
    weekEvent: WeekViewEvent,
    draggedByPx: number,
    dayWidth: number
  ): void {

    const daysDragged: number = draggedByPx / dayWidth;
    const newStart: Date = addDays(weekEvent.event.start, daysDragged);
    let newEnd: Date;
    if (weekEvent.event.end) {
      newEnd = addDays(weekEvent.event.end, daysDragged);
    }

    this.eventTimesChanged.emit({ newStart, newEnd, event: weekEvent.event });
  }

  getDayColumnWidth(eventRowContainer: HTMLElement): number {
    return Math.floor(eventRowContainer.offsetWidth / this.days.length);
  }
  dayColumnWidth: number;
  validateDrag: (args: any) => boolean;
  currentResizes: Map<WeekViewEvent, WeekViewEventResize> = new Map();

  dragStart(weekViewContainer: HTMLElement, event: HTMLElement): void {
    this.dayColumnWidth = this.getDayColumnWidth(weekViewContainer);
    const dragHelper: CalendarDragHelper = new CalendarDragHelper(
      weekViewContainer,
      event
    );
    this.validateDrag = ({ x, y }) =>
      this.currentResizes.size === 0 && dragHelper.validateDrag({ x, y });
    this.cdr.markForCheck();
  }

  eventDroped(event, newStart) {

    this.eventTimesChanged.emit({ event: event, newStart: newStart });
  }
}
