import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { FormControlService } from '../form-control.service';
import { FormGroup } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { data as countries } from 'emoji-flags';
import * as shape from 'd3-shape';
import * as d3 from 'd3';

@Component({
  selector: 'app-statistic-card-ui',
  templateUrl: './statistic-card-ui.component.html',
  styleUrls: ['./statistic-card-ui.component.scss']
})
export class StatisticCardUiComponent implements OnInit, OnChanges {

  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';

  apiResult: any
  title: string;
  description: string
  mappingFields: any;
  sparklineData: any = [];
  curves = {
    Basis: shape.curveBasis,
    'Basis Closed': shape.curveBasisClosed,
    Bundle: shape.curveBundle.beta(1),
    Cardinal: shape.curveCardinal,
    'Cardinal Closed': shape.curveCardinalClosed,
    'Catmull Rom': shape.curveCatmullRom,
    'Catmull Rom Closed': shape.curveCatmullRomClosed,
    Linear: shape.curveLinear,
    'Linear Closed': shape.curveLinearClosed,
    'Monotone X': shape.curveMonotoneX,
    'Monotone Y': shape.curveMonotoneY,
    Natural: shape.curveNatural,
    Step: shape.curveStep,
    'Step After': shape.curveStepAfter,
    'Step Before': shape.curveStepBefore,
    default: shape.curveLinear
  };

  // line interpolation
  curveType: string = 'Linear';
  curve: any = this.curves[this.curveType];
  constructor(private _formservice: FormControlService, private _appService: DataService) { }
  ngOnInit() {
    this.sparklineData = this.generateData(1, false, 30);
  }
  ngOnChanges(changes: any) {
    //this.ApiCall();
  }
  ApiCall() {

    let apiparam: any = {};
    this.control.ResultApiParam.forEach(item => {
      apiparam[item.key] = item.value;
    })
    this._appService.get(this.control.ResultApi, apiparam)
      .subscribe(
        (data: any) => {
          this.apiResult = data;
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done")
        }
      );
  }
  setMappingFields() {
    this.mappingFields = [];
    var arr: any = {};
    this.control.ResultDisplayField.forEach(item => {
      if (item.DisplayName.toLowerCase() == 'value') {
        arr = {};
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        this.title = arr;
      } else if (item.DisplayName.toLowerCase() == 'subvalue') {
        arr = {};
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        this.description = arr;
      }
    });
  }
  generateData(seriesLength: number, includeMinMaxRange: boolean, dataPoints: number = 5): any[] {
    const results = [];

    const domain: Date[] = []; // array of time stamps in milliseconds
    for (let j = 0; j < dataPoints; j++) {
      // random dates between Sep 12, 2016 and Sep 24, 2016
      domain.push(new Date(Math.floor(1473700105009 + Math.random() * 1000000000)));
    }

    for (let i = 0; i < seriesLength; i++) {
      const country = countries[Math.floor(Math.random() * countries.length)];
      const series = {
        name: country.name,
        series: []
      };

      for (let j = 0; j < domain.length; j++) {
        const value = Math.floor(2000 + Math.random() * 5000);
        // let timestamp = Math.floor(1473700105009 + Math.random() * 1000000000);
        const timestamp = domain[j];
        if (includeMinMaxRange) {
          const errorMargin = 0.02 + Math.random() * 0.08;

          series.series.push({
            value,
            name: timestamp,
            min: Math.floor(value * (1 - errorMargin)),
            max: Math.ceil(value * (1 + errorMargin))
          });
        } else {
          series.series.push({
            value,
            name: timestamp
          });
        }
      }

      results.push(series);
    }
    return results;
  }

}
