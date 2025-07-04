declare var require;
import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CardStore } from './CardStore';
import { ListSchema } from './ListSchema';
import { FormControlService } from '../form-control.service';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { DataService } from '../../core/services/data.service';
import { CardSchema } from './CardSchema';
// import { AuthService } from "../../core/authservice/auth.service";
const _ = require('lodash');
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
@Component({
  selector: 'app-kanban-ui',
  templateUrl: './kanban-ui.component.html',
  styleUrls: ['./kanban-ui.component.scss']
})
export class KanbanUiComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public AuthService: any;

  cardStore: CardStore = new CardStore();
  //lists: ListSchema[];
  lists: any = [];
  apiResult: any;
  addCardFormJson: any = null;
  addDataJson: any = {};
  busy: Subscription;
  isApiCalling:boolean = false;
  private _success = new Subject<string>();
  successMessage: string = "";
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  constructor(private _appService: DataService,
    public _controlService: FormControlService,
    private _router: Router) {
    this._controlService.componentRefreshCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
        () => {
          this.ApiCall();
        }
      );
    this._controlService.kanbanPinCalled$
      .takeUntil(this.unsubscribe)
      .subscribe(
        () => {
          if (this._controlService.dataModel.length > 0) {
            this.SavePinnedModel();
          }
        }
      );
  }
  AddModelJson() {
    this._controlService.dataModel.forEach(item => {
      if (item[this.control.statusfield]) {
        this.apiResult.push(item);
      } else {
        var _status = this.control.status.length > 0 ? this.control.status[0] : {};
        item[this.control.statusfield] = _status.value;
        this.apiResult.push(item);
      }
    });
    if (this.control.isNestedResult) {
      this.apiResult = this._controlService.formatResult(this.apiResult);
    }
    this.setMockData();
  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
    if (this.busy)
      this.busy.unsubscribe();
  }
  ngOnInit() {
    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);
    //this.formGroup.addControl(this.cardStore.addCardProp.key, new FormControl());
  }
  ngOnChanges(control: any) {
    debugger;
    if (this.control.enablecardfromformui) {
      this.loadCardUI();
    } else {
      this.ApiCall();
    }
  }
  GetAddForm(id: string) {
    if (this.addCardFormJson)
      return;
    let apiparam: any = {};
    apiparam.id = id;
    this._appService.get("api/AppData/get", apiparam, true)
      .subscribe(
        (data: any) => {
          this.addDataJson["id"] = data.Id;
          this.addCardFormJson = data
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done")
        }
      );
  }
  ApiCall() {
    debugger;
    this.cardStore = new CardStore();
    if (this.control.addformid) {
      this.GetAddForm(this.control.addformid);
    }
    const activateParams = this._controlService.getQueryParams();
    this.setMappingFields();
    if (this.control.filterresult == true) {
      this.apiResult = this.data[this.control.key] ? this.data[this.control.key] : [];
      this.setMockData();
    } else if (this.control.ResultApi) {
      this.isApiCalling = true;
      let currentUrl = this._router.url ? this._router.url : "/";
      if (currentUrl.indexOf('?') > -1) {
        currentUrl = currentUrl.split('?')[0];
      }
      var menu = this.AuthService.Menu;
      var page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
      let apiparam: any = {};
      this.control.ResultApiParam.forEach(option => {
        if (!option.ispagevarible)
          apiparam[option.key] = option.value;
        else if (page) {
          page.Params.forEach(pOption => {
            if (pOption.name.trim().toLowerCase() == option.value.trim().toLowerCase()) {
              let activeParam = activateParams.find(x => x[pOption.name]);
              if (activeParam) {
                apiparam[option.key] = activeParam[pOption.name];
              } else {
                apiparam[option.key] = pOption.value;
              }
            }
          })
        }
      })
      //apiparam.size = 500;
      if (this.control.rawquery) {
        var query = this.control.rawquery;

        this.control.ResultApiParam.forEach(option => {
          var value = option.value;
          if (page) {
            page.Params.forEach(pageoption => {
              var param = this.control.ResultApiParam.find(x => x.value == pageoption.name);
              if (param) {
                let activeParam = activateParams.find(x => x[option.name]);
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
      this._appService.get(this.control.ResultApi, apiparam, false)
        .subscribe(
          (data: any) => {
            if (this.control.setpagevariable) {
              this._controlService.setPageSearchVarible(this.data, null, this.control.pagevariables)
            }
            if (this.control.isNestedResult) {
              this.apiResult = this._controlService.formatResult(data);
            } else {
              this.apiResult = data;
            }

            this.setMockData();
            this.isApiCalling = false;
            this._controlService.ruleComponentDetectChanges();
          },
          err => {
            this.isApiCalling = false;
            console.log(err);
          },
          () => {
            //console.log("done")
          }
        );
    }
  }
  groups: any = [];
  setMockData() {
    this.lists = [];
    var count = 0;
    var lists: ListSchema[] = [];
    this.cardStore.state = this.control.statusfield;
    var groupByStatus = this._controlService.groupBy(this.apiResult, this.control.statusfield);

    this.control.status.forEach(status => {
      var arr: any = {};
      arr.state = status.value;
      arr.cards = [];
      if (Array.isArray(groupByStatus[status.value])) {
        groupByStatus[status.value].forEach((_data, j) => {
          arr.cards[count] = count;

          this.cardStore.cards[count] = _data;

          count++;
        });
      }
      lists.push(arr);
    });
    //});
    this.cardStore.lastid = Object.keys(this.cardStore.cards).length > 0 ? --Object.keys(this.cardStore.cards).length : -1;
    this.lists = lists;
    //});

    this.cardStore.groups = this.groups;
    this.cardStore.lists = this.lists;
  }
  getStatuskey(value: any) {
    return this.control.status.find(x => x.value == value).key
  }
  setMappingFields() {
    this.cardStore.control = this.control;
    var arr: any = {};
    this.control.ResultDisplayField.forEach(item => {
      if (item.fieldtype == 'title') {
        arr = {};
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        arr.fieldtype = item.fieldtype;
        arr.redirecturl = item.redirecturl;
        arr.redirectparam = item.redirectparam;
        arr.webnametype = item.webnametype;
        arr.webicon = item.WebIcon;
        this.cardStore.title = arr;
      } else if (item.fieldtype == 'description') {
        arr = {};
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        arr.fieldtype = item.fieldtype;
        arr.redirecturl = item.redirecturl;
        arr.redirectparam = item.redirectparam;
        arr.webnametype = item.webnametype;
        arr.webicon = item.WebIcon;
        this.cardStore.description = arr;
      } else if (item.fieldtype == 'image') {
        arr = {};
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        arr.fieldtype = item.fieldtype;
        arr.redirecturl = item.redirecturl;
        arr.redirectparam = item.redirectparam;
        arr.webnametype = item.webnametype;
        arr.webicon = item.WebIcon;
        this.cardStore.image = arr;
      }
      else if (item.fieldtype == 'html') {
        arr = {};
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        this.cardStore.html = arr;
      } else {
        arr = {};
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        arr.fieldtype = item.fieldtype;
        arr.redirecturl = item.redirecturl;
        arr.redirectparam = item.redirectparam;
        arr.webnametype = item.webnametype;
        arr.webicon = item.WebIcon;
        this.cardStore.mappingFields.push(arr);
      }
    });
  }

  getgroupCard(group) {
    var card: CardSchema = {
      id: group,
      description: group,
      assignedResource: "none",
      state: "none"
    };
    return card;
  }
  currentState: string = "";
  toggleDisplayAddCard(state) {

    this.cardStore._opened = true;
  }
  AddCard() {
  }

  allowDrop($event) {
    $event.preventDefault();
  }
  dragEnter(event) {
    event.target.style.border = "2px dashed #ff0000";
    return false;
  }

  dragLeave(event) {
    event.target.style.border = "none";
    return false;
  }
  dropOverActive: boolean = false;
  droppedData: any;
  onDrop(event, currentState) {
    this.dropOverActive = false;
    //event.target.style.border = "none";
    //event.preventDefault();
    //const id = event.dataTransfer.getData('id');
    //const state = event.dataTransfer.getData('state');
    this.droppedData = JSON.parse(event.dropData)

    if (currentState != this.droppedData.state) {
      //this.lists.find(x = x.state == currentState).cards.push(id);
      this.lists.forEach(list => {
        if (list.state == currentState) {
          list.cards.push(this.droppedData.id);
        }
      });

      var card = this.cardStore.deleteCard(this.droppedData.id, this.droppedData.state, null, true, currentState);
      if (card)
        this.UpdateApiCall(card);
    }

    return false;
  }
  UpdateApiCall(card) {
    let url = this.control.updateapi;
    let apiparam: any = {};

    this.control.updateapiparam.forEach(option => {
      apiparam[option.key] = option.value;
    })

    this._appService.post(url, JSON.stringify(card), apiparam)
      .subscribe((res: any) => {

      },
        err => {
          console.log(err);
        },
        () => {
          //this.msg = "Post shared successfully";
          //console.log("done!")
        }
      );
  }
  SavePinnedModel() {
    // debugger;
    var _pinnedData = this._controlService.deepcopy(this._controlService.dataModel);
    this._controlService.dataModel = []
    let url = this.control.updateapi;
    let currentUrl = this._router.url ? this._router.url : "/";
    if (currentUrl.indexOf('?') > -1) {
      currentUrl = currentUrl.split('?')[0];
    }
    var menu = this.AuthService.Menu;
    var page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
    const activateParams = this._controlService.getQueryParams();
    _pinnedData.forEach((_dataModel, index) => {
      var ModelJson = null;
      let apiparam: any = {};
      if (!this.control.enablerowquery) {
        ModelJson = _dataModel;
        this.control.updateapiparam.forEach(option => {
          if (!option.ispagevarible)
            apiparam[option.key] = option.value;
          else if (page) {
            page.Params.forEach(pOption => {
              if (pOption.name.trim().toLowerCase() == option.value.trim().toLowerCase()) {
                // apiparam[option.key] = pOption.value;
                let activeParam = activateParams.find(x => x[pOption.name]);
                if (activeParam) {
                  apiparam[option.key] = activeParam[pOption.name];
                } else {
                  apiparam[option.key] = pOption.value;
                }
              }
            })
          }
        })
      }
      else {
        var rowQuery = this.control.rowquery;
        this.control.updateapiparam.forEach(option => {
          if (!option.ispagevarible)
            rowQuery = rowQuery.replace("{{" + option.key + "}}", _dataModel[option.value] ? _dataModel[option.value] : null);
          else if (page) {
            page.Params.forEach(pOption => {
              if (pOption.name.trim().toLowerCase() == option.value.trim().toLowerCase()) {
                let activeParam = activateParams.find(x => x[pOption.name]);
                if (activeParam) {
                  rowQuery = rowQuery.replace("{{" + option.key + "}}", activeParam[pOption.name] ? activeParam[pOption.name] : null);
                } else {
                  rowQuery = rowQuery.replace("{{" + option.key + "}}", pOption.value ? pOption.value : null);
                }
              }
            })
          }
        })

        ModelJson = JSON.parse(rowQuery);

        if (!ModelJson[this.control.status]) {
          var _status = this.control.status.length > 0 ? this.control.status[0] : {};
          ModelJson[this.control.statusfield] = _status.value;
        }
      }
      this.busy = this._appService.post(url, JSON.stringify(ModelJson), apiparam)
        .subscribe((res: any) => {
          //this._controlService.dataModel.push(_dataModel);
          if (index == _pinnedData.length - 1) {
            this.ApiCall();
            this.changeSuccessMessage(this.control.updatesuccessmsg);
          }
        },
          err => {
            console.log(err);
            _.remove(this._controlService.dataModel, function (child) {
              return JSON.stringify(child) == JSON.stringify(_dataModel);
            });
          },
          () => {
            //console.log("done!")
          }
        );
    })
  }
  changeSuccessMessage(messages: any = null) {
    if (messages)
      this._success.next(messages);
    else
      this._success.next("Save successfully");
  }
  trackByFn(index, col) {
    return index;
  }
  FormCardUI: any = null;
  CardformGroup: FormGroup;
  loadCardUI() {
    this.FormCardUI = null;
    this.CardformGroup = null;
    let apiparam: any = {};
    apiparam.id = this.control.cardformid;
    this._appService.get("api/AppData/get", apiparam)
      .subscribe(
        (data: any) => {
          this.CardformGroup = this._controlService.toControlGroup(data.controls);
          this.FormCardUI = this._controlService.deepcopy(data);
          this.ApiCall();
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
