import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-number-format',
  templateUrl: './number-format.component.html',
  styleUrls: ['./number-format.component.scss']
})
export class NumberFormatComponent implements OnInit {
    @Input() public data: any;
    @Input() public control: any;
    symbol: any = { "0": "", "1": "$", "2": "₹", "3": "£", "4": "€", "5": "¥" };
    formatoption: any = {};
  constructor() { }
  ngOnInit() {
      this.formatoption = this.data[this.control.key];
  }
  format() {
      var data = "1234";

      if (data.trim() == "") return;
      var dataDecimal = data.split(".")
      var BeforeDecimal = dataDecimal[0];
      var AfterDecimal = dataDecimal.length > 1 ? dataDecimal[1] : "";

      var descimalplaces = "";
      if (this.formatoption.format == "number") {
          for (let i = 0; i < this.formatoption.descimalplaces; i++) {
              if (AfterDecimal.length > i) {
                  descimalplaces = descimalplaces + AfterDecimal.substring(i, 1);
              }
              else {
                  descimalplaces = descimalplaces + "0";
              }
          }
          if (descimalplaces == "") {
              AfterDecimal = "";
          }
          else {
              AfterDecimal = "." + descimalplaces;
          }
          if (this.formatoption.separator == true)
              BeforeDecimal = this.numberWithCommas(BeforeDecimal);

          if (this.formatoption.negativenumbers == "0")
              data = "-" + BeforeDecimal + AfterDecimal;
          else
              data = BeforeDecimal + AfterDecimal;

          this.formatoption.numbersample = data;
      }
      else if (this.formatoption.format == "currency") {
          for (let i = 0; i < this.formatoption.cdescimalplaces; i++) {
              if (AfterDecimal.length > i) {
                  descimalplaces = descimalplaces + AfterDecimal.substring(i, 1);
              }
              else {
                  descimalplaces = descimalplaces + "0";
              }
          }
          if (descimalplaces == "") {
              AfterDecimal = "";
          }
          else {
              AfterDecimal = "." + descimalplaces;
          }
          BeforeDecimal = this.numberWithCommas(BeforeDecimal);
          BeforeDecimal = (this.symbol[this.formatoption.symbol] ? this.symbol[this.formatoption.symbol] : "") + BeforeDecimal;

          if (this.formatoption.cnegativenumbers == "0")
              data = "-" + BeforeDecimal + AfterDecimal;
          else
              data = BeforeDecimal + AfterDecimal;

          this.formatoption.currencysample = data;
      }
      
      
  }
  numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
}
