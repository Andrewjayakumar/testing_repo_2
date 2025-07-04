
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

// import { AuthService } from "../../core/authservice/auth.service";
import { Router } from '@angular/router';
import { UUID } from "angular2-uuid";
import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';
import { DBkeys } from '../../core/authservice/db-Keys';
import { FormControlService } from '../form-control.service';

@Component({
  selector: 'app-bookmark',
  templateUrl: './bookmark.component.html',
  styleUrls: ['./bookmark.component.scss']
})
export class BookmarkComponent implements OnInit {
  @Input() public data: any;
  @Input() public control: any;
  // @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  @Input() public AuthService: any;
  page: any;

  constructor(private router: Router,
    private localStorage: LocalStoreManager,
    private _controlService: FormControlService) {
    this.router.events.subscribe((val) => {
      // see also 
      let currentUrl = this.router.url;
      // alert(currentUrl);
      var menu = this.AuthService.Menu;

      this.page = this.find(menu['Nav'], currentUrl.substring(1));
    });
  }

  ngOnInit() {
  }
  addaction() {
    debugger;
    let currentUrl = this.router.url;
    if (this.control.bookmarkurl) {
      this.setParam();
      currentUrl = this.control.bookmarkurl;
    } else {
      if (currentUrl.indexOf('?') > -1) {
        currentUrl = currentUrl.split('?')[0];
      }
    }
    var menu = this.AuthService.Menu;

    this.page = this.find(menu['Nav'], currentUrl.substring(1));
    //this.router.events.subscribe((val) => {
    //  // see also 
    //  let currentUrl = this.router.url;
    //  // alert(currentUrl);

    //});
    var item = {
      "id": UUID.UUID(),
      "url": this.page.Url,
      "title": this.data[this.control.titlemodel] ? this.data[this.control.titlemodel] : this.page.Title,
      "subtitle": this.data[this.control.subtitlemodel] != 'undefined' && this.data[this.control.subtitlemodel] != null ? this.data[this.control.subtitlemodel] : this.control.subtitlemodel,
      "icon": this.control.icon ? this.control.icon : "",
      "params": this.page.Params

    };
    this.AuthService.AddtoBookmark(item);

  }
  find(source, url) {
    for (var key in source) {
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
  removebookmark() {
    var selectedBookmark;
    let currentUrl = this.router.url;
    if (this.control.bookmarkurl) {
      currentUrl = this.control.bookmarkurl;
    } else {
      if (currentUrl.indexOf('?') > -1) {
        currentUrl = currentUrl.split('?')[0];
      }
    }
    if (this.AuthService.bookmark) {
      const page = this._controlService.find(this.AuthService.Menu['Nav'], currentUrl.substring(1));
      if (page) {
        selectedBookmark = this.AuthService.bookmark.find(x => x.url === page.Url && JSON.stringify(x.params) == JSON.stringify(page.Params))
      }
    }
    if (selectedBookmark) {
      this.AuthService.RemoveBookmark(selectedBookmark);
    }
  }
  isbookmarked() {
    var isbookmarked = false;
    let currentUrl = this.router.url;
    if (this.control.bookmarkurl) {
      currentUrl = this.control.bookmarkurl;
    } else {
      if (currentUrl.indexOf('?') > -1) {
        currentUrl = currentUrl.split('?')[0];
      }
    }
    // const menu = this.auth.Menu;
    const bookmark = this.AuthService.bookmark ? this.AuthService.bookmark.filter(x => x.url == currentUrl.substring(1)) : [];
    // const page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
    if (bookmark && this.control.PrimaryKey) {
      bookmark.forEach(item => {
        const param = item.params.find(x => x.name.toLowerCase() === this.control.PrimaryKey.toLowerCase() && x.value == this.data[this.control.PrimaryKey]);
        if (param) {
          isbookmarked = true;
        }
      })
    }
    return isbookmarked;
  }
  setParam() {
    let menu: any = this.localStorage.getDataObject(DBkeys.Menu);
    var redirectUrl = this.control.bookmarkurl;


    if (menu) {
      var page: any = this._controlService.find(menu['Nav'], redirectUrl.substring(1));
      var currentUrl = this.router.url ? this.router.url : "/";
      if (currentUrl.indexOf('?') > -1) {
        currentUrl = currentUrl.split('?')[0];
      }
      var currentPage: any = this._controlService.find(menu['Nav'], currentUrl.substring(1));//this._controlService.deepcopy(menu).Nav.find(x => x.Url == currentUrl.substring(1));
      if (currentPage) {
        const activateParams = this._controlService.getQueryParams();
        //page.Params = [];
        currentPage.Params.forEach(_item => {
          var arr: any = {}
          let activeParam = activateParams.find(x => x[_item.name]);
          if (_item.name == this.control.PrimaryKey) {
            arr.name = _item.name;
            if (_item.value == "&")
              arr.value = this.data[_item.name];
            else
              arr.value = this.data[this.control.PrimaryKey];

            let _param = page.Params.find(x => x.name == _item.name);
            if (_param) {
              _param.value = arr.value;
            } else {
              page.Params.push(arr);
            }
          } else {
            if (_item.value == "&")
              _item.value = this.data[_item.name];

            let _param = page.Params.find(x => x.name == _item.name);
            if (_param) {
              _param.value = activeParam ? activeParam[_item.name] : _item.value;
            } else {
              page.Params.push(_item);
            }
          }
        });
      }
      this.localStorage.saveSyncedSessionData(menu, DBkeys.Menu);
    }
    //this.setValue(menu['Nav'], action.RedirectUrl.substring(_index), action);
    //if (page)
    //  page.Params.push({ "key": action.PrimaryKey, "value": this.data[action.PrimaryKey] });
  }
}
