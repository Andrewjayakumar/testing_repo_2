import { Component, OnInit, AfterViewInit, ChangeDetectorRef, DoCheck, ViewChild, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { AddrecService } from '../addrec.service';
import { AddRecSharedService } from '../addrec.shared.service';
import { of } from 'rxjs/observable/of';
import { Observable, ObservableInput } from 'rxjs/Observable';
import { filter, distinctUntilChanged, switchMap, tap, catchError, debounceTime, concat, map, startWith } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { setTimeout } from 'timers';
import { LocalStoreManager } from '../../../../core/authservice/local-store-manager.service';
import { User } from '../../../../core/models/user.model';
import { unescapeIdentifier } from '@angular/compiler';



@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['../recdetails/recdetails.component.scss', '../add-requisition.component.scss']
})
export class ClientDetailsComponent implements OnInit {
  //typeaheads subscriptions
  public clientdatainput$ = new Subject<string | null>();
  public clientdata$: Observable<any>;
  isClientLoading = false;

  public endclientnameinput$ = new Subject<string | null>();
  public endclientname$: Observable<any>;
  isendclientloading = false;

  public msprojectslist$: Observable<any>;
  public projectinput$ = new Subject<string | null>();
  isProjectNameLoading = false;

  public hiringmanagerlist$: Observable<any>;
  public hiringmanagerinput$ = new Subject<string | null>();
  isHiringManagerLoading = false;
  selectedHiringMgr: any = {};

  public vendormanagerlist$: Observable<any>;
  public vendormanagerinput$ = new Subject<string | null>();
  isVendorManagerLoading = false;

  public recruiterList$: Observable<any>;
  public recruiterinput$ = new Subject<string | null>();
  isRecruiterNameLoading = false;

  public salesRepList$: Observable<any>;
  public salesRepinput$ = new Subject<string | null>();
  isSalesRepLoading = false;
  isClientInternalAccount = false;
  public insidesalesVmoList$: Observable<any>;
  public insidesalesVmoinput$ = new Subject<string | null>();

  engagementtypelist = [
    { "name": "SOW TOD (Non-Engg)", "value": "SOW TOD (Non-Engg)" },
    { "name": "Non-SOW TOD", "value": "Non-SOW TOD" }
  ];

  hiredcandidatestandardjobtitlehorizonList:any=[];
  isInsideSalesLoading = false;
  isVmoLoading = false;
  isHiringMangerMandatory = false;
  isRequisitionCancelled = false;
  isHiringManagerDisabled = false;
  isEngangementTypeDisabled = false;
  @Input('currentmode')
  mode: string = 'add';

  @Input('deliverymodelid')
  deliverymodelid: any = null;


  @ViewChild('clientDetailForm') form: any;

  @Output('onReset')
  resetClicked: EventEmitter<string> = new EventEmitter();

  @Output('onCancel')
  cancelClicked: EventEmitter<string> = new EventEmitter();

  eventsSubject: Subject<void> = new Subject<void>();

  /*
      @Output('createClicked')
      createClicked: EventEmitter<any> = new EventEmitter();
  */
  @Output()
  onValidCheck: EventEmitter<any> = new EventEmitter();

  @Input('resetCreateNew')
  resetCreateNew: boolean = false;

  @Input('backClick') isBackClicked: boolean = false;

  @Input() msprojectidparam: number = null;

  busy: Subscription;
  public clientLobOptions: any = null;
  isClientLobLoading = false;
  public regionOptionsList: any;
  selectedregionObj = {};
  clientsList: any;
  public DMList = [];
  public createBtnClicked: boolean = false;
  disableITSSFlag: boolean;
  linkedOpportunityList: any;
  smclientcode: any;
  projectmode: boolean = false;
  disableOpportunity: boolean = false;
  showbandlevel: boolean = false;
  bandlevelDetails: any;
  experienceLevel: string;
  userid: any;
  expLevelDetails: any;
  bandlevelDetailsFilter: any;
  experienceLevelList:any;
  deliverymodel:any;


  constructor(private recservice: AddrecService, private cd: ChangeDetectorRef, private sharedservice: AddRecSharedService, private localStorage: LocalStoreManager) {
    this.initializeTypeAheads();
    let current_user = this.localStorage.getData('current_user');
    if (current_user.email) {
      this.userid = current_user.email.split('@')[0];

    }

  }


  public typeaheadLoading = false;
  public labeldelay: boolean = true;

  public model = {
    //  "vasbulk":false,
    "itss": false,
    "jump": false,
    "sow":false,
    "clientid": null,
    "clientname": "",
    "endclientname": null,
    "clientlob": null,
    "clientlobid": null,
    "hiringmanagerid": null,
    "hiringmanageremail": null,
    "hiringmanagerphone": null,
    "hiringmanagername": null,
    "vendorid": null,
    "vendorname": "",
    "vendoremail": "",
    "vendorphone": "",
    "regionid": null,
    "projectname": null,
    "msprojectid": null,
    "interviewtimeslots": [],
    "managerinterviewslots": [],
    "salesnotes": "",
    "deliverycomments": "",
    "recruitername": null,
    "salesrepid": null,
    "insidesales": null,
    "vmo": null,
    "practicetype": null,
    "attachments": "",
    "mspstatusid": null,
    //   "mspstatus": null,
    "opportunityname": null,
    "opportunityid": null,
    "opportunityowner": null,
    "brandlevelid": null,
    "engagementtype": null,
    "hiredcandidatestandardjobtitlehorizonid":null,
    "hiredcandidateexperiencelevelid":null
  };

  public mask = [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  // public mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  mspstatusArray = [];




  ngOnInit() {
    this.getBandlevelData();
    // this.initializeTypeAheads();
    this.getExperienceLevel();
    this.getLinkedOpportunity(this.smclientcode);
    this.labeldelay = true;


    this.recservice.getMSPStatusValues().subscribe(
      (res) => {

        let resP = JSON.parse(res._body);
        this.mspstatusArray = resP.response ? resP.response.mspstatus : []
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.resetCreateNew && changes.resetCreateNew.currentValue) {
      this.form.reset();
      this.createBtnClicked = false;
      this.sharedservice.createButtonClicked = false;
      this.resetDataModel();
    }

    if (changes.isBackClicked && changes.isBackClicked.currentValue) {
      this.sharedservice.backClicked.next(this.form.valid);
      this.sharedservice.setFormData(this.model);
      if (this.form.valid) {
        this.onValidCheck.emit({ "isValid": true, "datamodel": this.model });
      }

    }
    /* to make Hiring manager name mandatory during Create requisition */
    if (this.mode === 'add' || this.mode === 'update') {
      if(this.experienceLevelList==null || this.experienceLevelList==undefined)
      this.getExperienceLevel();

      let keys = Object.keys(this.model);
      let updateModel = this.sharedservice.getFormData();
      keys.forEach(key => {
        if (updateModel[key] != null || updateModel[key] != "")
          this.model[key] = updateModel[key];
      });


      if(updateModel['brandlevelid'])
      this.showSelectedBandLevelExperience(updateModel['brandlevelid']);

      this.getDeliveryModels(updateModel['deliverymodelid'])

      if (updateModel['requisitiontypeid'] == 9 || updateModel['requisitiontypeid'] == 6) {
        this.isHiringMangerMandatory = true;
      } else {
        this.isHiringMangerMandatory = false;

      }

      if (this.model.opportunityname != "No Opportunity Available") {
        this.isHiringManagerDisabled = true;
      }
      else
      {
        this.isHiringManagerDisabled = false;

      }


      if (this.model.msprojectid) {
        this.disableOpportunity = true;
        this.isHiringManagerDisabled = true;
        this.model.engagementtype = updateModel['msprojecttype'];
        this.model.sow=updateModel['isclientsow'];

      } else {
        this.disableOpportunity = false;

        if(updateModel['isclientsow']!=undefined)
        {
          if (updateModel['isclientsow']) {
            this.isEngangementTypeDisabled = updateModel['isclientsow'];
            this.model.engagementtype = "SOW TOD (Non-Engg)";
            this.model.sow=updateModel['isclientsow'];
          }
          else
          {
           this.isEngangementTypeDisabled=false;
           this.model.sow=updateModel['isclientsow'];
           this.model.engagementtype = updateModel['engagementtype']!=null?updateModel['engagementtype']:"Non-SOW TOD"
          }
        }

      }

        this.getStandardJobTitleHorizon(updateModel['standardjobtitleid']);
    }

    // changes mode will not call after page loads, during edit after page loads changes will not reflect
    // it only calls one time during page load.
    if (changes.mode) {
      if (changes.mode.currentValue === 'update' && changes.mode.previousValue === 'add') {
        let keys = Object.keys(this.model);
        let updateModel = this.sharedservice.getFormData();
        keys.forEach(key => {
          if (updateModel[key] != null || updateModel[key] != "")
            this.model[key] = updateModel[key];
        });
        this.getDeliveryModels(updateModel['deliverymodelid'])

        if (updateModel['requisitiontypeid'] == 9 || updateModel['requisitiontypeid'] == 6) {
          this.isHiringMangerMandatory = true;
        } else {

          this.isHiringMangerMandatory = false;

        }


        if (updateModel['clientname']) {
          //let currentmanager = [{ "hiringmanagername": updateModel['hiringmanagername'], "hiringmanagerid": updateModel['hiringmanagerid'] }];
          let currentClientObj =
          {
            "clientcode": updateModel['clientid'],
            "clientname": updateModel['clientname'],
            "smclientcode": updateModel['smclientcode']
          };


          /*
          if (updateModel['assignedto']) {
              this.model.recruitername.push(updateModel['assignedto']);
          } */

          this.model.recruitername = updateModel['recruitername'] ? updateModel['recruitername'] : null;


          this.isRequisitionCancelled = updateModel['statusid'] === 2 || updateModel['statusid'] === 3;


          this.OnClientChanged(currentClientObj, updateModel);

        }

        if (updateModel['msprojectid'] && updateModel['itss']) {


          this.setITSSProjectandPracticeTower(updateModel['msprojectid']);


        }
        if (updateModel['hiringmanagerid'] && updateModel['hiringmanagername']) {
          this.getLinkedOpportunity(updateModel['smclientcode']);

        }
        if (updateModel['msprojectid']) {
          this.getProjectDetailsByProjectname(updateModel['msprojectid']);
        } else {

        }

        this.isClientInternalAccount=updateModel['isclientinternalaccount'];

      }

    }

    if (this.mode !== 'update' && this.msprojectidparam) {
      this.model.msprojectid = this.msprojectidparam;

      this.setITSSProjectandPracticeTower(this.msprojectidparam);


    }
    
    if(changes.deliverymodelid)
      {
  
  
        this.recservice.getDeliveryModels()
        .subscribe(res => {
          // debugger;
          let response = JSON.parse(res._body)['response'];
          var deliveryModelList = response ? response : [];
          const matchedModel = deliveryModelList.find(item => item.deliverymodelid == changes.deliverymodelid.currentValue);
          this.deliverymodel = matchedModel ? matchedModel.deliverymodelname : null;

          this.linkedOpportunityList = [];
          this.getLinkedOpportunity(this.smclientcode);
  

        },
          err => {
            console.error("Couldnt fetch Delivery Models" + err);
          });
  
  
  
      }



  }

  resetDataModel() {
    this.model["clientid"] = null;
    this.model.clientname = "";
    this.model.endclientname = null;

    this.model["itss"] = false;
    this.model["jump"] = false;
    this.model["sow"] = false;
    this.model["clientlobid"] = null;
    this.model["hiringmanagerid"] = null;
    this.model.hiringmanagername = null;
    this.model.vendorname = "";
    this.model.vendorid = null;
    this.model["regionid"] = null;
    this.model["projectname"] = null;
    this.model["reqassignedto"] = null;
    this.model["reqassignedto"] = null;
    this.model["salesrepid"] = null;
    this.model["vmo"] = null;
    this.model["practicetype"] = null;
    this.model["interviewtimeslots"] = [];
    this.model["managerinterviewslots"] = [];
    this.model.mspstatusid = null;
    this.model.msprojectid = null;
    this.model.opportunityid = null;
    this.model.opportunityowner = null;
    this.model.engagementtype = null;
    this.model.hiredcandidatestandardjobtitlehorizonid = null;
    this.model.hiredcandidateexperiencelevelid = null;

  }



  ngOnDestroy() {
    this.clientdatainput$.unsubscribe();
    this.hiringmanagerinput$.unsubscribe();
    this.salesRepinput$.unsubscribe();
    this.recruiterinput$.unsubscribe();
    this.insidesalesVmoinput$.unsubscribe();
    this.projectinput$.unsubscribe();
    this.vendormanagerinput$.unsubscribe();


  }

  initializeTypeAheads() {

    this.clientdata$ = this.clientdatainput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchClientName(term, this.userid))

    );

    this.endclientname$ = this.endclientnameinput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchEndClientName(term, this.userid))

    );

    this.msprojectslist$ = this.projectinput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchITSSProjectName(term))

    );

    this.hiringmanagerlist$ = this.hiringmanagerinput$.pipe(
      //filter(t => t && t.length > 2),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchHiringManagerFrmSalesforce(term)),

    );


    this.vendormanagerlist$ = this.vendormanagerinput$.pipe(
      //filter(t => t && t.length > 2),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchHiringManager(term))

    );

    this.recruiterList$ = this.recruiterinput$.pipe(
      //filter(t => t && t.length > 2),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchRecruiters(term))

    );

    this.salesRepList$ = this.salesRepinput$.pipe(
      //filter(t => t && t.length > 2),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchSalesRep(term))

    );

    this.insidesalesVmoList$ = this.insidesalesVmoinput$.pipe(
      //filter(t => t && t.length > 2),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchInsideSalesVmo(term))

    );






  }
  getDeliveryModels(deliveryModelID){

    if(this.deliverymodel==undefined)
    {
      let updateModel = this.sharedservice.getFormData();
      deliveryModelID=updateModel['deliverymodelid']
    }
    this.recservice.getDeliveryModels()
    .subscribe(res => {
      // debugger;
      let response = JSON.parse(res._body)['response'];
      var deliveryModelList = response ? response : [];
      const matchedModel = deliveryModelList.find(item => item.deliverymodelid == deliveryModelID);
      this.deliverymodel = matchedModel ? matchedModel.deliverymodelname : null;

      this.getLinkedOpportunity(this.smclientcode);

    },
      err => {
        console.error("Couldnt fetch Delivery Models" + err);
      });

  }
  getStandardJobTitleHorizon( standardjobtitleid:any)
  {
    this.recservice.GetStandardRolesHorizonsAsync(standardjobtitleid,null).subscribe(
      (res) => {
        if (JSON.parse(res._body)['response']['standardroleHorizons']) {
          this.hiredcandidatestandardjobtitlehorizonList = JSON.parse(res._body)['response']['standardroleHorizons'];
        }
       
         },
      err => {
        console.log("Error in fetching skills");
      }
    );
  }
  searchHiringManager(term: string): any {

    if (!term && !this.model.clientid)
      return of([]);
    this.isHiringManagerLoading = true;
    const clientname = this.model.clientid ? this.model.clientid : "";
    return this.recservice.getHiringManager(clientname, term).pipe(
      map((res: any) => {
        this.isHiringManagerLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response : []
      },
        () => {
          this.isHiringManagerLoading = false;
        })

    );
  }

  //get the data from the sales force
  searchHiringManagerFrmSalesforce(term: string): any {


    if (term && this.model.clientid) {
      this.isHiringManagerLoading = true;

      // const clientname = this.model.clientid ? this.model.clientid : "";
      return this.recservice.searchHiringManagerFrmSalesforce(this.smclientcode, term).pipe(
        map((res: any) => {
          this.isHiringManagerLoading = false;
          let resP = JSON.parse(res._body);
          return resP.response ? resP.response.managerlist : []
        },
          () => {
            this.isHiringManagerLoading = false;
          })

      );
    } else {


      return of([]);
    }
  }


  //To clear the Dropdown lists of Hiring Manager after selection
  resetHiringManagerList(): void {
    this.hiringmanagerlist$ = this.hiringmanagerinput$.pipe(
      switchMap((term: string) => {
        return this.searchHiringManagerFrmSalesforce(term);
      })
    );
  }


  searchClientName(term: string, userid: string): ObservableInput<any> {
    if (!term)
      return of([]);

    this.isClientLoading = true;
    return this.recservice.getClientName(term, userid).pipe(
      catchError(() => of([])),
      map((res: any) => {
        this.isClientLoading = false;
        let resP = JSON.parse(res._body);
        if (resP.response && resP.response.clients && resP.response.clients.length > 0) {
          this.smclientcode = resP.response.clients[0].smclientcode;
        }
        return resP.response ? resP.response.clients : [];
      })
    );
  }


  searchEndClientName(term: string, userid): ObservableInput<any> {
    if (!term)
      return of([]);

    this.isendclientloading = true;
    return this.recservice.getClientName(term, userid).pipe(
      catchError(() => of([])),
      map((res: any) => {
        this.isendclientloading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.clients : [];
      })
    );
  }


  searchITSSProjectName(term: any): any {
    if (!term)
      return of([]);

    this.isProjectNameLoading = true;
    return this.recservice.getProjectName(term, this.model.clientid).pipe(
      map((res) => {
        this.isProjectNameLoading = false;
        let resP = JSON.parse(res._body);
        if (resP.response.relatedprojectnames) {
          this.getProjectDetailsByProjectname(resP.response.relatedprojectnames[0].msprojectid);

        }
        return resP.response ? resP.response.relatedprojectnames : []
      })

    );
  }

  searchRecruiters(term: string): ObservableInput<any> {

    if (!term)
      return of([]);

    this.isRecruiterNameLoading = true;
    const clientid = this.model.clientid;
    return this.recservice.getRecruitersList(term, clientid).pipe(
      map((res: any) => {
        this.isRecruiterNameLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response : [];
        //return res.response? res.response : []
      })

    );
  }

  searchSalesRep(term: string): ObservableInput<any> {
    if (!term)
      return of([]);

    this.isSalesRepLoading = true;
    return this.recservice.getSalesRepList(term).pipe(
      map((res: any) => {
        this.isSalesRepLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response : [];
      })

    );
  }

  searchInsideSalesVmo(term: string): ObservableInput<any> {
    if (!term)
      return of([]);

    this.isInsideSalesLoading = true;

    return this.recservice.getInsideSalesorVMO(term).pipe(
      map((res: any) => {
        this.isInsideSalesLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response : [];
      })

    );
  }


  getClientNames(term: any) {
    return this.recservice.getClientName(term, this.userid);
  }

  modelCheckboxChange(event, value) {
    this.model[value] = event;
  }


  OnClientChanged(event, updateReqModel?) {
    //this.smclientcode = event.smclientcode
    if (event === undefined) {
      this.isClientInternalAccount=false;


      this.model["hiringmanageremail"] = null;
      this.model["hiringmanagerphone"] = null;
      this.model["hiringmanagername"] = null;
      this.model["opportunityname"] = null;
      this.model['endclientname'] = null;
      this.model['engagementtype'] = null;

      this.linkedOpportunityList = [];
      this.model.sow=false;



    }
    else {

      this.model.clientname = event ? event.clientname : null;
      this.model.endclientname = event ? event.clientname : null;
      this.isClientInternalAccount=event ? event.internalaccount : false;

      if (event.issow) {
        this.model.engagementtype = "SOW TOD (Non-Engg)"
        this.isEngangementTypeDisabled = true;
      }
      else
      {
        
        this.model.engagementtype = "Non-SOW TOD";
        this.isEngangementTypeDisabled = false;
      }
      this.model.sow=event.issow;

      if (event.smclientcode) {

        this.getLinkedOpportunity(event.smclientcode);
        this.smclientcode = event.smclientcode;
      } else {

        this.model.opportunityname = null

      }




      // Set Region

      this.setRegionByClient(updateReqModel == null || updateReqModel == undefined ? { clientid: this.model.clientid } : updateReqModel);


      this.clientdatainput$.next();
      this.getClientLOB(this.model.clientid);

      if (event && event.itss) {
        this.model.itss = true;
        this.disableITSSFlag = true;
      } else if (this.msprojectidparam) {
        this.model.itss = true;
        this.disableITSSFlag = true;
      }
      //if (event && event.issow) {

      //    this.model.vasbulk = true;
      //    this.onSowSwitch(this.model.vasbulk);
      //} else
      //    this.model.vasbulk = false;
      //    this.onSowSwitch(this.model.vasbulk);

    }

  }
  setRegionByClient(updateReqModel?) {

    if (!updateReqModel.clientid) {
      this.model.regionid = null;

      return;
    }

    this.recservice.getRegionByClient(updateReqModel.clientid).subscribe(
      (res) => {
        let response = JSON.parse(res._body)['response'];
        this.regionOptionsList = response ? response : [];

        if (this.mode == 'add')
          this.model.regionid = response ? response[0].id : '';
        else {
          this.model.regionid = updateReqModel.regionid;
        }

      },
      (err) => {
        console.log('error in retreiving Region');
      }
    );



  }



  getClientLOB(clientname?) {
    this.isClientLobLoading = true;
    if (!clientname)
      clientname = "";
    this.recservice.getClientLOBOptions(clientname).
      subscribe(
        (res: any) => {

          let response = JSON.parse(res._body)['response'];
          //JSON.parse(res._body)['response'];
          this.clientLobOptions = response ? response : [];
          this.isClientLobLoading = false;
        },
        err => {
          console.log("Error in fetching Client LOB");
          this.isClientLobLoading = false;
        }
      );
  }

  SetManagerDetails(type, event) {

    if (event) {

      let managerid;
      this.resetHiringManagerList();
      if (type == 'hiring') {
        if (event.hiringmanageremail || event.hiringmanagerphone) {

          this.model.hiringmanageremail = event.hiringmanageremail;
          this.model.hiringmanagerphone = event.hiringmanagerphone;

        } else {

          this.model.hiringmanageremail = null;
          this.model.hiringmanagerphone = null;

        }

        this.model.hiringmanagerid = event.hiringmanagerid;

        // managerid = this.model.hiringmanagerid;
        // get the linked opportunity if hiring manager id present
        if (managerid) {
          this.getLinkedOpportunity(managerid);
        }

        this.model.hiringmanagername = event ? event.hiringmanagername : null;
        if (!event || !event.hiringmanagername) {
          this.model.hiringmanageremail = null;
          this.model.hiringmanagerphone = null;
        }
      } else {
        managerid = this.model.vendorid;
        this.model.vendorname = event.hiringmanagername;
        if (!event || !event.hiringmanagername) {
          this.model.vendoremail = null;
          this.model.vendorphone = null;
        }
      }
      // DOnt Call APIs to fetch email and phone if managername is empty string
      if (!event || !event.hiringmanagername)
        return of([]);

    } else {
      this.model.hiringmanageremail = null;
      this.model.hiringmanagerphone = null;
    }

    //this.recservice.getHiringManagerDetails(managerid).subscribe(
    //  (res: any) => {      

    //        let response = JSON.parse(res._body)['response'];
    //    //
    //    if(type=='hiring'){
    //    this.model.hiringmanageremail = response.hiringmanageremail;
    //    this.model.hiringmanagerphone = response.hiringmanagerphone;
    //    } else {
    //      this.model.vendoremail = response.hiringmanageremail;
    //    this.model.vendorphone = response.hiringmanagerphone;
    //    }
    //  },
    //  err => {
    //      console.log("Error in fetching Hiring Manager");
    //  }
    //);
  }

  getLinkedOpportunity(managerid) {

    if(this.deliverymodel!=undefined)
    {
      this.recservice.getlinkedOpportunities(managerid,this.deliverymodel).subscribe((res: any) => {
        if (JSON.parse(res._body)['response'])
          this.linkedOpportunityList = JSON.parse(res._body)['response']['opportunitylist'];
  
      },
        err => {
          console.log("Error in fetching Hiring Manager");
        }
      );
    }
    else
    {
      this.getDeliveryModels(this.deliverymodel)
    }

  }
  salesOrVmoChanged() {
    this.insidesalesVmoinput$.next("");
    //  this.insidesalesVmoinput$ = [];
  }


  setClientLobDetails(event) {

    this.model.clientlobid = event.id;
  }

  clearRecFormDetails(currentForm, name) {
    currentForm.form.reset();
    // this.form.reset();
    this.resetDataModel();
    this.resetClicked.emit(name);
    this.createBtnClicked = false;
    this.eventsSubject.next();
  }

  onCancelClicked() {
    this.cancelClicked.emit('clientdetails');
  }

  createRequisition(mode?: string) {
    this.createBtnClicked = true; //for form validation
    this.sharedservice.createButtonClicked = true; // flag to distinguish between create REq in details pae and Client page

    if (!this.form.valid)
      this.onValidCheck.emit({ "isValid": false });
    else if (this.form.valid)
      this.onValidCheck.emit({ "isValid": true, "datamodel": this.model, 'mode': mode ? mode : 'add' });

  }




  OnITSSProjectSelected(data) {
    if (data) {
      this.disableOpportunity = true;
      this.showbandlevel = false;
      this.getProjectDetailsByProjectname(data.msprojectid);
    } else {
      this.disableOpportunity = false;

    }
  }

  OnITSSProjectNameFocused() {

    this.msprojectslist$ = this.projectinput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchITSSProjectName(term)));


  }

  setITSSProjectandPracticeTower(msprojectid) {
    //in edit mode or project mode auto populated msproject details
    //set the itss flag to true by default
    this.model.itss = true;
    this.disableITSSFlag = true; // this is to disabled ITSS from being turnedoff .
    this.projectmode = true;
    let msprojectname = null;
    this.recservice.getMSProjectDetailsById(msprojectid).subscribe(
      (res) => {


        //handle response
        let response = JSON.parse(res._body).response[0];

        msprojectname = response.projectname;
        this.model.clientid = response.clientcode;
        this.model.clientname = response.clientname;
        this.model.opportunityname = response.opportunityname;
        this.model.opportunityowner = response.opportunityowner;
        this.model.opportunityid = response.opportunityid;
        this.smclientcode = response.smclientcode;
        this.model.hiringmanageremail = response.hiringmanageremail;
        this.model.hiringmanagername = response.hiringmanagername;
        this.model.hiringmanagerid = response.hiringmanagerid;
        this.model.hiringmanagerphone = response.hiringmanagerphone;
        this.model.engagementtype = response.projecttype;
        this.isEngangementTypeDisabled = true;
        if (this.model.opportunityid != 0)
          this.isHiringManagerDisabled = true;

        this.setRegionByClient({ clientid: this.model.clientid, regionid: this.model.regionid });
        this.getClientLOB(this.model.clientid);

        // this is to assign an Observable itself without disturbing typeahead binding.
        this.msprojectslist$ = this.searchITSSProjectName(msprojectname);
        //instantiate practice type dropdown
        this.getLinkedOpportunity(this.smclientcode);

      }
    );

  }


  getOpportunityID(val) {
    if (val) {

      this.model.opportunityowner = val.opportunityowner;
      this.model.opportunityid = val.opportunityid;
      this.sharedservice.gccOpportunityDetected.next(val.isGCCOpportunity);
      if (val.opportunityHiringManagerId)
        this.getHiringManagerBasedOnOpportunity(val.opportunityHiringManagerId);
      else {

        this.isHiringManagerDisabled = false;
        this.model.hiringmanagerid = null;
        this.model.hiringmanagername = null;
        this.model.hiringmanageremail = null;
        this.model.hiringmanagerphone = null;
      }

    } else {
      this.sharedservice.gccOpportunityDetected.next(val.isGCCOpportunity == undefined || val.isGCCOpportunity == null ? false : true);

      this.model.opportunityowner = ''; // Clear the value of Opportunity Owner
      this.isHiringManagerDisabled = false;
      this.model.hiringmanagerid = null;
      this.model.hiringmanagername = null;
      this.model.hiringmanageremail = null;
      this.model.hiringmanagerphone = null;
    }


  }

  //onSowSwitch(value){
  //  if(value == true){
  //    this.model.vasbulk = true;

  //  }else{
  //    this.model.vasbulk= false;

  //  }


  //}


  getHiringManagerBasedOnOpportunity(opportunityHiringManagerId) {
    this.isHiringManagerLoading = false;
    this.recservice.searchHiringManagerFrmSalesforce(this.smclientcode, "", opportunityHiringManagerId).subscribe(
      (res: any) => {
        let detail = JSON.parse(res._body)['response']['managerlist'];

        if (detail.length > 0) {
          this.isHiringManagerLoading = false;
          this.isHiringManagerDisabled = true;
          this.model.hiringmanagerid = detail[0].hiringmanagerid;
          this.model.hiringmanagername = detail[0].hiringmanagername;
          this.model.hiringmanageremail = detail[0].hiringmanageremail;
          this.model.hiringmanagerphone = detail[0].hiringmanagerphone;
        }
        else
          this.isHiringManagerLoading = false;

      },
      err => {
        this.isHiringManagerLoading = false;

      },)

  }


  //To get values of Opportunity on slection of project NAme
  getProjectDetailsByProjectname(msprojectid) {


    this.recservice.getMSProjectDetailsById(msprojectid).subscribe(
      (res) => {

        let response = JSON.parse(res._body).response[0];
        this.model.opportunityname = response.opportunityname;
        this.model.opportunityowner = response.opportunityowner;
        this.model.opportunityid = response.opportunityid;

        this.model.hiringmanageremail = response.hiringmanageremail;
        this.model.hiringmanagername = response.hiringmanagername;
        this.model.hiringmanagerid = response.hiringmanagerid;
        this.model.hiringmanagerphone = response.hiringmanagerphone;
        this.model.engagementtype = response.projecttype;

        this.isEngangementTypeDisabled = true;

        if (this.model.opportunityid != 0)
          this.isHiringManagerDisabled = true;

      }
    );

  }

  onBandLevelDetailsChange(e) {
    
  }

  onExpLevelDetailsChange(experiencelevel) {
    this.model.brandlevelid = null;
    this.fillBandLevelDetails(experiencelevel);
  }

  fillBandLevelDetails(experiencelevel: any) {
    this.bandlevelDetailsFilter = this.bandlevelDetails.filter(x => x.experiencelevel === experiencelevel);
  }

  fillExperienceLevel() {
    let updateModel = this.sharedservice.getFormData();
    const brandlevelidnew = updateModel["brandlevelid"];
    this.showSelectedBandLevelExperience(brandlevelidnew);
  }

  showSelectedBandLevelExperience(brandlevelid: any) {
   
    if(this.bandlevelDetails==null || this.bandlevelDetails == undefined)
      {
      this.getBandlevelData();
      }
      if(this.bandlevelDetails!==null && this.bandlevelDetails!==undefined)
      {
        const bandData = this.bandlevelDetails.filter(x => x.brandlevelid === brandlevelid);
        if (bandData && bandData.length > 0)
          this.experienceLevel = bandData[0].experiencelevel;
          this.fillBandLevelDetails(this.experienceLevel);
      }

    
  }

  getBandlevelData() {
    this.recservice.getBandlevelData().subscribe(
      (res) => {
        if (JSON.parse(res._body).response) {
          this.bandlevelDetails = JSON.parse(res._body).response['brandlevel'];
          this.expLevelDetails = Array.from(new Set(this.bandlevelDetails.map(x => x.experiencelevel)));

          this.fillExperienceLevel();
        }
      }
    );
  }
  getExperienceLevel() {
    this.recservice.getExperienceLevel().subscribe(
      (res) => {
        if (JSON.parse(res._body).response) {
          this.experienceLevelList = JSON.parse(res._body).response['experiencelevel'];
        }
      }
    );
  }

}
