import { Component, OnInit, Input } from '@angular/core';
import { TREE_ACTIONS, KEYS, IActionMapping } from 'angular-tree-component';
const _ = require('lodash');
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { FormControlService } from './../form-control.service';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { CustomValidators } from 'ng2-validation';
import { UUID } from 'angular2-uuid';
import { controlslist, FormApiParams, controls } from './../form-controls-list-new';
// import ControlPropertyList from './../Property';
import { DataService } from '../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Location } from '@angular/common';

const actionMappingdrag: IActionMapping = {
  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
    },
    dragStart: (tree, node, $event) => {
      if (node.hasChildren) {
        TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
      }
    },
    click: (tree, node, $event) => {

      $event.shiftKey ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event) : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
    }
  },
  keys: {
    [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
  }
};

@Component({
  selector: 'app-formeditor',
  templateUrl: './formeditor.component.html',
  styleUrls: ['./formeditor.component.scss']
})
export class FormeditorComponent implements OnInit {
  @Input() public AuthService;
  public Isaddchildren: boolean = false;
  private _openedProperty: boolean = false;
  public actionMapping: IActionMapping = {
    mouse: {
      contextMenu: (tree, node, $event) => {
        $event.preventDefault();
      },
      dblClick: (tree, node, $event) => {

        this.Clearcontrol();
        if (node.data.haschildren) {
          this.Isaddchildren = true;
          this.OpenChildControlmenu(node, tree, $event);
          this._togglePropertySidebar();
          tree.update();
        }
        if (node.hasChildren) {
          TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        }
      },
      click: (tree, node, $event) => {

        this._togglePropertySidebar();
        if (this.selectedcontrol == node.data || !this.selectedcontrol) {
          this.Clearcontrol();
          if (node.data.haschildren) {
            this.Isaddchildren = true;
            this.selectedcontrol = node.data;
            if (node.data.type == 'tab' || node.data.type == 'formwizard') {
              this.ShowProperties(node, tree, $event);
            }
            //_othis.AddSinglecontrol(node, tree);
            // _othis.OpenChildControlmenu(node, tree, $event);

          } else {
            this.ShowProperties(node, tree, $event);
          }
        } else {
          this.Clearcontrol();
        }
        // alert("call");
        //
        $event.shiftKey ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event) : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
      }
    },
    keys: {
      [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
    }
  };
  private Notificationformjson: any = {};
  /* form API params control */
  // private CreateEndpointCtr: any = FormApiParams[0];
  // private UpdateEndpointCtr: any = FormApiParams[1];
  private GetEndpointCtr: any = {}; //= FormApiParams.getaapi;
  // private DeleteEndpointCtr: any = FormApiParams[3];
  // private ListEndpointCtr: any = FormApiParams[4];
  private filtertypeCtr: any = FormApiParams.filtertype;
  private FilterEndpointCtr: any = {};// FormApiParams.filterapi;
  private FilterEndpointParamsCtr: any = {};//FormApiParams[6];
  private ExportColumnsCtr: any = {};// FormApiParams[7];
  private CustomFilterCtr: any = {};// FormApiParams[8];
  private exportcolumnscustomfiltersCtr: any = {};// FormApiParams.exportcolumnscustomfilters;
  public factorymodel: any = { "setting": { "subscriptionId": "0db4af49-c21e-4455-82fd-835bb47a12c4", "tenantid": "9224d6b1-b2af-49d5-b1b2-0127b39e30c8", "region": "East US", "resourceGroup": "Default-Storage-EastUS", "applicationId": "17366dcc-9c67-4a7c-b79b-418020c61dd7", "authenticationKey": "Kg3sN3gAQ1zDMuByKKP7/O4TpposzFwTOhBu9UHcuN8=", "factory": "", "selectfactory": "Existing" }, "source": { "linkedServiceName": "", "type": "", "AccountName": "", "AccountKey": "", "name": "", "folderPath": "", "fileName": "", "collectionName": "", "typeProperties": "", "dataset": "", "selectlinkedservice": "New", "selectdataset": "New" }, "destination": { "linkedServiceName": "", "type": "", "AccountName": "", "AccountKey": "", "name": "", "folderPath": "", "fileName": "", "collectionName": "", "typeProperties": "", "dataset": "", "selectlinkedservice": "New", "selectdataset": "New" }, "Pipeline": { "name": "", "trigger": "", "frequency": "", "interval": null, "startTime": "undefined--", "endTime": "undefined--", "source": {}, "destination": {}, "mapping": [] } };
  public Notificationdatajson: any = {};

  /** Data Facory*/
  public Azuresetting: any = {};//FormApiParams.azuresetting;
  public SourceDataset: any = {};//FormApiParams.sourcedataset;
  public DestinationDataset: any = {};// FormApiParams.destinationdataset;
  // public Pipeline: any;
  public PipelineConfiguration: any = {};//FormApiParams.configuration;

  /** */

  /* private properties */
  private options: NgbModalOptions = { size: 'lg', windowClass: 'model-cw' };
  private selectedcontrol: any = {};
  private form: FormGroup;
  private formAttribute: FormGroup;
  // private ControlPropertyList: any[];
  private selectednode: any[];
  private DataJson: any = {};
  private formid: string;

  filterChangeconfirm: string = "";
  modelfiltertype: string = ""
  formUItype: string = "form";
  controlForm: any;
  /* public properties */
  public FilterUIJson: any =
    {
      filtertype: "None",
      filterAddform: "",
      ShowAddform: true,
      addBtnText: "Add New",
      addBtnClass: "ml-2 btn-outline-primary btn-round",
      addBtnIcon: "fa fa-plus",
      ShowExport: false,
      CustomFilter: false,
      customfilterapimappingform: "",
      customfilterapimapping: [],
      exportBtnText: "Export",
      exportBtnClass: "ml-2 btn-outline-primary btn-round",
      exportBtnIcon: "fa fa-file-excel-o",
      searchBtnClass: "btn-outline-secondary",
      searchBtnIcon: "fa fa-search",
      applyFilterBtnClass: "btn-outline-primary",
      applyFilterBtnIcon: "none",
      applyFilterBtnText: "Apply",
      filterBtnClass: "ml-2 btn-outline-secondary",
      filterBtnIcon: "fa fa-filter",
      filterBubble: "bg-danger",
      ShowImport: false,
      importBtnText: "Import",
      importBtnClass: "ml-2 btn-outline-primary btn-round",
      importBtnIcon: "fa fa-cloud-upload",
      ExportColumns: [],
      FilterApiEndpoint: "",
      FilterEndpointParams: [],
      FilterRawQuery: "",
      controls: [],
      apimethod: 'get'
    };
  public FilterModelJson = [];
  ShowInListData: any = [];
  ShowInListCol: any = [];
  public order: string = 'order';
  public controlslist: any[];
  public controls: any[];
  public nodes: any[];
  public filternodes: any[];
  public FormbuilderJson: any =
    {
      Id: "",
      FormName: "Form Name",
      ModelName: "ModelName",
      // CreateEndpoint: "",
      // UpdateEndpoint: "",
      GetEndpoint: "",
      GetRawQuery: "",
      // DeleteEndpoint: "",
      // ListEndpoint: "",
      // CreateEndpointParams: [],
      // UpdateEndpointParams: [],
      GetEndpointParams: [],
      // DeleteEndpointParams: [],
      // ListEndpointParams: [],
      controls: [],
      ModelJson: this.DataJson,
      FilterUIJson: this.FilterUIJson,
      FilterModelJson: this.FilterModelJson,
      Notification: { "create": false, "createmodelfiled": "", "createsubject": "", "isloginusercreateenable": false, "updatemodelfiled": "", "updatesubject": "", "isloginuserupdateenable": false, "deletemodelfiled": "", "deletesubject": "", "isloginuserdeleteenable": false, "importmodelfiled": "", "importsubject": "", "isloginuserimportenable": false, "createtemplate": "<table class=\"email-container\" style=\"margin: 0 auto; background: #eee; max-width: 600px; width: 100%; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<td>\n<table class=\"email-container\" style=\"margin: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<td style=\"padding: 0 0 20px 0; margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" align=\"left\" valign=\"top\"><img style=\"width: 100%; height: auto; border: 0;\" src=\"http://apps.socialheit.com/cdn/images/placeholder-image.png\" /></td>\n</tr>\n<tr>\n<td style=\"padding: 0 0 0 0; margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" align=\"left\" valign=\"top\">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.</td>\n</tr>\n</tbody>\n</table>\n</td>\n</tr>\n</tbody>\n</table>", "update": false, "updatetemplate": "<table class=\"email-container\" style=\"margin: 0 auto; background: #eee; max-width: 600px; width: 100%; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<td>\n<table class=\"email-container\" style=\"margin: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<td style=\"padding: 0 0 20px 0; margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" align=\"left\" valign=\"top\"><img style=\"width: 100%; height: auto; border: 0;\" src=\"http://apps.socialheit.com/cdn/images/placeholder-image.png\" /></td>\n</tr>\n<tr>\n<td style=\"padding: 0 0 0 0; margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" align=\"left\" valign=\"top\">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.</td>\n</tr>\n</tbody>\n</table>\n</td>\n</tr>\n</tbody>\n</table>", "delete": false, "deletetemplate": "<table class=\"email-container\" style=\"margin: 0 auto; background: #eee; max-width: 600px; width: 100%; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<td>\n<table class=\"email-container\" style=\"margin: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<td style=\"padding: 0 0 20px 0; margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" align=\"left\" valign=\"top\"><img style=\"width: 100%; height: auto; border: 0;\" src=\"http://apps.socialheit.com/cdn/images/placeholder-image.png\" /></td>\n</tr>\n<tr>\n<td style=\"padding: 0 0 0 0; margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" align=\"left\" valign=\"top\">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.</td>\n</tr>\n</tbody>\n</table>\n</td>\n</tr>\n</tbody>\n</table>", "import": false, "importtemplate": "<table class=\"email-container\" style=\"margin: 0 auto; background: #eee; max-width: 600px; width: 100%; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<td>\n<table class=\"email-container\" style=\"margin: 20px; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n<tbody>\n<tr>\n<td style=\"padding: 0 0 20px 0; margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" align=\"left\" valign=\"top\"><img style=\"width: 100%; height: auto; border: 0;\" src=\"http://apps.socialheit.com/cdn/images/placeholder-image.png\" /></td>\n</tr>\n<tr>\n<td style=\"padding: 0 0 0 0; margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 16px;\" align=\"left\" valign=\"top\">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do incididunt utlabore etdolore magna aliqua.Ut enim minim.</td>\n</tr>\n</tbody>\n</table>\n</td>\n</tr>\n</tbody>\n</table>" },
      saveBtnKeyForEditMode: "",
    };
  public asyncChildren = [
    {
      name: 'child2.1',
      subTitle: 'new and improved'
    }, {
      name: 'child2.2',
      subTitle: 'new and improved2'
    }
  ];
  public customTemplateStringOptions =
    {
      isExpandedField: 'expanded',
      idField: 'uuid',
      // actionMapping: this.actionMapping,
      nodeHeight: 23,
      allowDrag: true,
      allowDrop: true,
      useVirtualScroll: false
    };
  public controlOptions =
    {
      isExpandedField: 'expanded',
      idField: 'uuid',
      actionMappingdrag,
      nodeHeight: 23,
      allowDrag: true,
      allowDrop: true,
      useVirtualScroll: false
    };
  public Warehouseform: any = {};

  private _opened: boolean = false;

  private _toggleSidebar() {

    this._opened = !this._opened;
  }


  private _togglePropertySidebar(tree: any = null) {
    this._openedProperty = !this._openedProperty;
    if (tree) {
      tree.treeModel.update();
    }
  }
  //setting sidebar
  private _attributesSidbar: boolean = false;
  private _toggleAttributesSidebar() {
    this._attributesSidbar = !this._attributesSidbar;
  }
  private _notificationSidbar: boolean = false;
  private _toggleNotificationSidebar() {
    this._notificationSidbar = !this._notificationSidbar;
  }
  private _azureSidbar: boolean = false;
  private _toggleAzureSidebar() {
    this._azureSidbar = !this._azureSidbar;
  }
  private _modelSidbar: boolean = false;
  private _toggleModelSidebar() {
    this._modelSidbar = !this._modelSidbar;
  }
  isApicalling: boolean = false
  ngOnInit() {

    var id = null;
    if (this.route.children.length > 0) {
      this.route.children[this.route.children.length - 1].params.subscribe(params => {
        id = params["id"];
      });
    }
    this.fetchProperties();
    if (id) {
      this.GetFormdata(id);
    } else {
      this.formid = UUID.UUID();
      this.FormbuilderJson.controls = [];
      this.nodes = [];
    }
    this.loadFormData();
  }
  curenttab = 0
  changetab(activTab) {
    this.curenttab = activTab;
  };
  fetchProperties() {
    var typeList: any = ["getapi", "filterApi", "exportcolumnscustomfilters", "azuresetting", "sourcedataset", "destinationdataset", "configuration", "notification"];

    typeList.forEach(type => {
      var apiparam: any = {}
      apiparam.type = type;
      this.busy = this._appService.get("api/AppData/getproperties", apiparam, true)
        .subscribe(

          (data: any) => {

            switch (type) {
              case "getapi":
                this.GetEndpointCtr = data;
                break;
              case "filterApi":
                this.FilterEndpointCtr = data;
                break;
              case "exportcolumnscustomfilters":
                this.exportcolumnscustomfiltersCtr = data;
                break;
              case "azuresetting":
                this.Azuresetting = data;
                break;
              case "sourcedataset":
                this.SourceDataset = data;
                break;
              case "destinationdataset":
                this.DestinationDataset = data;
                break;
              case "configuration":
                this.PipelineConfiguration = data;
                break;
              case "notification":
                this.Notificationformjson = data;
                break;
            }
          },
          err => {
            console.log(err);
          },
          () => {
            //console.log("done")
          }
        );
    });
  }
  filterFormLoaded: any = false;
  GetFormdata(id: string) {
    this.isApicalling = true;
    let apiparam: any = {};
    apiparam.id = id;
    this.busy = this._appService.get("api/AppData/get", apiparam, "none")
      .subscribe(
        (data: any) => {
          this.form = this._controlService.toControlGroup(data.controls);
          if (data.Notification) {
            this.FormbuilderJson = this._controlService.deepcopy(data);
          } else {
            var notification = this._controlService.deepcopy(this.FormbuilderJson.Notification);

            this.FormbuilderJson = this._controlService.deepcopy(data);
            this.FormbuilderJson.Notification = notification;
          }


          this.FormbuilderJson.FormName = data.Formname;

          if (this.FormbuilderJson.FilterUIJson == undefined) {
            this.FormbuilderJson.FilterUIJson = this.FilterUIJson;
            this.FormbuilderJson.FilterModelJson = this.FilterModelJson;
          }
          else {
            this.FilterUIJson = this.FormbuilderJson.FilterUIJson;
            this.FilterModelJson = this.FormbuilderJson.FilterModelJson;
          }
          if (this.filtertypeCtr) {
            this.filtertypeCtr.optionlist.forEach(item => {
              if (this.FilterUIJson[this.filtertypeCtr.key].indexOf(item.value) > -1) {
                item.checked = true;
              }

            })
          }

          //this.form = this._controlService.toControlGroup(this.FormbuilderJson.FilterUIJson.controls);
          //this.nodes = this.FormbuilderJson.controls.filter(x => x.filterresult != true);
          this.filternodes = this.FormbuilderJson.controls.filter(x => x.filterresult == true);
          if (this.filternodes.length > 0)
            this.nodes = this.FormbuilderJson.controls.filter(x => x.filterresult != true);
          else
            this.nodes = this.FormbuilderJson.controls;

          this.GenerateDataJson(this.FormbuilderJson.controls);
          var filterControls = this.deepcopy(this.FormbuilderJson.FilterUIJson.controls);
          filterControls.sort(function (a, b) { return a.order - b.order })
          filterControls.forEach(filter => {

            filter.key = filter.key.substring(0, filter.key.indexOf('_filter'));
            this.addStaticFilterUI(JSON.stringify(filter), "add");
          });
          this.addFilterUI();
        },
        err => {
          console.log(err);
        },
        () => {
          this.isApicalling = false;
          //console.log("done")
        }
      );
  }
  ResetFilterTypeCtr() {
    this.FilterUIJson[this.filtertypeCtr.key] = "";

    this.filtertypeCtr.optionlist.forEach(selected => {
      if (selected.checked) {
        if (this.FilterUIJson[this.filtertypeCtr.key] == "") {
          this.FilterUIJson[this.filtertypeCtr.key] = selected[this.filtertypeCtr.valuefield];
        } else {
          this.FilterUIJson[this.filtertypeCtr.key] = this.FilterUIJson[this.filtertypeCtr.key] + ',' + selected[this.filtertypeCtr.valuefield];
        }
      }
    });
  }
  OpenControlPopover(node: any, IsChild: boolean) {

    if (IsChild) {
      this.Isaddchildren = true;
      this.selectednode = node.data;
    } else {
      this.selectednode = (node.realParent ? node.realParent : node.treeModel.virtualRoot).data;

    }
    this._toggleSidebar();
  }
  /**
   * AddRootControll : Called when Root control added on form
   * @param tree
   * @param item
   * @param content
   */
  AddRootControll(tree: any, item: any, content: any) {

    var controldump: any = {};
    let uuid = UUID.UUID();
    item.id = uuid;
    item.order = this.FormbuilderJson.controls.length + 1;
    if (item.filterresult != true)
      item.filterresult = false;
    controldump = this.deepcopy(item)
    this.FormbuilderJson.controls.push(controldump);
    this.selectedcontrol = this.FormbuilderJson.controls[this.FormbuilderJson.controls.length - 1];
    this.form = this._controlService.toControlGroup(this.FormbuilderJson.controls);
    //this.nodes = this.FormbuilderJson.controls.filter(x => x.filterresult != true);
    this.filternodes = this.FormbuilderJson.controls.filter(x => x.filterresult == true);
    if (this.filternodes.length > 0)
      this.nodes = this.FormbuilderJson.controls.filter(x => x.filterresult != true);
    else
      this.nodes = this.FormbuilderJson.controls;

    if (item.filterresult == true) {
      for (var variableKey in this.DataJson) {
        if (this.DataJson.hasOwnProperty(variableKey) && variableKey !== 'id') {
          delete this.DataJson[variableKey];
        }
      }
      this.GenerateDataJson(this.FormbuilderJson.controls);
    }
    else {
      //
      for (var variableKey in this.DataJson) {
        if (this.DataJson.hasOwnProperty(variableKey) && variableKey !== 'id') {
          delete this.DataJson[variableKey];
        }
      }
      this.GenerateDataJson(this.FormbuilderJson.controls);
      if (tree)
        tree.treeModel.update();
    }
    // tree.treeModel.update();
  }

  /**
   * addChildcontrol : called when dynmic control added inside control eg : grid, form wizard etc
   * @param tree
   * @param item
   * @param data
   * @param content
   */
  addChildcontrol(tree: any, item: any, data: any, content: any) {

    let uuid = UUID.UUID();
    item.id = uuid;
    item.order = data.children.length + 1;
    if (item.filterresult != true)
      item.filterresult = false;
    var controldump: any = {};
    controldump = this.deepcopy(item);
    if (data.type === "grid") {
      controldump.isTableView = true;
    }

    data.children.push(controldump);
    this.form = this._controlService.toControlGroup(this.FormbuilderJson.controls);
    tree.treeModel.update();
    this.selectedcontrol = data.children[data.children.length - 1];
  }

  public controlProperty: any;
  addcontrol(tree: any, item: any, parent: any, content: any) {

    this._toggleSidebar();
    this.controlProperty = null;
    if (this.Isaddchildren) {
      this.addChildcontrol(tree, item, parent, content);


    } else {
      this.AddRootControll(tree, item, content);
    }
    this.Isaddchildren = false;
    this.GetControlProperty(item);
    this._togglePropertySidebar();

    // this.addFilterUI();
  }

  Clearcontrol() {

    this.selectedcontrol = null;
    this.controlProperty = null;
  }
  SaveProperty(tree: any) {

    if (this.selectedcontrol.type == 'tab') {

      for (var index = 0; index < this.selectedcontrol.Totaltab; index++) {

        this.selectedcontrol.children.push({
          key: 'Tab' + index,
          Header: 'Tab ' + index,
          label: 'Tab ' + index,
          icon: 'tab_unselected',
          type: 'tabcontainer',
          haschildren: true,
          hasdatasource: false,
          children: []

        });
      }
      this.form = this._controlService.toControlGroup(this.FormbuilderJson.controls);
      //this.nodes = this.FormbuilderJson.controls.filter(x => x.filterresult != true);
      if (this.FormbuilderJson.controls.filter(x => x.filterresult == true).length > 0)
        this.nodes = this.FormbuilderJson.controls.filter(x => x.filterresult != true);
      else
        this.nodes = this.FormbuilderJson.controls;

      tree.treeModel.update();
    }
    else if (this.selectedcontrol.type == 'formwizard') {

      for (var index = 0; index < this.selectedcontrol.Totalstep; index++) {

        this.selectedcontrol.children.push({
          key: 'Step' + index,
          Header: 'Step ' + index,
          label: 'Step ' + index,
          icon: 'tab_unselected',
          type: 'tabcontainer',
          haschildren: true,
          hasdatasource: false,
          hideonedit: false,
          children: []

        });
      }
      this.form = this._controlService.toControlGroup(this.FormbuilderJson.controls);
      //this.nodes = this.FormbuilderJson.controls.filter(x => x.filterresult != true);
      if (this.FormbuilderJson.controls.filter(x => x.filterresult == true).length > 0)
        this.nodes = this.FormbuilderJson.controls.filter(x => x.filterresult != true);
      else
        this.nodes = this.FormbuilderJson.controls;
      tree.treeModel.update();
    } else if (this.selectedcontrol.type == 'button' && this.selectedcontrol.actiontype == 'dropdown') {
      if (!this.selectedcontrol.children) {
        this.selectedcontrol.children = [];
      }
      this.selectedcontrol.haschildren = true;
    }

    for (var variableKey in this.DataJson) {
      if (this.DataJson.hasOwnProperty(variableKey) && variableKey !== 'id') {
        delete this.DataJson[variableKey];
      }
    }
    this.GenerateDataJson(this.FormbuilderJson.controls);
    this.controlProperty = null;
    //this.selectedcontrol = null;
  }


  /**
   * OpenChildControlmenu
   * @param node
   * @param tree
   * @param posXMenuchild
   */

  OpenChildControlmenu(node: any, tree: any, posXMenuchild: any) {

    this.selectednode = node.data;
    this.selectedcontrol = node.data;
    if (node.data.type == 'tab') {


      node.data.children.push({
        key: 'Tab',
        Header: 'Tab',
        label: 'Tab',
        icon: 'tab_unselected',
        type: 'tabcontainer',
        haschildren: true,
        hasdatasource: false,
        children: []

      });

      this.form = this._controlService.toControlGroup(this.FormbuilderJson.controls);

      if (this.FormbuilderJson.controls.filter(x => x.filterresult == true).length > 0)
        this.nodes = this.FormbuilderJson.controls.filter(x => x.filterresult != true);
      else
        this.nodes = this.FormbuilderJson.controls;

      //tree.treeModel.update();
    } else if (node.data.type == 'formwizard') {


      node.data.children.push({
        key: 'Step',
        Header: 'Step',
        label: 'Step',
        icon: 'tab_unselected',
        type: 'tabcontainer',
        haschildren: true,
        hasdatasource: false,
        hideonedit: false,
        children: []

      });

      this.form = this._controlService.toControlGroup(this.FormbuilderJson.controls);

      if (this.FormbuilderJson.controls.filter(x => x.filterresult == true).length > 0)
        this.nodes = this.FormbuilderJson.controls.filter(x => x.filterresult != true);
      else
        this.nodes = this.FormbuilderJson.controls;

      //tree.treeModel.update();
    }
    else {
      this.GetControlProperty(this.selectedcontrol);
      // posXMenuchild.open();
    }
  }
  AddSinglecontrol(node: any, tree: any) {

    this.selectedcontrol = node.data;
    //this.selectednode = node.data;
    this.GetControlProperty(this.selectedcontrol);

  }


  /**
   * EditProperties : This is use for Edit properties of dynmic control.
   * @param node
   * @param tree
   * @param content
   */
  EditProperties(node: any, tree: any, content: any) {
    this.ShowProperties(node, tree, content);
    this.controlForm = null;
    if (node.data) {
      this.selectedcontrol = node.data;
    } else {
      this.selectedcontrol = node;
    };

    this.GetControlProperty(this.selectedcontrol);
    this.modalService.open(content, this.options).result.then((result) => {


      for (var variableKey in this.DataJson) {
        if (this.DataJson.hasOwnProperty(variableKey) && variableKey !== 'id') {
          delete this.DataJson[variableKey];
        }
      }
      this.GenerateDataJson(this.FormbuilderJson.controls);

    }, (reason) => {

    });

  }
  getfilternode(opt) {

    return this.filternodes.filter(x => x.Name == opt[this.filtertypeCtr.valuefield])
  }
  ShowProperties(node: any, tree: any, content: any) {

    this.controlProperty = null;
    if (node.data) {
      this.selectedcontrol = node.data;
    } else {
      this.selectedcontrol = node;
    };
    this.GetControlProperty(this.selectedcontrol);

    //this.modalService.open(content, this.options).result.then((result) => {


    //  for (var variableKey in this.DataJson) {
    //    if (this.DataJson.hasOwnProperty(variableKey) && variableKey !== 'id') {
    //      delete this.DataJson[variableKey];
    //    }
    //  }
    //  this.GenerateDataJson(this.FormbuilderJson.controls);

    //}, (reason) => {

    //});

  }
  /**
   * Create UI for Filter
   */
  private findFilterControls(control: any, Filterlist: any = []) {

    if (control.haschildren == true) {
      for (let child of control.children) {
        if (child.addinfilter == true && Filterlist.filter(x => x.key == child.key).length == 0) {
          Filterlist.push(child);
        }
        if (control.haschildren == true)
          this.findFilterControls(child, Filterlist);
      }
    }
    else if (control.addinfilter == true && Filterlist.filter(x => x.key == control.key).length == 0) {
      Filterlist.push(control);
    }
  }

  staticFilterUI: any = [];
  addStaticFilterUI(control: any, action: any) {

    var _control = JSON.parse(control);
    var _filterList = this.deepcopy(this.staticFilterUI);
    if (action == "add" && this.staticFilterUI.filter(x => x.key == _control.key).length == 0)
      this.staticFilterUI.push(_control);
    else if (action == "update") {
      for (var i = 0; i < _filterList.length; i++) {
        if (_filterList[i].key == _control.key) {
          this.staticFilterUI.splice(i, 1);
          this.form.removeControl(_control.key);
        }
      }
      if (this.staticFilterUI.filter(x => x.key == _control.key).length == 0)
        this.staticFilterUI.push(_control);
    }
    else if (action == "delete") {
      for (var i = 0; i < _filterList.length; i++) {
        if (_filterList[i].key == _control.key) {
          this.staticFilterUI.splice(i, 1);
          this.form.removeControl(_control.key);
        }
      }
    }

    this.addFilterUI();

  }
  addFilterUI() {
    this.FilterUIJson.controls = [];
    this.FilterModelJson = [];
    var FilterUI = this.deepcopy(this.staticFilterUI);

    this.FormbuilderJson.controls.forEach(control => {
      if (control.haschildren == true) {
        this.findFilterControls(control, FilterUI);
      }
      else if (control.addinfilter == true && FilterUI.filter(x => x.key == control.key).length == 0) {
        FilterUI.push(control);
      }
    })
    var _model: any = {};
    FilterUI.forEach(control => {
      _model = {};

      var _control = this.deepcopy(control);
      _control.id = UUID.UUID();
      _control.key = control.key + "_filter";


      if (control.type == "date") {

        _model.type = "daterange";
        _model.id = _control.key;
        _model.key = control.key;
        let arr: any = {}
        arr.from = "";
        arr.to = "";
        _model.value = arr;
        this.FilterModelJson.push(_model);

      } else if (control.type == "number") {

        _model.type = "range";
        _model.id = _control.key;
        _model.key = control.key;
        let arr: any = {}
        arr.from = "";
        arr.to = "";
        _model.value = arr;
        this.FilterModelJson.push(_model);

      } else
        if (control.type == "textbox") {
          _model.type = "search";
          _model.id = _control.key;
          _model.key = control.key;
          _model.value = "";
          this.FilterModelJson.push(_model);


        } else if (control.type == "checkboxlist") {
          _model.type = "terms";
          _model.id = _control.key;
          _model.key = control.key;
          _model.value = [];
          this.FilterModelJson.push(_model);


        } else {

          _model.type = "term";
          _model.id = _control.key;
          _model.key = control.key;
          _model.value = "";
          this.FilterModelJson.push(_model);
        }

      this.FilterUIJson.controls.push(_control);
      this.form.addControl(_control.id, new FormControl());
    })
    this.FormbuilderJson.FilterUIJson = this.FilterUIJson;
    this.FormbuilderJson.FilterModelJson = this.deepcopy(this.FilterModelJson);
    this.filterFormLoaded = true;
  }
  setExportColumnsList(key: any) {
    if (this.ExportColumnsCtr && this.ExportColumnsCtr.paramlist) {
      if (this.ExportColumnsCtr.paramlist.filter(x => x.key == key).length == 0) {
        var arr: any;
        arr = { key: key, value: key };
        this.ExportColumnsCtr.paramlist.push(arr);
      }
    }
  }
  /**
   * event for log
   * @param event
   */
  onEvent(event: any) {
    // console.log(event);
  }
  /**
   * GenerateDataJson : This is final method called after control added to form and use to call SetControlValidator function.
   * @param control
   */
  GenerateDataJson(control: any) {

    this.form = this._controlService.toControlGroup(this.FormbuilderJson.controls);
    // this._controlService.Id = this.FormbuilderJson.Id;
    // this._controlService.FormName = this.FormbuilderJson.FormName
    // this._controlService.ModelName = this.FormbuilderJson.ModelName
    // this._controlService.CreateEndpoint = this.FormbuilderJson.CreateEndpoint
    // this._controlService.UpdateEndpoint = this.FormbuilderJson.UpdateEndpoint
    // this._controlService.GetEndpoint = this.FormbuilderJson.GetEndpoint
    // this._controlService.DeleteEndpoint = this.FormbuilderJson.DeleteEndpoint
    // this._controlService.ListEndpoint = this.FormbuilderJson.ListEndpoint


    for (var index = 0; index < control.length; index++) {
      this.setExportColumnsList(control[index].key);
      if (control[index].key === 'Tab') {
        for (let _child of control[index].children) {
          if (_child.haschildren == true) {
            for (let __child of _child.children) {
              this.SetControlValidator(__child.type, __child.id, __child.require, control[index].haschildren);
            }
          } else {
            this.SetControlValidator(_child.type, _child.id, _child.require, control[index].haschildren);
          }
        }

      }
      else if (control[index].key === 'Formwizard') {

      }
      else {
        this.SetControlValidator(control[index].type, control[index].id, control[index].require, control[index].haschildren);
      }
      if (control[index].haschildren && control[index].type != 'grid' && control[index].type != 'dashboard' && control[index].type != 'multiselect') {
        this.GenerateDataJson(control[index].children);

      } else {
        if (control[index].type == 'checkbox') {
          this.DataJson[control[index].key] = false;

        } else if (control[index].type == 'grid') {
          this.DataJson[control[index].key] = [];
        } else if (control[index].type == 'number') {
          this.DataJson[control[index].key] = null;
        }
        else if (control[index].type == 'list') {
          this.DataJson[control[index].key] = [];
        }
        else if (control[index].type == 'multiselect') {
          this.DataJson[control[index].key] = [];
        }
        else if (control[index].type == 'date') {
          this.DataJson[control[index].key] = null;
        }
        else if (control[index].type == 'label') {
          if (control[index].viewtype != 'name') {
            this.DataJson[control[index].key] = "";
          }
        }
        else if (control[index].type == 'calender') {
          if (control[index].filterresult != true)
            this.DataJson[control[index].key] = [];
        } else if (control[index].type == 'cardgrid') {
          if (control[index].filterresult != true)
            this.DataJson[control[index].key] = [];
        } else if (control[index].type == 'kanban') {
          if (control[index].filterresult != true)
            this.DataJson[control[index].key] = [];
        } else if (control[index].type == 'map') {
          if (control[index].filterresult != true)
            this.DataJson[control[index].key] = [];
        }
        else if (control[index].type == 'advancegrid') {
          if (control[index].filterresult != true)
            this.DataJson[control[index].key] = [];
        }
        else if (control[index].type == 'button') {
          delete this.DataJson[control[index].key];
        }
        else if (control[index].type == 'googleplaces') {
          this.DataJson[control[index].key] = {};
        }
        else if (control[index].type == 'table') {
          if (control[index].filterresult != true)
            this.DataJson[control[index].key] = [];
        }
        else {
          this.DataJson[control[index].key] = '';
        }

      }
    }


  }

  /**
   * SetControlValidator : This function dynmically set validation based of user selection and control type
   * @param type
   * @param key
   * @param require
   * @param haschild
   */
  SetControlValidator(type: string, key: string, require: boolean, haschild: boolean) {
    if (type === 'email') {
      if (require == true)
        this.form.controls[key].validator = Validators.compose([Validators.required, CustomValidators.email]);
      else
        this.form.controls[key].validator = Validators.compose([]);;
    }
    else if (type === 'phonenumber') {
      if (require == true)
        this.form.controls[key].validator = Validators.compose([Validators.required, Validators.pattern("\\d{3}[\\-]\\d{3}[\\-]\\d{4}")]);
      else
        this.form.controls[key].validator = Validators.compose([Validators.pattern("\\d{3}[\\-]\\d{3}[\\-]\\d{4}")]);
    }
    else if (type === 'date') {

      try {
        if (require == true)
          this.form.controls[key].validator = Validators.compose([Validators.required, CustomValidators.date]);
        else
          this.form.controls[key].validator = Validators.compose([CustomValidators.date]);

      } catch (e) {

      }

    }
    else if (type === 'website') {
      if (require == true)
        this.form.controls[key].validator = Validators.compose([Validators.required, Validators.pattern("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})")]);
      else
        this.form.controls[key].validator = Validators.compose([Validators.pattern("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})")]);
    }
    else if (key === 'apiurl') {
      if (require == true)
        this.form.controls[key].validator = Validators.compose([Validators.required, CustomValidators.url]);
      else
        this.form.controls[key].validator = Validators.compose([CustomValidators.url]);
    }
    else if (haschild == false) {
      if (require == true)
        this.form.controls[key].validator = Validators.compose([Validators.required]);
      else
        this.form.controls[key].validator = Validators.compose([]);
    }
  }
  validateForm() {

    this.form = this._controlService.toControlGroup(this.FormbuilderJson.controls);
    if (this.form.errors) {
      alert("Please fill in all required fields!");
      return false;
    }
    else {
      return true;
    }
  }

  /**
   * Save form - Work in progress
   */
  SaveForm() {

    if (this.ExportColumnsCtr) {
      this.ExportColumnsCtr.paramlist = [];
      for (let item in this.DataJson) {
        this.ExportColumnsCtr.paramlist.push({ key: item, value: item });
      }
    }
    // this.FormbuilderJson.controls[0].children[2].children[0].Add = true;
    this.FormbuilderJson.ModelJson = this.deepcopy(this.DataJson);
    this.FormbuilderJson.ModelJson.id = "";

    if (this.FormbuilderJson.Id) {

      this._appService.post("api/AppData/update", this.FormbuilderJson)
        .subscribe((res: any) => {
          //this._router.navigate(['./forms']); 
          this.location.back();
        });
    } else {

      this._appService.post("api/AppData/create", this.FormbuilderJson)
        .subscribe((res: any) => {
          // this._router.navigate(['./forms']);
          this.location.back();
        }
        );

    }
    if (this.FormbuilderJson.Id) {
      const esc = encodeURIComponent;
      var params: any = {};
      params.Id = this.FormbuilderJson.Id;
      const QueryStr = Object.keys(params)
        .map(k => esc(k) + '=' + esc(params[k])).join('&');
      if (!this._appService.stream['api/service/get?' + QueryStr]) {
        delete this._appService.stream['api/service/get?' + QueryStr];
      }
    }
  }

  /**
   * Delete Control fro tree
   * @param node
   * @param tree
   */
  DeleteControl(node: any, tree: any) {

    let parentNode = node.realParent ? node.realParent : node.treeModel.virtualRoot;

    _.remove(parentNode.data.children, function (child) {
      return child === node.data;
    });
    delete this.DataJson[node.data.key];

    _.remove(this.FormbuilderJson.controls, function (child) {
      return child === node.data;
    });
    if (node.data && node.data.filterresult == true) {
      this.FormbuilderJson.FilterUIJson.filtertype = "";
      this.FormbuilderJson.controls.forEach(control => {
        if (control.filterresult == true) {
          if (this.FormbuilderJson.FilterUIJson.filtertype == "") {
            this.FormbuilderJson.FilterUIJson.filtertype = control.Name;
          } else {
            this.FormbuilderJson.FilterUIJson.filtertype = this.FormbuilderJson.FilterUIJson.filtertype + "," + control.Name;
          }
        }
      })
    }
    this.form = this._controlService.toControlGroup(this.FormbuilderJson.controls);
    tree.treeModel.update();

    this.addFilterUI();
    this.controlProperty = null;
    //this.selectedcontrol = null;
  }

  /**
   * Swap json index.
   * @param input
   * @param oldindex
   * @param newindex
   */
  swap(input: any, oldindex: any, newindex: any) {
    var temp = input[oldindex];

    input[oldindex] = input[newindex];
    input[newindex] = temp;
    return input;
  }
  /**
 * Setorder : This is set order of dynamic controls in form.
 * @param node
 * @param tree
 * @param index
 * @param mode
 */
  Showaddnew(node: any, index: any) {

    var parentNode = (node.realParent ? node.realParent : node.treeModel.virtualRoot).data.children;

    let lastindex = parentNode.length - 1;
    if (index == lastindex) {
      return true;

    } else {
      return false;
    }


  }

  /**
   * Setorder : This is set order of dynamic controls in form.
   * @param node
   * @param tree
   * @param index
   * @param mode
   */
  Setorder(node: any, tree: any, index: any, mode: string) {

    var parentNode = (node.realParent ? node.realParent : node.treeModel.virtualRoot).data.children;

    if (mode === 'down') {
      let lastindex = parentNode.length - 1;
      if (index == lastindex) {

        alert("You can not move last control down")

      } else {
        parentNode = this.swap(parentNode, index, index + 1);
      }
    } else {

      parentNode = this.swap(parentNode, index, index - 1);
    }
    if (!node.realParent) {
      var copyCtrl = this.deepcopy(this.FormbuilderJson.controls.filter(x => x.filterresult == true));
      //this.FormbuilderJson.controls = parentNode;
      this.FormbuilderJson.controls = this.deepcopy(this.nodes);
      if (copyCtrl.length > 0) {
        copyCtrl.forEach(ctrl => {
          this.FormbuilderJson.controls.push(ctrl);
        })
      }
    }
    // this.FormbuilderJson.controls=this.nodes;
    this.form = this._controlService.toControlGroup(this.FormbuilderJson.controls);
    tree.treeModel.update();


  }

  /**
   * GetControlProperty - This is filter dynamic property based on user selection
   * @param control
   */
  GetControlProperty(control: any) {

    var apiparam: any = {}
    apiparam.type = control.type.toLowerCase();
    this.busy = this._appService.get("api/AppData/getproperties", apiparam, true)
      .subscribe(
        (data: any) => {
          let controls = data ? data.controls : [];
          if (control.type == "import") {
            var model: any = [];
            for (let item in this.DataJson) {
              model.push({ "key": item, "value": item });
            }
            const mandatoryfield: any = controls.find(x => x.key == 'mandatoryfield')
            if (mandatoryfield) {
              mandatoryfield.paramlist = model;
            }
            const mappingfield: any = controls.find(x => x.key == 'mappingfield')
            if (mappingfield) {
              mappingfield.paramlist = model;
            }
          }
          if (!this.controlForm) {
            this.controlForm = controls;
          }
          if (!this.controlProperty) {
            this.controlProperty = controls;
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

  GetValueinList(row: any, key) {
    var value = this.findinJson(row, key)

    return value;
  }
  findinJson(json, key) {
    var result = "";
    for (var property in json) {
      //console.log(property);
      if (json.hasOwnProperty(property)) {
        if (property == key) {
          result = json[property];
        }
        if (Array.isArray(json[property])) {
          for (var child in json[property]) {
            //console.log(json[property][child]);
            var res = this.findinJson(json[property][child], key);
            if (res.length >= 1) {
              result = res[child];
            }
          }
        }
      }
    }
    return result;
  }
  tabChange(event: any) {

    this.ShowInListData = [];
    if (event.nextId == "List") {
      this.ShowInListCol = this.GetShowInListCol();
      //Object.keys(this.DataJson).forEach(
      //    items => {
      //        if (Array.isArray(value))
      //            this.ShowInListData.push(value);
      //    }
      //)
      //if (this.ShowInListData.length == 0)
      this.ShowInListData.push(this.DataJson);
    }
  }
  /**
   * ShowInList Columns for List view
   */
  private GetShowInListCol() {
    var _arr = [];
    this.FormbuilderJson.controls.forEach(
      control => {
        if (control.haschildren == true) {
          var ArrNew = this.FindListinChildren(control.children, _arr)
          _arr = ArrNew;
        }
        else if (control.showinlist == true)
          _arr.push(control);
      }
    );
    return _arr;
  }
  FindListinChildren(children: any, pushArr: any) {
    var Arr = pushArr;
    children.forEach(
      _child => {
        if (_child.haschildren == true) {
          var _arrNew = this.FindListinChildren(_child.children, Arr);
          Arr = _arrNew;
        }
        else if (_child.showinlist == true)
          Arr.push(_child);
      }
    )
    return Arr;
  }
  /**
   * This is common method use for copy json data into another object
   * @param o
   */
  deepcopy<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }
  loadFormData() {
    if (this.FormbuilderJson.GetEndpoint !== "") {
      // this.loadGetEndpointdata();
    }
  }
  loadGetEndpointdata() {
    var id = "";
    if (this.FormbuilderJson.GetEndpointParams.length > 0)
      id = this.FormbuilderJson.GetEndpointParams[0].value;

    this._controlService.GetStory(this.FormbuilderJson.GetEndpoint, id);
  }

  /**
  ///
  Filter Search Code
  ///
  */
  FilterViewChangeComplete(tree, content, event, isChange) {
    this.ResetFilterTypeCtr();
    var controls = this.FormbuilderJson.controls.filter(x => x.filterresult == true && x.type != 'import');
    if (controls.length > 0) {
      _.remove(this.FormbuilderJson.controls, function (child) {
        return child.filterresult == true && child.type != 'import';
      });
      this.form = this._controlService.toControlGroup(this.FormbuilderJson.controls);
      this.filternodes = this.FormbuilderJson.controls.filter(x => x.filterresult == true);
    }


    //this.isFilterResultCreated = true;
    if (this.FilterUIJson.filtertype == 'All' || this.FilterUIJson.filtertype.indexOf("Calender") > -1) {
      let item = this.deepcopy(this.controlslist.find(x => x.type == 'calender'));
      //let control = this.FormbuilderJson.controls.filter(x => x.key == 'CalenderView')
      let control = this.FormbuilderJson.controls.filter(x => x.type == 'calender')
      if (item && control.length == 0) {
        item.label = 'CalenderView';
        item.Name = 'Calender';
        item.filterresult = true;
        item.key = "CalenderView";
        item.ResultApi = this.FilterUIJson.FilterApiEndpoint;
        item.rawquery = this.FilterUIJson.FilterRawQuery;
        item.ResultApiParam = this.FilterUIJson.FilterEndpointParams;
        this.AddRootControll(tree, item, content);
      }
    } if (this.FilterUIJson.filtertype == 'All' || this.FilterUIJson.filtertype.indexOf("Grid") > -1) {
      let item = this.deepcopy(this.controlslist.find(x => x.type == 'cardgrid'));
      //let control = this.FormbuilderJson.controls.filter(x => x.key == 'GridView')
      let control = this.FormbuilderJson.controls.filter(x => x.type == 'cardgrid')
      if (item && control.length == 0) {
        item.filterresult = true;
        item.key = "GridView";
        item.label = 'GridView';
        item.Name = 'Grid';
        item.ResultApi = this.FilterUIJson.FilterApiEndpoint;
        item.ResultApiParam = this.FilterUIJson.FilterEndpointParams;
        item.rawquery = this.FilterUIJson.FilterRawQuery;
        this.AddRootControll(tree, item, content);
      }
    } if (this.FilterUIJson.filtertype == 'All' || this.FilterUIJson.filtertype.indexOf("KanBan") > -1) {
      let item = this.deepcopy(this.controlslist.find(x => x.type == 'kanban'));
      //let control = this.FormbuilderJson.controls.filter(x => x.key == 'KanBanView')
      let control = this.FormbuilderJson.controls.filter(x => x.type == 'kanban')
      if (item && control.length == 0) {
        item.filterresult = true;
        item.key = "KanBanView";
        item.label = 'KanBanView';
        item.Name = 'KanBan';
        item.apiurl = this.FilterUIJson.FilterApiEndpoint;
        item.paramlist = this.FilterUIJson.FilterEndpointParams;
        item.rawquery = this.FilterUIJson.FilterRawQuery;
        this.AddRootControll(tree, item, content);
      }
    }
    if (this.FilterUIJson.filtertype == 'All' || this.FilterUIJson.filtertype.indexOf("Map") > -1) {
      let item = this.deepcopy(this.controlslist.find(x => x.type == 'map'));
      //let control = this.FormbuilderJson.controls.filter(x => x.key == 'MapView')
      let control = this.FormbuilderJson.controls.filter(x => x.type == 'map')
      if (item && control.length == 0) {
        item.filterresult = true;
        item.key = "MapView";
        item.label = 'MapView';
        item.Name = 'Map';
        item.ResultApi = this.FilterUIJson.FilterApiEndpoint;
        item.ResultApiParam = this.FilterUIJson.FilterEndpointParams;
        item.rawquery = this.FilterUIJson.FilterRawQuery;
        this.AddRootControll(tree, item, content);
      }
    } if (this.FilterUIJson.filtertype == 'All' || this.FilterUIJson.filtertype.indexOf("List") > -1) {
      let item = this.deepcopy(this.controlslist.find(x => x.type == 'advancegrid'));
      //let control = this.FormbuilderJson.controls.filter(x => x.key == 'ListView')
      let control = this.FormbuilderJson.controls.filter(x => x.type == 'advancegrid')
      if (item && control.length == 0) {
        item.filterresult = true;
        item.key = "ListView";
        item.Name = 'List';
        item.label = 'ListView';
        item.hideview = true;
        item.hidedelete = true;
        item.hideedit = true;
        item.ResultApi = this.FilterUIJson.FilterApiEndpoint;
        item.ResultApiParam = this.FilterUIJson.FilterEndpointParams;
        item.rawquery = this.FilterUIJson.FilterRawQuery;
        this.AddRootControll(tree, item, content);
      }
    }

    if (this.FilterUIJson.ShowImport) {
      let item = this.deepcopy(this.controlslist.find(x => x.type == 'import'));
      //let control = this.FormbuilderJson.controls.filter(x => x.key == 'Import')
      let control = this.FormbuilderJson.controls.filter(x => x.type == 'import')
      if (item && control.length == 0) {
        item.filterresult = true;
        item.key = "Import";
        item.label = 'Import';
        item.Name = 'Import';
        this.AddRootControll(tree, item, content);
      }
    } else {
      var controls = this.FormbuilderJson.controls.filter(x => x.filterresult == true);
      _.remove(this.FormbuilderJson.controls, function (child) {
        //return child.key == 'Import';
        return child.type == 'import';
      });
      this.form = this._controlService.toControlGroup(this.FormbuilderJson.controls);
      this.filternodes = this.FormbuilderJson.controls.filter(x => x.filterresult == true);

    }
  }
  FilterViewChange(tree, content, event = '', isChange = true, option: any = null) {

    if (event == '') {
      if (isChange) {
        this.FilterViewChangeComplete(tree, content, event, isChange);
      } else {
        this.modalService.open(content).result.then((result) => {
          if (this.filterChangeconfirm == "OK") {
            this.FilterViewChangeComplete(tree, content, event, isChange);
          }
          else {
            if (option) {
              this.filtertypeCtr.optionlist.forEach(element => {
                if (element.key == option.key) {
                  element.checked = true;
                }
              });
            }
            this.ResetFilterTypeCtr()
            this.filterChangeconfirm = "Cancel";
          }
        });
      }
    } else {
      if (this.FilterUIJson.ShowImport) {
        let item = this.deepcopy(this.controlslist.find(x => x.type == 'import'));
        //let control = this.FormbuilderJson.controls.filter(x => x.key == 'Import')
        let control = this.FormbuilderJson.controls.filter(x => x.type == 'import')
        if (item && control.length == 0) {
          item.filterresult = true;
          item.key = "Import";
          item.label = 'Import';
          item.Name = 'Import';
          this.AddRootControll(tree, item, content);
        }
      } else {
        var controls = this.FormbuilderJson.controls.filter(x => x.filterresult == true);
        _.remove(this.FormbuilderJson.controls, function (child) {
          //return child.key == 'Import';
          return child.type == 'import';
        });
        this.form = this._controlService.toControlGroup(this.FormbuilderJson.controls);
        this.filternodes = this.FormbuilderJson.controls.filter(x => x.filterresult == true);

      }
    }
  }
  filterApplied: number = 0;
  _step: number = 1;
  _totalSteps: number = 2;
  _stepid: string = "";
  _stepName: string = "";
  FilterResult: any;
  busy: Subscription;
  Search(isSearchClicked = false) {

    this.FormbuilderJson.controls.forEach(item => {
      if (item.filterresult == true) {
        this.DataJson[item.key] = [];
      }
    })
    if (isSearchClicked == false)
      this._controlService._toggleSidebar();

    this.filterApplied = this.FilterCount();

    let apiparam: any = {};
    this.FilterUIJson.FilterEndpointParams.forEach(option => {
      if (option.key == "query")
        apiparam[option.key] = JSON.stringify(this.FilterModelJson);
      else
        apiparam[option.key] = option.value;
    })
    let url = this.FilterUIJson.FilterApiEndpoint;
    this.busy = this._appService.get(url, apiparam).subscribe((data: any) => {

      this.FormbuilderJson.controls.forEach(item => {
        if (item.filterresult == true) {
          this.DataJson[item.key] = data ? data : [];
          if (item.key == "MapView" && this.DataJson[item.key].length == 0) {
            this.DataJson[item.key] = [{}]
          }
        }
      })
      this._controlService.RefreshComponent();
    });

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
  FilterCount() {

    var count = 0;
    this.FilterModelJson.forEach(item => {
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

    this.FilterModelJson.forEach(item => {
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
        this.DataJson[item.id] = [];
      }
      else if (item.type != 'search') {
        item.value = "";
        this.DataJson[item.id] = "";
      }
    })
    this._controlService.ResetComponent();
  }
  /**
   * form.component contructor method
   * @param _controlService
   * @param modalService
   */

  constructor(public _controlService: FormControlService, private modalService: NgbModal,
    private _appService: DataService, private _router: Router, public route: ActivatedRoute, private location: Location) {

    Object.assign(this, {
      controlslist,
      controls
    });

    // this.FormbuilderJson.controls.push(FormApiParams[0]);
    // this.FormbuilderJson.controls.push(FormApiParams[1]);
    //this.FormbuilderJson.controls.push(FormApiParams[2]);
    // this.FormbuilderJson.controls.push(FormApiParams[3]);
    //this.FormbuilderJson.controls.push(FormApiParams[4]);
    //this.FormbuilderJson.controls.push(FormApiParams[5]);
    //this.FormbuilderJson.controls.push(FormApiParams[6]);
    //this.FormbuilderJson.controls.push(FormApiParams[7]);
    //this.FormbuilderJson.controls.push(FormApiParams[8]);
    //this.formAttribute = this._controlService.toControlGroup(this.FormbuilderJson.controls);
    //this.GenerateDataJson(this.FormbuilderJson.controls);
  }


  GetAuthParam() {
    var Params = {
      "tenantid": this.factorymodel.setting.tenantid,
      "applicationId": this.factorymodel.setting.applicationId,
      "authenticationKey": this.factorymodel.setting.authenticationKey
    };
    return JSON.stringify(Params);
  }
  modeljson: string;
  setmodeljson() {

    this.FormbuilderJson = JSON.parse(this.modeljson);
  }
  CreateFactory() {
    var Factorybody = {
      "location": "East US"
    };



    var urlpart = this.factorymodel.setting.subscriptionId + "/resourceGroups/" + this.factorymodel.setting.resourceGroup + "/providers/Microsoft.DataFactory/factories/" + this.factorymodel.setting.factory + "?api-version=2017-09-01-preview";

    let apiparam: any = {};
    apiparam.urlpart = urlpart;
    apiparam.param = this.GetAuthParam();
    this.busy = this._appService.post("api/datafactory/Putdata", JSON.stringify(Factorybody), apiparam)
      .subscribe((res: any) => {
        alert("Factory created successfully");
      });
  }
  onStepSetting(event: any) {
    this.GetLinkservicebyFactory();
    this.GetDatasetFactory();
  }
  onDestination(event: any) {
    this.GetDatasetDestination(this.factorymodel.destination.dataset);
    this.GetDatasetsource(this.factorymodel.source.dataset);
  }
  GetDatasetsource(name: string) {
    var urlpart = this.factorymodel.setting.subscriptionId + "/resourceGroups/" + this.factorymodel.setting.resourceGroup + "/providers/Microsoft.DataFactory/factories/" + this.factorymodel.setting.factory + "/datasets/" + name + "?api-version=2017-09-01-preview";

    var _othis = this;
    let apiparam: any = {};
    apiparam.urlpart = urlpart;
    apiparam.param = this.GetAuthParam();
    this.busy = this._appService.get("api/datafactory/getdata", apiparam)
      .subscribe((res: any) => {

        _othis.factorymodel.Pipeline.source = res;
        _othis.factorymodel.Pipeline.mapping = [];
        _othis.factorymodel.Pipeline.source.properties.structure.forEach(option => {
          var row: any = {};
          row.name = option.name;
          row.value = "";
          _othis.factorymodel.Pipeline.mapping.push(row)
        });
      });
  }
  GetDatasetDestination(name: string) {
    var urlpart = this.factorymodel.setting.subscriptionId + "/resourceGroups/" + this.factorymodel.setting.resourceGroup + "/providers/Microsoft.DataFactory/factories/" + this.factorymodel.setting.factory + "/datasets/" + name + "?api-version=2017-09-01-preview";

    var _othis = this;
    let apiparam: any = {};
    apiparam.urlpart = urlpart;
    apiparam.param = this.GetAuthParam();
    this.busy = this._appService.get("api/datafactory/getdata", apiparam)
      .subscribe((res: any) => {
        _othis.factorymodel.Pipeline.destination = res;

      });
  }
  GetLinkservicebyFactory() {


    var _othis = this;
    var urlpart = this.factorymodel.setting.subscriptionId + "/resourceGroups/" + this.factorymodel.setting.resourceGroup + "/providers/Microsoft.DataFactory/factories/" + this.factorymodel.setting.factory + "/linkedservices?api-version=2017-09-01-preview";

    let apiparam: any = {};
    apiparam.urlpart = urlpart;
    apiparam.param = this.GetAuthParam();
    this.busy = this._appService.get("api/datafactory/getdata", apiparam)
      .subscribe((res: any) => {


        var data = res.value;
        _othis.SourceDataset.controls[0].children[0].children[1].children[0].optionlist = data;
        _othis.DestinationDataset.controls[0].children[0].children[1].children[0].optionlist = data;
      });
  }
  GetDatasetFactory() {


    var urlpart = this.factorymodel.setting.subscriptionId + "/resourceGroups/" + this.factorymodel.setting.resourceGroup + "/providers/Microsoft.DataFactory/factories/" + this.factorymodel.setting.factory + "/datasets?api-version=2017-09-01-preview";

    var _othis = this;
    let apiparam: any = {};
    apiparam.urlpart = urlpart;
    apiparam.param = this.GetAuthParam();
    this.busy = this._appService.get("api/datafactory/getdata", apiparam)
      .subscribe((res: any) => {


        var data = res.value;
        _othis.SourceDataset.controls[1].children[0].children[1].children[0].optionlist = data;
        _othis.DestinationDataset.controls[1].children[0].children[1].children[0].optionlist = data;
      });
  }
  CreateDataset() {

    var body = {
      "name": "DSCosmoss",
      "properties": {
        "linkedServiceName": {
          "referenceName": "CosmosConnection",
          "type": "LinkedServiceReference"
        },
        "type": "DocumentDbCollection",
        "structure": [
          {
            "name": "name",
            "type": "String"
          },
          {
            "name": "website",
            "type": "String"
          },
          {
            "name": "Owner",
            "type": "String"
          },
          {
            "name": "type"
          },
          {
            "name": "Owner Email"
          },
          {
            "name": "tags"
          }
        ],
        "typeProperties": {
          "collectionName": "Organization"
        }
      }
    };
  }
  public Activity: any = {};
  onConfiguration(event: any) {
    var mapping = "";
    this.factorymodel.Pipeline.mapping.forEach(option => {


      if (option.value) {
        if (mapping) {
          mapping += ",";
          mapping += option.name + ":" + option.value;
        } else {
          mapping += option.name + ":" + option.value;
        }

      }



    });
    this.Activity = {
      "name": this.factorymodel.Pipeline.name,
      "properties": {
        "activities": [
          {
            "name": "Copytest",
            "type": "Copy",
            "policy": {
              "timeout": "7.00:00:00",
              "retry": 0,
              "retryIntervalInSeconds": 30,
              "secureOutput": false
            },
            "typeProperties": {
              "source": {
                "type": this.factorymodel.Pipeline.source.properties.type
              },
              "sink": {
                "type": this.factorymodel.Pipeline.destination.properties.type
              },
              "enableStaging": false,
              "cloudDataMovementUnits": 0,
              "translator": {
                "type": "TabularTranslator",
                "columnMappings": mapping
              }
            },
            "inputs": [
              {
                "referenceName": this.factorymodel.source.dataset,
                "type": "DatasetReference"
              }
            ],
            "outputs": [
              {
                "referenceName": this.factorymodel.destination.dataset,
                "type": "DatasetReference"
              }
            ]
          }
        ]
      }
    };
    //this.CreateCopyActivity();
  }

  public visiblebutton = true;
  CreateCopyActivity(trigger1: string) {

    var urlpart = this.factorymodel.setting.subscriptionId + "/resourceGroups/" + this.factorymodel.setting.resourceGroup + "/providers/Microsoft.DataFactory/factories/" + this.factorymodel.setting.factory + "/pipelines/" + this.Activity.name + "?api-version=2017-09-01-preview";

    let apiparam: any = {};
    apiparam.urlpart = urlpart;
    apiparam.param = this.GetAuthParam();
    this.busy = this._appService.post("api/datafactory/Putdata", JSON.stringify(this.Activity), apiparam)
      .subscribe((res: any) => {
        if (trigger1 != "run") {
          var trigger = {
            "properties": {
              "type": "ScheduleTrigger",
              "typeProperties": {
                "recurrence": {
                  "frequency": this.factorymodel.Pipeline.frequency,
                  "interval": this.factorymodel.Pipeline.interval,
                  "startTime": this.factorymodel.Pipeline.startTime,
                  "endTime": this.factorymodel.Pipeline.endTime,
                  "timeZone": "UTC"
                }
              },
              "pipelines": [
                {
                  "pipelineReference": {
                    "referenceName": this.factorymodel.Pipeline.name,
                    "type": "PipelineReference"
                  }
                }
              ]
            }
          };
          var urlpart = this.factorymodel.setting.subscriptionId + "/resourceGroups/" + this.factorymodel.setting.resourceGroup + "/providers/Microsoft.DataFactory/factories/" + this.factorymodel.setting.factory + "/triggers/" + this.Activity.name + "trigger?api-version=2017-09-01-preview";

          let apiparam: any = {};
          apiparam.urlpart = urlpart;
          apiparam.param = this.GetAuthParam();
          this.busy = this._appService.post("api/datafactory/Postdata", JSON.stringify(trigger), apiparam)
            .subscribe((res: any) => {
              this.visiblebutton = false;
            });
        } else {
          this.visiblebutton = true;
        }
      });
  }


}
