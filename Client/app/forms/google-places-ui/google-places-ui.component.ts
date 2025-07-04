import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../form-control.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-google-places-ui',
  templateUrl: './google-places-ui.component.html',
  styleUrls: ['./google-places-ui.component.scss']
})
export class GooglePlacesUiComponent implements OnInit, OnChanges, OnDestroy{
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  control_id: string = ""
  options: any = {
    types: [],
    componentRestrictions: { postal_code: 325201}
  }
  result: any = {
    "street_number": "",
    "street": "",
    "city": "",
    "state": "",
    "district": "",
    "country": "",
    "postal_code": "",
    "lat": "",
    "lng": "",
    "adr_address": "",
    "name": "",
    "place_id": "",
    "types": "",
    "url": "",
    "utc_offset": "",
    "vicinity": "",
    "photos": "",
    "airport": "",
    "CountryCodes": "",
    "formatted_address": ""
  }
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  constructor(public _controlService: FormControlService) {
    this._controlService.componentResetCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
      () => {
        this.initializeData();
      }
    );

    this._controlService.googlePlacesResetCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
      () => {
        this.result = {};
        this.initializeData();
      }
      );
  }
  address: any 
  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
  ngOnInit() {
    this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
  }
  ngOnChanges(control: any) {
    this.initializeData();
  }
  initializeData() {
    if (this.data[this.control.key + "_node"] && this.data[this.control.key + "_node"].formatted_address) {
      this.result = this.data[this.control.key + "_node"];
    }
    else if (this.data[this.control.key]) {
      if (typeof this.data[this.control.key]=='object') {
        this.result.formatted_address = this.data[this.control.key].formatted_address;
      } else
        this.result.formatted_address = this.data[this.control.key];
      
    }
    else {
      // this.data[this.control.key] = this.result;
      if (this.control.StoreJsonnode) {
        this.data[this.control.key] = this.result.formatted_address;
        this.data[this.control.key + "_node"] = this.result;
      }
    }
    this.address = this.result.formatted_address;
  }
  getAddress(event: any) {
    if (event && event.formatted_address) {
      this.data[this.control.key] = event.formatted_address;
      if (this.control.StoreJsonnode)
      {
        this.result.formatted_address = event.formatted_address;
        this.data[this.control.key + "_node"] = this.result;
      }
    }
  }
}
