// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, NavigationExtras, CanLoad, Route } from '@angular/router';
import { AuthService } from './auth.service';
import { AccountService } from './account.service';

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {
    constructor(private authService: AuthService, private router: Router, private account: AccountService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {


        let url: string = state.url;
        return this.checkLogin(url);
    }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        return this.canActivate(route, state);
    }

    canLoad(route: Route): boolean {

        let url = `/${route.path}`;
        return this.checkLogin(url);
    }

    checkLogin(url: string): boolean {

      if (this.authService.isLoggedIn) {
        if (this.authService.isSessionExpired)
        {
          //this.authService.loginRedirectUrl = url;
          this.router.navigate(['/login']);
       
          //return false;
        }
            //if (url.indexOf("admin/user") > -1) {
            //    if (this.account.userHasAccessPermission("Users")) {
            //        return true;
            //    } else {
                   
            //    }
            //} else if (url.indexOf("admin") > -1) {
            //    if (this.account.userHasAccessPermission("Applications")) {
            //        return true;
            //    } else {
                   
            //    }
            //}
           // else {
                return true;
           // }


        }

        this.authService.loginRedirectUrl = url;
        this.router.navigate(['/login']);

        return false;
    }
}
