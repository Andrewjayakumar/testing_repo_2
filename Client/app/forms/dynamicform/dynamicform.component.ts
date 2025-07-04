import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FormControlService } from '../form-control.service';
import { DataService } from '../../core/services/data.service';
import { CustomValidators } from 'ng2-validation';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { ExportToCsv } from '../../forms/export-to-csv';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { Router } from '@angular/router';
import 'rxjs/add/operator/takeUntil';
@Component({
  selector: 'app-dynamicform',
  templateUrl: './dynamicform.component.html',
  styleUrls: ['./dynamicform.component.scss'],
  providers: [ExportToCsv]
})
export class DynamicformComponent implements OnInit, OnDestroy {

  @Input() public controls: any = [];
  @Input() public datamodel: any = {};
  @Input() public access: string = 'write';
  @Input() public filterdata: any = [];
  @Input() public FormUI: any = null;
  @Input() public formdata: any = null;
  @Input() public AuthService;
  // Note: don't keep name of output events as same as native events such as submit etc.
  @Output() formsubmit = new EventEmitter<any>();
  @Output() export = new EventEmitter<{ file: string, option: any }>();

  successMessage: string = "";
  private _success = new Subject<string>();
  SidebarControls: any = [];
  SidebarData: any = {};
  FilterResult: any;
  public form: FormGroup;
  public formFilter: FormGroup;
  filterApplied: number = 0;
  _step: number = 1;
  _totalSteps: number = 2;
  _stepid: string = "";
  _stepName: string = "";
  busy: Subscription;
  filterbar: boolean = true;
  _opened: boolean = false;
  _openedExport: boolean = false;
  FilterView: any = [];

  SidebarEditModel: any
  isControlinGrid: boolean = false;

  CustomFilterFormUI: any
  CustomFilterFormModel: any
  CustomFilterFormGroup: FormGroup
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  private options: NgbModalOptions = { size: 'lg', windowClass: 'model-cw' };
  constructor(public _controlService: FormControlService, private _appService: DataService, private exportToCsv: ExportToCsv,
    private modalService: NgbModal, private _router: Router) {
    this._controlService.dynamicFormFilterRefreshCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
        (data: any) => {
          debugger;
          if (data && data.isSearchClicked == 'norefresh' && (data.formId === this.FormUI.Id || !data.formId)) {
            this.Search();
            if (data && data.successmessage && data.successmessage.text) {
              this.changeSuccessMessage(data.successmessage)
            }
          } else if (data.formId === this.FormUI.Id || !data.formId) {
            this.Search(data ? data.isSearchClicked : true);
            if (data && data.successmessage && data.successmessage.text) {
              this.changeSuccessMessage(data.successmessage)
            }
          }
        }
      );
  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
    if (this.busy)
      this.busy.unsubscribe();
  }
  SaveBtnControlforEditMode: any = [];
  public ngOnInit() {
    this._success.takeUntil(this.unsubscribe).subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).takeUntil(this.unsubscribe).subscribe(() => this.successMessage = null);
    // this._controlService.resetPageSearchVarible();
    this._controlService.formvalidation = {};
    this._controlService.formvalid = false;
    this._controlService.formData = {};
    this._controlService.formParams = {};
    this._controlService.formInput = {};
    debugger;
    // this._controlService.filterEditformJson = null;
    if (this._controlService._opened) {
      this._controlService._toggleSidebar();
    }

    if (this._controlService._openedEditForm) {
      this._controlService._toggleEditFormSidebar();
    }

    if (this.FormUI && this.controls && this.FormUI.saveBtnKeyForEditMode) {
      this.controls.forEach(control => {
        if (control.filterresult != true)
          this.findFormControl(control, this.FormUI.saveBtnKeyForEditMode);
      })
    }
    if (this.FormUI && this.access == 'filter' && this.FormUI.FilterUIJson) {
      this.FilterView = this.getFilterView();
      this.formFilter = this._controlService.toControlGroup(this.FormUI.FilterUIJson.controls);

      // if (this.FormUI.FilterUIJson.CustomFilter) {
      //   this.LoadCustomFilterForm(this.FormUI.FilterUIJson.customfilterapimappingform);
      // } else {
      //   this.Search(true);
      // }
      this.Search(true);
      this._controlService.filterEditformId = this.FormUI.FilterUIJson.filterAddform;


      var controls = this.controls.filter(control => control.filterresult == true)
      this.form = this._controlService.toControlGroup(controls);
      this._controlService.GenerateDataJson(controls, this.datamodel, this.form, null, this.FormUI ? this.FormUI.Id : null);
    }
    else if (this.controls) {
      this.form = this._controlService.toControlGroup(this.controls);
      this._controlService.GenerateDataJson(this.controls, this.datamodel, this.form, null, this.FormUI ? this.FormUI.Id : null);
    }
  }
  findFormControl(control, key) {
    if (control.haschildren == true && this.SaveBtnControlforEditMode.length == 0 && control.type != 'grid') {
      let ctr = control.children.filter(x => x.key == key);
      if (ctr.length > 0) {
        this.SaveBtnControlforEditMode = ctr;
        return;
      }
      for (let child of control.children) {
        if (control.haschildren == true)
          this.findFormControl(child, key);
      }
    } else if (this.SaveBtnControlforEditMode.length == 0 && control.type == 'grid') {
      this.isControlinGrid = false;
      this.isControlExistinGrid(control, key);
      if (this.isControlinGrid) {
        this.SaveBtnControlforEditMode[0] = control;
        return;
      }
    }
    else if (this.SaveBtnControlforEditMode.length == 0) {
      if (key == control.key) {
        this.SaveBtnControlforEditMode[0] = control;
      }
    }
  }
  public onSubmit() {

    this._appService.post("", this.datamodel);//.subscribe((data: any) => {
    //   this.dataoptions = data
    // });
    // this.formsubmit.emit(this.form.value);
  }

  _onOpenStart() {
    this.SidebarEditModel = null;
    if (this.FormUI && this.FormUI.saveBtnKeyForEditMode) {
      this.controls.forEach(control => {
        if (control.filterresult != true)
          this.findFormControl(control, this.FormUI.saveBtnKeyForEditMode);
      })
    }
    if (this._controlService.formData.id) {
      this.controls.forEach(control => {
        if (control.filterresult != true)
          this.findSidebarControl(control, this._controlService.formData.id);
      })
      this.SidebarEditModel = this._controlService.filterEditformJson.ModelJson
    }
    else {
      this.SidebarControls = [];
    }
  }

  _onClosed() {
    this.SidebarControls = [];
  }

  private findSidebarControl(control: any, id) {
    if (control.haschildren == true && this.SidebarControls.length == 0 && control.type != 'grid') {
      let ctr = control.children.filter(x => x.id == id);
      if (ctr.length > 0) {
        this.SidebarControls = ctr;
        this.form.addControl(id + (ctr[0].isTableView ? ctr[0].key : ''), new FormControl());
        return;
      }
      for (let child of control.children) {
        if (control.haschildren == true)
          this.findSidebarControl(child, id);
      }
    } else if (this.SidebarControls.length == 0 && control.type == 'grid') {
      this.isControlinGrid = false;
      this.isControlExistinGrid(control, id);
      if (this.isControlinGrid) {
        this.SidebarControls[0] = control;
        this.form.addControl(id, new FormControl());
        return;
      }
    }
    else if (this.SidebarControls.length == 0) {
      if (control.id && id == control.id) {
        this.SidebarControls[0] = control;
        this.form.addControl(id + (control.isTableView ? control.key : ''), new FormControl());
      }
    }
  }

  private isControlExistinGrid(control, id) {
    if (this.isControlinGrid)
      return;
    if (control.haschildren == true) {
      let ctr = control.children.filter(x => x.id == id);
      if (ctr.length > 0) {
        this.isControlinGrid = true;
      }
      for (let child of control.children) {
        if (control.haschildren == true)
          this.isControlExistinGrid(child, id);
      }
    }
  }

  isTableView() {
    if (this.SidebarControls.length > 0)
      return this.SidebarControls[0].isTableView;
    else
      return false;
  }

  setSidebarData() {
    this.SidebarData = "";
  }
  loading: boolean = false;
  Search(isSearchClicked = false) {
    this.loading = true;
    debugger;
    if (this.FormUI) {
      let url = this.FormUI.FilterUIJson.FilterApiEndpoint;
      if (!url) {
        return;
      }
      var filterResultCtr = this.FormUI.controls.filter(x => x.filterresult == true);
      if (isSearchClicked == false)
        this._opened = false;

      this.filterApplied = this.FilterCount();
      if (this.FormUI.FilterUIJson.filtertype == 'Custom') {
        if (this._opened)
          this._opened = !this._opened;

        this.formsubmit.emit();
      } else if (filterResultCtr.length > 0 && filterResultCtr.find(x => x.type == 'kanban' || x.type == 'calender' || x.type == 'map') && filterResultCtr[0].cardtype == "Dynamic") {
        if (this._opened)
          this._opened = !this._opened;

        this.formsubmit.emit();
      }
      else if (this.FormUI.FilterUIJson.FilterApiEndpoint) {
        let apiparam: any = {};
        this.FormUI.FilterUIJson.FilterEndpointParams.forEach(option => {
          if (option.key == "query")
            apiparam[option.key] = JSON.stringify(this.filterdata);
          else
            apiparam[option.key] = option.value;
        })
        // if (this.FormUI.FilterUIJson.CustomFilter) {
        //   this.FormUI.FilterUIJson.customfilterapimapping.forEach(item => {
        //     apiparam[item.ApiParam] = this.CustomFilterFormUI.ModelJson[item.customfilterfield];
        //   })
        // }
        //let url = this.FormUI.FilterApiEndpoint;
        //this._appService.get(url, apiparam).subscribe((data: any) => {
        //    this.FilterResult = data;
        //});
        //let url = this.FormUI.FilterUIJson.FilterApiEndpoint;
        if (this.FormUI.FilterUIJson.FilterRawQuery) {
          let currentUrl = this._router.url ? this._router.url : "/";
          if (currentUrl.indexOf('?') > -1) {
            currentUrl = currentUrl.split('?')[0];
          }
          let menu = this.AuthService.Menu;
          let page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
          const activateParams = this._controlService.getQueryParams();
          if (page) {
            page.Params.forEach(option => {
              var param = this.FormUI.FilterUIJson.FilterEndpointParams.find(x => x.value == option.name);
              if (param) {
                let activeParam = activateParams.find(x => x[option.name]);
                if (activeParam) {
                  apiparam[param.key] = activeParam[option.name];
                } else {
                  apiparam[param.key] = option.value;
                }
              }
            })
          }
          var query = this.FormUI.FilterUIJson.FilterRawQuery;

          this.FormUI.FilterUIJson.FilterEndpointParams.forEach(option => {
            var value = option.value;
            if (page) {
              page.Params.forEach(pageoption => {
                var param = this.FormUI.FilterUIJson.FilterEndpointParams.find(x => x.value == pageoption.name);
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
            var param = "{{" + option.key + "}}";
            query = query.replace(param, value)
            // query.replace(param, value)

          })
          apiparam.query = query;
        }
        this.busy = this._appService.get(url, apiparam, false).subscribe((data: any) => {
          filterResultCtr.forEach(item => {
            this.datamodel[item.key] = data;
            if (this.datamodel[item.key + '_filterParam']) {
              this.datamodel[item.key + '_filterParam'] = null;
            }
          })
          this._controlService.RefreshComponent();
          this.loading = false;
        });
      }
    }
  }

  customSearch() {
    debugger;
    this.loading = true;
    var apiparam: any = {};
    var customFilterUI = this.CustomFilterFormUI.FilterUIJson;
    if (this.FormUI && customFilterUI && customFilterUI.FilterApiEndpoint) {
      this._opened = !this._opened;
        var filterResultCtr = this.FormUI.controls.filter(x => x.filterresult == true);

        // The below check is fix for Chart refresh issue. EMpty the model to dleete the card grid from DOM
        //consequent code, populates the card grid by calling appservice method for REQs
        if (filterResultCtr && filterResultCtr.length > 0) {
            filterResultCtr.forEach(item => {
                this.datamodel[item.key] = [];
            })
            this._controlService.RefreshComponent();
        }


      this.filterApplied = this.custonFilterCount();

      if (customFilterUI.apimethod == 'post') {
        var _searchModel: any = {}
        customFilterUI.FilterEndpointParams.forEach(option => {
          apiparam[option.key] = option.value;
          _searchModel[option.key] = option.value;
        })
        this.FormUI.FilterUIJson.customfilterapimapping.forEach(item => {
          _searchModel[item.ApiParam] = this.CustomFilterFormModel[item.customfilterfield] == "undefined" ? "" : this.CustomFilterFormModel[item.customfilterfield];
        })

        let url = customFilterUI.FilterApiEndpoint;
        if (this.FormUI.FilterUIJson.FilterRawQuery) {

          let currentUrl = this._router.url ? this._router.url : "/";
          if (currentUrl.indexOf('?') > -1) {
            currentUrl = currentUrl.split('?')[0];
          }
          let menu = this.AuthService.Menu;
          let page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
          var query = this.FormUI.FilterUIJson.FilterRawQuery;

          this.FormUI.FilterUIJson.FilterEndpointParams.forEach(option => {
            var value = option.value;
            if (page) {
              const activateParams = this._controlService.getQueryParams();
              page.Params.forEach(pageoption => {
                var param = this.FormUI.FilterUIJson.FilterEndpointParams.find(x => x.value == pageoption.name);
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
            var param = "{{" + option.key + "}}";
            query = query.replace(param, value)
            // query.replace(param, value)

          })
          apiparam.query = query;
        } else {
          this._controlService.setPageVarible(customFilterUI.FilterEndpointParams, _searchModel, this.AuthService);
          this._controlService.setPageVarible(customFilterUI.FilterEndpointParams, apiparam, this.AuthService);
        }
        this.busy = this._appService.post(url, JSON.stringify(_searchModel), apiparam)
          .debounceTime(400)
          .distinctUntilChanged()
          .subscribe((data: any) => {
            filterResultCtr.forEach(item => {
              this.datamodel[item.key] = data;
              this.datamodel[item.key + '_filterParam'] = { "apiurl": url, "params": apiparam };
            })
            this._controlService.RefreshComponent();
            this.loading = false;
          });
      } else {

        customFilterUI.FilterEndpointParams.forEach(option => {
          apiparam[option.key] = option.value;
        })
        this.FormUI.FilterUIJson.customfilterapimapping.forEach(item => {
          apiparam[item.ApiParam] = this.CustomFilterFormModel[item.customfilterfield] == "undefined" ? "" : this.CustomFilterFormModel[item.customfilterfield];
        })

        let url = customFilterUI.FilterApiEndpoint;
        if (this.FormUI.FilterUIJson.FilterRawQuery) {

          let currentUrl = this._router.url ? this._router.url : "/";
          if (currentUrl.indexOf('?') > -1) {
            currentUrl = currentUrl.split('?')[0];
          }
          let menu = this.AuthService.Menu;
          let page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
          var query = this.FormUI.FilterUIJson.FilterRawQuery;

          this.FormUI.FilterUIJson.FilterEndpointParams.forEach(option => {
            var value = option.value;
            if (page) {
              const activateParams = this._controlService.getQueryParams();
              page.Params.forEach(pageoption => {
                var param = this.FormUI.FilterUIJson.FilterEndpointParams.find(x => x.value == pageoption.name);
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
            var param = "{{" + option.key + "}}";
            query = query.replace(param, value)
            // query.replace(param, value)

          })
          apiparam.query = query;
        }
        this.busy = this._appService.get(url, apiparam, false)
          .debounceTime(400)
          .distinctUntilChanged()
          .subscribe((data: any) => {
            filterResultCtr.forEach(item => {
              this.datamodel[item.key] = data;
              this.datamodel[item.key + '_filterParam'] = { "apiurl": url, "params": apiparam };
            })
            this._controlService.RefreshComponent();
            this.loading = false;
          });

      }
    }
  }
  Redirect(id: string, Name: string) {
    this._stepid = id;
    this._stepName = Name;
    this._step = this._totalSteps > this._step ? (this._step + 1) : (this._step - 1);
    //alert(this._step + " " + this._stepid);
  }
  _step1(filter) {
    return this._step == 1 && filter.type == 'list';
  }
  _step2(filter) {
    return this._step == 2 && filter.id == this._stepid;
  }
  activePanelIndex: any = [];
  panelChange(i, tab) {
    if (this.activePanelIndex[i] == null)
      this.activePanelIndex[i] = tab;
    else
      this.activePanelIndex[i] = null;
  }
  custonFilterCount() {
    var count = 0;
    for (let item in this.CustomFilterFormModel) {
      if (Array.isArray(this.CustomFilterFormModel[item]) && this.CustomFilterFormModel[item].length > 0) {
        count = count + 1;
      } else if (this.CustomFilterFormModel[item]) {
        count = count + 1;
      }
    }
    return count;
  }
  FilterCount() {

    var count = 0;
    this.filterdata.forEach(item => {
      if (item.type == 'daterange' && (item.value.from != '' || item.value.to != '')) {
        count = count + 1;
      } else if (item.type == 'range' && (item.value.from != '' || item.value.to != '')) {
        count = count + 1;
      } else if (item.type == 'terms' && item.value.length > 0) {
        count = count + 1;
      } else if (item.type == 'term' && item.value != '')
        count = count + 1;
      else if (item.type == 'number' && (item.value.from != '' || item.value.to != ''))
        count = count + 1;
    })

    return count;
  }
  clearFilter() {
    // debugger;
    if (this.FormUI.FilterUIJson && this.FormUI.FilterUIJson.CustomFilter) {
      this.CustomFilterFormModel = this._controlService.deepcopy(this.CustomFilterFormUI.ModelJson);
    }
    else {
      this.filterdata.forEach(item => {
        if (item.type == 'daterange') {
          item.value.from = "";
          item.value.to = "";
        } else if (item.type == 'range') {
          item.value.from = "";
          item.value.to = "";
        } else if (item.type == 'number') {
          item.value.from = "";
          item.value.to = "";
        } else if (item.type == 'terms') {
          item.value = [];
          this.datamodel[item.id] = [];
        }
        else if (item.type != 'search') {
          item.value = "";
          this.datamodel[item.id] = "";
        }
      })
    }
    this._controlService.ResetComponent();

    if (this.FormUI && this.FormUI.FilterUIJson && this.FormUI.FilterUIJson.CustomFilter)
      this.Search();
    else {
      this.Search();
    }
  }
  AddFormGroup: FormGroup;
  AddFormJsonUI: any
  InitializeAddForm() {
    this._controlService.formvalidation = {};
    this._controlService.formvalid = false;
    let apiparam: any = {};
    apiparam.id = this.FormUI.FilterUIJson.filterAddform;
    this._appService.get("api/AppData/get", apiparam)
      .takeUntil(this.unsubscribe)
      .subscribe(
        (data: any) => {
          this.AddFormGroup = this._controlService.toControlGroup(data.controls);
          this.AddFormJsonUI = this._controlService.deepcopy(data);
          if (this.AddFormJsonUI.ModelJson["id"] == "")
            delete this.AddFormJsonUI.ModelJson["id"];

          this._controlService.GenerateDataJson(this.AddFormJsonUI.controls, this.AddFormJsonUI.ModelJson, this.AddFormGroup, true, this.AddFormJsonUI ? this.AddFormJsonUI.id : "");
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done")
        }
      );
    //}
  }
  exportToCSV() {

    var options = {
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      showLabels: true,
      showTitle: true,
      useBom: true
    };


    //var filename = this.FormUI.Formname + "_" + this._controlService.ConvertToDate(new Date).replace('/', '') + "_" + this._controlService.ConvertToTime(new Date);

    if (this.FormUI) {
      var filterResultCtr = this.FormUI.controls.filter(x => x.filterresult == true);

      if (this.FormUI.FilterUIJson.filtertype == 'Custom') {
        this.export.emit({ file: "", option: options });
      } else if (filterResultCtr.length > 0 && filterResultCtr.find(x => x.type == 'kanban' || x.type == 'calender') && filterResultCtr[0].cardtype == "Dynamic") {
        this.export.emit({ file: "", option: options });
      }
      else if (this.FormUI.FilterUIJson.FilterApiEndpoint) {
        var filterResultCtr = this.FormUI.controls.filter(x => x.filterresult == true);
        var data = null;
        filterResultCtr.forEach(control => {
          if (this.datamodel[control.key]) {
            data = this.datamodel[control.key];
            if (this.FormUI.FilterUIJson.ExportColumns)
              this.exportToCsv.GeneratecsvReport(this.FormUI.FilterUIJson.ExportColumns, data, this.FormUI.ModelName);
            //this.exportToCsv.GenerateReport(this.FormUI.controls, this.FormUI.FilterUIJson.ExportColumns, data, this.FormUI.Formname);

            return;
          }
        })
      }
    }
  }
  getImportTitle() {
    if (this.FormUI && this.FormUI.controls) {
      var control = this.FormUI.controls.find(ctrl => ctrl.filterresult == true && ctrl.type == 'import');
      if (control)
        return control.placeholder;
      else
        return '';
    } else
      return '';
  }
  getFilterView() {
    var controls = this._controlService.deepcopy(this.FormUI.controls);
    return controls.sort(function (a, b) {
      var x = a.type.toLowerCase();
      var y = b.type.toLowerCase();
      if (x > y) { return -1; }
      if (x < y) { return 1; }
      return 0;
    });
  }
  _onAddSidebarClosed() {
    this.AddFormJsonUI = null;
    if (this.AddFormGroup) {
      this.AddFormGroup.reset();
    }
    this.AddFormGroup = null;
  }
  _onAddSidebarStart() {

  }

  _onEditSidebarClosed() {
    // this._controlService.resetPageSearchVarible();
    this._controlService.filterEditformJson = null;
    if (this._controlService.formFilter) {
      this._controlService.formFilter.reset();
    }
    this._controlService.formFilter = null;
  }
  _onEditSidebarStart() {
    debugger;
  }
  clickFilter() {
    this.filterbar = true;
    this._opened = !this._opened;
    if (this.FormUI.FilterUIJson && this.FormUI.FilterUIJson.CustomFilter && !this.CustomFilterFormUI) {
      this.LoadCustomFilterForm()
    }
  }
  LoadCustomFilterForm() {
    this.CustomFilterFormUI = null;
    this.CustomFilterFormModel = null;
    const formid = this.FormUI.FilterUIJson.customfilterapimappingform;
    if (formid) {
      let apiparam: any = {};
      apiparam.id = formid;
      this._appService.get("api/AppData/get", apiparam)
        .takeUntil(this.unsubscribe)
        .subscribe(
          (data: any) => {
            this.CustomFilterFormGroup = this._controlService.toControlGroup(data.controls);
            this.CustomFilterFormUI = this._controlService.deepcopy(data);
            this._controlService.GenerateDataJson(this.CustomFilterFormUI.controls, this.CustomFilterFormUI.ModelJson,
              this.CustomFilterFormGroup);

            this.CustomFilterFormModel = this._controlService.deepcopy(this.CustomFilterFormUI.ModelJson);
            //this.customSearch(this.CustomFilterFormUI.FilterUIJson);
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
  closeConfirm: string = ""
  closeAddSidebar(content) {
    if (this.filterbar == false) {
      this.modalService.open(content, { size: 'sm' }).result.then((result) => {
        if (this.closeConfirm == "YES") {
          this._opened = !this._opened;
          this.AddFormJsonUI = null;
        }
        else {
          this.closeConfirm = "NO";
        }
      });
    }
    else {
      // this.CustomFilterFormUI = null;
      // this.CustomFilterFormModel = null;
      this._opened = !this._opened;
    }
  }
  public changeSuccessMessage(messages: any) {
    if (messages)
      this._success.next(messages);
  }
  ImportStatusFrom: any;
  public _openedImportHistory: boolean = false;
  GetImportStatusForm() {
    debugger;
    this.ImportStatusFrom = null
    let apiparam = {};
    apiparam['id'] = "d9665cb6-83fa-4ef9-9ea8-718aa8eb2f7e";
    this._appService.get("api/AppData/get", apiparam)
      .subscribe(
        (data: any) => {
          this.FormUI.controls.forEach(co => {
            if (co.type == "import") {
              var api = co.historyapiurl;
              var param = co.historyapiparam;
              var rawquery = co.historyrawquery;
              data.controls.forEach(imp => {
                if (imp.key == "import") {
                  imp.ResultApi = api;
                  imp.ResultApiParam = param;
                  imp.rawquery = rawquery;
                }
              });
              this.ImportStatusFrom = data;
            }
          })

          this._openedImportHistory = true;
        },
        err => {
          console.log(err);

        },
        () => {
          console.log("done")
        }
      );
  }
}
