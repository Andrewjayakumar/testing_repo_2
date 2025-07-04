declare var require;
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
const _ = require('lodash');

@Component({
  selector: 'app-group-calc-ui',
  templateUrl: './group-calc-ui.component.html',
  styleUrls: ['./group-calc-ui.component.scss']
})
export class GroupCalcUiComponent implements OnInit {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;

  constructor() { }

  ngOnInit() {
  }
  getArray(data) {
    var arr = [];
    if (data && this.data[data.value1]) {
      this.data[data.value1].forEach(item => {
        if (!isNaN(parseInt(item[data.value2])))
          arr.push(item[data.value2]);
      });
    }
    return arr;
  }
  getOpration() {
    var operation = null;
    var expression = this.control.expression ? this.control.expression : {};
    switch (expression.type) {
      case "max":
        var arr = this.getArray(expression);
        operation = _.max(arr);
        break;
      case "mean":
        var arr = this.getArray(expression);
        operation = _.mean(arr);
        break;
      case "min":
        var arr = this.getArray(expression);
        operation = _.min(arr);
        break;
      case "length":
        // var arr = this.getArray(expression);
        if (Array.isArray(expression.value1) && expression.value1.length > 0) {
          operation = this.data[expression.value1[0]].length;
        }
        break;
      case "sum":
        var arr = this.getArray(expression);
        operation = _.sum(arr);
        break;
      case "abs":
        break;
      case "ceil":
        break;
      case "floor":
        break;
      case "pow":
        break;
      case "sqrt":
        break;
      default:
        operation = 0;
        break;

    }
    return operation;
  }
  evaluate() {
    try {
      this.data[this.control.key] = this.getOpration();
    }
    catch (e) {
      this.data[this.control.key] = '#';
    }
    return this.data[this.control.key];
  }
  gethtml() {
    var s = "<" + this.control.formattype + ">" + this.evaluate() + "</" + this.control.formattype + ">";
    return s;
  }
}
