import { Component, OnInit, Input, Output, OnChanges } from '@angular/core';
import { DataService } from '../../core/services/data.service';
// import { AuthService } from '../../core/authservice/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { FormControlService } from '../form-control.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-timeline-ui',
  templateUrl: './timeline-ui.component.html',
  styleUrls: ['./timeline-ui.component.scss']
})
export class TimelineUiComponent implements OnInit, OnChanges {
  @Input() public data: any;
  @Input() public control: any = {};
  @Input() public AuthService;

  busy: Subscription;
  sidebar: boolean = false;
  isUnansweredonly: boolean = false;
  QA: any = {};
  ApiResult: any = [];
  title: any = "";
  description: any = "";
  mappingFields: any = [];
  constructor(private _router: Router,private _appService: DataService, private _controlService: FormControlService) { }

  UploadControls: any = []

  Message: any = { answered: "", unanswered: "", total: "" };

  get answered(): string {
    return this.ApiResult.filter(x => x.replied == true).length;
  }

  get unanswered(): string {
    return this.ApiResult.filter(x => x.replied == false).length;
  }

  get total() {
    return this.ApiResult.filter(x => x.Userrole == 'Reviewer').length;
  }
  isAdmin: boolean = false;
  isShowAddButton: boolean = false;

  ngOnInit() {

    this.isShowAddButton = this.AuthService.currentUser.roles.indexOf(this.control.createby.trim()) > -1 ? true : false;
    // this.AuthService.currentUser.roles.findIndex(role => role.toLowerCase().indexOf(this.control.createby.trim().toLowerCase()) > -1) ? true : false;
  }
  ngOnChanges() {
    this.setMappingFields();
    this.ApiCall();
  }
  uploadModel: any = {}
  setDocuments(documents: any) {
    this.uploadModel = {}
    this.UploadControls = [];
    var control = {
      "key": "attachment1",
      "Name": "Upload",
      "label": "Attachment1",
      "placeholder": "Upload",
      "collection": "File Collection",
      "uploadtype": "single",
      "icon": "fa fa-upload",
      "type": "Upload",
      "apiurl": "api/applicant/upload",
      "width": "12",
      "order": 5,
      "showinlist": false,
      "haschildren": false,
      "isTableView": false,
      "hasdatasource": true,
      "id": "f78d3164-8b36-64ce-8f8d-2cfbffg6ff0e",
      "uuid": 1038232389545
    }
    if (Array.isArray(documents)) {
      documents.forEach(doc => {
        var _control = JSON.parse(JSON.stringify(control));
        _control.key = doc;
        if (this.control.docuploadapi.length > 0) {
          _control.apiurl = this.control.docuploadapi;
        }
        _control.label = doc;
        this.UploadControls.push(_control)
        this.uploadModel[_control.key] = "";
      })
    } else {
      for (let i = 1; i <= 3; i++) {
        var _control = JSON.parse(JSON.stringify(control));
        _control.key = "doc" + i;
        _control.label = "doc" + i;
        if (this.control.docuploadapi.length > 0) {
          _control.apiurl = this.control.docuploadapi;
        }
        this.UploadControls.push(_control)
        this.uploadModel[_control.key] = "";
      }
    }
  }
  setMappingFields() {
    this.mappingFields = [];
    var arr: any = {};
    this.control.ResultDisplayField.forEach(item => {
      if (item.DisplayName.toLowerCase() == 'title') {
        this.title = item.BindingField;
      } else if (item.DisplayName.toLowerCase() == 'description') {
        this.description = item.BindingField;
      } else {
        arr = {};
        arr.key = item.DisplayName;
        arr.value = item.BindingField;
        this.mappingFields.push(arr);
      }
    });
  }
  isValidateErr: boolean = false;
  _opened: boolean = false;
  question: any;
  Validate(question: any = {}) {
    if (question[this.description].trim().length == 0) {
      this.isValidateErr = true;
    }
    else
      this.isValidateErr = false;

    if (question[this.title].trim().length == 0) {
      this.isValidateErr = true;
    }
    else
      this.isValidateErr = false;

    if (this.isValidateErr == false) {
      this._opened = !this._opened
      this.savetimeline(question);
    }
  }
  isAdminfun(item) {
    debugger;
    var admin = true;
     admin = (item && this.AuthService.currentUser.roles.indexOf(item['Userrole']) > -1) ? false : false;
    //return item && this.AuthService.currentUser.id == item[this.control.Userid] && Array.isArray(this.AuthService.currentUser.roles) && this.AuthService.currentUser.roles.findIndex(role => role.toLowerCase().indexOf(this.control.createby.trim().toLowerCase()) > -1) ? true : false;
    return admin;
  }
  setQuestion(item: any, action: string = '') {

    this.isAdmin = item && this.AuthService.currentUser.id == item['UserId'] && Array.isArray(this.AuthService.currentUser.roles) && this.AuthService.currentUser.roles.indexOf(this.control.createby.trim()) > -1 ? true : false;
    //this.isAdmin = item && this.AuthService.currentUser.id == item[this.control.Userid] && Array.isArray(this.AuthService.currentUser.roles) && this.AuthService.currentUser.roles.findIndex(role => role.toLowerCase().indexOf(this.control.createby.trim().toLowerCase()) > -1) ? true : false;

    if (action == 'reply') {
      var question = JSON.parse(JSON.stringify(item));
      this.question = question;
      this.question[this.description] = "";
      //this.question[this.title] = question[this.title];
      //this.question[this.description] = "";
    } else if (action == 'new') {
      this.question = {};
      this.question[this.title] = this.data['assetId'];
      this.question[this.description] = "";
    } else {
      this.question = JSON.parse(JSON.stringify(item));
    }
  }
  savetimeline(question) {
    let url = this.control.updateapi;
    let apiparam: any = {};

    this.control.updateapiparam.forEach(option => {
      apiparam[option.key] = option.value;
    })
    question[this.control.document] = [];
    for (let item in this.uploadModel) {
      question[this.control.document].push({ item: this.uploadModel[item] })
    }
    question['data'] = this.data;
    this.busy = this._appService.post(url, JSON.stringify(question), apiparam)
      .subscribe((res: any) => {

      },
        err => {
          console.log(err);
        },
        () => {
          //this.msg = "Post shared successfully";
          console.log("done!")
        }
      );
  }
  //isUnansweredonly: boolean = false;
  FilterTimeline() {
    if (this.isUnansweredonly == true) {
      return this.ApiResult.filter(x => x.replied == false);
    }
    else {
      return this.ApiResult;
    }
  }
  ApiCall() {

    var prop = this.control.timelinedate;
    let apiparam : any= {};
    this.control.ResultApiParam.forEach(item => {
      apiparam[item.key] = item.value;
    })

    this._controlService.setPageVarible(this.control.ResultApiParam, apiparam, this.AuthService);
    if (this.control.rawquery) {
      debugger;
      var query = this.control.rawquery;
      let currentUrl = this._router.url ? this._router.url : "/";
      if (currentUrl.indexOf('?') > -1) {
        currentUrl = currentUrl.split('?')[0];
      }
      const menu = this.AuthService.Menu;
      const page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
      const activateParams = this._controlService.getQueryParams();
      this.control.ResultApiParam.forEach(option => {
        debugger;
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
    //apiparam.size = 500;
    this._appService.get(this.control.ResultApi, apiparam)
      .subscribe(
        (data: any) => {
          this.ApiResult = data.sort(function (a, b) { return (b[prop] > a[prop]) ? 1 : ((b[prop] < a[prop]) ? -1 : 0); });
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done")
        }
      );
  }

  getUrl(item) {
    return item && item.split('|').length > 1 ? item.split('|')[1] : "";
  }
  getName(item) {
    return item && item.split('|').length > 0 ? item.split('|')[0] : "";
  }
  getTimeline(questionId) {

    return this.ApiResult.filter(item => item.questionid == questionId);
  }
  getQuestion(questionid) {
    var data = this.ApiResult.filter(x => x.Id == questionid);
    if (data.length == 1)
      return data[0].Description;
    else
      return null;
  }
  isImagebyExt(fileName: string = "") {
    var lastIndex = fileName.lastIndexOf('.');
    var ext = lastIndex > 0 ? fileName.substr(lastIndex + 1).toLowerCase() : null;
    if (ext == "jpeg" || ext == "png" || ext == "jpg" || ext == "tiff" || ext == "bmp")
      return true;
    else
      return false;
  }
}
