import { Component, OnInit, ViewChild, OnChanges, EventEmitter, AfterViewInit, ChangeDetectorRef, TemplateRef, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { AddrecService } from '../add-requisition/addrec.service';
import { AddRecSharedService } from '../add-requisition/addrec.shared.service';
import { of } from 'rxjs/observable/of';
import { Observable, ObservableInput } from 'rxjs/Observable';
import { filter, distinctUntilChanged, switchMap, tap, catchError, debounceTime, concat, map, startWith, takeUntil } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { setTimeout } from 'timers';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { CandidateService } from '../../candidate/candidate.service';
import { NgbModal, NgbDateStruct, NgbModalOptions, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalConfirm, RecCreationConfirmation } from '../requisition-modals.component';
import { Router, ActivatedRoute } from '@angular/router';
declare var $: any;
import { AcaDocumentsComponent } from '../add-requisition/recdetails/aca-documents/aca-documents.component';







@Component({
  selector: 'app-new-add-req',
  templateUrl: './new-add-requisition.component.html',
  styleUrls: ['./new-add-requisition.component.scss'],
  providers: [AddrecService, AddRecSharedService, CandidateService]
})
export class NewAddRequisitionComponent implements OnInit, OnChanges {
  busy: Subscription;
  @Input() public id;
  botResponseDetails: any;
  //typeaheads subscriptions
  public clientdatainput$ = new Subject<string | null>();
  public clientdata$: Observable<any>;
  isClientLoading = false;
  userid: any;
  smclientcode: any;
  public reqTypeList: any = [];
  public deliveryModelList: any = [];
  public currentRemoteIndex: number;
  public remotecitieslist: any = [];
  zipcodelist: any = [];
  public redepledbylist: any = [];
  public reqfulfillmentreasonlist: any = [];
  projectloblist: any = [];
  public status = null;
  public prioritylist;
  public qualifications = null;
  public stateWiseSearch = false;
  //isvasbulk = false;
  public circleList = null;
  public communityList = null;
  isCommunityLoading = false;
  standardJobTitleList: any = [];

  public remotezipcode: string = "";
  public remotecity: string = "";
  public skill: string = null;
  public expLevel: string = null;
  public citieslist: any = [];
  public traveltypelist: any = [];
  public reasonList: any = null;
  showChatGPTButton: boolean = false;
  public isMsProject: Boolean = false
  public isGCCOpportunity: boolean = false;
  public allowredeploymenthire: boolean = false;
  jobtitleid: any;
  standardskillmapping: any;
  standardroleHorizons: any;
  skillmappingId: any;
  public clientLobOptions: any = null;
  isClientLobLoading = false;
  public regionOptionsList: any;
  selectedregionObj = {};
  clientsList: any;
  public DMList = [];
  public createBtnClicked: boolean = false;
  disableITSSFlag: boolean;
  linkedOpportunityList: any;
  projectmode: boolean = false;
  disableOpportunity: boolean = false;
  showbandlevel: boolean = false;
  bandlevelDetails: any;
  experienceLevel: string;
  expLevelDetails: any;
  bandlevelDetailsFilter: any;
  experienceLevelList: any;
  roleFamily: any;
  subroleFamily: any;

  jobTitleItems$: Observable<any>;
  jobTitleinput$ = new Subject<string | null>();
  isJobTitleLoading = false;

  zipcodeDataItems$: Observable<any>;
  zipcodeinput$ = new Subject<string | null>();
  zipcodeDataLoading = false;

  skillItems$: Observable<any>;
  skillinput$ = new Subject<string | null>();
  skillLoading = false;

  cityDataItems$: Observable<any>;
  cityinput$ = new Subject<string | null>();


  stateItemsList$: Observable<any>;
  stateinput$ = new Subject<string | null>();
  isStateLoading: boolean = false;
  isWorkflowInitiated = false;
  isGCCReqType = false;

  isgcidLoading: boolean = false;
  gcidItems$: Observable<any>;
  gcidinput$ = new Subject<string | null>();
  isreqFulfilmentReasonRquired: boolean = true;

  showRemoteLocation: boolean = false;
  showVerifiedFlag: boolean = false;
  showAddButton: boolean = true;
  mandatoryFromDeliveryModel: boolean = true;
  public projectTypeList: any;
  public currentDate: NgbDateStruct = <NgbDateStruct>{};
  public dueDate: NgbDateStruct = <NgbDateStruct>{};
  public startDate: NgbDateStruct = <NgbDateStruct>{};
  public endDate: NgbDateStruct = <NgbDateStruct>{};

  public durationDiffWeeks = null;
  public durationDiffDays = null;
  public gpgpmMarginsForEditReq = [];

  public requisitionid: number = null;
  Difference_In_Days: number;
  public msprojectslist$: Observable<any>;
  public projectinput$ = new Subject<string | null>();
  isProjectNameLoading = false;
  engagementtypelist = [
    { "name": "SOW TOD (Non-Engg)", "value": "SOW TOD (Non-Engg)" },
    { "name": "Non-SOW TOD", "value": "Non-SOW TOD" }
  ];

  hiredcandidatestandardjobtitlehorizonList: any = [];
  isInsideSalesLoading = false;
  isVmoLoading = false;
  isHiringMangerMandatory = false;
  isRequisitionCancelled = false;
  isHiringManagerDisabled = false;
  isEngangementTypeDisabled = false;
  @ViewChild('RecDetailForm') form: any;
  deliverymodelid: any;



  enableAutomation: boolean = true;
  isRecDetailFormValid = false;
  isRecDetailRightFormValid = false;
  isClientDetailFormValid = false;
  currentUserRole: number = 8;

  modalcloseResult: string;
  isNextClicked = false;
  isBackBtnClicked = false;
  isRecDetailFormReset: boolean = false;
  isClientDetailFormReset: boolean = false;
  isCreateReqClicked: boolean;
  modalRef: any;

  empType: number = 2;// contract by default - to pass to recdeail page

  //  nextbtnSubject$: Subject<void> = new Subject<void>();
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };

  isDetailPageValid: boolean = false;

  //Variables needed for Update Rec and clone rec - mode can be add/ update or clone
  mode: string = 'add';
  msprojecturlparam: any = null;
  isAIDrivenUser: boolean = false;
  showSkipBillrate: boolean = false;
  billrateInvalidMsg: any;



  public endclientnameinput$ = new Subject<string | null>();
  public endclientname$: Observable<any>;
  isendclientloading = false;


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
  isPageLoading = false;
  public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true };
  @ViewChild('content') content: TemplateRef<any>;
  circleid: any;

  isAllowedClient(): boolean {
    const allowedCodes = ['JP512', 'IN616'];
    return allowedCodes.includes(this.model.clientid);
  }

  billRate: any = [
    {
      "label": "Hourly",
      "value": "hourly"
    },
    {
      "label": "Monthly",
      "value": "monthly"
    },
    {
      "label": "Yearly",
      "value": "yearly"
    }
  ];



  expList: any = [
    {
      "exp": "Beginner (0 - 3 years)",
      "expValue": "Beginner"
    },
    {
      "exp": "Intermediate (4 - 7 years)",
      "expValue": "Intermediate"
    },
    {
      "exp": "Advanced (7+ years)",
      "expValue": "Advanced"
    },
    {
      "exp": "Any Level",
      "expValue": "Any Level"
    }];
  @Input() msprojectidparam: number = null;

  constructor(private recservice: AddrecService, private localStore: LocalStoreManager, private sharedservice: AddRecSharedService, public _appService: CandidateService, public _modalService: NgbModal, private router: Router, private currentRoute: ActivatedRoute, private sharedService: AddRecSharedService) {
    this.initializeTypeAheads();
    let current_user = this.localStore.getData('current_user');
    if (current_user.email) {
      this.userid = current_user.email.split('@')[0];

    }

    current_user.roles.forEach((element) => {
      if (current_user.activerolename == element.rolename) {
        if (element.allowredeploymenthire == "true") {
          this.allowredeploymenthire = true;
        } else {
          this.allowredeploymenthire = false;

        }
      }
    })
  }
  public model = {
    //  hardcoded values for API to run



    "itss": false,
    "jump": false,
    "sow": false,
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
    "brandlevelid": null,
    "engagementtype": null,
    "hiredcandidatestandardjobtitlehorizonid": null,
    "hiredcandidateexperiencelevelid": null,
    "smclientcode": null,
    "reqfulfillmentreasonid": null,
    "projectlobid": null,
    "gciid": null,
    "requisitiontypeid": null,
    "statusid": null,
    "redepledbyid": null,
    "exclusive": false,
    "skillmappingid": null,
    "standardroleshorizonid": null,
    "circleid": null,
    "communityid": null,
    "rolefamilyid": null,
    "subrolefamilyid": null,
    "deliverymodelid": null,
    "zipcode": null,
    "city": null,
    "traveltype": null,
    "isremote": false,
    "issecondarylocation": false,
    "skill": null,
    "expLevel": null,
    "description": null,
    "projecttypeid": 2,
    "billrate": null,
    "currencyid": 1,
    "billratetype": "hourly",
    "duedate": null,
    "startdate": null,
    "projectenddate": null,
    "dateDiffinDays": 0,
    "projectdurationweeks": 0,
    "isbillrateskip": false,
    "name": null,
    "cityid": null,
    "state": null,
    "stateid": null,
    "remotelocationdetails": [],
    "skills": [],
    "supermerged": null,
    "opportunityowner": null,


    "jobtitle": null,
    //    "tcuid": 0,
    "statusreasonid": null,
    "location": false,
    "gotowork": true,
    "offshore": false,
    "exclusivedays": 1,
    "isbulk": false,

    "primaryskills": [],
    "desiredskills": [],
    "version": "2.0",
    "additionaldetails": null,
    "isverified": false,
    "minexperience": null,
    "maxexperience": null,
    "daytodayactivity": null,
    "musthave": null,
    "nicetohave": null,
    "chatgptrecommendationid": 0,

    "standardjobtitleid": null,
    "hiredthroughredeployment": false,
    "enableAutomation": false,




  };
  ngOnInit() {
    this.oneditInit();
    this.fetchAllDropdownData();
    this.getExperienceLevel();
    this.getRoleFamily();
    this.loadInitAPICalls();
    this.getBandlevelData();
    this.getLinkedOpportunity(this.smclientcode);
    this.getProjectLOB();




  }
  oneditInit() {
    // debugger;
    let current_user_obj = this.localStore.getData('current_user');
    this.currentUserRole = current_user_obj.activerole;
    this.isAIDrivenUser = current_user_obj.aidrivenuser ? current_user_obj.aidrivenuser : false;

    this.currentRoute.queryParams.subscribe(params => {

      this.requisitionid = parseInt(params['requisitionid']);

      this.msprojecturlparam = parseInt(params['projectid']);

      this.enableAutomation = params['enableAutomation'] ? params['enableAutomation'].toLowerCase() === 'true' : false;

    });

    if (this.requisitionid) {
      this.isPageLoading = true;
      this.busy =
        this.recservice.getRequisitionDetailsById(this.requisitionid).subscribe(
          (res: any) => {

            this.mode = 'update';
            let details = JSON.parse(res._body).response[0];

            this.empType = details.projecttypeid ? details.projecttypeid : 2;
            this.showSkipBillrate = details.deliverymodelid && details.deliverymodelid != 1
            if (details.deliverymodelid) {
              this.deliverymodelid = details.deliverymodelid;
              console.log("this Delivery Model ID REQ", this.deliverymodelid);

            }
            this.sharedService.setFormData(details);
            if (this.mode === 'add' || this.mode === 'update') {
              let keys = Object.keys(this.model);
              let updateModel = this.sharedservice.getFormData();
              keys.forEach(key => {
                if (updateModel[key] != null || updateModel[key] != "")
                  this.model[key] = updateModel[key];
              });
              if (updateModel['requisitiontypeid'] == 9 || updateModel['requisitiontypeid'] == 6) {
                this.isHiringMangerMandatory = true;
              } else {
                this.isHiringMangerMandatory = false;

              }

              if (this.model.opportunityname != "No Opportunity Available") {
                this.isHiringManagerDisabled = true;
              }
              else {
                this.isHiringManagerDisabled = false;

              }


              if (this.model.msprojectid) {
                this.disableOpportunity = true;
                this.isHiringManagerDisabled = true;
                this.model.engagementtype = updateModel['msprojecttype'];
                this.model.sow = updateModel['isclientsow'];

              } else {
                this.disableOpportunity = false;

                if (updateModel['isclientsow'] != undefined) {
                  if (updateModel['isclientsow']) {
                    this.isEngangementTypeDisabled = updateModel['isclientsow'];
                    this.model.engagementtype = "SOW TOD (Non-Engg)";
                    this.model.sow = updateModel['isclientsow'];
                  }
                  else {
                    this.isEngangementTypeDisabled = false;
                    this.model.sow = updateModel['isclientsow'];
                    this.model.engagementtype = updateModel['engagementtype'] != null ? updateModel['engagementtype'] : "Non-SOW TOD"
                  }
                }

              }

              this.getStandardJobTitleHorizon(updateModel['standardjobtitleid']);
            }

            if (this.mode == 'update') {
              let keys = Object.keys(this.model);
              let updateModel = this.sharedservice.getFormData();
              keys.forEach(key => {
                if (updateModel[key] != null || updateModel[key] != "")
                  this.model[key] = updateModel[key];
              });

              if (updateModel['requisitiontypeid'] == 9 || updateModel['requisitiontypeid'] == 6) {
                this.isHiringMangerMandatory = true;
              } else {

                this.isHiringMangerMandatory = false;

              }

              this.setDateModelinUpdate(updateModel);

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


                // this.OnClientChanged(currentClientObj, updateModel);

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

              this.isClientInternalAccount = updateModel['isclientinternalaccount'];
              if (updateModel['msproject']) {
                this.isMsProject = updateModel['msproject'];
                // this.msprojectidparam = updateModel['msprojectid'];
                //  this.getProjectDetailsById();

              }
              if (updateModel['description']) {
                this.setEditorContent(updateModel['description']);
              }

              if ('statusreasonid' in updateModel) {
                this.onReqStatusChanged({ status: "", id: updateModel.statusid, reason: updateModel.statusreasonid }, true);
              }

              //if (updateModel.requisitiontypeid && updateModel.requisitionpriorityid) {
              //  let rectypeObj = { "id": updateModel.requisitiontypeid, "type": updateModel['requisitiontype'] };
              //  let priorityObj = { "requisitionpriorityid": updateModel.requisitionpriorityid, "prioritytype": updateModel['prioritytype'] };
              //}
              this.isWorkflowInitiated = updateModel["isworkflowinitiated"];
              this.isGCCReqType = updateModel['requisitiontype'].toLocaleLowerCase().includes('gcc');
              if (this.isGCCReqType) {
                this.isGCCOpportunity = true;
                this.model.deliverymodelid = 2;
              }


              if (updateModel.skills && updateModel.skills.length >= 5) {
                this.showAddButton = false;
              }

              if (this.model.deliverymodelid != null && (this.model.deliverymodelid == 1 || this.model.deliverymodelid == 5)) {
                this.mandatoryFromDeliveryModel = true;

              } else {
                this.mandatoryFromDeliveryModel = false;

              }


              if (updateModel['gciid']) {
                this.getGCIDDetails(updateModel['gciid']).subscribe((selectedItem: any) => {
                  if (selectedItem && selectedItem.length > 0) {
                    this.getallgcidDetails(selectedItem[0]);
                  }
                });
              }

              if (this.model.hiredthroughredeployment) {
                this.form.controls['noofpos'].disable();
                //this.isvasbulk = true;
              }


              if (updateModel['rolefamilyid']) {
                this.getsubRoleFamily(updateModel['rolefamilyid'])

              }

              //if(updateModel['standardjobtitleid']){
              //  this.stdjobtitle = updateModel['standardjobtitle'];
              //}
              if (updateModel['standardjobtitleid']) {
                this.onstandardJobtitlleChange(updateModel['standardjobtitleid'])

              }
              if (updateModel['skillmappingid']) {
                this.onSkillsMappingChange(updateModel['skillmappingid'])

              }
              if (updateModel['standardroleshorizonid']) {
                //   this.onStandardjobTitleHorozonChange(updateModel['standardroleshorizonid'])
              }
              if (updateModel['circleid']) {
                this.onCirclelistChange(updateModel['circleid'])

              }

              if (updateModel['receiveddate']) {

                //  this.onCirclelistChange(updateModel['circleid'])
                if (updateModel['receiveddate'].split("T")[0] < '2025-01-01') {
                  this.isreqFulfilmentReasonRquired = false;

                  if (updateModel['reqfulfillmentreasonid'] == null)
                    this.model.reqfulfillmentreasonid = null;
                }

                if (updateModel['projectlobid']) {
                  this.model.projectlobid = null;
                }

              }
            }
          },
          () => {
            this.isPageLoading = false;
          }
        );
    }
  }

  initializeTypeAheads() {

    this.clientdata$ = this.clientdatainput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchClientName(term, this.userid))

    );

    this.jobTitleItems$ = this.jobTitleinput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchJobtitle(term))

    );

    this.zipcodeDataItems$ = this.zipcodeinput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchZipCode(term))
    );

    this.skillItems$ = this.skillinput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchSkill(term))
    );

    this.stateItemsList$ = this.stateinput$.pipe(
      //filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchState(term))
    );

    this.gcidItems$ = this.gcidinput$.pipe(
      filter((t: any) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.getGCIDDetails(term))
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
  searchState(term: string): ObservableInput<any> {
    if (!term)
      return of([]);
    let selectedDeliveryModel = this.model.deliverymodelid;
    this.isStateLoading = true;
    return this.recservice.getStates(term, selectedDeliveryModel).pipe(
      map((res: any) => {
        //debugger;
        this.isStateLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.relatedstates : []
      })

    );
  }

  searchJobtitle(term: string) {
    if (!term)
      return of([]);

    this.isJobTitleLoading = true;
    return this.recservice.getJobTitle(term).pipe(
      map((res) => {
        //debugger;
        this.isJobTitleLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.relatedjobtitles : []
      }),
      takeUntil(this.jobTitleinput$)

    );
  }


  searchZipCode(term) {
    if (!term) //&& !this.model.clientid)
      return of([]);
    let selectedDeliveryModel = this.model.deliverymodelid;
    this.zipcodeDataLoading = true;
    return this.recservice.getZipCodeListByText(term, selectedDeliveryModel).pipe(
      map((res) => {
        // debugger;
        this.zipcodeDataLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.zipcodes : []
      }),
      takeUntil(this.zipcodeinput$)
    );
  }

  searchSkill(term) {
    if (!term) //&& !this.model.clientid)
      return of([]);

    this.skillLoading = true;
    return this.recservice.getSkillsByText(term).pipe(
      map((res) => {
        // debugger;
        this.skillLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.skills : []
      }),
      takeUntil(this.skillinput$)


    );
  }


  getGCIDDetails(gcID: string) {
    if (!gcID)
      return of([]);

    this.isgcidLoading = true;
    return this._appService.getGCIDDetails(gcID).pipe(
      map((res: any) => {
        this.isgcidLoading = false;
        let response = JSON.parse(res._body)['response'];
        return response ? response : [];
      }),
      takeUntil(this.gcidItems$)
    );
  }

  getallgcidDetails(selecteddropItem) {
    (<HTMLInputElement>document.getElementById('empfullName')).value = "";
    if (selecteddropItem) {
      const firstName = selecteddropItem.firstname ? selecteddropItem.firstname : "";
      const lastName = selecteddropItem.lastname ? selecteddropItem.lastname : "";
      (<HTMLInputElement>document.getElementById('empfullName')).value = `${firstName} ${lastName}`.trim();
    }
  }
  allowOnlyNumbers(event: KeyboardEvent) {
    const allowedKeys = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete']; // Allow navigation keys and delete/backspace
    if (allowedKeys.indexOf(event.key) !== -1) {
      return; // Allow these keys
    }
    // Prevent if key pressed is not a number (0-9)
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  OnClientChanged(event) {
    if (event.smclientname) {
      this.model.supermerged = event.smclientname;

    }
    if (event === undefined) {
      this.isClientInternalAccount = false;


      this.model["hiringmanageremail"] = null;
      this.model["hiringmanagerphone"] = null;
      this.model["hiringmanagername"] = null;
      this.model["opportunityname"] = null;
      this.model['endclientname'] = null;
      this.model['engagementtype'] = null;

      this.linkedOpportunityList = [];
      this.model.sow = false;



    }
    else {

      this.model.clientname = event ? event.clientname : null;
      this.model.endclientname = event ? event.clientname : null;
      this.isClientInternalAccount = event ? event.internalaccount : false;

      if (event.issow) {
        this.model.engagementtype = "SOW TOD (Non-Engg)"
        this.isEngangementTypeDisabled = true;
      }
      else {

        this.model.engagementtype = "Non-SOW TOD";
        this.isEngangementTypeDisabled = false;
      }
      this.model.sow = event.issow;

      if (event.smclientcode) {

        this.getLinkedOpportunity(event.smclientcode);
        this.smclientcode = event.smclientcode;
      } else {

        this.model.opportunityname = null

      }

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

    if (!['JP512', 'IN616'].includes(event.clientcode)) {
      this.model.projectlobid = null;
    }


  }
  /**
  * Get 
  */
  fetchAllDropdownData(): void {
    //Rec Type
    this.recservice.getRecType()
      .subscribe(res => {
        // debugger;
        let response = JSON.parse(res._body)['response'];
        this.reqTypeList = response.requisitiontype;
      },
        err => {
          console.error("Couldnt fetch Rectype List" + err);
        });

    // get delivery model options
    this.recservice.getDeliveryModels()
      .subscribe(res => {
        // debugger;
        let response = JSON.parse(res._body)['response'];
        this.deliveryModelList = response ? response : [];
      },
        err => {
          console.error("Couldnt fetch Delivery Models" + err);
        });

    // Status
    this.recservice.getStatus()
      .subscribe(res => {
        let resP = JSON.parse(res._body);
        let response = resP.response;
        this.status = response.status;
      },
        err => {
          console.error("Couldnt fetch Status List" + err);
        });

    //Qualification
    this.recservice.getQualification()
      .subscribe(res => {
        // debugger;
        let response = JSON.parse(res._body)['response'];
        this.qualifications = response.qualifications;
      },
        err => {
          console.log("Couldnt fetch qualification List" + err);
        });

    this.recservice.getCircleList()
      .subscribe(res => {
        let response = JSON.parse(res._body)['response'];
        this.circleList = response
      },
        err => {
          console.log("Couldnt fetch Circle List" + err);
        });


    //Standard jobtitle
    this.recservice.getStdJobTitle()
      .subscribe(res => {
        if (JSON.parse(res._body)) {
          let response = JSON.parse(res._body)['response'];
          this.standardJobTitleList = response ? response.standardjobtitles : [];
        }
      },
        err => {
          console.error("Couldnt fetch Standard Job Title List" + err);
        });

    // Travel Types
    this.recservice.getTravelTypes()
      .subscribe(res => {
        let response = JSON.parse(res._body)['response'];
        this.traveltypelist = response ? response.traveltypes : [];
      },
        err => {
          console.error("Couldnt fetch travel Type List" + err);
        });
    //Categories /TCU - removed from recdetails page please chekc hostroy of the file


    // RedepLedBy
    this.recservice.getRedepLedBy()
      .subscribe(res => {
        let response = JSON.parse(res._body)['response'];
        this.redepledbylist = response ? response.redepledby : [];
      },
        err => {
          console.error("Couldnt fetch travel Type List" + err);
        });

    this.getReqFulfillmentReason();
  }

  getReqFulfillmentReason() {
    // RedepLedBy
    this.recservice.getReqFulfillmentReason()
      .subscribe(res => {
        let response = JSON.parse(res._body)['response'];
        this.reqfulfillmentreasonlist = response ? response.reqfulfillmentreason : [];

        if (this.allowredeploymenthire === false) {
          this.reqfulfillmentreasonlist = this.reqfulfillmentreasonlist.filter(item => item.reqfulfillmentreasonid !== 2);
        }
      },
        err => {
          console.error("Couldnt fetch travel Type List" + err);
        });
  }

  getProjectLOB() {
    debugger;
    this.recservice.getProjectLOB().subscribe(
      res => {
        let response = JSON.parse(res._body)['response'];
        this.projectloblist = response ? response.projectlobname : [];
      },
      err => {
        console.error("Couldn't fetch Project LOB List:", err);
      }
    );
  }

  onstandardJobtitlleChange(event) {
    if (event.jobtitleid) {
      this.jobtitleid = event.jobtitleid;
      this.model.skillmappingid = null;
      this.model.standardroleshorizonid = null;
      this.model.circleid = null;
      this.model.communityid = null;
      this.model.rolefamilyid = null;
      this.model.subrolefamilyid = null;
      this.standardroleHorizons = [];
      this.circleList = [];
      this.communityList = [];

    } else {
      if (this.mode == 'update') {
        this.jobtitleid = event;



      }
    }

    this.recservice.GetStandardSkillsMappingsAsync(this.jobtitleid, this.skillmappingId).subscribe(
      (res) => {
        if (JSON.parse(res._body)['response']['standardskillsmappings']) {
          this.standardskillmapping = JSON.parse(res._body)['response']['standardskillsmappings'];

          this.onStandardjobTitleHorozonChange();
        }

      },
      err => {
        console.log("Error in fetching skills");
      }
    );
  }

  onSkillsMappingChange(event) {
    if (event.id) {
      this.skillmappingId = event.id;
      this.model.standardroleshorizonid = null;
      // this.model.circleid = null;
      //this.model.communityid = null;
    }
    else {
      this.skillmappingId = event;


    }
    this.recservice.GetStandardRolesHorizonsAsync(this.jobtitleid, this.skillmappingId).subscribe(
      (res) => {
        if (JSON.parse(res._body)['response']) {

          this.standardroleHorizons = JSON.parse(res._body)['response']['standardroleHorizons'];
          this.onStandardjobTitleHorozonChange();
        }


      },
      err => {
        console.log("Error in fetching skills");
      }
    );
  }

  onStandardjobTitleHorozonChange() {
    this.recservice.onStandardjobTitleHorozonChange(this.jobtitleid, this.skillmappingId || 0).subscribe(
      (res) => {
        if (JSON.parse(res._body)['response']) {
          this.circleList = JSON.parse(res._body)['response'];

        }


      },
      err => {
        console.log("Error in fetching skills");
      }
    );
  }

  onCirclelistChange(event) {
    if (this.mode == 'update') {
      this.circleid = event
    } else {
      this.circleid = event.id

    }
    this.recservice.onCirclelistChange(this.circleid, this.jobtitleid).subscribe(
      (res) => {

        this.communityList = JSON.parse(res._body)['response'];


      },
      err => {
        console.log("Error in fetching skills");
      }
    );
  }

  onExpLevelDetailsChange(experiencelevel) {
    this.model.brandlevelid = null;
    this.fillBandLevelDetails(experiencelevel);
  }

  fillBandLevelDetails(experiencelevel: any) {
    this.bandlevelDetailsFilter = this.bandlevelDetails.filter(x => x.experiencelevel === experiencelevel);
  }

  fillExperienceLevel() {
    this.expLevelDetails = Array.from(new Set(this.bandlevelDetails.map(x => x.experiencelevel)));
    let updateModel = this.sharedservice.getFormData();
    const brandlevelidnew = updateModel["brandlevelid"];
    this.showSelectedBandLevelExperience(brandlevelidnew);
  }

  showSelectedBandLevelExperience(brandlevelid: any) {
    const bandData = this.bandlevelDetails.filter(x => x.brandlevelid === brandlevelid);
    if (bandData && bandData.length > 0)
      this.experienceLevel = bandData[0].experiencelevel;
    this.fillBandLevelDetails(this.experienceLevel);
  }

  getBandlevelData() {
    this.recservice.getBandlevelData().subscribe(
      (res) => {
        if (JSON.parse(res._body).response) {
          this.bandlevelDetails = JSON.parse(res._body).response['brandlevel'];
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
          console.log(this.experienceLevelList)
        }
      }
    );
  }


  getRoleFamily() {
    this.recservice.getRoleFamily().subscribe(
      (res) => {
        let response = JSON.parse(res._body)['response'];
        this.roleFamily = response['rolefamily'] ? response['rolefamily'] : [];

      },
      err => {
        console.log("Error in fetching Community" + err);
      }
    );
  }
  onRoleFamChange(event) {
    if (event.rolefamilyid) {
      this.getsubRoleFamily(event.rolefamilyid);
    }
  }

  getsubRoleFamily(id) {
    this.recservice.getsubRoleFamily(id).subscribe(
      (res) => {
        let response = JSON.parse(res._body)['response'];
        this.subroleFamily = response['subrolefamily'] ? response['subrolefamily'] : [];

      },
      err => {
        console.log("Error in fetching Community" + err);
      }
    );
  }

  loadInitAPICalls() {
    //ProjectType
    this.recservice.getProjectType()
      .subscribe(res => {
        // debugger;
        let response = JSON.parse(res._body)['response'];
        this.projectTypeList = response.projecttypes;

      },
        err => {
          console.log("Couldnt fetch ProjectTypes List" + err);
        });

  }

  DueDateChanged() {

    if (!this.dueDate)
      return;

    var tzoffset = (new Date()).getTimezoneOffset() * 60000;

    var date: any = new Date(`${this.dueDate.year}-${this.dueDate.month}-${this.dueDate.day}`);
    // let dueDataObj:Date = new Date(date);
    // this.datamodel.duedate = dueDataObj.toISOString();
    // this.datamodel.duedate = (new Date(date)).toISOString();
    // latest changes for start date for previous date on selection
    let MM = ('0' + this.dueDate.month).slice(-2);
    let DD = ('0' + this.dueDate.day).slice(-2);
    this.model.duedate = `${MM}/${DD}/${this.dueDate.year}`;
    // ends

  }

  StartDateChanged() {

    if (!this.startDate)
      return;

    var tzoffset = (new Date()).getTimezoneOffset() * 60000;

    var date: any = new Date(`${this.startDate.year}-${this.startDate.month}-${this.startDate.day}`);

    // latest changes for start date for previous date on selection
    let MM = ('0' + this.startDate.month).slice(-2);
    let DD = ('0' + this.startDate.day).slice(-2);
    this.model.startdate = `${MM}/${DD}/${this.startDate.year}`;
    // ends 



    if (this.endDate) {
      this.endDate = null;
      this.durationDiffWeeks = null;
    }

  }

  EndDateChanged() {
    if (!this.endDate) {
      return;
    }

    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let MM = ('0' + this.endDate.month).slice(-2);
    let DD = ('0' + this.endDate.day).slice(-2);

    var date: any = new Date(`${this.endDate.year}-${this.endDate.month}-${this.endDate.day}`);
    let endDateObj: Date = new Date(date);
    this.model.projectenddate = `${MM}/${DD}/${this.endDate.year}`;

    let startDateObj = new Date(this.model.startdate);

    let Difference_In_Time = endDateObj.getTime() - startDateObj.getTime();
    if (Difference_In_Time < 0) {
      this.endDate = null;
      return;
    }

    this.Difference_In_Days = parseInt('' + (Difference_In_Time / (1000 * 3600 * 24)));

    this.durationDiffWeeks = parseInt('' + this.Difference_In_Days / 7);
    this.durationDiffDays = this.Difference_In_Days % 7;

    this.model.projectdurationweeks = this.durationDiffWeeks;
    this.model.dateDiffinDays = this.durationDiffDays;

  }

  getLinkedOpportunity(managerid) {
    this.recservice.getlinkedOpportunities(managerid).subscribe((res: any) => {
      if (JSON.parse(res._body)['response'])
        this.linkedOpportunityList = JSON.parse(res._body)['response']['opportunitylist'];

    },
      err => {
        console.log("Error in fetching Hiring Manager");
      }
    );
  }
  OnITSSProjectNameFocused() {

    this.msprojectslist$ = this.projectinput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchITSSProjectName(term)));


  }



  //To get values of Opportunity on slection of project NAme
  getProjectDetailsByProjectname(msprojectid) {


    this.recservice.getMSProjectDetailsById(msprojectid).subscribe(
      (res) => {

        let response = JSON.parse(res._body).response[0];
        this.model.opportunityname = response.opportunityname;
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

  getStandardJobTitleHorizon(standardjobtitleid: any) {
    this.recservice.GetStandardRolesHorizonsAsync(standardjobtitleid, null).subscribe(
      (res) => {
        if (JSON.parse(res._body)['response']['standardroleHorizons']) {
          this.hiredcandidatestandardjobtitlehorizonList = JSON.parse(res._body)['response']['standardroleHorizons'];
          console.log(this.hiredcandidatestandardjobtitlehorizonList);
        }

      },
      err => {
        console.log("Error in fetching skills");
      }
    );
  }

  onDeliveryModelChange(deliveryModel) {
    this.model.zipcode = null;
    this.model.city = null;
    let deliveryModelID = deliveryModel.value;
    if (deliveryModelID == 1 || deliveryModelID == 5) {
      this.mandatoryFromDeliveryModel = true;
      this.form.form.setErrors({ 'invalid': true });
    } else {
      this.mandatoryFromDeliveryModel = false;
      this.form.form.setErrors(null);
    }
    this.onDeliveryModelUpdated(deliveryModel.value)
  }

  onDeliveryModelUpdated(value) {

    let modelid = value;
    this.deliverymodelid = value;

    if ((this.deliverymodelid == 1 || this.deliverymodelid == 5) && (this.empType == 1 || this.empType == 2))
      this.enableAutomation = true;
    else
      this.enableAutomation = false;

    if (modelid && modelid == 2) {
      this.showSkipBillrate = true;
    } else {
      this.showSkipBillrate = false;
    }

  }

  onZipcodeChange(zip) {
    //  debugger;
    let selectedZip = zip.value;
    let selectedDeliveryModel = this.model.deliverymodelid;
    this.model.zipcode = zip.value;
    this.citieslist = null;

    if (selectedZip) {
      this.recservice.getCityListByZipcode(selectedZip, selectedDeliveryModel).subscribe(
        (res) => {

          let response = JSON.parse(res._body)['response'];
          this.citieslist = response ? response.locationdetails : [];
          this.model.city = this.citieslist[0].city;
          this.zipcodeinput$.next('true');
        },
        err => {
          console.log("Couldnt fetch cities List" + err);
        });
    } else {
      this.model.city = null;
      this.citieslist = [];

    }

  }
  onCityChanged(e) {
    this.model.city = e.city;
    this.model.cityid = e.cityid;
  }
  onStateChanged(e) {
    this.model.state = e.state;
    this.model.stateid = e.stateid;
    let stateSelected = this.model.stateid;
    let selectedDeliveryModel = this.model.deliverymodelid;
    this.citieslist = null;
    if (stateSelected) {
      this.recservice.getCityFromStates(stateSelected, selectedDeliveryModel).subscribe(
        (res) => {

          let response = JSON.parse(res._body)['response'];
          this.citieslist = response ? response.states : [];
          this.stateinput$.next('true');
        },
        err => {
          console.log("Couldnt fetch cities List" + err);
        });
    } else {
      this.model.cityid = null;
      this.citieslist = [];

    }
  }
  onRemoteZipcodeChange(zip) {

    let selectedZip = zip.value;
    let selectedDeliveryModel = this.model.deliverymodelid;
    this.remotecitieslist = null;
    // this.zipcodeDataItems$.takeUntil(this.zipcodeinput$);
    //.takeUntil(this._onDestroy)
    if (selectedZip) {
      this.recservice.getCityListByZipcode(selectedZip, selectedDeliveryModel).subscribe(
        (res) => {
          let response = JSON.parse(res._body)['response'];
          this.remotecitieslist = response ? response.locationdetails : null;
          if (this.remotecitieslist.length > 0) {
            this.remotecity = this.remotecitieslist[0].city;
          } else {
            this.remotecity = null;
          }

          this.zipcodeinput$.next('true');
        },
        err => {
          console.log("Couldnt fetch cities List" + err);
        });
    } else {
      this.remotecity = null;
      this.remotecitieslist = [];

    }
  }
  addEntryToRemotelist() {

    if (this.remotecity) {
      let obj = {
        "remotezipcode": this.remotezipcode,
        "remotecity": (this.remotecity ? this.remotecity : '')

      };
      //   this.zipcodeinput$.next('true');
      this.model.remotelocationdetails.push(obj);
      this.remotezipcode = null;
      this.remotecity = null;

    }
    else
      return;
  }
  deleteFromRemoteList(zipcode) {
    if (zipcode) {
      let index = this.model.remotelocationdetails.findIndex(x => x.remotezipcode === zipcode);
      if (index != -1)
        this.model.remotelocationdetails.splice(index, 1);
    }
  }


  onTravelTypeChange(e: any) {
    this.model.traveltype = e.id;
  }

  onEmpTypeChanged(event, option) {
    if (event.target.checked) {

      let changedEvent = option.id ? option.id : "";
      this.model.billrate = '';
    }

  }
  addEntryToSkillList() {

    if (this.skill && this.expLevel) {
      let obj = {
        "skill": this.skill,
        "skilllevel": this.expLevel

      };
      this.model.skills.push(obj);
      if (this.model.skills.length >= 5) {
        this.showAddButton = false;
      }
      this.skill = null;
      this.expLevel = null;

    }
    else
      return;
  }
  deleteSkillsAndExperience(skill, skilllevel) {
    if (skill || skilllevel) {
      let index1 = this.model.skills.findIndex(x => x.skill === skill);
      let index2 = this.model.skills.findIndex(x => x.skilllevel === skilllevel);
      if (index1 != -1) {
        this.model.skills.splice(index1, 1);
      } else if (index2 != -1) {
        this.model.skills.splice(index2, 1);
      }
    }
    if (this.model.skills.length >= 5) {
      this.showAddButton = false;
    } else {
      this.showAddButton = true;
    }
  }

  editorFocusOut(event) {
    let sourceEditorContent = event.srcElement.textContent.trim();
    let innerContent = event.srcElement.innerHTML.trim();

    this.model.description = innerContent; //need this assignment for null check
    if (innerContent) {
      if (innerContent.length < 500) {
        this.form.form.setErrors({ 'invalid': true });
      } else {
        this.form.form.setErrors(null);

        if (innerContent.indexOf('<') === -1 || innerContent.indexOf('>') == -1) // if already in html format, dont add the p tags
        {
          innerContent = `<p> ${innerContent} </p>`;
        }

        this.model.description = innerContent; //reassign with p tags
      }
      return;
    }
    else {
      this.form.form.setErrors({ 'invalid': true });
      return;
    }

  }

  validateBillRateDecimal() {
    if (this.model.billratetype != 'hourly') {
      //TODO validation for yearly and monthly here
      return true;
    }

    var regex: RegExp = new RegExp(/^[1-9]\d{0,2}(\.\d{0,2})?$/);
    let input = this.model.billrate;

    if (input && regex.test(input)) {

      this.billrateInvalidMsg = null;
      return true;
    }
    else {
      this.billrateInvalidMsg = "Hourly Bill Rate should not be more than 999.99";
      return false;
    }
  }

  getOpportunityID(val) {
    if (val) {

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

      this.isHiringManagerDisabled = false;
      this.model.hiringmanagerid = null;
      this.model.hiringmanagername = null;
      this.model.hiringmanageremail = null;
      this.model.hiringmanagerphone = null;
    }


  }

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

      })

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

  OnITSSProjectSelected(data) {
    if (data) {
      this.disableOpportunity = true;
      this.showbandlevel = false;
      this.getProjectDetailsByProjectname(data.msprojectid);
    } else {
      this.disableOpportunity = false;

    }
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

        //  this.setRegionByClient({ clientid: this.model.clientid, regionid: this.model.regionid });
        this.getClientLOB(this.model.clientid);

        // this is to assign an Observable itself without disturbing typeahead binding.
        this.msprojectslist$ = this.searchITSSProjectName(msprojectname);
        //instantiate practice type dropdown
        this.getLinkedOpportunity(this.smclientcode);

      }
    );

  }

  getClientLOB(clientname?) {
    console.log("NGONchangesbefore");

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
  ngOnChanges(changes: SimpleChanges) {






  }
  postRequisitionforCreate(dataobj: any) {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.isPageLoading = true;
    this.busy = this.recservice.postRequisition(this.model).subscribe(
      (res: any) => {
        let resParsed = JSON.parse(res._body);
        let response = resParsed.response;
        this.isPageLoading = false;
        // debugger;
        if (!response) {
          // window.alert("Error in creating Requisition" + resParsed.message);

          this.popupConfig.title = "Oops !";
          this.popupConfig.message = "Error Occurred: Failed to Create requisition -" + resParsed.message;
          this.popupConfig.type = "error";
          this.popupConfig.isConfirm = true;
          this.openPopup();
        }
        else {
          this.requisitionid = response.requisitionid;
          this._modalService.open(RecCreationConfirmation, { backdrop: true }).result.then((result) => {
            this.modalcloseResult = `Closed with: ${result}`;
            if (result === 'ok') {
              this.router.dispose();

              if (this.msprojecturlparam && this.msprojecturlparam > 0) {
                this.router.navigateByUrl('projects/summary?projectid=' + this.msprojecturlparam);
              }
              else if (this.isAIDrivenUser) {
                this.router.navigateByUrl('apps/requisitionspage/aimatch?requisitionid=' + this.requisitionid);
              }
              else
                this.router.navigateByUrl('apps/requisitionspage/myrequisitions');
            }
            else if (result === 'createnew') {



            }

          });



        }
      },
      err => {
        this.isPageLoading = false;
        console.log("error in creating requisition" + err.message);

        this.popupConfig.title = "Oops !";
        this.popupConfig.message = "Error Occurred: Failed to Create requisition - " + err.message;
        this.popupConfig.type = "error";
        this.popupConfig.isConfirm = true;

        this.openPopup();
      }
    );

  }

  openPopup(closePopup?: boolean) {

    this.modalRef = this._modalService.open(this.content, this.ngbModalOptions);

    this.modalRef.result.then((result) => {

      if (result === 'Close click') {

      }
    }, (reason) => {
      if (reason === ModalDismissReasons.ESC ||
        reason === ModalDismissReasons.BACKDROP_CLICK) {

      }
    });


  }

  setDateModelinUpdate(updateModel) {

    if (updateModel.duedate) {
      let dd = new Date(updateModel.duedate);

      this.dueDate = { "year": dd.getFullYear(), "month": dd.getMonth() + 1, "day": dd.getDate() };

      // Assign current date to created Date of REquisition
      let created = new Date(updateModel['receiveddate']);
      this.currentDate = { "year": created.getFullYear(), "month": created.getMonth() + 1, "day": created.getDate() };

      this.model.duedate = `${this.dueDate.month}/${this.dueDate.day}/${this.dueDate.year}`;
    }

    if (updateModel.startdate) {
      let dd = new Date(updateModel.startdate);

      this.startDate = { "year": dd.getFullYear(), "month": dd.getMonth() + 1, "day": dd.getDate() };


      this.model.startdate = `${this.startDate.month}/${this.startDate.day}/${this.startDate.year}`;
    }

    if (updateModel.projectenddate) {
      let dd = new Date(updateModel.projectenddate);

      this.endDate = { "year": dd.getFullYear(), "month": dd.getMonth() + 1, "day": dd.getDate() };

      this.model.projectenddate = `${this.endDate.month}/${this.endDate.day}/${this.endDate.year}`;

      this.durationDiffWeeks = updateModel.projectdurationweeks;
      this.Difference_In_Days = this.durationDiffWeeks * 7;
    }


  }

  setEditorContent(htmlContent) {

    /* to make editor focused during update req on page load if old req's have less than 500 characters
     * to validate not allow the next Button and make the editor touched (dirty)*/
    if (this.model.description.length < 500) {
      $("#red_description").focus();

    }

  }

  onReqStatusChanged(event, isUpdate?: boolean) {
    if (this.mode === 'update') {
      // debugger;
      switch (event.id) {
        case 3:
        case 4:
        case 9:
          this.recservice.getReasonsforStatusChange(event.id).subscribe(
            (res) => {
              let response = JSON.parse(res._body)['response'];

              this.reasonList = response ? response.name : [];
            },
            err => {
              console.log("Error in fetching Reason for Status Change");
            }
          );

          break;
        default: break;
      }
    }
    else
      return;

  }

  postRequisitionforUpdate(dataobj: any) {
    this.isPageLoading = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.busy = this.recservice.updateRequisition(this.model, this.requisitionid).subscribe(
      (res: any) => {
        let resParsed = JSON.parse(res._body);
        let response = resParsed.response;
        this.isPageLoading = false;

        if (!response) {
          // window.alert("Error in creating Requisition" + resParsed.message);

          this.popupConfig.title = "Oops !";
          this.popupConfig.message = "Error Occurred: Failed  to update requisition -" + resParsed.message;
          this.popupConfig.type = "error";
          this.popupConfig.isConfirm = false;
          this.openPopup();
        }

        else {
          this.popupConfig.title = "Awesome !";
          this.popupConfig.message = "Successfully Updated Requisition";
          this.popupConfig.type = "success";
          this.popupConfig.isConfirm = false;
          this.openPopup();


          setTimeout(() => {
            this.popupConfig.message = null;

            this.modalRef.close();
            debugger;
            if (this.isAIDrivenUser) {
              let url = '/apps/requisitionspage/aimatch' + '?requisitionid=' + this.requisitionid;;
              this.router.navigateByUrl(url);
            }
            else {
              let url = '/apps/recoverview' + '?requisitionid=' + this.requisitionid;;
              this.router.navigateByUrl(url);
            }

          }, 3000);


        }
      },
      err => {
        this.isPageLoading = false;

        this.popupConfig.title = "Oops !";
        this.popupConfig.message = "Error Occurred: Failed  to update requisition -" + err.message;
        this.popupConfig.type = "error";
        this.popupConfig.isConfirm = true;
        this.openPopup();
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


  }
  cancelButtonClicked() {
    //goto my req page

    this._modalService.open(NgbdModalConfirm, this.ngbModalOptions).result.then((result) => {
      this.modalcloseResult = `Closed with: ${result}`;
      if (result === 'ok') {

        // this.formData.clear();
        this.router.dispose();
        if (this.mode == 'update') {
          if (!this.isAIDrivenUser) {
            let url = '/apps/recoverview' + '?requisitionid=' + this.requisitionid;
            this.router.navigateByUrl(url);
          } else {
            let url = 'apps/requisitionspage/aimatch?requisitionid=' + this.requisitionid;
            this.router.navigateByUrl(url);
          }
        }
        else if (this.msprojecturlparam && this.msprojecturlparam > 0) {
          this.router.navigateByUrl('projects/summary?projectid=' + this.msprojecturlparam);
        }
        else {
          this.router.navigateByUrl('apps/requisitionspage/myrequisitions');
        }

      }
      else {

      }
    });



  }

  onRecTypeChanged(event, updatePriorityObj?, mode?) {

    if (event && event.id) {
      let rectypeid = event.id;

      /* Need locally updated requisition type id in client details component to
       * make Hiring Manager Name Manadatory during create requisition */
      let keys = Object.keys(this.model);
      let updateModel = this.sharedService.getFormData();
      keys.forEach(key => {
        if (key === 'requisitiontypeid') {
          updateModel[key] = rectypeid;
          this.sharedService.setFormData(updateModel[key]);

        }

      });
      /* end this change */
      if (rectypeid == 9 || rectypeid == 10 || rectypeid == 5) {
        this.recservice.getAutomationPriority().subscribe(
          (res) => {
            let response = JSON.parse(res._body)['response'];

            this.prioritylist = response ? response : [];


            /*if (this.employmentTypeVal == 2 && (this.model.gotowork || this.model.exclusive)) {


            } */



          },
          err => {
            console.log("Couldnt fetch priority List" + err);
          });
      }
      else {

      }
      if (rectypeid == 10 || rectypeid == 11) {
        this.model.deliverymodelid = 2;
        this.isGCCReqType = true;
        this.onDeliveryModelChange({ value: 2 });
      } else {
        this.isGCCReqType = false;
      }


      if (rectypeid == 4) {
        this.model.reqfulfillmentreasonid = 10;
        this.model.redepledbyid = null;
      } else {
        this.model.reqfulfillmentreasonid = null;
        this.model.redepledbyid = null;
      }

    }

    else {
      this.prioritylist = [];
      return;
    }

  }

  reqfulfillmentreasonchange(event) {
    this.model.redepledbyid = null;

    if (event.reqfulfillmentreasonid == 10)
      this.model.requisitiontypeid = 4;

    if (event.reqfulfillmentreasonid == 9)
      this.model.statusid = 9;



  }

  acaBtnClicked() {
    let startDateStr = this.startDate['year'] + '-' + this.startDate['month'] + '-' + this.startDate['day'];
    let endDateStr = this.endDate['year'] + '-' + this.endDate['month'] + '-' + this.endDate['day'];



    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",



    };

    const modalRef = this._modalService.open(

      AcaDocumentsComponent,
      ngbModalOptions
    );

    modalRef.componentInstance.requisitionid = this.requisitionid;
    modalRef.componentInstance.startDate = startDateStr;
    modalRef.componentInstance.endDate = endDateStr;
    modalRef.componentInstance.differenceInDays = this.Difference_In_Days;
    modalRef.componentInstance.deliverymodelid = this.deliverymodelid;



  }
}
