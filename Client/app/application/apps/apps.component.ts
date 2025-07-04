import { Component, OnInit, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from "../../core/authservice/auth.service";
//import { FormControlService } from '../../forms/form-control.service';
import { Subject } from 'rxjs/Subject';
import { NgbModal, NgbModalOptions, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss']
})
export class AppsComponent implements OnInit, OnChanges, OnDestroy {
  ngOnChanges(changes: SimpleChanges): void {

    let currentUrl = this.router.url;

  }
  page: any;
  private unsubscribe: Subject<true> = new Subject<true>();
  actionDashboardMenu: boolean = false;

  constructor(public route: ActivatedRoute, private auth: AuthService, private router: Router,//, private _controlservice: FormControlService
   
  ) {
   // this.router.navigated = true;
    // override the route reuse strategy
    //this.router.routeReuseStrategy.shouldReuseRoute = function () {
    //  return false;
    //}

    //this.router.events.subscribe((evt) => {
    //  if (evt instanceof NavigationEnd) {
    //    // trick the Router into believing it's last link wasn't previously loaded
    //    this.router.navigated = false;
    //    // if you need to scroll back to top, here is the right place
    //    window.scrollTo(0, 0);
    //  }
    //});
    this.router.events
      .takeUntil(this.unsubscribe)
      .subscribe((val) => {
   
      // see also 
      let currentUrl = this.router.url.split("?");

      // alert(currentUrl);
      var menu = this.auth.Menu;
      if (currentUrl.length > 0 && (!this.page || this.page.Url !== currentUrl[0].substring(1))) {
        this.page = this.find(menu['Nav'], currentUrl[0].substring(1));
      }
    });
  }
  ngOnDestroy() {
    this.unsubscribe.next(true);
    this.unsubscribe.complete();
  }
  ngOnInit() {
    //if (this._controlservice._openedEditForm) {
    //  this._controlservice._toggleEditFormSidebar();
    //}

    // this.route.params.subscribe(params => {
    //  // alert(JSON.stringify(params));
    // });

    // alert(JSON.stringify(this.page));
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

}
