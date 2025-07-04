declare var require;
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
var DateDiff = require('date-diff');
const _ = require('lodash');
@Component({
  selector: 'app-expression-calc-ui',
  templateUrl: './expression-calc-ui.component.html',
  styleUrls: ['./expression-calc-ui.component.scss']
})
export class ExpressionCalcUiComponent implements OnInit {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;

  constructor() { }

  ngOnInit() {

  }
  getOpration() {
    var operation = "";
    this.control.operation.forEach(item => {
      if (operation == "") {
        if (item.type == "value") {
          operation = this.data[item.data];
        } else {
          operation = item.data;
        }
      } else {
        if (item.type == "value") {
          operation += this.data[item.data];
        } else {
          operation += item.data;
        }
      }
    })
    return operation;
  }
  evaluate() {
    try {
      if (this.control.isdatediff) {
        var Lablevaleu = "";
        if (this.control.operation.length == 3) {
          const _date1 = this.data[this.control.operation[0].data];
          const _date2 = this.data[this.control.operation[2].data];

          const date1 = new Date(_date1);
          const date2 = new Date(_date2);
          const diff = new DateDiff(date1, date2);
          if (_date1 && _date2) {
            switch (this.control.datedifftype) {
              case "day":
                this.data[this.control.key] = diff.days();
                Lablevaleu = this.data[this.control.key] + " Day(s)"
                break;
              case "week":
                this.data[this.control.key] = diff.weeks();

                var days = ((diff.days()) % 7);
                var w = diff.weeks();
                if (w != NaN) {
                  Lablevaleu = Math.floor(diff.weeks()) + " Week(s)";

                  if (Lablevaleu == "NaN Week(s)") {
                    Lablevaleu = "0 Week(s)";
                  }
                }
                else {
                  Lablevaleu = "0 Week(s)"
                }
                if (days > 0) {
                  Lablevaleu += " and " + days + " Day(s)";
                }

                break;
              case "month":
                this.data[this.control.key] = diff.months();
                if (diff.months() != null) {
                  Lablevaleu = Math.floor(diff.months()) + " Month(s)";
                  if (Lablevaleu == "NaN Month(s)") {
                    Lablevaleu = "0 Month(s)";
                  }
                } else {
                  Lablevaleu = "0 Month(s)";
                }
                if (((diff.months()) % 1) != 0) {
                  const value = diff.months();
                  const decPart = parseInt((value + "").split(".")[0]);

                  days = (diff.days()) - (decPart * 30);
                  // var days = (decPart * 3);
                  if (days > 0) {
                    Lablevaleu += " and " + days + " Day(s)";
                  }
                }


                break;
              case "year":
                this.data[this.control.key] = diff.years();
                Lablevaleu = this.data[this.control.key] + " Year(s)"
                break;
              default:
                this.data[this.control.key] = diff.days();
                Lablevaleu = this.data[this.control.key] + " Day(s)"
                break;

            }
          }
        }
        return Lablevaleu;

      } else {
        var operation = this.getOpration();
        this.data[this.control.key] = eval(operation);
      }
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
