import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { FormControlService } from '../form-control.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-goggle-map-ui',
  templateUrl: './goggle-map-ui.component.html',
  styleUrls: ['./goggle-map-ui.component.scss']
})
export class GoggleMapUiComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public data: any = [];
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public AuthService;
  placesCtrl = {
    "key": "places",
    "Name": "Google Places",
    "label": "",
    "placeholder": "Enter Location",
    "icon": "fa fa-location-arrow",
    "type": "googleplaces",
    "width": 10,
    "order": 1,
    "showinlist": false,
    "id": "b6b8bbed-1276-38f7-46eb-0fd9a9a92858",
    "filterresult": false,
    "uuid": 6882233111118
  }
  placesData: any = {}
  controlLoaded: boolean = false;

  defaultImage = "https://maps.gstatic.com/mapfiles/api-3/images/spotlight-poi-dotless.png";
  Result: any;
  title: any = "";
  image: any = "";
  description: any = "";
  html: any = "";
  mappingFields: any = [];

  cardInfo: any = []
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  constructor(private _appService: DataService, public _controlService: FormControlService) {
    this._controlService.componentRefreshCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
        () => {
          this.ApiCall();
        }
      );
  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
  ngOnInit() {
    this.formGroup.addControl(this.placesCtrl.id, new FormControl())
    this.controlLoaded = true;
  }
  ngOnChanges(changes: any) {
    this.ApiCall();
  }
  markerClick(item: any) {
    this.cardInfo = item[this.control.datanode] ? item[this.control.datanode] : [item];
  }

  ApiCall() {
    debugger;
    this.setMappingFields();
    if (this.control.filterresult == true) {
      this.Result = this.data[this.control.key] ? this.data[this.control.key] : [];
    } else if (this.control.ResultApi) {
      let apiparam: any = {};
      this.control.ResultApiParam.forEach(item => {
        apiparam[item.key] = item.value;
      })
      //apiparam.size = 500;
      this._appService.get(this.control.ResultApi, apiparam)
        .subscribe(
          (data: any) => {
            this.Result = data;
          },
          err => {
            console.log(err);
          },
          () => {
            //console.log("done")
          }
        );
    } else {
      this.Result = this.control.options;
    }
  }
  setMappingFields() {
    this.mappingFields = [];
    var arr: any = {};
    this.control.ResultDisplayField.forEach(item => {
      arr = {};
      if (item.DisplayName.toLowerCase() == 'title') {
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        arr.fieldtype = item.fieldtype;
        arr.redirecturl = item.redirecturl;
        arr.redirectparam = item.redirectparam;
        this.title = arr;
      } else if (item.DisplayName.toLowerCase() == 'description') {
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        arr.fieldtype = item.fieldtype;
        arr.redirecturl = item.redirecturl;
        arr.redirectparam = item.redirectparam;
        this.description = arr;
      } else if (item.DisplayName.toLowerCase() == 'pictureurl') {
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        arr.fieldtype = item.fieldtype;
        arr.redirecturl = item.redirecturl;
        arr.redirectparam = item.redirectparam;
        this.image = arr;
      }
      else if (item.DisplayName.toLowerCase() == 'html') {
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        this.html = arr;
      } else {
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        arr.fieldtype = item.fieldtype;
        arr.redirecturl = item.redirecturl;
        arr.redirectparam = item.redirectparam;
        this.mappingFields.push(arr);
      }
    });
  }
  getLatitude() {
    var lat = 40.712775;
    if (this.placesData.places) {
      lat = this.placesData.places.lat;
    } else {
      if (this.Result.length > 0) {
        var item = this.Result[0];
        if (item.lat)
          lat = item.lat;
        else if (item[this.control.latitudefield])
          lat = item[this.control.latitudefield]
      }
    }
    return lat;
  }
  getLongitude() {
    var lng = -74.005973;
    if (this.placesData.places) {
      lng = this.placesData.places.lng;
    } else {
      if (this.Result.length > 0) {
        var item = this.Result[0];
        if (item.lng)
          lng = item.lng;
        else if (item[this.control.longitudefield])
          lng = item[this.control.longitudefield]
      }
    }
    return lng;
  }
  ResetplaceData() {
    this.placesData.places = {};
    this._controlService.ResetGooglePlaces();
  }
}
