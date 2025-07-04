import { Component, OnInit, Input, OnChanges, OnDestroy, ChangeDetectionStrategy,
  ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ISubscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/timer';

@Component({
  selector: 'app-progress-bar-ui',
  templateUrl: './progress-bar-ui.component.html',
  styleUrls: ['./progress-bar-ui.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgressBarUiComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public data: any;
  @Input() public control: any;
  constructor(private cd: ChangeDetectorRef) { }

  private subscription: ISubscription;

  TotalWeightage: number = 0;
  Weightage: number = 0;
  ngOnInit() {
    let timer = Observable.timer(2000, 1000);
    this.subscription = timer.subscribe(t => this.calculateProgress());
  }
  ngOnChanges() {
    this.TotalWeightage = 0;
    var totalWeight = 0;
    this.control.weightagefieldmapping.forEach(item => {
      totalWeight = totalWeight + (item.weightage ? item.weightage : 0);
    });
    this.TotalWeightage = totalWeight;
  }
  ngOnDestroy() {
    if (this.subscription && !this.subscription.closed)
      this.subscription.unsubscribe();
  }
  calculateProgress() {
    if (this.control.sourceweightage == 'single') {
      // this.Weightage = Math.round(this.data[this.control.singlevalue]);
      this.data[this.control.key] = Math.round(this.data[this.control.singlevalue]);
    } else if (this.control.sourceweightage == 'apifields') {
      // this.Weightage = Math.round((this.data[this.control.actualvalue] / this.data[this.control.totalvalue]) * 100);
      let _actualVal = this.data[this.control.actualvalue] ? parseInt(this.data[this.control.actualvalue]) : 0;
      this.data[this.control.key] = Math.round((_actualVal / parseInt(this.control.totalvalue)) * 100);
    } else {
      if (this.TotalWeightage == 0) {
        // this.Weightage = 0;
        this.data[this.control.key] = 0;
      } else {
        var finalScore = 0;
        this.control.weightagefieldmapping.forEach(item => {
          if (Array.isArray(this.data[item.property]) && this.data[item.property].length > 0) {
            finalScore = finalScore + ((item.weightage / this.TotalWeightage) * 100);
          } else if (!Array.isArray(this.data[item.property])) {
            if (this.data[item.property] !== '' && this.data[item.property] != null && this.data[item.property] !== "undefined") {
              finalScore = finalScore + ((item.weightage / this.TotalWeightage) * 100);
            }
          }
        })
        // this.Weightage = Math.round(finalScore);
        this.data[this.control.key] = Math.round(finalScore);
      }
    }

    this.cd.markForCheck();
  }
}
