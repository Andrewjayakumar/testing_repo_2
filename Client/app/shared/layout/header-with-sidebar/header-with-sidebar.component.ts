
declare var $: any;
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, Renderer2, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UtilityService } from '../../../core/services/utility.service';
import { DataService } from '../../../core/services/data.service';
import { AuthService } from '../../../core/authservice/auth.service';
import { AccountService } from '.././../../core/authservice/account.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';



@Component({
  selector: 'app-header-with-sidebar',
  templateUrl: './header-with-sidebar.component.html',
  styleUrls: ['./header-with-sidebar.component.scss']
})

export class HeaderWithSidebarComponent implements OnInit, AfterViewInit, OnDestroy {
  public isCollapsed: boolean = true;
  public Menu: any = null;
  isMenuIconClicked: boolean = false;


  isUserLoggedIn: boolean;
  busy: Subscription;
  selectedrole: any;
    showActivityLogPanel: boolean = false;
    @ViewChild('activityPane') activityPane: ElementRef;
   /** set activityPane(elRef: ElementRef) {
        this.activityPane = elRef;
    }**/
  //constructor(
  //    public tokens: AuthTokenService,
  //    public store: Store<AppState>,
  //    public accountService: AccountService,
  //    public translation: TranslateService,
  //    public utilityService: UtilityService,
  //    public appservice: DataService,
  //    private loggedInAction: LoggedInActions,
  //    private authReadyActions: AuthReadyActions,
  //) { }
  constructor(
    public accountService: AccountService,
    public utilityService: UtilityService,
    public appservice: DataService,
    public locationStrategy: LocationStrategy,
      private auth: AuthService,
    //  private localStorage: LocalStoreManager,
    public _router: Router,
      private _Location: Location,
      private changeDetectorRef: ChangeDetectorRef,
      private renderer: Renderer2,
      private _elementRef: ElementRef
  ) { }

  public ngOnInit(): void {
    //this.authState$ = this.store.select(state => state.auth);
    //this.CheckAuth();
    //Observable.interval(300000).subscribe(x => {
    //  this.CheckAuth();
    //});
    var locationStrategy: any = this.locationStrategy;
    this.isUserLoggedIn = this.auth.isLoggedIn;
    if (locationStrategy._platformLocation.pathname.indexOf("/auth-callback") >= 0
      || locationStrategy._platformLocation.pathname == "/login/Registered"
      || locationStrategy._platformLocation.pathname == "/login/reset"
      || locationStrategy._platformLocation.pathname == "/forgotpassword"
      || locationStrategy._platformLocation.pathname.indexOf("/resetpassword") >= 0
        || locationStrategy._platformLocation.pathname.indexOf("/action") >= 0
    || locationStrategy._platformLocation.pathname.indexOf("/submission") >0) {
      return;
    } else {
      if (!this.auth.isLoggedIn) {
        //this.auth.ActiveDirlogin();
        //if (this.locationStrategy._platformLocation.pathname != "/") {
        //  this._router.navigate(['/login', this.locationStrategy._platformLocation.pathname]);
        //} else
        //{
        this.utilityService.navigateToSignIn();
        //}
        // this._router.navigate("/login/requisitions");
        //this.utilityService.navigateToSignIn();
      }
    }
  }

  ngAfterViewInit() {
    // $('.custom-navbar').find('app-navigation').prev('a').addClass('sub d-flex');
    // $('.custom-navbar').find('app-navigation').prev('a').append('<i class="fa fa-angle-down ml-auto right-icon"></i>')

    $('body').on('click', ".custom-navbar .sub", function () {
      if (!$(this).hasClass('active')) {
        $(this).addClass('active');
        $(this).find('.fa-angle-down').removeClass('fa-angle-down').addClass('fa-angle-up');
        if (!$('.toggelMenu').hasClass('active')) {
          $('.toggelMenu').trigger("click");

        }
      } else {
        $(this).removeClass('active');
        $(this).find('.fa-angle-up').removeClass('fa-angle-up').addClass('fa-angle-down');
       


      }
      return false;
    });
    $('body').on('click', ".custom-navbar .nav-link", function () {
      if (!$(this).hasClass('sub') && $('.toggelMenu').hasClass('active')) {
        $('.toggelMenu').trigger("click");
      }
    });
    $('body').on("click", ".toggelMenu", function () {
      var targetId = '#' + $(this).attr('data-id');
    //  var parent = $(this).attr('data-parent');

      if (!$(this).hasClass('active')) {
        $(this).addClass('active');
        $(targetId).addClass('open');
        //$(parent).css({
        //  'padding-left': '250px'
        //});
        $('.custom-navbar').css({
          'width': '250px'
        });

      } else {
        $(this).removeClass('active');
        $(targetId).removeClass('open');
        //$(parent).css({
        //  'padding-left': '50px'
        //});
        $('.custom-navbar').css({
          'width': '50px'
        });

        $('.custom-navbar .sub.active').trigger("click");


      };
    });
    //$(document).bind('mousedown touchstart', function (e) {
    //  if ($(e.target).closest('.aside-sidebar, .toggelMenu').length === 0) {
    //    $(".toggelMenu.active").trigger("click");
    //  }
    //});
     
  }
  //end ngAfterViewInit
  RedirectToDashboard() {
    var Nav: any = this.auth.Menu['Nav'];
    var navigate = Nav && Nav.length > 0 ? Nav[0].Url : 'Home';
    this.utilityService.navigate(navigate);
  }
    Selectrole(event: any) {
    var data = { "role": event.roleid }
    this.appservice.post("api/service/SwitchRole", JSON.stringify(data))
      .subscribe(
          datares => {
              if (JSON.stringify(datares) === "{}") {
                  window.alert("You are not authorised User. Re-login and try again")
                  return;
              }
        this.auth.updateroles(null, event.roleid, event.rolename);
        this.auth.updatetoken(datares);
        this.auth.Savemenu();
      },
      err => {
        console.log(err);
      },
      () => {

      }
      );
  }
  //public CheckAuth()
  //{
  //    this.authState$.loggedIn = false;

  //    this.appservice.get("api/account/checksession")
  //        .subscribe(
  //        data => {
  //            if (data == 0) {

  //                this.utilityService.navigateToSignIn();
  //            } else
  //            {
  //                this.store.dispatch(this.loggedInAction.loggedIn());
  //                this.store.dispatch(this.authReadyActions.ready());
  //            }
  //        },
  //        err => {
  //            console.log(err);
  //        },
  //        () => {
  //            console.log("done")
  //        }
  //        );

  //}
  public toggleNav() {
    this.isCollapsed = !this.isCollapsed;
  }
  public GetMenu() {

    if (this.auth.isLoggedIn && JSON.stringify(this.Menu) != JSON.stringify(this.auth.Menu) && this.auth.Menu.Nav.length > 0) {
      this.Menu = this.auth.Menu;
      return true;
    } else if (this.Menu && this.auth.isLoggedIn && JSON.stringify(this.Menu) == JSON.stringify(this.auth.Menu)) {
      return true;
    } else {
      return false;
    }


  }
  public setLang(lang: any) {
    //  this.currentLanguage = lang;
    // this.translation.use(lang.locale);
  }

  public ngOnDestroy(): void {
    // this.tokens.unsubscribeRefresh();
  }
  get ActiveGroup(): string {
    return this.auth.currentUser ? this.auth.currentUser.ActiveGroup : "";
  }


  get GroupList(): any[] {
    var groups = [];

    if (this.auth.currentUser) {
      groups = this.auth.currentUser.groups.split(",");
      return groups;
    } else {
      return groups;
    }
  }

  get canAccessStory() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("story") > -1
    //return true;//this.auth.currentUser.roles.indexOf("Reviewer") > -1;
  }
  get canAccessCampaign() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("campaign") > -1
    //return true;;//this.auth.currentUser.roles.indexOf("Reviewer") > -1;
  }
  get canAccessBulletin() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("bulletin") > -1
    //return true;;//this.auth.currentUser.roles.indexOf("Reviewer") > -1;
  }
  get canAccessPost() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("post") > -1
    //return true;//this.auth.currentUser.roles.indexOf("Reviewer") > -1;
  }
  get canAccessEngage() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("engage") > -1
    //return this.auth.currentUser.roles.indexOf("Tenant Admin") > -1 || this.auth.currentUser.roles.indexOf("Marketing Admin") > -1;
  }
  get canAccessPeople() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("people") > -1
    //return this.auth.currentUser.roles.indexOf("Tenant Admin") > -1 || this.auth.currentUser.roles.indexOf("Marketing Admin") > -1;
  }
  get canAccessAnalytics() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("analytics") > -1
    //return this.auth.currentUser.roles.indexOf("Tenant Admin") > -1 || this.auth.currentUser.roles.indexOf("Marketing Admin") > -1;
  }
  get canAccessProfile() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("profile") > -1
    //return this.auth.currentUser.roles.indexOf("Tenant Admin") > -1 || this.auth.currentUser.roles.indexOf("Marketing Admin") > -1;
  }
  get canAccessPayment() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("payment") > -1
    //return this.auth.currentUser.roles.indexOf("Tenant Admin") > -1;
  }
  get canAccessUsers() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("users") > -1
    //return this.auth.currentUser.roles.indexOf("Tenant Admin") > -1;
  }
  get canAccessGroups() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("group") > -1

  }

  get canAccessSales() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));

    return userPermissions.indexOf("sales") > -1

  }
  get canAccessactivity() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("activity") > -1

  }
  get canAccessdeal() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("deal") > -1

  }
  get canAccesscontact() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("contact") > -1

  }
  get canAccessorganization() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("organization") > -1

  }
  get canAccessleads() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("leads") > -1

  }
  ChangeGroup(group) {

    var per = this.auth.userPermissions;
    this.busy = this.appservice.post("api/admin/changegroup", group)
      .subscribe(
      data => {
        // alert("call");

        this.auth.updateGroup(group);
        window.location.reload();
        //this.auth.currentUser.ActiveGroup = group;
      },
      err => {


      },
      () => {

      }
      );
    }

    public showActivityLog(event) {
        this.showActivityLogPanel = !this.showActivityLogPanel;
      /**  if (this.showActivityLogPanel) {
           
            this.changeDetectorRef.detectChanges();
            setTimeout(() => { console.log(this.activityPane); }, 1);
            debugger;
           this.renderer.setStyle(this.activityPane.nativeElement, "width", "300px");
            this.activityPane.nativeElement.style.width = "300px";
        } **/
    }

    public pinCandidate(pinObject: any) {
       
        if (pinObject && pinObject.params) {
            let primaryKey = pinObject.params[0].name;
            let primaryKeyValue = pinObject.params[0].value;
            if (!this.isbookmarked(pinObject, primaryKey, primaryKeyValue)) {
                this.auth.AddtoBookmark(pinObject);
            }
           
        }
    }

    isbookmarked(item: any, primaryKey, primarykeyValue) {
        let itembookmarked = false;
       // debugger;
        if (this.auth.bookmark) {
            this.auth.bookmark.forEach(item => {
                const param = item.params.find(x => x.name === primaryKey && x.value === primarykeyValue);
                if (param) {
                    itembookmarked = item;
                }
            })
        }
        if (itembookmarked) {
            this.auth.RemoveBookmark(itembookmarked);
        }
        return itembookmarked;
    }
}
