import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { FormControlService } from '../form-control.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-nested-ui',
  templateUrl: './nested-ui.component.html',
  styleUrls: ['./nested-ui.component.scss']
})
export class NestedUiComponent implements OnInit, OnChanges {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public AuthService: any;

  advanceSearchformJson: any;
  advanceSearchModelJson: any;
  result: any = [];
  nestedItems: any;
  busy: Subscription;

  constructor(
    private _appService: DataService,
    private _controlservice: FormControlService
  ) { }
  ngOnInit() {
    // {
    //   "key": "",
    //   "header": "clientname",
    //   "formid": "a76a82f9-ee08-49cd-a0c3-72e3d542fe4a",
    //   "children": [
    //     {
    //       "key": "region",
    //       "header": "region",
    //       "formid": "",
    //       "children": [
    //         {
    //           "key": "user",
    //           "header": "userid",
    //           "formid": "",
    //           "children": [
    //             {
    //               "key": "requisitions",
    //               "header": "requisitionname",
    //               "formid": "253f310b-56b0-4803-b517-bf319435a275",
    //               "children": []
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ]


    // }
  }
  ngOnChanges() {
    // debugger;
    if (this.control.nestedItems) {
      this.nestedItems = JSON.parse(this.control.nestedItems)
      this.find(this.nestedItems);
    }

    if (this.control.apiurl) {
      this.callservice();
    } else {
      this.result = [];
    }
  }
  find(nestedItems: any = []) {
    nestedItems.children.forEach(item => {
      if (item.formid && item.formid !== '') {
        this.loadMetadata(item.formid);
      }
      this.find(item);
    })
  }
  loadMetadata(formid) {
    // debugger;
    let apiparam: any = {};
    apiparam.id = formid;
    this.busy = this._appService.get("api/AppData/get", apiparam)
      .subscribe(
        (data: any) => {
          var arr: any = {};
          arr.form = this._controlservice.toControlGroup(data.controls);
          arr.formUIJson = this._controlservice.deepcopy(data);

          this._controlservice.formData[formid] = arr;
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done")
        }
      );
  }
  callservice() {
    const apiparam: any = {};
    const url = this.control.apiurl;

    if (this.control.apiparam) {
      this.control.apiparam.forEach(option => {
        apiparam[option.key] = option.value;
      })
    }

    this._controlservice.setPageVarible(this.control.apiparam, apiparam, this.AuthService);
    if (url) {
      this.busy = this._appService.get(url, apiparam)
        .subscribe(
          (data: any) => {
            if (Array.isArray(data))
              this.result = data;
            else {
              this.result.push(data);
            }
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
}
