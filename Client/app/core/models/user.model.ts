// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

export class User {
  // Note: Using only optional constructor properties without backing store disables typescript's type checking for the type
  constructor(id?: string, Fist_name?: string, ActiveGroup?: string, email?: string, groups?: string, phoneNumber?: string, roles?: string[], activerole?: string, Plan?: string, activerolename?: string, LastName?: string, FullName?: string) {

        this.id = id;
        this.Fist_name = Fist_name;
        this.ActiveGroup = ActiveGroup;
        this.email = email;
        this.groups = groups;
        this.phoneNumber = phoneNumber;
        this.roles = roles;
        this.activerole = activerole;
        this.Plan = Plan;
      this.activerolename = activerolename;
      
      this.devicename = this.getPropertyfromRoles(roles[0], "devicename");
      this.linenumber = this.getPropertyfromRoles(roles[0], "linenumber");
        this.Last_name = LastName;
        this.full_name = FullName;
      this.c2curl = this.getPropertyfromRoles(roles[0], "c2cwebdialerurl");
    }


    get friendlyName(): string {
        let name = this.Fist_name || this.Last_name;

        if (this.Fist_name)
            name = this.Fist_name + " " + name;

        return name;
    }


    public id: string;
    public Fist_name: string;
    public Last_name: string;
    public full_name: string;
    public ActiveGroup: string;
    public email: string;
    public upn: string;
    public groups: string;
    public phoneNumber: string;
    public isEnabled: boolean;
    public isLockedOut: boolean;
    public roles: any;
    public activerole: string;
    public Plan: string;
    public activerolename: string;
    public devicename: string;
    public linenumber: string;
    public c2curl: string;
    public w3access: string = '';
    public descriptionverify = false;
  public aidrivenuser = false;
  public allowrequisitioncreation = false;

    getPropertyfromRoles(rolesObjString, prop) {
        let rolesObj = {};
        if (rolesObjString) {
            rolesObj = JSON.parse(rolesObjString);
            return rolesObj[prop];
        } else
            return "";


    }
}
