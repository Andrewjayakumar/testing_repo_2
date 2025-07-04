import { Component, OnInit, OnChanges } from '@angular/core';
import { ActivatedRoute,Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { DataService } from '../core/services/data.service';
import { AuthService } from "../core/authservice/auth.service";
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit, OnChanges {

  constructor(public route: ActivatedRoute, public _appService: DataService, private auth: AuthService, private router: Router) { }
  id: string;
  model: string;
  action: string;
  dataId: string;
  formBuilderJson: any;
  private _success = new Subject<string>();
  staticAlertClosed = false;
  successMessage: string;
  busy: Subscription;
  page: any;
  ngOnInit() {
    setTimeout(() => this.staticAlertClosed = true, 20000);
    this._success.subscribe((message) => this.successMessage = message);
    debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);

    this.route.params.subscribe(params => {
      //this.id = params['id'];
      //this.model = params['model'];
      //this.action = params['action'];
      //this.dataId = params['dataid'];
    });
    let currentUrl = this.router.url;

    var menu = this.auth.Menu;

    this.page = this.find(menu['Nav'], "app/organization");
    //this.GetMetadata(this.id);
  }
  ngOnChanges(id: any) {

    //this.route.params.subscribe(params => {
    //  this.id = params['id'];
    //  this.model = params['model'];
    //  this.action = params['action'];
    //  this.dataId = params['dataid'];
    //});
    //alert(this.action);
    //this.GetMetadata(this.id);

  }
  GetMetadata(id: string) {
    this.formBuilderJson = null
    let apiparam :any= {};
    apiparam.id = id;
    this.busy = this._appService.get("api/AppData/get", apiparam)
      .subscribe(
      (data:any) => {
        this.formBuilderJson = data;
        if (this.action == "get") {

          this.GetData();
        }


        //this.GetApplication();

      },
      err => {
        console.log(err);

      },
      () => {
        //console.log("done");
      }
      );
  }
  GetData() {
    let url = this.formBuilderJson.GetEndpoint;
    let apiparam :any = {};
    apiparam.Id = this.dataId;
    apiparam.type = this.formBuilderJson.ModelName;

    this.busy = this._appService.get(url).subscribe((data:any) => {
      if (data && data.Id) {
        this.formBuilderJson.ModelJson = data;

      }

    });
  }
  Action() {
    if (this.action == "add") {
      let apiparam :any = {};
      apiparam.type = this.formBuilderJson.ModelName;
      this.busy = this._appService.post(this.formBuilderJson.CreateEndpoint, JSON.stringify(this.formBuilderJson.ModelJson), apiparam)
        .subscribe(
        data => {

          this.alertSuccessMessage("data saved successfully.");
        },
        err => {
          console.log(err);
        },
        () => {

        }
        );
    }
    if (this.action == "get") {
      let apiparam:any = {};
      apiparam.type = this.formBuilderJson.ModelName;
      this.busy = this._appService.post(this.formBuilderJson.UpdateEndpoint, JSON.stringify(this.formBuilderJson.ModelJson), apiparam)
        .subscribe(
        data => {

          this.alertSuccessMessage("data saved successfully.");
        },
        err => {
          console.log(err);
        },
        () => {

        }
        );
    }
  }
  public alertSuccessMessage(msg: string) {

    this._success.next(msg);
  }
  find(source, url) {
    for ( var key in source) {
      var item = source[key];
      if (item.Url == url)
        return item;

      // Item not returned yet. Search its children by recursive call.
      if (item.children) {
        var subresult = this.find(item.children, url);

        // If the item was found in the subchildren, return it.
        if (subresult)
          return subresult;
      }
    }
    // Nothing found yet? return null.
    return null;
  }

}
