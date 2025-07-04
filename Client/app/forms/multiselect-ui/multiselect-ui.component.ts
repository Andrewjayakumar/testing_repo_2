declare var require;
import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Pipe, PipeTransform, ViewChild } from '@angular/core';

// import 'rxjs/add/operator/debounceTime';
// import 'rxjs/add/operator/distinctUntilChanged';
// import 'rxjs/add/operator/throttleTime';
// import 'rxjs/add/observable/fromEvent';
import { DataService } from '../../core/services/data.service';
import { FormGroup, FormControl } from '@angular/forms';
const _ = require('lodash');
import { FormControlService } from '../form-control.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: any, filter: any): any {
    if (filter && Array.isArray(items)) {
      let filterKeys = Object.keys(filter);
      return items.filter(item =>
        filterKeys.reduce((memo, keyName) =>
          (memo && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] === "", true));
    } else {
      return items;
    }
  }
}

@Component({
  selector: 'app-multiselect-ui',
  templateUrl: './multiselect-ui.component.html',
  styleUrls: ['./multiselect-ui.component.scss']
})

export class MultiselectUiComponent implements OnInit {
  @ViewChild('container') container;
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';

  public isOpen: boolean = false;
  public enableFilter: boolean;
  public addtext: string = "";
  public filterText: string;
  public filterPlaceholder: string;
  public filterInput = new FormControl();
  public addInput = new FormControl();
  public items = [];
  public hide = true;
  public showMaxmessage = false;
  public control_id = null;
  constructor(private changeDetectorRef: ChangeDetectorRef, public _appService: DataService, public _controlService: FormControlService, private _sanitizer: DomSanitizer) {
    document.addEventListener('click', this.offClickHandler.bind(this));
  }
  offClickHandler(event: any) {
    if (this.container && this.container.nativeElement) {
      if (!this.container.nativeElement.contains(event.target)) { // check click origin
        this.isOpen = false;
      }
    }
  }
  safehtml(value) {
    return this._sanitizer.bypassSecurityTrustHtml(value);
    // return this._sanitizer.bypassSecurityTrustStyle(`linear-gradient( rgba(29, 29, 29, 0), rgba(16, 16, 23, 0.5)), url(${image})`);
  }
  keyDownFunction(event) {
    if (event.keyCode == 13) {
      try {
        this.data[this.control.key].push(this.addtext);
      } catch (e) {
        this.data[this.control.key] = [];
        this.data[this.control.key].push(this.addtext);
      }

      //alert(this.addtext);
      this.addtext = "";
      // rest of your code
      this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);
    }
  }
  select(item: any) {
    if (this.data[this.control.key] == null) {
      this.data[this.control.key] = [];
    }
    if (this.control.maximumselect) {
      if (this.data[this.control.key].length < this.control.maximumselect) {
        item.checked = !item.checked;
        this.data[this.control.key].push(item[this.control.textfield]);
        this.showMaxmessage = false;
      } else {
        this.showMaxmessage = true;
      }
    }
    else {
      item.checked = !item.checked;
      this.data[this.control.key].push(item[this.control.textfield]);
      this.showMaxmessage = false;
    }

    this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);
  }
  remove(item: any) {
    // item.checked = !item.checked;
    _.remove(this.data[this.control.key], function (row) {
      return row === item;
    });
    this.items.forEach(option => {
      if (item == option[this.control.textfield]) {
        option.checked = false;
      }

    })
    //this.data[this.control.key].push(item[this.control.textfield]);
    this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);
  }
  toggleSelect() {

    this.isOpen = !this.isOpen;
    if (this.items.length === 0) {
      this.getdata();
    }
  }

  clearFilter() {
    this.filterText = "";
  }

  ngOnInit() {
    //this.getdata();

    this.control_id = this.control.id;
    this.enableFilter = true;
    this.filterText = "";
    this.filterPlaceholder = "Filter..";
    this.formGroup.controls[this.control_id]
      .valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(term => {
        this.addtext = term;
        this.changeDetectorRef.markForCheck();
        console.log(term);
      });
    this.filterInput
      .valueChanges
      .debounceTime(200)
      .distinctUntilChanged()
      .subscribe(term => {
        this.filterText = term;
        this.changeDetectorRef.markForCheck();
        console.log(term);
      });
    this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);
  }
  ngOnChanges(control: any) {
    this.getdata();
    this.updatePageVarible();
  }
  getdata() {
    this.ServiceCall();
  }
  getItems() {
    var val = this.filterText.trim().length > 0 ? this.filterText : this.addtext;
    return val ? this.items.filter((s) => s[this.control.textfield].match(new RegExp(val, 'gi'))) : this.items;

  }
  ServiceCall() {
    if (this.control.apiurl.trim() == '') {
      this.items = this.control.paramlist;
      if (this.data[this.control.key]) {
        this.items.forEach(option => {

          this.data[this.control.key].forEach(selected => {

            if (selected == option[this.control.textfield]) {
              option.checked = true;
            }
          })


        })
      }
    } else {
      let url = this.control.apiurl;
      let searchapiparam: any = {};

      this.control.paramlist.forEach(option => {
        searchapiparam[option.key] = option.value;
      })
      this._appService.get(url, searchapiparam, this.control.enablecache)
        .debounceTime(400)
        .distinctUntilChanged()
        .subscribe((data: any) => {
          this.items = data;
          if (this.data[this.control.key]) {
            this.items.forEach(option => {

              this.data[this.control.key].forEach(selected => {

                if (selected == option[this.control.textfield]) {
                  option.checked = true;
                }
              })


            })
          }
        });
    }
  }
  updatePageVarible() {
    if (this.control.storeaspagesearch) {
      var data = [];
      if (Array.isArray(this.data[this.control.key])) {
        this.data[this.control.key].forEach(item => {
          if (item) {
            data.push(item);
          }
        })
      }
      if (data.length > 0) {
        this._controlService.setPageSearchVarible(data, this.control.key)
      }
    }
  }
}
