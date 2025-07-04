import { Component, OnInit, OnChanges, Input, SimpleChanges, OnDestroy } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Subscription } from "rxjs/Subscription";
import { Router } from '@angular/router';
// import { AuthService } from "../../core/authservice/auth.service";
import { FormControlService } from '../form-control.service';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-dynamicform-init',
  templateUrl: './dynamicform-init.component.html',
  styleUrls: ['./dynamicform-init.component.scss']
})
export class DynamicformInitComponent implements OnInit, OnChanges, OnDestroy {
  hide: boolean = true;

  @Input() public Content: any;
  @Input() public param: any;
  @Input() public AuthService: any;

  FormJson: any;
  busy: Subscription;
  private unsubscribe: Subject<boolean> = new Subject<boolean>();
  constructor(private _appService: DataService,
    private _Router: Router,
    private _controlService: FormControlService) {
    this._controlService.pageRefresh$
      .takeUntil(this.unsubscribe)
      .subscribe(
        () => {
          this.FormJson = null;
          this.loadMetaData();
        }
      );
  }

  ngOnInit() {
    //var s=  this.AuthService.isSessionExpired;
  }
  ngOnChanges(changes: SimpleChanges): void {

    this.loadMetaData();

  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
    this.busy.unsubscribe();
  }
  loadMetaData() {
    if (Array.isArray(this.AuthService.bookmark) && this.AuthService.bookmark.length > 0) {
      this._controlService.ruleComponentDetectChanges();
    }
    let apiparam: any = {};
    this.FormJson = null;
    apiparam.id = this.Content.formid;
    this.busy = this._appService.get("api/AppData/get", apiparam, "none")
      .subscribe(
        (data: any) => {
          // debugger;
          let FormJson = this._controlService.deepcopy(data);
          if (this.Content.access == 'read' || this.Content.isBindformWriteMode) {
            this.GetData(FormJson);
          } else {
            this.FormJson = FormJson;
          }

        },
        err => {
          console.log(err);

        },
        () => {
          //console.log("done");
        }
      );
  }
  getTitle() {

    if (this.Content && this.Content.DynamicTitle) {
      if (this.FormJson) {
        if (this.FormJson.ModelJson) {
          return this.FormJson.ModelJson[this.Content.DynamicTitle];
        } else {
          return "";
        }

      } else {
        return "";
      }
    } else {
      return this.Content ? this.Content.Title : '';
    }


  }
  find(source: any, url: string) {
    for (var key in source) {
      var item: any;
      item = source[key];
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
  GetData(FormJson: any) {
    let url = FormJson.GetEndpoint;
    let apiparam: any = {};
    if (url) {
      FormJson.GetEndpointParams.forEach(option => {
        if (option.value) {
          apiparam[option.key] = option.value;
        } else {
          if (this.param) {
            this.param.forEach(formparam => {
              if (formparam.key == option.key) {
                apiparam[option.key] = formparam.value;
              }

            })
          }
        }

      })
      this._controlService.setPageVarible(FormJson.GetEndpointParams, apiparam, this.AuthService);

      if (FormJson.GetRawQuery) {
        var query = FormJson.GetRawQuery;
        FormJson.GetEndpointParams.forEach(option => {
          var param = "{{" + option.key + "}}";
          query.replace(param, option.value)

        })
        apiparam.query = query;
      }

      this.busy = this._appService.get(url, apiparam).subscribe((data: any) => {
        if (data) {

          if (Array.isArray(data)) {
            FormJson.ModelJson = data.length > 0 ? data[0] : FormJson.ModelJson;
          } else if (typeof data == "object") {
            FormJson.ModelJson = data;
          }

          this.FormJson = FormJson;

          this._controlService.ruleComponentDetectChanges();
        }

      });
    } else {
      this.FormJson = FormJson;
      this._controlService.ruleComponentDetectChanges();
    }
  }
}
