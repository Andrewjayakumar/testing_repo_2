import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeAgoPipe } from 'time-ago-pipe';
import { DateTzPipe } from './DatePipe/date-tz.pipe';
import { SortArrayPipe } from './SortArray/SortArryPipe';
import { ReversePipe } from './Reverse-Pipe/reverse.pipe';
import { UTCTimeAgeNowPipe } from './UTCTimeAgeNow/utctimeage.pipe';
import { HighlightPipe } from './highlight-search-text/highlight.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
    declarations: [
        TimeAgoPipe,
        DateTzPipe,
        SortArrayPipe,
        ReversePipe,
      UTCTimeAgeNowPipe,
      HighlightPipe
    ],
    exports: [
        TimeAgoPipe,
        DateTzPipe,
        SortArrayPipe,
        ReversePipe,
      UTCTimeAgeNowPipe,
      HighlightPipe
    ]
})
export class CommonCustomPipeModule { }
