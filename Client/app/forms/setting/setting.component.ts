declare var require;
import { Component, OnInit, Input } from '@angular/core';
import { TREE_ACTIONS, KEYS, IActionMapping } from 'angular-tree-component';
const _ = require('lodash');
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { DataService } from '../../core/services/data.service';
// import { AuthService } from '../../core/authservice/auth.service';
import { Subscription } from "rxjs/Subscription";
import { debounceTime } from "rxjs/operator/debounceTime";
import { Subject } from "rxjs/Subject";
import { debug } from 'util';
const actionMapping: IActionMapping = {
  mouse: {
    contextMenu: (tree, node, $event) => {
      $event.preventDefault();
    },
    dblClick: (tree, node, $event) => {
      if (node.hasChildren) {
        TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
      }
    },
    click: (tree, node, $event) => {
      this.SelectedNode = node.data;
      // alert(JSON.stringify(node.data));
      $event.shiftKey ? TREE_ACTIONS.TOGGLE_SELECTED_MULTI(tree, node, $event) : TREE_ACTIONS.TOGGLE_SELECTED(tree, node, $event);
    }
  },
  keys: {
    [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`)
  }
};
@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  @Input() public AuthService: any;
  private options: NgbModalOptions = { size: 'lg', windowClass: 'model-cw' };
  busy: Subscription;
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  public customTemplateStringOptions =
    {
      isExpandedField: 'expanded',
      idField: 'uuid',
      actionMapping,
      nodeHeight: 23,
      allowDrag: true,
      allowDrop: true,
      useVirtualScroll: false
    };
  public nodes: any = {

  };
  public MenuPropertiy: any = [];
  public MenuNode: any;
  public ContentForm: any = [];
  public ContentData: any;
  public SelectedNode: any;
  constructor(private modalService: NgbModal, private _appService: DataService) { }

  ngOnInit() {
    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);
    this.MenuPropertiy = [{ "id": "db952995-18a8-dc11-96db-8f9318f5efc5", "key": "Title", "Name": "Textbox", "label": "Title", "placeholder": "Title", "icon": "fa fa-text-width", "type": "textbox", "width": "6", "order": 1, "require": true, "showinlist": true, "addinfilter": false, "filterheader": "", "haschildren": false, "isTableView": false, "hasdatasource": false, "filterresult": false, "uuid": 7407947764019 }, { "key": "WebIcon", "Name": "Dropdown 2", "label": "Web Icon", "placeholder": "Web Icon", "icon": "fa fa-chevron-circle-down", "type": "dropdown2", "width": "6", "order": 1, "require": false, "showinlist": true, "haschildren": false, "isTableView": false, "hasdatasource": false, "allowbindingwithcontrols": false, "bindingwithothercontrols": [], "refreshfromparent": false, "parentcontrolkey": "", "apifieldforparentcontrol": "", "addinfilter": false, "filterheader": "", "autoselectfirstvalue": false, "textfield": "key", "valuefield": "value", "apiurl": "", "ApiParam": [], "optionlist": [], "storejsonnode": false, "selectiontype": "single", "defaulttext": "Select", "selectalltext": "Select All", "unselectalltext": "UnSelect All", "enablesearchfilter": true, "pullRight": false, "selectionLimit": null, "closeOnSelect": true, "maxHeight": "400px", "isLazyLoad": false, "from": "from", "search": "", "dynamictitlemaxitems": 9999999, "showcheckall": false, "showuncheckall": false, "id": "3319bd37-72a3-9d64-01d2-ba462ceff0a5", "filterresult": false, "uuid": 4617392543488, "description": "", "imageurl": "", "charlimit": null, "minimumselect": null, "enablecache": false, "errormsg": "", "showselectedcount": false, "searchtext": "", "enablecustomsearch": false, "addTag": false, "notFoundText": "", "hideSelected": false, "customlabel": false, "imagefield": "", "bgimg": "", "bgposition": "", "bgsize": "", "ResultApi": "api/service/geticonlist", "rawquery": "", "outputtype": "", "groupby": false, "groupbyfield": "", "selectablegroup": false, "ResultApiParam": [{ "key": "Icontype", "id": "e1efdb97-b932-3581-303d-6f5e2ad86daa", "value": "WebIcon" }], "api": "", "bindingqueryfield": "", "apiparam": [], "customoption": false, "ResultDisplayField": [], "actionview": "", "customActionAlign": "", "CustomAction": [] }, { "id": "545d3460-aaa4-92d1-b627-9edced1d541e", "key": "Breadcrumb", "Name": "Textbox", "label": "Breadcrumb", "placeholder": "Breadcrumb", "icon": "fa fa-text-width", "type": "textbox", "width": 6, "order": 2, "require": false, "showinlist": true, "addinfilter": false, "filterheader": "", "haschildren": false, "isTableView": false, "hasdatasource": false, "filterresult": false, "uuid": 2425184791698 }, { "key": "showinmenu", "Name": "Checkbox", "label": "Show in Menu", "placeholder": "Show in Menu", "icon": "fa fa-check-square-o", "type": "checkbox", "width": 6, "order": 1, "require": false, "Falsevalue": "", "Truevalue": "", "showinlist": false, "addinfilter": false, "haschildren": false, "isTableView": false, "hasdatasource": false, "uuid": 2911932294171, "id": "c0522501-8a48-4156-fbbb-5da383694c9b", "filterresult": false, "customvalue": "", "filterheader": "", "iscustomtext": false }, { "id": "43c83294-7885-4522-a2e0-6ab45da3421b", "key": "Url", "Name": "Textbox", "label": "Url", "placeholder": "Url", "icon": "fa fa-text-width", "type": "textbox", "width": "12", "order": 3, "require": false, "showinlist": true, "addinfilter": false, "filterheader": "", "haschildren": false, "isTableView": false, "hasdatasource": false, "filterresult": false, "uuid": 2910920967253 }, { "key": "roles", "Name": "Multi Select", "label": "Select or enter Roles", "placeholder": "Select or enter Roles", "showheader": false, "Panelheader": "", "icon": "fa fa-bars", "type": "multiselect", "width": "12", "order": 7, "textfield": "key", "require": false, "showinlist": false, "haschildren": false, "hasdatasource": true, "isTableView": false, "apiurl": "", "paramlist": [], "id": "71745dba-043c-440b-cebf-b8af87db07da", "filterresult": false, "uuid": 4655511690268, "enablecache": false, "minimumselect": null, "maximumselect": null }, { "key": "Params", "Name": "Grid", "label": "Parameters", "icon": "fa fa-table", "type": "grid", "width": 12, "order": 4, "viewtype": "grid", "headerfield": "", "Maxrow": 50, "require": false, "showinlist": false, "haschildren": true, "hasdatasource": true, "isTableView": false, "refresh": false, "children": [{ "id": "b51b8cb9-9d9f-73aa-7b59-f3ba545199a2", "key": "name", "Name": "Textbox", "label": "Name", "placeholder": "Name", "icon": "fa fa-text-width", "type": "textbox", "width": 6, "order": 1, "require": false, "showinlist": true, "addinfilter": false, "filterheader": "", "haschildren": false, "isTableView": true, "hasdatasource": false, "filterresult": false, "uuid": 4414676894779 }, { "id": "160a96ac-db76-51f6-c1ba-5646d8cfdb7d", "key": "value", "Name": "Textbox", "label": "Value", "placeholder": "Value", "icon": "fa fa-text-width", "type": "textbox", "width": 6, "order": 2, "require": false, "showinlist": true, "addinfilter": false, "filterheader": "", "haschildren": false, "isTableView": true, "hasdatasource": false, "filterresult": false, "uuid": 8718866803428 }], "addnewlabel": "", "id": "d7a16870-5f64-5704-2691-270e088cc44e", "filterresult": false, "uuid": 8606548098987 }];
    this.MenuNode = { "id": "1", "Title": "Menu Title", "WebIcon": "", "Breadcrumb": "", "Url": "", "showinmenu": true, "Params": [], "children": [], "Layout": { "Content": [] } };
    this.ContentForm = [{ "id": "c85e876b-ac4b-2360-e50a-04bd4240d481", "key": "Title", "Name": "Textbox", "label": "Title", "placeholder": "Title", "icon": "fa fa-text-width", "type": "textbox", "width": "12", "order": 1, "require": true, "showinlist": true, "addinfilter": false, "filterheader": "", "haschildren": false, "isTableView": false, "hasdatasource": false, "filterresult": false, "uuid": 601415562192 }, { "key": "formid", "Name": "Dropdown 2", "label": "Select Form", "placeholder": "Select Form", "icon": "fa fa-chevron-circle-down", "type": "dropdown2", "width": "12", "order": 2, "require": false, "showinlist": true, "haschildren": false, "isTableView": false, "hasdatasource": false, "allowbindingwithcontrols": false, "bindingwithothercontrols": [], "refreshfromparent": false, "parentcontrolkey": "", "apifieldforparentcontrol": "", "addinfilter": false, "filterheader": "", "autoselectfirstvalue": false, "textfield": "Formname", "valuefield": "Id", "apiurl": "api/appdata/list", "ApiParam": [{ "key": "sortfield", "id": "3cf81525-0c26-abc7-7a44-b2b0716107ec", "value": "formname" }, { "key": "sortorder", "id": "3abb2aa4-1bca-67a0-ecd4-8ccb6b796c27", "value": "Ascending" }], "optionlist": [], "storejsonnode": false, "selectiontype": "single", "defaulttext": "Select Form", "selectalltext": "Select All", "unselectalltext": "UnSelect All", "enablesearchfilter": true, "pullRight": false, "selectionLimit": null, "closeOnSelect": true, "maxHeight": "400px", "isLazyLoad": false, "from": "from", "search": "", "dynamictitlemaxitems": 9999999, "showcheckall": false, "showuncheckall": false, "id": "0820d199-4902-500e-ccca-486868517792", "filterresult": false, "uuid": 3850746841909 }, { "key": "access", "Name": "Radio List", "label": "Select View", "placeholder": "Select View", "showheader": false, "Panelheader": "", "icon": "fa fa-bars", "type": "radio", "direction": "horizontal", "width": "12", "allowbindingwithcontrols": false, "bindingwithothercontrols": [], "order": 3, "textfield": "key", "valuefield": "value", "require": true, "showinlist": false, "addinfilter": false, "filterheader": "", "haschildren": false, "hasdatasource": true, "isTableView": false, "allowother": false, "apiurl": "", "optionlist": [{ "key": "List", "id": "a85d6924-260d-b6b5-6e79-9d08c61c25d4", "value": "filter", "imageUrl": "", "populatejson": "" }, { "key": "Add", "id": "e615ce36-515c-f33c-1fef-92ec43f7be40", "value": "write", "imageUrl": "", "populatejson": "" }, { "key": "Edit", "id": "221bfd6d-332d-f46e-06e8-4e6192156a0a", "value": "edit", "imageUrl": "", "populatejson": "" }, { "key": "Read", "id": "58bc91b2-770c-11db-0536-9e507e5adcf9", "value": "read", "imageUrl": "", "populatejson": "" }], "id": "4c2f21e2-8945-d820-b7de-2e7381af13bf", "filterresult": false, "uuid": 9731036679187 }, { "key": "width", "Name": "Dropdown 2", "label": "Select Width", "placeholder": "Select Width", "icon": "fa fa-chevron-circle-down", "type": "dropdown2", "width": "12", "order": 4, "require": false, "showinlist": true, "haschildren": false, "isTableView": false, "hasdatasource": false, "allowbindingwithcontrols": false, "bindingwithothercontrols": [], "refreshfromparent": false, "parentcontrolkey": "", "apifieldforparentcontrol": "", "addinfilter": false, "filterheader": "", "autoselectfirstvalue": false, "textfield": "key", "valuefield": "value", "apiurl": "", "ApiParam": [], "optionlist": [{ "key": "1", "id": "f41a1edb-6a6b-2799-1158-48d691204bbc", "value": "1", "groupkey": "", "populatejson": "" }, { "key": "2", "id": "0dce8549-395a-acaf-00f0-4ece5d84846d", "value": "2", "groupkey": "", "populatejson": "" }, { "key": "3", "id": "406a0a3a-13ff-469d-673e-4975442cfdc8", "value": "3", "groupkey": "", "populatejson": "" }, { "key": "4", "id": "5e940b80-8c1b-163b-d59c-6e37b2dba08d", "value": "4", "groupkey": "", "populatejson": "" }, { "key": "5", "id": "d409cc1b-0cdf-a83e-6a29-5eb76806a23d", "value": "5", "groupkey": "", "populatejson": "" }, { "key": "6", "id": "1e3bffa5-b6e6-08cf-12b8-47316f2bb1d9", "value": "6", "groupkey": "", "populatejson": "" }, { "key": "7", "id": "59dff0cb-6180-4dc2-365f-065f5b5d273c", "value": "7", "groupkey": "", "populatejson": "" }, { "key": "8", "id": "1401e891-a738-f630-2c6a-0099a7fb3ad8", "value": "8", "groupkey": "", "populatejson": "" }, { "key": "9", "id": "e7b8ac86-bc66-f103-ece4-cbdea3aa2a89", "value": "9", "groupkey": "", "populatejson": "" }, { "key": "10", "id": "ffb74797-0c2d-b1be-bacd-10b78589e37a", "value": "10", "groupkey": "", "populatejson": "" }, { "key": "11", "id": "b875d9ea-5b10-cf34-6073-758f9a889997", "value": "11", "groupkey": "", "populatejson": "" }, { "key": "12", "id": "ec0b2ea6-9888-5024-1ea2-31fdd7fad564", "value": "12", "groupkey": "", "populatejson": "" }], "storejsonnode": false, "selectiontype": "single", "defaulttext": "Select Width", "selectalltext": "Select Width", "unselectalltext": "UnSelect All", "enablesearchfilter": true, "pullRight": false, "selectionLimit": null, "closeOnSelect": true, "maxHeight": "400px", "isLazyLoad": false, "from": "from", "search": "", "dynamictitlemaxitems": 9999999, "showcheckall": false, "showuncheckall": false, "id": "358e020f-149d-7f60-4545-4e2b619fe3d7", "filterresult": false, "uuid": 9374505247931 }, { "id": "c85e876b-ac4b-2360-e50a-04bd4240d481", "key": "DynamicTitle", "Name": "Textbox", "label": "Dynamic Title", "placeholder": "Dynamic Title", "icon": "fa fa-text-width", "type": "textbox", "width": "12", "order": 1, "require": true, "showinlist": true, "addinfilter": false, "filterheader": "", "haschildren": false, "isTableView": false, "hasdatasource": false, "filterresult": false, "uuid": 2649700184434 }, { "key": "rulewriteapi", "Name": "Rules Container", "label": "Bind Form in Add View", "icon": "fa fa-tachometer", "type": "rulescontainer", "width": 12, "order": 6, "hasdatasource": false, "haschildren": true, "children": [{ "key": "isBindformWriteMode", "Name": "Checkbox", "label": "Is Bind Form ", "placeholder": "Placeholder Text", "icon": "fa fa-check-square-o", "type": "checkbox", "width": "6", "order": 1, "require": false, "Falsevalue": "", "Truevalue": "", "showinlist": false, "addinfilter": false, "haschildren": false, "isTableView": false, "hasdatasource": false, "id": "10fe5d4c-a7f7-ff62-0c3e-6e67f785b881", "filterresult": false, "uuid": 7823591117555, "errormsg": "", "customvalue": "", "filterheader": "" }], "CustomAction": [], "actionview": "popover", "id": "80cd1d66-821f-651e-fb1d-92b036ff593f", "filterresult": false, "uuid": 3542253952768, "rules": [{ "control": ["access"], "operator": ["="], "value": "write", "action": "show" }] }, { "id": "c4185dc9-7420-194f-e207-fe1a43d07d4d", "key": "penalbg", "Name": "Textbox", "label": "Penal Background", "placeholder": "Exp. #000000", "icon": "fa fa-text-width", "type": "textbox", "width": "6", "order": 1, "require": false, "showinlist": true, "addinfilter": false, "filterheader": "", "haschildren": false, "isTableView": false, "hasdatasource": false, "help": "", "helpdirection": "top", "filterresult": false, "uuid": 7313526436967, "errormsg": "", "textonly": false, "storeaspagesearch": false, "charlimit": null, "islinkpagevarible": false, "pagevariblelink": "", "description": "", "imageurl": "", "bgimg": "", "bgposition": "", "bgsize": "", "AutoValidateOnLoad": false, "apiurl": "", "queryfield": "", "outputfield": "", "apiparam": [] }, { "id": "d8795ea1-2ecb-8f57-e7de-13aa892b1cf5", "key": "penalClass", "Name": "Textbox", "label": "Penal Class", "placeholder": "", "icon": "fa fa-text-width", "type": "textbox", "width": "6", "order": 2, "require": false, "showinlist": true, "addinfilter": false, "filterheader": "", "haschildren": false, "isTableView": false, "hasdatasource": false, "help": "", "helpdirection": "top", "filterresult": false, "uuid": 3983157324388, "errormsg": "", "textonly": false, "storeaspagesearch": false, "charlimit": null, "islinkpagevarible": false, "pagevariblelink": "", "description": "", "imageurl": "", "bgimg": "", "bgposition": "", "bgsize": "", "AutoValidateOnLoad": false, "apiurl": "", "queryfield": "", "outputfield": "", "apiparam": [] }, { "id": "5abbd2ec-21ed-2a04-6e4e-e9a24a32b62d", "key": "penalBodyClass", "Name": "Textbox", "label": "Penal Body Class", "placeholder": "", "icon": "fa fa-text-width", "type": "textbox", "width": 6, "order": 4, "require": false, "showinlist": true, "addinfilter": false, "filterheader": "", "haschildren": false, "isTableView": false, "hasdatasource": false, "help": "", "helpdirection": "top", "filterresult": false, "uuid": 7239670288322, "errormsg": "", "textonly": false, "storeaspagesearch": false, "charlimit": null, "islinkpagevarible": false, "pagevariblelink": "", "description": "", "imageurl": "", "bgimg": "", "bgposition": "", "bgsize": "", "AutoValidateOnLoad": false, "apiurl": "", "queryfield": "", "outputfield": "", "apiparam": [] }, { "key": "hideheader", "Name": "Checkbox", "label": "Hide Header ?", "placeholder": "", "icon": "fa fa-check-square-o", "type": "checkbox", "width": 6, "order": 3, "require": false, "Falsevalue": "", "Truevalue": "", "iscustomtext": false, "truetext": "", "falsetext": "", "showinlist": false, "addinfilter": false, "haschildren": false, "isTableView": false, "hasdatasource": false, "hideswitchtext": false, "help": "", "helpdirection": "top", "id": "c8a229d8-d0b3-956d-fd5e-cc4865d2f9e4", "filterresult": false, "uuid": 4921078860785, "errormsg": "", "customvalue": "yes", "description": "", "imageurl": "", "filterheader": "", "bgimg": "", "bgposition": "", "bgsize": "" }];
    this.ContentData = { "id": "f1b908a7-d5b7-4790-97ae-926e6a70e14c", "Title": "", "formid": "", "access": "", "width": "", "isBindformWriteMode": false, "DynamicTitle": "", "formid_node": { "formid_name": "", "formid_id": "" }, "penalbg": "", "penalClass": "", "hideheader": false, "penalBodyClass": "" };
    this.nodes = { "Type": "Top", "Logourl":"https://socialheitdir.blob.core.windows.net/crmtesting/socialheitnewstoryimagecollection/logo-cameo-8586618086140890369.png", "Isdefault": false, "timezone":"","dateformat":"MM/dd/yyyy hh:mm a", "Nav": [] };
    this.GetMenu();
  }
  public _openedAddMenuSidebar: boolean = false;
  public Isparent: boolean = false;

  closeAddMenuSidebar(tree: any) {

    if (!this.Isparent) {
      var menu = this.deepcopy(this.MenuNode);

      if (!this.nodes)
        this.nodes = [];
      this.SelectedNode.children.push(menu);

      tree.treeModel.update();
    }
    else {
      var menu = this.deepcopy(this.MenuNode);

      if (!this.nodes)
        this.nodes = [];
      this.nodes['Nav'].push(menu);
      // this.SelectedNode = menu;

      tree.treeModel.update();
    }
    this._openedAddMenuSidebar = !this._openedAddMenuSidebar;
  }

  Addchild(node: any) {
    this.MenuNode = { "id": "1", "Title": "Menu Title", "WebIcon": "", "Breadcrumb": "", "Url": "", "showinmenu": true, "Params": [], "children": [], "Layout": { "Content": [] } };
    this.SelectedNode = node.data;
    this.Isparent = false;
    this._openedAddMenuSidebar = !this._openedAddMenuSidebar;

  }
  AddMenu() {
    this.Isparent = true;
    this.MenuNode = { "id": "1", "Title": "Menu Title", "WebIcon": "", "Breadcrumb": "", "Url": "", "showinmenu": true, "Params": [], "children": [], "Layout": { "Content": [] } };

    this._openedAddMenuSidebar = !this._openedAddMenuSidebar;

  }
  SelectMenu(node: any) {

    this.SelectedNode = node.data;
  }
  EditMenu(node: any, tree: any, sidebar: any) {
    this._opened = !this._opened;
    this.sidebarType = sidebar;
    this.MenuNode = node.data;
    //this.modalService.open(content, this.options).result.then((result) => {

    //  tree.treeModel.update();
    //  //this.AuthService.Refreshmenu(this.nodes);
    //}, (reason) => {

    //});
  }
  public _opened: boolean = false;
  public sidebarType: any = "";
  _toggleSidebar() {
    this._opened = !this._opened;
  }
  closeSidebar(tree: any) {
    tree.treeModel.update();
    this._opened = !this._opened;
  }
  Save() {
    let apiparam: any = {};
    apiparam.type = "menu";
    this.nodes.id = "menu";
    this.busy = this._appService.post("api/application/update", JSON.stringify(this.nodes), apiparam)
      .subscribe((res: any) => {
        this.alertSuccessMessage("saved successfully Refresh your page for get menu.");
        this.AuthService.Refreshmenu(this.nodes);
      }
      );
  }
  public alertSuccessMessage(msg: string) {

    this._success.next(msg);
  }
  public GetMenu() {
    let url = "api/application/get";

    let apiparam: any = {};
    apiparam.Id = "menu";
    apiparam.type = "menu";

    this.busy = this._appService.get(url, apiparam).subscribe((data: any) => {
      if (data) {
        this.nodes = data;
      }

    });
  }
  Addlayout(sidebar: any, ) {
    this._opened = !this._opened;
    this.sidebarType = sidebar;
    var Content = this.deepcopy(this.ContentData);
    this.SelectedNode.Layout.Content.push(Content);
    //this.modalService.open(content, this.options).result.then((result) => {
    //  var Content = this.deepcopy(this.ContentData);
    //  this.SelectedNode.Layout.Content.push(Content);
    //  //this.AuthService.Refreshmenu(this.nodes);
    //}, (reason) => {

    //});

  }
  Editlayout(sidebar: any, tree: any, Data: any) {
    this._opened = !this._opened;
    this.sidebarType = sidebar;
    this.ContentData = Data;
    //this.modalService.open(content, this.options).result.then((result) => {
    //  tree.treeModel.update();
    //  //this.AuthService.Refreshmenu(this.nodes);
    //}, (reason) => {

    //});

  }
  Deletelayout(index: any, tree: any) {


    this.SelectedNode.Layout.Content.splice(index, 1);
    //this.AuthService.Refreshmenu(this.nodes);

  }
  Delete(source, uuid) {
    for (var key in source) {
      var item = source[key];
      if (item.uuid == uuid) {
        return;
      }


      // Item not returned yet. Search its children by recursive call.
      if (item.children) {
        var subresult = this.Delete(item.children, uuid);

        // If the item was found in the subchildren, return it.
        if (subresult)
          return subresult;
      }
    }
    // Nothing found yet? return null.
    return null;
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


    tree.treeModel.update();
    //this.AuthService.Refreshmenu(this.nodes);

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

    tree.treeModel.update();


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
  deepcopy<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }
}
