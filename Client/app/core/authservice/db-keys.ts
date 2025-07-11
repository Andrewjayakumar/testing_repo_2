// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Injectable } from '@angular/core';

@Injectable()
export class DBkeys {

    public static readonly CURRENT_USER = "current_user";
    public static readonly USER_PERMISSIONS = "user_permissions";
    public static readonly ACCESS_TOKEN = "access_token";
    public static readonly ID_TOKEN = "id_token";
    public static readonly REFRESH_TOKEN = "refresh_token";
    public static readonly TOKEN_EXPIRES_IN = "expires_in";

    public static readonly REMEMBER_ME = "remember_me";


    public static readonly LANGUAGE = "language";
    public static readonly HOME_URL = "home_url";
    public static readonly THEME = "theme";
    public static readonly SHOW_DASHBOARD_STATISTICS = "show_dashboard_statistics";
    public static readonly SHOW_DASHBOARD_NOTIFICATIONS = "show_dashboard_notifications";
    public static readonly SHOW_DASHBOARD_TODO = "show_dashboard_todo";
    public static readonly SHOW_DASHBOARD_BANNER = "show_dashboard_banner";
    public static readonly Menu = "menu";
    public static readonly BookMarklist = "bookmark";
    public static readonly RETURNURL = "returnurl";
    public static readonly SELECTED_ROLE = "selectedrole";
    public static readonly SEARCH_QUERY = "search_query";

}
