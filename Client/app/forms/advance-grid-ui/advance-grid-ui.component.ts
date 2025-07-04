import { Component, OnInit, Input, ViewChild, AfterViewInit, TemplateRef, OnChanges, ElementRef, OnDestroy, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../../core/services/data.service';
import { FormControlService } from '../form-control.service';
import { Subscription } from 'rxjs/Subscription';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { IMultiSelectSettings } from 'angular-2-dropdown-multiselect';
import { ExportToCsv } from '../../forms/export-to-csv';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// import { AuthService } from "../../core/authservice/auth.service";
var columns: any;
@Component({
  selector: 'app-advance-grid-ui',
  templateUrl: './advance-grid-ui.component.html',
  styleUrls: ['./advance-grid-ui.component.scss'],
  providers: [ExportToCsv]
})
export class AdvanceGridUiComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy, AfterViewChecked {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public AuthService: any;

  @ViewChild('myTable') table: any;
  @ViewChild('linkTemplate') linkTemplate: TemplateRef<any>;
  @ViewChild('dateTemplate') dateTemplate: TemplateRef<any>;
  @ViewChild('imageTemplate') imageTemplate: TemplateRef<any>;

  formEdit: FormGroup
  formEmail: FormGroup
  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'form-control text-left',
    selectionLimit: 1,
    autoUnselect: true,
    closeOnSelect: true,
    containerClasses: 'form-group multiy-select',
  };
  //page: number = 1
  busy: Subscription;
  successMessage: string = "";
  modalMessage: string = "";
  confirm: string = "NO";
  private _success = new Subject<string>();
  page: any = { totalElements: 0, pageNumber: 0, size: 0 };
  externalPaging: boolean = false;
  apiResult: any = [];
  columns: any = [];
  allColumns: any = [];
  //selectedRecord: any = {};
  selected: any = [];
  EditFormUI: any = null
  EmailFormUI: any = null
  EditModelJson: any = {}
  EmailModelJson: any = {}
  _openEdit: boolean = false;
  _openEmail: boolean = false;
  //selectAll: boolean = false;
  private options: NgbModalOptions = { size: 'lg', windowClass: 'model-cw', backdrop: false };
  updateDataModel: any
  UpdateControl: any = null
  upddropdownList: any
  updselectedItems: any
  isApiCalling: boolean = false;

  loadingText: string = "";
  advanceSearchformJson: any;
  advanceSearchModelJson: any;
  totalCount: any
  defaultpagesearchsize: any;
  defaultexpandallFirstLoad: boolean = true;
  private unsubscribe: Subject<true> = new Subject<true>();
  constructor(private _appService: DataService,
    public _controlService: FormControlService,
    private modalService: NgbModal,
    private exportToCsv: ExportToCsv,
    private _router: Router, private el: ElementRef, private cdRef: ChangeDetectorRef,
    private _sanitizer: DomSanitizer) {
    this._controlService.componentRefreshCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
          (message?) => {
              // fix for double alerts on grid
              if (message) {
                  if (message.status && message.status === "error") {
                      this.changeSuccessMessage(message.title + "  " + message.text);
                  } else {
                      this.changeSuccessMessage(message.text);
                  }
                  return;
              }
          if (this._controlService.dataModel.length > 0) {
            this.AddModelJson();
          } else {
            this.LoadResultData();
          }
        }
      );
  }
  AddModelJson() {
    this._controlService.dataModel.forEach(item => {
      this.apiResult.push(item);
    });
  }
  ngOnInit() {
    this._openEmail = false;
    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);
  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
    if (this.table) {
      this.table = null;
      }

  }
  ngOnChanges(control: any) {
    this.setMappingFields();
    // if (this.EditFormUI == null || this.EditFormUI.Id != this.control.editformid) {
    //   this.loadEditForm()
    // }
    debugger;
    if (this.control.enablemultiview) {
      // this.control.actionview = '';
      this.apiResult = this._controlService.deepcopy(this.data);
    } else {
      if (this.control.PagingType == 'server') {
        this.externalPaging = true;
      }
      if (this.control.enableadvancesearch) {
        this.loadMetadata(this.control.advancesearchapimappingform)
      } else {
        this.LoadResultData();
      }
    }
  }

  ngAfterViewInit() {
    if (this.table) {
      this.table.bodyComponent.updatePage = function (direction: string): void {
        let offset = this.indexes.first / this.pageSize;

        if (direction === 'up') {
          offset = Math.ceil(offset);
        } else if (direction === 'down') {
          offset = Math.floor(offset);
        }

        if (direction !== undefined && !isNaN(offset)) {
          this.page.emit({ offset });
        }
      }
    }
  }
  ngAfterViewChecked() {
    if (this.control.defaultexpandall && this.defaultexpandallFirstLoad) {
      if (this.table && this.table.rowDetail) {
        this.table.rowDetail.expandAllRows();
        this.cdRef.detectChanges();
      }
    }
  }
  onSelect({ selected }) {
    debugger;
    // console.log('Select Event', selected, this.selected);

    this.selected.splice(0, this.selected.length);
    this.selected.push(...selected);
  }

  onActivate(event) {

    // console.log('Activate Event', event);
  }

  LoadResultData() {

    this.apiResult = [];
    if (this.control.filterresult == true) {
      this.isApiCalling = false;
      if (this.externalPaging) {
        this.onScroll(1);
        // this.apiResult = this.data[this.control.key] ? this.data[this.control.key].slice(0, this.control.PageSize) : [];
        // this.page.totalElements = this.control.PageSize * (this.page.pageNumber + 1)
      } else {
        this.apiResult = this._controlService.formatResult(this.data[this.control.key] ? this.data[this.control.key] : []);
      }
    } else if (this.control.ResultApi) {
      if (this.externalPaging) {
        this.onScroll(this.control.enableadvancesearch ? 1 : 0);
      } else {
        if (this.control.enableadvancesearch) {
          this.SearchApiCall();
        } else {
          this.ResultApiCall();
        }
      }
    }
    this.cdRef.detectChanges();
  }

  setPage(pageInfo) {
    // debugger;
    this.page.pageNumber = pageInfo.offset;
    if (this.externalPaging) {
      this.ResultApiCall();
    } else {
      //this.LoadResultData();
    }
  }
  tempData: any = []
  tempFirstCol: any = {};
  ResultApiCall() {
    var url = this.data[this.control.key + '_filterParam'] ? this.data[this.control.key + '_filterParam'].apiurl : this.control.ResultApi;
    var apiparam: any = this.data[this.control.key + '_filterParam'] ? this.data[this.control.key + '_filterParam'].params : {};
    if (!this.data[this.control.key + '_filterParam']) {
      this.control.ResultApiParam.forEach(item => {
        if (item.isdatamodel) {
          apiparam[item.key] = this.data[item.value];
        } else {
          apiparam[item.key] = item.value;
        }
      })
      this._controlService.setPageVarible(this.control.ResultApiParam, apiparam, this.AuthService);
    }
    if (this.externalPaging) {
      apiparam[this.control.PageSizeParam] = this.control.PageSize;
      apiparam[this.control.PageFromParam] = Math.ceil(this.apiResult.length / parseInt(this.control.PageSize)) + 1; //(this.control.PageSize * this.page.pageNumber) + 1;
    }

    if (this.control.rawquery) {
      var query = this.control.rawquery;
      let currentUrl = this._router.url ? this._router.url : "/";
      if (currentUrl.indexOf('?') > -1) {
        currentUrl = currentUrl.split('?')[0];
      }
      const menu = this.AuthService.Menu;
      const page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
      const activateParams = this._controlService.getQueryParams();
      this.control.ResultApiParam.forEach(option => {
        var value = option.value;
        if (option.isdatamodel) {
          value = this.data[value];
        } else {
          if (page) {
            page.Params.forEach(pageoption => {
              var param = this.control.ResultApiParam.find(x => x.value == pageoption.name);
              if (param) {
                let activeParam = activateParams.find(x => x[pageoption.name]);
                if (activeParam) {
                  value = activeParam[pageoption.name];
                } else {
                  value = pageoption.value;
                }
              }
            })
          }
        }
        var param = "{{" + option.key + "}}";
        query = query.replace(param, value)
        // query.replace(param, value)

      })
      apiparam.query = query;
    }

    debugger;
    this.isApiCalling = true;
    this.cdRef.detectChanges();
    this.busy = this._appService.get(this.control.ResultApi, apiparam, false)
      .subscribe(
        (data: any) => {
          debugger;
          if (this.control.isNestedResult && Array.isArray(data)) {
            if (this.externalPaging) {
              // this.apiResult = [...this.apiResult, ...data];
              this.apiResult = this.apiResult.concat(this._controlService.formatResult(data));
              //this.apiResult = data;
            } else {
              this.apiResult = this._controlService.formatResult(data);
            }
          } else if (Array.isArray(data)) {
            if (this.externalPaging) {
              this.apiResult = this.apiResult.concat(data);
            } else {
              this.apiResult = data;
            }
          }
          this.tempData = this._controlService.deepcopy(this.apiResult);
          this.page.totalElements = this.control.PageSize * (this.page.pageNumber + 1)
        },
        err => {
          this.isApiCalling = false;
          this.cdRef.detectChanges();
          console.log(err);
        },
        () => {
          this.isApiCalling = false;
          this.cdRef.detectChanges();
          //console.log("done")
        }
      );
  }
  SearchApiCall() {
    if (!this.nosearchform && this.control.enableadvancesearch && !this.validateForm()) {
      return;
    }
    var url = this.control.ResultApi;
    let resultapiparam: any = {};
    //this.apiResult = [];
    // ...using get request
    debugger;
    if (this.control.rememberlastsearched) {
      this._controlService.setLocalStorage(this.advanceSearchModelJson, this.control.advancesearchapimappingform, this.AuthService);
    }
    if (url) {
      this.isApiCalling = true;
      this.cdRef.detectChanges();
      if (this.control.apimethod == "post") {
        var _searchModel: any = {};
        this.control.ResultApiParam.forEach(option => {
          if (option.isdatamodel) {
            _searchModel[option.key] = this.data[option.value];
            resultapiparam[option.key] = this.data[option.value];
          } else {
            _searchModel[option.key] = option.value;
            resultapiparam[option.key] = option.value;
          }
        })
        if (this.advanceSearchformJson && this.advanceSearchModelJson) {
          this.control.advancesearchapimapping.forEach(option => {
            _searchModel[option.ApiParam] = this.advanceSearchModelJson[option.advancesearchfield];
          })
        }
        if (this.control.PagingType == 'server') {
          if (this.control.PageSizeParam !== "") {
            //_searchModel[this.control.PageSizeParam] = this.control.PageSize;
            if (this.defaultpagesearchsize) {
              _searchModel[this.control.PageSizeParam] = this.defaultpagesearchsize;
            } else {
              _searchModel[this.control.PageSizeParam] = _searchModel[this.control.PageSizeParam] ? _searchModel[this.control.PageSizeParam] : this.control.PageSize;
            }
          }
          if (this.control.PageFromParam !== "") {
            const index = Math.ceil(this.apiResult.length / parseInt(_searchModel[this.control.PageSizeParam])) + 1;

            // _searchModel[this.control.PageFromParam] = index;
            _searchModel[this.control.PageFromParam] = _searchModel[this.control.PageFromParam] ? _searchModel[this.control.PageFromParam] : index;
          }
        }
        this._controlService.setPageVarible(this.control.ResultApiParam, _searchModel, this.AuthService);
        this._controlService.setPageVarible(this.control.ResultApiParam, resultapiparam, this.AuthService);

        this.busy = this._appService.post(url, JSON.stringify(_searchModel), resultapiparam)
          .debounceTime(400)
          .distinctUntilChanged()
          .subscribe((data: any) => {
            if (this.control.apifieldforresponse && Array.isArray(data[this.control.apifieldforresponse])) {
              if (this.control.apifieldforcounts) {
                this.totalCount = data[this.control.apifieldforcounts];
              }
              if (this.control.PagingType == 'client') {
                if (this.control.isNestedResult) {
                  this.apiResult = this._controlService.formatResult(data[this.control.apifieldforresponse]);
                } else {
                  this.apiResult = data[this.control.apifieldforresponse];
                }
              }
              else {
                if (this.control.isNestedResult) {

                  this.apiResult = this.apiResult.concat(this._controlService.formatResult(data[this.control.apifieldforresponse]));
                } else {
                  this.apiResult = this.apiResult.concat(data[this.control.apifieldforresponse]);
                }
              }
            }
            else if (Array.isArray(data)) {
              if (this.control.PagingType == 'client') {
                if (this.control.isNestedResult) {
                  this.apiResult = this._controlService.formatResult(data);
                } else {
                  this.apiResult = data;
                }
              }
              else {
                if (this.control.isNestedResult) {
                  this.apiResult = this.apiResult.concat(this._controlService.formatResult(data));
                } else {
                  this.apiResult = this.apiResult.concat(data);
                }
              }
            } else {
              if (this.control.PagingType == 'client') {
                this.apiResult = [];
              }
            }
            this.defaultpagesearchsize = null;
            if (this.control.rememberlastsearched) {
              this._controlService.setLocalStorage(this.apiResult.length, this.control.advancesearchapimappingform + 'pagesize', this.AuthService);
            }

            if (this.control.storeaspagesearchfromapi) {
              this._controlService.setPageSearchKeywords(data[this.control.storeaspagesearchapifield]);
            }
          },
            err => {
              this.isApiCalling = false;
              this.cdRef.detectChanges();
              console.log(err);
            },
            () => {
              this.isApiCalling = false;
              this.cdRef.detectChanges();
            });
      } else {
        this.control.ResultApiParam.forEach(option => {
          if (option.isdatamodel) {
            resultapiparam[option.key] = this.data[option.value];
          } else {
            resultapiparam[option.key] = option.value;
          }
        })
          if (this.advanceSearchformJson && this.advanceSearchModelJson) {
              let pagevariablesToBeSet = [];
              let pageVariableValues = {};
              this.control.advancesearchapimapping.forEach(option => {
                  resultapiparam[option.ApiParam] = this.advanceSearchModelJson[option.advancesearchfield];
                  // call to set page variable here.
                  pageVariableValues[option.ApiParam] = this.advanceSearchModelJson[option.advancesearchfield];;
                  pagevariablesToBeSet.push(option.ApiParam);
              });
              this._controlService.setPageSearchVarible(pageVariableValues, null, pagevariablesToBeSet);
        }
        if (this.control.PagingType == 'server') {
          if (this.control.PageSizeParam !== "") {
            if (this.defaultpagesearchsize) {
              resultapiparam[this.control.PageSizeParam] = this.defaultpagesearchsize;
            } else {
              resultapiparam[this.control.PageSizeParam] = resultapiparam[this.control.PageSizeParam] ? resultapiparam[this.control.PageSizeParam] : this.control.PageSize;
            }
          }
          if (this.control.PageFromParam !== "") {
            const index = Math.ceil(this.apiResult.length / parseInt(this.control.PageSize)) + 1;

            resultapiparam[this.control.PageFromParam] = resultapiparam[this.control.PageFromParam] ? resultapiparam[this.control.PageFromParam] : index;
          }
          }
          debugger;
        this._controlService.setPageVarible(this.control.ResultApiParam, resultapiparam, this.AuthService);

        this.busy = this._appService.get(url, resultapiparam)
          .debounceTime(400)
          .distinctUntilChanged()
          .subscribe((data: any) => {
            if (this.control.apifieldforresponse && Array.isArray(data[this.control.apifieldforresponse])) {
              if (this.control.apifieldforcounts) {
                this.totalCount = data[this.control.apifieldforcounts];
              }
              if (this.control.PagingType == 'client') {
                if (this.control.isNestedResult) {
                  this.apiResult = this._controlService.formatResult(data[this.control.apifieldforresponse]);
                } else {
                  this.apiResult = data[this.control.apifieldforresponse];
                }
              }
              else {
                if (this.control.isNestedResult) {

                  this.apiResult = this.apiResult.concat(this._controlService.formatResult(data[this.control.apifieldforresponse]));
                } else {
                  this.apiResult = this.apiResult.concat(data[this.control.apifieldforresponse]);
                }
              }
            }
            else if (Array.isArray(data)) {
              if (this.control.PagingType == 'client') {
                if (this.control.isNestedResult) {
                  this.apiResult = this._controlService.formatResult(data);
                } else {
                  this.apiResult = data;
                }
              }
              else {
                if (this.control.isNestedResult) {

                  this.apiResult = this.apiResult.concat(this._controlService.formatResult(data));
                } else {
                  this.apiResult = this.apiResult.concat(data);
                }
              }
            } else {
              if (this.control.PagingType == 'client') {
                this.apiResult = [];
              }
            }
            this.defaultpagesearchsize = null;
            if (this.control.rememberlastsearched) {
              this._controlService.setLocalStorage(this.apiResult.length, this.control.advancesearchapimappingform + 'pagesize', this.AuthService);
            }
            if (this.control.storeaspagesearchfromapi) {
              this._controlService.setPageSearchKeywords(data[this.control.storeaspagesearchapifield]);
            }
          },
            err => {
              this.isApiCalling = false;
              this.cdRef.detectChanges();
              console.log(err);
            },
            () => {
              this.isApiCalling = false;
              this.cdRef.detectChanges();
            });
      }
    }
  }
  form: FormGroup;
  nosearchform: any = false;
  loadMetadata(formid) {
    this._controlService.formvalidation = {};
    this._controlService.formvalid = false;
    this.advanceSearchformJson = null;
    this.advanceSearchModelJson = null;
    this.form = null;
    let apiparam: any = {};
    apiparam.id = formid;
    if (formid) {
      this._appService.get("api/AppData/get", apiparam)
        .subscribe(
          (data: any) => {
            // debugger;
            this._controlService.formData = {};
            this.form = this._controlService.toControlGroup(data.controls);
            this.advanceSearchformJson = this._controlService.deepcopy(data);
            if (this.control.rememberlastsearched) {
              var _data: any = this._controlService.deepcopy(this._controlService.getLocalStorage(formid, this.AuthService));
              this.advanceSearchModelJson = _data ? _data : this._controlService.deepcopy(data.ModelJson);
              // this.SearchApiCall();
            } else {
              this.advanceSearchModelJson = this._controlService.deepcopy(data.ModelJson);
            }
            this._controlService.GenerateDataJson(this.advanceSearchformJson.controls, this.advanceSearchModelJson, this.form)
            if (this.control.enabledefaultsearch) {
              this.defaultpagesearchsize = this._controlService.getLocalStorage(formid + 'pagesize', this.AuthService);
              this.LoadResultData();
            } else {
              this.defaultpagesearchsize = null;
            }
            this.cdRef.detectChanges();
          },
          err => {
            console.log(err);
          },
          () => {
            //console.log("done")
          }
        );
    } else {
      this.nosearchform = true;
      this.LoadResultData();
    }
  }
  getCellBackground = ({ row, column, value }) => {
    let color: string;
    const col = columns.find(x => x.prop == column.prop && x.cellconditionfield != '');
    if (col && col.coloractiontype === 'background') {
      value = row[col.cellconditionfield] || row[col.cellconditionfield] == false ? row[col.cellconditionfield] : "";
      col.cellbackgroundcolor.forEach(item => {
        switch (item.condition) {
          case '=':
            if (value.toString() == item.value.toString())
              color = item.color;
            break;
          case '<>':
            if (value.toString() != item.value.toString())
              color = item.color;
            break;
          case '>':
            if (parseFloat(value) > parseFloat(item.value))
              color = item.color;
            break;
          case '>=':
            if (parseFloat(value) >= parseFloat(item.value))
              color = item.color;
            break;
          case '<':
            if (parseFloat(value) < parseFloat(item.value))
              color = item.color;
            break;
          case '<=':
            if (parseFloat(value) <= parseFloat(item.value))
              color = item.color;
            break;
          case 'between':
            if (this.isBetween(parseFloat(value), item.value))
              color = item.color;
            break;
        }
      })
    }
    return ' ' + color;
  }
  getCellTextColor(row, col) {
    let color: string;
    if (col) {
      var value = row[col.cellconditionfield] || row[col.cellconditionfield] == false ? row[col.cellconditionfield] : "";
      col.cellbackgroundcolor.forEach(item => {
        switch (item.condition) {
          case '=':
            if (value.toString() == item.value.toString())
              color = item.color;
            break;
          case '<>':
            if (value.toString() != item.value.toString())
              color = item.color;
            break;
          case '>':
            if (parseFloat(value) > parseFloat(item.value))
              color = item.color;
            break;
          case '>=':
            if (parseFloat(value) >= parseFloat(item.value))
              color = item.color;
            break;
          case '<':
            if (parseFloat(value) < parseFloat(item.value))
              color = item.color;
            break;
          case '<=':
            if (parseFloat(value) <= parseFloat(item.value))
              color = item.color;
            break;
          case 'between':
            if (this.isBetween(parseFloat(value), item.value))
              color = item.color;
            break;
        }
      })
    }
    return { 'color': color };
  }
  getHtml(value) {
    return this._sanitizer.bypassSecurityTrustHtml(value);
  }
  getConditionaltext(conditionaltext: any = [], value: any) {
    var _conditionaltext = value;
    conditionaltext.forEach(item => {
      switch (item.condition) {
        case '=':
          if (value.toString() == item.value.toString())
            _conditionaltext = item.displaytext;
          break;
        case '<>':
          if (value.toString() != item.value.toString())
            _conditionaltext = item.displaytext;
          break;
        case '>':
          if (parseFloat(value) > parseFloat(item.value))
            _conditionaltext = item.displaytext;
          break;
        case '>=':
          if (parseFloat(value) >= parseFloat(item.value))
            _conditionaltext = item.displaytext;
          break;
        case '<':
          if (parseFloat(value) < parseFloat(item.value))
            _conditionaltext = item.displaytext;
          break;
        case '<=':
          if (parseFloat(value) <= parseFloat(item.value))
            _conditionaltext = item.displaytext;
          break;
        case 'between':
          if (this.isBetween(parseFloat(value), item.value))
            _conditionaltext = item.displaytext;
          break;
      }
    })
    return _conditionaltext;
  }
  isBetween(value, condition) {
    var val = condition.split('-');
    if (val.length == 2) {
      if (val[0] < value && val[1] > value) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  formatResult(data: any) {
    // debugger;
    var Datalist: any = [];
    data.forEach((item) => {
      var row: any = {};

      for (var key in item) {
        if (item.hasOwnProperty(key)) {

          if (typeof item[key] === 'object') {
            var item2 = item[key];
            for (var key2 in item2) {
              if (item2.hasOwnProperty(key2)) {
                row[key + "~" + key2] = item2[key2];
              }
            }

          } else {
            row[key] = item[key];
          }

        }
      }
      Datalist.push(row);
    });
    return Datalist;
  }
  loadEditForm() {
    var apiparam: any = {}
    apiparam.id = this.control.editformid;
    this._appService.get("api/AppData/get", apiparam)
      .subscribe(
        (data: any) => {
          this.formEdit = this._controlService.toControlGroup(data.controls.filter(x => x.filterresult != true));
          this.EditFormUI = this._controlService.deepcopy(data);
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done")
        }
      );
  }

  loadEmailForm() {
    debugger;
    var _othis = this;
    var apiparam: any = {}
    apiparam.id = this.control.emailformid;
    this._appService.get("api/AppData/get", apiparam)
      .subscribe(
        (data: any) => {
          debugger;
          this.formEmail = this._controlService.toControlGroup(data.controls.filter(x => x.filterresult != true));
          this.EmailFormUI = this._controlService.deepcopy(data);
          this.EmailModelJson = this._controlService.deepcopy(data.ModelJson);
          var _arrEmail = [];
          this.selected.forEach(item => {
            _arrEmail.push(item[_othis.control.emailfieldSource]);
          })
          _othis.EmailModelJson[_othis.control.emailfieldDestination] = _arrEmail;
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done")
        }
      );
  }

  delete(content) {

    if (this.isRecordSelected()) {
      this.modalMessage = "Are you sure want to delete ?";
      this.modalService.open(content, this.options).result.then((result) => {
        if (this.confirm == "YES") {
          var requests = [];
          for (let item of this.selected) {
            let url = this.control.deleteapi;
            let apiparam: any = {};
            this.control.deleteapiparam.forEach(option => {
              apiparam[option.key] = option.value;
            })
            apiparam[this.control.primarykey] = item[this.control.primarykey];
            requests.push(this._appService.get(url, apiparam, false))
          }
          this.busy = forkJoin(requests)
            .subscribe(result => {
              this.changeSuccessMessage("Deleted Successfully!");
            },
              err => {
                this.changeSuccessMessage("Error!");
              },
              () => {
                //console.log("done!")
              }
            );
        } else {
          this.confirm == "NO";
        }
      });
    } else {
      this.changeSuccessMessage("Please selected atleast one record.");
    }
  }

  openUpdate(content) {
    debugger;
    if (this.isRecordSelected()) {
      this.upddropdownList = this.getColumnList();
      if (this.EditFormUI == null || this.EditFormUI.Id != this.control.editformid) {
        this.loadEditForm()
      }
      this.modalService.open(content, this.options);
    } else {
      this.changeSuccessMessage("Please selected atleast one record.");
    }
  }

  onChange(event) {
    debugger;
    //this.resetUpdate();
    var key = this.updselectedItems.length > 0 ? this.updselectedItems[0] : ""
    this.updateDataModel = this._controlService.deepcopy(this.EditFormUI.ModelJson);
    this.UpdateControl = this._controlService.findControl(key, this.EditFormUI.controls.filter(x => x.filterresult != true));
  }

  resetUpdate() {
    this.UpdateControl = null;
    this.updateDataModel = null;
    this.updselectedItems = [];
  }

  update(content) {
    debugger;
    //alert(JSON.stringify(this.updateDataModel));
    this.modalMessage = "Are you sure want to update ?";
    this.modalService.open(content, this.options).result.then((result) => {
      if (this.confirm == "YES") {
        var requests = [];

        for (let item of this.selected) {
          debugger;
          let url = this.control.updateapi;
          let apiparam: any = {};
          this.control.updateapiparam.forEach(option => {
            apiparam[option.key] = option.value;
          })
          item[this.UpdateControl.key] = this.updateDataModel[this.UpdateControl.key]
          requests.push(this._appService.post(url, JSON.stringify(item), apiparam))

        }
        this.busy = forkJoin(requests)
          .subscribe(result => {
            this.changeSuccessMessage("Update Successfully!");
          },
            err => {
              this.changeSuccessMessage("Error!");
            },
            () => {
              //console.log("done!")
            }
          );
      } else {
        this.confirm == "NO";
      }
    });
    // this.resetUpdate();
  }

     clearAdvSearchFormModel() {
         
        let keys = Object.keys(this.advanceSearchModelJson);
         //this is to allow call only on first time clear, subsequent clears are not to fire api call.
         var tempval = "";
         keys.forEach(x =>
            { 
             if (typeof (this.advanceSearchModelJson[x]) === "string") {
                 tempval = tempval + " " + this.advanceSearchModelJson[x];
                 this.advanceSearchModelJson[x] = "";
             } else
                 this.advanceSearchModelJson[x] = null;
         });
        if (this.control.searchApionClear) {
            //this.LoadResultData();
            this.SearchApiCall();
         }

      /**   this.advanceSearchformJson.controls.forEach(ctrl => {
             debugger;
             switch (ctrl.type) {
                 default: break;
                 case 'dropdown2':
                     
                     break;
                 case 'textbox': break;

             }
         }); **/
    }

  Export() {
    debugger;
    var columns = [];
    var data = Array.isArray(this.apiResult) && this.apiResult.length > 0 ? this.apiResult[0] : null;
    if (data) {
      this.control.ResultDisplayField.forEach(item => {
        var arr: any = {}
        arr.name = item.DisplayName;
        arr.prop = item.BindingValueField && item.BindingValueField.trim() ? item.BindingValueField : item.BindingField;
        var value = data[arr.prop];
        let isValidDate = Date.parse(value);
        if (!isNaN(value)) {
          arr.type = "text";
        } else if (!isNaN(isValidDate)) {
          arr.type = "date";
        } else {
          arr.type = "text";
        }
        columns.push(arr);
      });
      this.exportToCsv.GeneratecsvReport(columns, this.apiResult, this.control.label ? this.control.label : 'Export');
    }
    // var columns = [];
    // this.control.ResultDisplayField.forEach(item => {
    //   var arr: any = {}
    //   arr.name = item.DisplayName;
    //   arr.prop = item.BindingValueField && item.BindingValueField.trim() ? item.BindingValueField : item.BindingField;
    //   var control = this._controlService.findControl(item.key, this.EditFormUI.controls.filter(x => x.filterresult != true));
    //   if (control) {
    //     if (control.type == "date") {
    //       arr.type = "date";
    //     }
    //     else {
    //       arr.type = "text";
    //     }
    //   } else {
    //     arr.type = "text";
    //   }
    //   columns.push(arr);
    // });
    // let apiparam: any = {};
    // this.control.ResultApiParam.forEach(item => {
    //   apiparam[item.key] = item.value;
    // })
    // this.busy = this._appService.get(this.control.ResultApi, apiparam, false)
    //   .subscribe(
    //     (data: any) => {
    //       this.exportToCsv.GeneratecsvReport(columns, data, "Export");
    //     },
    //     err => {
    //       console.log(err);
    //     },
    //     () => {
    //       //console.log("done")
    //     }
    //   );
  }
  _toggleEditSidebar(row: any, value?: any) {

    this.EditModelJson = row;
    // if (!this.EditFormUI) {
    //   this.loadEditForm()
    // }
  }

  _toggleEmailSidebar() {

    if (!this.control.emailfieldSource || this.control.emailfieldSource.trim() == '') {
      this._success.next("Email source field not found.");
    } else if (this.selected.length == 0) {
      this._success.next("Please selected atleast one record.");
    } else {
      var _arrEmail = [];
      this.selected.forEach(item => {
        _arrEmail.push(item[this.control.emailfieldSource]);
      })
      this.EmailModelJson[this.control.emailformfield] = _arrEmail;
      if (!this.EmailFormUI) {
        this.loadEmailForm()
      }
      this._openEdit = !this._openEdit;
      this._openEmail = true
      //this._openEmail = !this._openEmail;
    }
  }

  freezeColumns(freezecontent) {
    this.modalService.open(freezecontent, this.options);
  }

  freezeColumn(col, type) {

    if (type == 'left') {
      col.frozenLeft = !col.frozenLeft;
    }
    else if (type == 'right') {
      col.frozenRight = !col.frozenRight;
    }
    this.apiResult = [];
    var that = this;
    setTimeout(function () {
      that.LoadResultData();
    }, 1000);
  }

  manageColumns(columncontent) {
    this.modalService.open(columncontent, this.options);
  }

  toggleColumn(col) {
    const isChecked = this.isChecked(col);

    if (isChecked) {
      this.columns = this.columns.filter(c => {
        return c.name !== col.name;
      });
    } else {
      this.columns = [...this.columns, col];
    }
    columns = this.columns;
  }

  isChecked(col: any, type?: any) {
    if (type == 'left') {
      return col.frozenLeft == true;
    }
    else if (type == 'right') {
      return col.frozenRight == true;
    } else {
      return this.columns.find(c => {
        return c.name === col.name;
      });
    }
  }
  setMappingFields() {
    this.columns = [];
    this.allColumns = [];
    var arr: any = {};
    // debugger;
    this.tempFirstCol = {};
    this.control.ResultDisplayField.forEach((item, i) => {
      if (i == 0) {
        this.tempFirstCol.name = item.DisplayName;
        this.tempFirstCol.value = item.BindingField;
      }
      arr = {};
      arr.name = item.DisplayName;
      arr.prop = item.BindingField;
      arr.bindtext = item.BindingValueField;
      if (this.control.enablemultiview) {
        if (item.Show === 'advancegrid' || item.Show === 'all') {
          arr.display = true;
        } else {
          arr.display = false;
        }
      } else {
        if (item.displayColumn == false || item.displayColumn == true) {
          arr.display = item.displayColumn;
        } else {
          arr.display = true;
        }
      }

      arr.frozenLeft = false;
      arr.frozenRight = false;
      arr.fieldtype = item.fieldtype;
      arr.resizeable = true;
      arr.conditionaltext = item.conditionaltext ? item.conditionaltext : [];
      arr.cellbackgroundcolor = item.cellbackgroundcolor ? item.cellbackgroundcolor : [];
      arr.cellconditionfield = item.cellconditionfield ? item.cellconditionfield : "";
      arr.coloractiontype = item.coloractiontype;
      arr.headerclass = item.headerclass;
      if (item.fieldtype == "date")
        arr.cellTemplate = this.dateTemplate;
      if (item.fieldtype == "image")
        arr.cellTemplate = this.imageTemplate;

      var actions = this.getBindingCustomAction();
      if (actions.length > 0 && actions.find(_item => _item.columnname == item.DisplayName))
        arr.cellTemplate = this.linkTemplate;

      this.allColumns.push(arr);
    });
    this.columns = this.allColumns.filter(x => x.display == true);
    columns = this.columns;
  }

  isRecordSelected() {
    return this.selected.length > 0 ? true : false;
  }

  changeSuccessMessage(messages: any = null) {
    if (messages)
      this._success.next(messages);
    else
      this._success.next("Data saved successfully.");
  }

  getColumnList() {
    var _mappingFields = [];
    this.control.ResultDisplayField.forEach(item => {
      if (item.stopupdate != true) {
        var arr: any = {};
        arr.name = item.DisplayName;
        arr.id = item.BindingValueField && item.BindingValueField.trim() ? item.BindingValueField : item.BindingField;

        _mappingFields.push(arr);
      }
    });
    return _mappingFields;
  }
  viewtype: any = "read";
  customAction(action, row) {
    if (action.ActionType == 'sidebar') {
      this.viewtype = action.SidebarViewType;
      this._toggleEditSidebar(row);
      this._openEdit = !this._openEdit;
      this._controlService.InitializeEditForm(this.data[action.PrimaryKey], null, null, null, null, this.AuthService)
    } else {
      //this._router.navigate([action.RedirectUrl, this.data[action.PrimaryKey]], { relativeTo: this.route });
      this._router.navigate([action.RedirectUrl]);
    }
  }
  getCustomAction() {
    return this.control.CustomAction.filter(item => item.bindactionwithcolumn != true);
  }
  getBindingCustomAction() {
    if (this.control.CustomAction) {
      return this.control.CustomAction.filter(item => item.bindactionwithcolumn == true);
    }
  }
  toggleExpandRow(row) {
    // debugger;
    // console.log('Toggled Expand Row!', row);
    this.table.rowDetail.toggleExpandRow(row);
  }
  onDetailToggle(event) {
    // debugger;
    // console.log('Detail Toggled', event);
  }
  updateFilter(event) {
    if (this.tempFirstCol && this.tempFirstCol.value) {
      const value = this.tempFirstCol.value;
      const val = event.target.value.toLowerCase();

      // filter our data
      const temp = this.tempData.filter(function (d) {
        return d[value].toLowerCase().indexOf(val) !== -1 || !val;
      });

      // update the rows
      this.apiResult = temp;
      // Whenever the filter changes, always go back to the first page
      this.table.offset = 0;
    }
  }
  readonly headerHeight = 50;
  readonly rowHeight = 50;
  onScroll(offsetY: number) {
    // debugger;
    // total height of all rows in the viewport
    const viewHeight =
      this.el.nativeElement.getBoundingClientRect().height - this.headerHeight;

    // check if we scrolled to the end of the viewport
    if (
      !this.isApiCalling &&
      offsetY + viewHeight >= this.apiResult.length * this.rowHeight &&
      offsetY > 0
    ) {
      // total number of results to load
      //this.control.PageSize = this.control.PageSize;

      // check if we haven't fetched any results yet
      if (this.apiResult.length === 0) {
        // calculate the number of rows that fit within viewport
        const pageSize = Math.ceil(viewHeight / this.rowHeight);

        // change the limit to pageSize such that we fill the first page entirely
        // (otherwise, we won't be able to scroll past it)
        this.control.PageSize = Math.max(pageSize, this.control.PageSize);
      }

      if (this.control.enableadvancesearch) {
        this.SearchApiCall();
      } else {
        this.ResultApiCall();
      }
    }
  }
  validateForm() {
    debugger;
    var valid = true;
    var mandatoryCtrl = [];
    // This function deals with validation of the form fields
    this.advanceSearchformJson.controls.forEach(child => {
      if (child.haschildren) {
        child.children.forEach(_child => {
          if (_child.require) {
            mandatoryCtrl.push(_child)
          }
        })
      }
      else if (child.require) {
        mandatoryCtrl.push(child)
      }
    })
    if (mandatoryCtrl.length > 0) {
      Object.keys(this._controlService.formvalidation).forEach(
        (key) => {
          const value: any = this._controlService.formvalidation[key] ? this._controlService.formvalidation[key] : {};
          var control = mandatoryCtrl.find(x => x.key == key);
          if (control && value.status == 'fail') {
            valid = false;
            var control_id = control.isTableView ? this.data['id'] + control.key : control.id;
            if (this.form.controls[control_id]) {
              this.form.controls[control_id].markAsTouched();
            }
          }
          //arr.push({ "key": key, "value": value.status, "control": value.control });
        }
      );
    }
    return valid; // return the valid status
  }
}
