declare var require;
import { Component, OnInit, Input, OnDestroy, OnChanges, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UUID } from 'angular2-uuid';
import { DataService } from '../../core/services/data.service';
const _ = require('lodash');
import { ChartService } from '../chart-ui/chart-ref/chart.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { FormControlService } from '../form-control.service';
//import { Subscription } from 'rxjs/Subscription';
import { Subscription, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid-ui',
  templateUrl: './grid-ui.component.html',
  styleUrls: ['./grid-ui.component.scss']
})
export class GridUiComponent implements OnInit, OnDestroy, OnChanges {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public sidebar: boolean = false;
  @Input() public formdata: any = {};
  @Input() public AuthService;

  private options: NgbModalOptions = { size: 'lg', windowClass: 'model-cw' };
  private DataJson: any = {};
  private _success = new Subject<string>();
  staticAlertClosed = false;
  dataoptions: any = {};
  SuccessMessage: string = '';
  formSuccessMessage = {};
  formSuccessMessageText: string = '';
  ErrorMessage: string = '';
  Deleteconfirm: string = 'NO';
  CardformGroup: FormGroup;
  form: FormGroup;
  busy: Subscription;
  private hide = true;
  Iscontrolladded: boolean = false;
  subscription: Subscription;
  filter: any = {};
  cardgridoption: any = {};

  activepanel: any = null;
  accordiondata: any = {}
  isApiCalling: any = false;
  constructor(private _appService: DataService, private _chartService: ChartService, private modalService: NgbModal,
    public _controlService: FormControlService, private _router: Router,
    private location: Location, private cdRef: ChangeDetectorRef) {
    setTimeout(() => this.staticAlertClosed = true, 1000);
    this._success.subscribe((message) => this.formSuccessMessageText = message);
    this._success.pipe(
      debounceTime(500)
    ).subscribe(() => this.formSuccessMessageText = null);
    this.subscription = this._controlService.gridRefreshCalled$.subscribe((data: any) => { this.RefreshModalFromOtherControl(data) });

    this.cardgridoption = {
      "key": "Card",
      "Name": "Card",
      "label": "Card",
      "placeholder": "",
      "icon": "fa fa-search-plus",
      "type": "cardgrid",
      "width": 12,
      "order": 18,
      "enablecardfromfromui": true,
      "haschildren": false,
      "isTableView": false,
      "hasdatasource": true,
      "cardtype": "CommonCard",
      "field3Icon": "fa fa-retweet",
      "hidearrow": false,
      "actionicon": "fa fa-chevron-right",
      "field5text": "Favorite",
      "field6text": "Retweet",
      "ResultApi": "",
      "ResultApiParam": [],
      "ResultDisplayField": [],
      "PageSizeParam": "",
      "PageFromParam": "",
      "PageSize": 20,
      "PagingType": "client",
      "redirectOptions": {
        "redirecttype": "sidebar",
        "formid": "",
        "field": "",
        "condition": "0",
        "fieldvalue": 0
      },
      "ViewType": "list",
      "column": "12",
      "masonrylayout": false,
      "defaultcardimage": "",
      "showviewlink": true,
      "allowcardedit": true,
      "editcardredirecttype": "sidebar",
      "accessmodeforsidebar": "edit",
      "editcardurl": "",
      "paramforredirect": "",
      "showcardheader": false,
      "CustomAction": [],
      "actionview": "popover",
      "slideviewoption": "none",
      "slidersize": "5",
      "sidebarredirecturl": "",
      "nodataheight": null,
      "nodataimage": "",
      "nodataimagewidth": null,
      "nodatatitle": "",
      "nodatamsg": "No data available",
      "nodatabgcolor": "",
      "horizontalalignment": "",
      "iscircleimage": false,
      "imagewidth": "",
      "imageheight": "",
      "slidernavigation": false,
      "sliderpagination": false
    };
  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }
  RefreshModalFromOtherControl(param: any) {

    var data = param ? JSON.parse(param.props) : null;
    if (data) {
      if (data.actiontype == 'filter') {
        this.filter = {};
        this.control.children.forEach(child => {
          this.filter[child.key] = '';
        });
        if (this.control.key === data.controlkey) {
          this.filter[data.bindingfield] = this.data[data.sourcecontrolkey];
        }
      } else {
        if (this.control.key === data.controlkey) {
          this.InitializeControl();
        }
      }
    }
  }
  ngOnInit() {
    debugger;
    this.RefreshModalFromOtherControl(this._controlService.formData[this.control.key]);
    this.InitializeControl();
    if (this.control.viewtype == 'list') {
      this.GetAddEditForm();
      this.GetCardForm();
    }
  }
  ngOnChanges(control: any) {
    if (this.control.enablemultiview) {
      this.control.isaccordion = true;
      this.control.children = [];
      this.data[this.control.key] = this.data;
      this.control.viewtype = 'list';
    }
    if (Array.isArray(this.data[this.control.key]) && this.data[this.control.key].length > 0) {
      if (typeof this.data[this.control.key][0] !== 'object') {
        this.data[this.control.key] = [];
      }
    }
    //this.filter : any = {};
    //this.control.children.forEach(child => {
    //  this.filter[child.key] = '';
    //});
  }
  InitializeControl() {
    if (this.control.viewtype == 'grid' || this.control.viewtype == 'vertical grid') {
      //var _index = 1;
      //Object.entries(this.data).forEach(
      //  ([key, value]) => {
      if (Array.isArray(this.data[this.control.key])) {
        for (let ctr of this.data[this.control.key]) {
          if (!ctr.id) {
            ctr.id = UUID.UUID();
          }
          for (var index = 0; index < this.control.children.length; index++) {
            if (this.control.children[index].haschildren) {
              var children = this.control.children[index].children;
              for (var _index = 0; _index < children.length; _index++) {
                let id = ctr.id;
                this.formGroup.addControl(id + children[_index].key, new FormControl());
              }
            } else {
              let id = ctr.id;
              this.formGroup.addControl(id + this.control.children[index].key, new FormControl());
            }
          }
          //_index = _index + 1;
        }
      }
      //  }
      //);
    } else {
      if (Array.isArray(this.data[this.control.key])) {
        this.data[this.control.key].forEach(opt => {
          if (!opt.id) {
            opt.id = UUID.UUID();
          }
          this.addChildControlsInit(this.control.children, opt.id);
          this.Iscontrolladded = true;
        });
      }
    }
  }
  calladdcontroll() {
    if (this.data[this.control.key]) {
      this.data[this.control.key].forEach(opt => {

        this.addChildControlsInit(this.control.children, opt.id);
        this.Iscontrolladded = true;
      });
    }
  }
    Addrow() {
    this.Iscontrolladded = true;
    var childdata: any = {};
    this.filter = {};
    if (this.control.viewtype == 'grid' || this.control.viewtype == 'vertical grid') {
      let uuid = UUID.UUID();
      for (var index = 0; index < this.control.children.length; index++) {
        this.filter[this.control.children[index].key] = '';
        this.control.children[index].isTableView = true;
        if (this.control.children[index].type == 'grid') {
          childdata[this.control.children[index].key] = [];
        } else {
          childdata[this.control.children[index].key] = '';
        }

        childdata["id"] = uuid;

        var ctr = new FormControl();

        this.formGroup.addControl(uuid + this.control.children[index].key, ctr);

      }
      try {
        this.data[this.control.key].push(childdata);
      } catch (ex) {
        this.data[this.control.key] = [];
        this.data[this.control.key].push(childdata);
      }
    } else {
      this.GenerateDataJson(this.control.children);
      let uuid = UUID.UUID();
      this.DataJson["id"] = uuid;
      //var ctr = new FormControl();

      //this.formGroup.addControl(uuid + this.control.key, ctr);
      this.addChildControls(this.control.children);
      let datarow = this._controlService.deepcopy(this.DataJson);
      try {
        this.data[this.control.key].push(datarow);
      } catch (ex) {
        this.data[this.control.key] = [];
        this.data[this.control.key].push(datarow);
      }
    }

  }
  public addChildControlsInit(control: any, Id: string) {
    for (var index = 0; index < control.length; index++) {
      if (control[index].haschildren == true && control[index].type !== "grid") {
        //var ctrl = new FormControl();
        control[index].isTableView = true;
        //console.log(Id + control[index].key);
        this.formGroup.addControl(Id + control[index].key, new FormControl());
        // this.formGroup.addControl(Id + control[index].key, ctrl);
        this.addChildControlsInit(control[index].children, Id);

      }
      else {
        //var ctr = new FormControl();
        control[index].isTableView = true;
        //console.log(Id + control[index].key);
        this.formGroup.addControl(Id + control[index].key, new FormControl());
        //this.formGroup.addControl(Id + control[index].key, ctr);

      }
    }

  }
  private addChildControls(control: any) {

    for (var index = 0; index < control.length; index++) {
      if (control[index].haschildren == true && control[index].type !== "grid") {
        var ctrl = new FormControl();
        control[index].isTableView = true;
        this.formGroup.addControl(this.DataJson["id"] + control[index].key, ctrl);
        this.addChildControls(control[index].children);
      }
      else {
        var ctr = new FormControl();
        control[index].isTableView = true;
        this.formGroup.addControl(this.DataJson["id"] + control[index].key, ctr);

      }
    }

  }
  GenerateDataJson(control: any) {

    for (var index = 0; index < control.length; index++) {


      if (control[index].haschildren && control[index].type != 'grid' && control[index].type != 'dashboard' && control[index].type != 'multiselect') {
        this.GenerateDataJson(control[index].children);

      } else {
        if (control[index].type == 'checkbox') {
          this.DataJson[control[index].key] = false;

        } else if (control[index].type == 'grid') {
          this.DataJson[control[index].key] = [];
        }
        else if (control[index].type == 'list') {
          this.DataJson[control[index].key] = [];
        }
        else if (control[index].type == 'multiselect') {
          this.DataJson[control[index].key] = [];
        }
        else if (control[index].type == 'date') {
          this.DataJson[control[index].key] = new Date;
        } else if (control[index].type == 'label') {
          if (control[index].viewtype != 'name') {
            this.DataJson[control[index].key] = "";
          }
        }
        else {
          this.DataJson[control[index].key] = '';
        }

      }
    }


  }
    DeleteRow(row: any, content: any) {
        if (!this.control.deleteconfirmation) {
            _.remove(this.data[this.control.key], function (item) {
                return item === row;
            });
            this.data[this.control.key] = this.data[this.control.key].filter(item => item != row)
        }
        else {
            this.modalService.open(content, this.options).result.then((result) => {
                if (this.Deleteconfirm == "YES") {
                    _.remove(this.data[this.control.key], function (item) {
                        return item === row;
                    });
                    this.data[this.control.key] = this.data[this.control.key].filter(item => item != row)
                } else {
                    this.Deleteconfirm == "NO";
                }
            });
        }

        // remove from formgroup so that validators are gone - remove from shared control service the required fields too
        var key;
        for (key in row) {
            this.formGroup.removeControl(this.DataJson["id"] + key);         
            this.formGroup.clearAsyncValidators();
        }

  }
  Refresh() {
    if (this.control.refreshfor === 'formid') {
      this.GetFormJson("api/AppData/get", this.data.source, this.data.target);
    }
    else
      this.ApiCall(this.data.ResultApi, this.data.ResultApiParam);
  }
  BindFormModel(Url: string, formid: string) {
    let apiparam: any = {};
    this.SuccessMessage = 'Refreshing...';
    this.ErrorMessage = '';

    apiparam.id = formid;
    this._appService.get(Url, apiparam)
      .subscribe(
        (data: any) => {
          var _List = [];
          Object.keys(data.ModelJson).forEach((key) => {
            var arr: any = {};
            arr["key"] = key;
            arr["value"] = key;
            _List.push(arr);
          });
          this.data[this.control.key].forEach(option => {
            option.ModelFieldList = _List;
          })
        },
        err => {
          console.log(err);
          this.SuccessMessage = '';
          this.ErrorMessage = 'Failed, Please verify api detail and try again!';
        },
        () => {
          console.log("Completed Refresh Binding Field!")
          this.SuccessMessage = 'Refresh completed!';
          this.ErrorMessage = '';
        }
      );
  }
  GetFormJson(Url: string, formid1: string, formid2: string) {
    let apiparam: any = {};
    this.SuccessMessage = 'Refreshing...';
    this.ErrorMessage = '';

    apiparam.id = formid1;
    this._appService.get(Url, apiparam)
      .subscribe(
        (data: any) => {
          var _List = data.controls.length > 0 ? data.controls[0].ResultDisplayField[0].BindingFieldList : [];

          this.data[this.control.key].forEach(option => {
            option.SourceFieldList = _List;
          })

          apiparam.id = formid2;
          this._appService.get(Url, apiparam)
            .subscribe(
              (data: any) => {
                _List = [];
                var _data = data.controls.length > 0 ? data.controls[0] : [];
                Object.keys(_data).forEach((key) => {
                  //console.log(key + ' ' + value); // "a 5", "b 7", "c 9"     
                  var arr: any = {};
                  arr["key"] = key;
                  arr["value"] = key;
                  _List.push(arr);
                });
                this.data[this.control.key].forEach(option => {
                  option.TargeFieldList = _List;
                })
              },
              err => {
                console.log(err);
                this.SuccessMessage = '';
                this.ErrorMessage = 'Failed, Please verify api detail and try again!';
              },
              () => {
                console.log("Completed Refresh Binding Field!")
                this.SuccessMessage = 'Refresh completed!';
                this.ErrorMessage = '';
              }
            );
        },
        err => {
          console.log(err);
          this.SuccessMessage = '';
          this.ErrorMessage = 'Failed, Please verify api detail and try again!';
        }
      );
  }
  ApiCall(url: string, params: any) {
    if (this.control.children.find(x => x.refreshfor === 'model')) {
      this.BindFormModel("api/AppData/get", this.data[this.control.key + 'form']);
    }

    if (url && url.trim() != '') {
      let apiparam: any = {};
      this.SuccessMessage = 'Refreshing...';
      this.ErrorMessage = '';

      params.forEach(option => {
        apiparam[option.key] = option.value;
      })
      apiparam[this.data.SearchApiQuery] = "";
      // apiparam["size"] = "1";

      this._appService.get(url, apiparam)
        .debounceTime(400)
        .distinctUntilChanged()
        .subscribe(
          (data: any) => {
            this.dataoptions = data;

            if (this.control.refresh == true) {
              var _List = [];
              var dataOtption: any = {}
              if (Array.isArray(this.dataoptions) && this.dataoptions.length > 0)
                dataOtption = this.dataoptions[0];
              else if (typeof this.dataoptions == "object")
                dataOtption = this.dataoptions;

              Object.keys(dataOtption).forEach((key) => {
                //console.log(key + ' ' + value); // "a 5", "b 7", "c 9"     
                var arr: any = {};
                const value = this.dataoptions[key];
                arr["key"] = key;
                arr["value"] = key;
                if (value != null && typeof value == "object") {
                  Object.keys(value).forEach((cKey) => {
                    arr = {};
                    arr["key"] = key + " [" + cKey + "]";
                    arr["value"] = key + "~" + cKey;
                    _List.push(arr);
                  });
                }
                else
                  _List.push(arr);
              });

              this.data[this.control.key].forEach(option => {
                option.BindingFieldList = _List;
                option.ChartFieldList = this._chartService.ChartFieldList;
              })
            }
            this.cdRef.detectChanges();
          },
          err => {
            console.log(err);
            this.SuccessMessage = '';
            this.ErrorMessage = 'Failed, Please verify api detail and try again!';
            this.cdRef.detectChanges();
          },
          () => {
            console.log("Completed Refresh Binding Field!")
            this.SuccessMessage = 'Refresh completed!';
            this.ErrorMessage = '';
            this.cdRef.detectChanges();
          }
        );
    }

  }
  getAccordionData(props) {
    debugger;
    this.accordiondata = {};
    if (props.nextState !== false) {
      this.isApiCalling = true;
      const url = this.AddEditForm.GetEndpoint;
      const _data = props.panelId ? this.data[this.control.key][props.panelId] : props;
      if (url && url.trim() != '') {
        let apiparam: any = {};
        this.AddEditForm.GetEndpointParams.forEach(option => {
          if (_data[option.value]) {
            apiparam[option.key] = _data[option.value];
          }
          else {
            apiparam[option.key] = option.value;
          }
        })
        this._appService.get(url, apiparam)
          .subscribe(
            (data: any) => {
              this.isApiCalling = false;
              if (Array.isArray(data)) {
                if (data.length > 0) {
                  this.accordiondata = data[0];
                }
              } else {
                this.accordiondata = data;
              }
              if (!this.accordiondata) {
                this.accordiondata = {};
              }
              this.cdRef.detectChanges();
            },
            err => {
              this.isApiCalling = false;
              this.accordiondata = {};
              this.cdRef.detectChanges();
              console.log(err);
            },
            () => {
            }
          );
      } else {
        if (this.control.enablemultiview && this.control.rememberlastsearched) {
          var StoredData: any = this._controlService.deepcopy(this._controlService.getLocalStorage(this.control.advancesearchapimappingform, this.AuthService));
          this.accordiondata = StoredData ? StoredData : this._controlService.deepcopy(this.AddEditForm.ModelJson);
        } else {
          this.accordiondata = this.AddEditForm.ModelJson;
        }
        var _queryParams: any = {};
        if (this.control.PrimaryKey) {
          _queryParams[this.control.primarynode ? this.control.primarynode : this.control.PrimaryKey] = _data[this.control.PrimaryKey];
        }
        var urlTree: string = this._router.createUrlTree([], {
          queryParams: _queryParams,
          queryParamsHandling: "merge",
          preserveFragment: true
        }).toString();
        // this._router.navigateByUrl(urlTree);
        this.location.go(urlTree);
        this.isApiCalling = false;
        this.cdRef.detectChanges();
      }
    }
  }
  _opened: boolean = false;
  AddEditForm: any;
  CardForm: any;
  row: any;
  GetAddEditForm() {
    let apiparam = {};
    this.isApiCalling = true;
    this.cdRef.detectChanges();
    apiparam['id'] = this.control.addeditformid;
    this._appService.get("api/AppData/get", apiparam)
      .subscribe(
        (data: any) => {
          this.form = this._controlService.toControlGroup(data.controls);
          this.AddEditForm = this._controlService.deepcopy(data);
          this.row = this._controlService.deepcopy(data.ModelJson);

          if (this.control.isaccordion && Array.isArray(this.data[this.control.key]) && this.data[this.control.key].length > 0) {
            const _data = this.data[this.control.key][0];
            if (_data) {
              this.getAccordionData(_data);
              this.activepanel = _data[this.control.primarykey];
            } else {
              this.isApiCalling = false;
            }
          } else {
            this.isApiCalling = false;
          }
          this.cdRef.detectChanges();
        },
        err => {
          console.log(err);

        },
        () => {
          console.log("done")
        }
      );
  }
  GetCardForm() {
    this.CardformGroup = null;
    let apiparam = {};
    apiparam['id'] = this.control.enablemultiview ? this.control.extcardformid : this.control.cardformid;
    this._appService.get("api/AppData/get", apiparam)
      .subscribe(
        (data: any) => {
          this.CardformGroup = this._controlService.toControlGroup(data.controls);
          this.CardForm = this._controlService.deepcopy(data);
          this.cdRef.detectChanges();

        },
        err => {
          console.log(err);

        },
        () => {
          console.log("done")
        }
      );
  }

  OpenAddform() {
    this._opened = !this._opened;
    this._controlService.GenerateDataJson(this.AddEditForm.controls, this.AddEditForm.ModelJson, this.AddEditForm, true, this.AddEditForm.Id);
    this.row = this._controlService.deepcopy(this.AddEditForm.ModelJson);
  }

  Save() {
    debugger;
    var mode = "add";
    //var _othis = this;
    if (this.row['id']) {
      mode = "update";
      var id: string;
      id = this._controlService.deepcopy(this.row['id']);
      _.remove(this.data[this.control.key], function (item) {
        return item.id === id;
      });
      this.data[this.control.key].splice(0, 0, this._controlService.deepcopy(this.row));
    } else {

      let uuid = UUID.UUID();
      this.row['id'] = uuid;
      this.row['createddate'] = new Date();
      this.data[this.control.key].splice(0, 0, this._controlService.deepcopy(this.row));
      //this.data[this.control.key].push(this._controlService.deepcopy(this.row));
    }
    let apiparam: any = {};

    var updateparamlist = this.control.updateparamlist ? this.control.updateparamlist : [];
    updateparamlist.forEach(option => {
      apiparam[option.key] = option.value;
    })
    debugger;
    this.busy = this._appService.post(this.control.updateApi, JSON.stringify(this.data), apiparam)
      .subscribe((res: any) => {
        if (res.status == "success") {
          if (mode == "add") {
            this.formSuccessMessageText = this.control.successmsgtext;
            this.formSuccessMessage['title'] = this.control.successmsgtitle;
            this.formSuccessMessage['icon'] = this.control.successmsgicon;
          } else {
            this.formSuccessMessageText = this.control.updatemsgtext;
            this.formSuccessMessage['title'] = this.control.updatemsgtitle;
            this.formSuccessMessage['icon'] = this.control.updatemsgicon;
          }
        }
        this._opened = false;
      });

  }
  Edit(row: any) {
    this.row = row;
    this._opened = !this._opened;
  }
    Delete(content: any, row: any) {
        debugger;
    this.modalService.open(content, this.options).result.then((result) => {
      if (this.Deleteconfirm == "YES") {
        _.remove(this.data[this.control.key], function (item) {
          return item === row;
        });
        this.data[this.control.key] = this.data[this.control.key].filter(item => item != row);
        let apiparam: any = {};

        var updateparamlist = this.control.updateparamlist ? this.control.updateparamlist : [];
        updateparamlist.forEach(option => {
          apiparam[option.key] = option.value;
        })
        this.busy = this._appService.post(this.control.updateApi, JSON.stringify(this.data), apiparam)
          .subscribe((res: any) => {

          });
      } else {
        this.Deleteconfirm == "NO";
      }
    });
  }
  trackByFn(index, item) {
    if (!item) return null;
    return index;
  }
}
