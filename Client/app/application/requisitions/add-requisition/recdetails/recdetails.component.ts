import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { AddrecService } from '../addrec.service';
import { AddRecSharedService } from '../addrec.shared.service';

import { of } from 'rxjs/observable/of';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';
//import { QuillConfig} from './quillconfig';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ObservableInput } from 'rxjs/Observable';
import { LocalStoreManager } from '../../../../core/authservice/local-store-manager.service';
import { User } from '../../../../core/models/user.model';
import { CandidateService } from '../../../candidate/candidate.service';
import { ChatGPTComponent } from '../chat-gpt/chat-gpt.component';
declare var $: any;

@Component({
  selector: 'app-recdetails',
  templateUrl: './recdetails.component.html',
  styleUrls: ['./recdetails.component.scss'],
  providers: [CandidateService]
})
export class RecdetailsComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

  @Input('requisitionid')
  reqid: any = null;
  @Input('currentmode') mode = 'add';  // default mode to "add"
  @Output('deliveryModelUpdated') deliveryModelUpdated: EventEmitter<any> = new EventEmitter();
  @Input('enableAutomation') enableAutomation: boolean = true;
  @Input('msprojectidparam') msprojectidparam: number = null;
  @Output('ReqFulfillmentReasonProjectNBLChange')  ReqFulfillmentReasonProjectNBLChange = new EventEmitter();

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

  //stdJobTitleItems$: Observable<any>;
  //stdJobTitleInput$ = new Subject<string | null>();
  //isStdJobTitleLoading = false;
  //stdjobtitle: any = null;
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
  public allowredeploymenthire :boolean = false;

  public reqTypeList: any = [];
  public deliveryModelList: any = [];
  public currentRemoteIndex: number;
  public remotecitieslist: any = [];
  zipcodelist: any = [];
  public redepledbylist: any = [];
  public reqfulfillmentreasonlist: any = [];

  showRemoteLocation: boolean = false;
  showVerifiedFlag: boolean = false;
  showAddButton: boolean = true;
  mandatoryFromDeliveryModel: boolean = true;

  @Input() empType = 2; // by default enable contract - for multi description

  @ViewChild('editor') editor: ElementRef;
  @ViewChild('musthave') musthave: ElementRef;
  @ViewChild('d2d') d2d: ElementRef;
  @ViewChild('pluses') pluses: ElementRef;
  @ViewChild('RecDetailForm') form: any;
  selectors: any;
  touched: boolean = false;
  updatedpriority: any;
  plusesLimiterror = false;
  mustHaveLimiterror = false;
  d2dLimiterror = false;
  //for old direct reqs is multidescription will be false
  ismultidescription = false;
  // selectedState: any;
  // selectedCity: any;
  redeploymentHireError = false;
  isgcidLoading: boolean = false;
  gcidItems$: Observable<any>;
  gcidinput$ = new Subject<string | null>();
  isreqFulfilmentReasonRquired: boolean =true;
  //  @Input('nextbtnClicked') nextButtonSubject$: Observable<void>;

  nextClicked = false;

  @Input('resetClicked')
  resetClicked = false;

  @Output()
  onValidCheck: EventEmitter<any> = new EventEmitter(true);
  cleanupClicked = false;
  roleFamily: any;
  subroleFamily: any;
  userid:any;

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


  aiPayload = {
    textcontent: "",
    daytodayactivity: "",
    musthave: "",
    nicetohave: "",
    ismulti: false,
    reqID: 0,
    chatgptrecommendationid: 0
  };

  jobtitleid: any;
  standardskillmapping: any;
  standardroleHorizons: any;
  skillmappingId: any;



  constructor(private recservice: AddrecService, private sharedService: AddRecSharedService, private localstorage: LocalStoreManager, public _appService: CandidateService,
    private _modalService: NgbModal) {
      this.sharedService.gccOpportunityDetected$.subscribe((res) => {
        if (res) {
          this.isGCCOpportunity = res;
          this.model.requisitiontypeid = 10;
         // this.model.deliverymodelid = 2;
          this.isGCCReqType = true;
          this.mandatoryFromDeliveryModel = false;
          this.onRecTypeChanged({ id: 10 }, null, 'selected');
        } else {
          this.isGCCOpportunity = this.isGCCReqType = false;
          let keys = Object.keys(this.model);
          let updateModel = this.sharedService.getFormData();
          keys.forEach(key => {
            if (key === 'requisitiontypeid') {
              this.model.requisitiontypeid = updateModel.requisitiontypeid || undefined;
            }
            if (key === 'deliverymodelid') {
              this.model.deliverymodelid = updateModel.deliverymodelid || undefined;
            }
          });
          this.onRecTypeChanged({ id: this.model.requisitiontypeid }, null, 'selected');
        }
      })
      this.sharedService.nextClick$.subscribe(
        () => {
          this.nextClicked = true;
          this.checkDescriptionValidation();
          this.setSkillValidation();
          if (this.model.numberofpositions>1 ) {
            this.form.form.setErrors({ 'invalid': true });
          }

          if (!this.form.valid || this.form.form.errors || this.redeploymentHireError)
            this.onValidCheck.emit({ "isValid": false });
          else if (this.form.valid) {
            this.onValidCheck.emit({ "isValid": true, "datamodel": this.model });
          }
          this.sharedService.setFormData(this.model)
        }
      );
      let current_user: User = this.localstorage.getData('current_user');

      current_user.roles.forEach((element) => {
        if (current_user.activerolename == element.rolename) {
          if (element.allowredeploymenthire == "true") {
            this.allowredeploymenthire= true;
          } else {
            this.allowredeploymenthire = false;
  
          }
        }
      })

      this.showVerifiedFlag = current_user.descriptionverify;
      this.showChatGPTButton = false; // putting to false for april 1st release current_user.activerole == '13';
      this.initializeTypeaheads();
      if (current_user.email) {
        this.userid = current_user.email.split('@')[0];
  
      }
  }

  //@Input
  public model = {
    "name": "",
    "requisitiontypeid": null,
    "requisitionpriorityid": null,
    "statusid": 1,
    "qualificationid": null,
    "jobtitle": null,
    //    "tcuid": 0,
    "statusreasonid": null,
    "location": false,
    "gotowork": true,
    "exclusive": false,
    "offshore": false,
    "exclusivedays": 1,
    "numberofpositions": 1,
    "maxsubmissions": 0,
    "isbulk": false,
    "zipcode": null,
    "city": null,
    "traveltype": null,
    "state": null,
    "stateid": null,
    "cityid": null,
    "remotelocationdetails": [],
    "description": "",
    "primaryskills": [],
    "desiredskills": [],
    "version": "2.0",
    "isremote": false,
    "additionaldetails": null,
    "isverified": false,
    "skills": [],
    "minexperience": null,
    "maxexperience": null,
    "issecondarylocation": false,
    "daytodayactivity": null,
    "musthave": null,
    "nicetohave": null,
    "chatgptrecommendationid": 0,
    "deliverymodelid": null as number | null,
    "circleid": null,
    "communityid": null,
    "rolefamilyid": null,
    "subrolefamilyid": null,
    "standardjobtitleid": null,
    "hiredthroughredeployment": false,
    "gciid": null,
    "enableAutomation": false,
    "standardroleshorizonid": null,
    "skillmappingid":null,
    "redepledbyid":null,
    "reqfulfillmentreasonid":null
  };


  /**
   * Variables 
   */

  public status = null;
  public prioritylist;
  public qualifications = null;
  public stateWiseSearch = false;
  //isvasbulk = false;
  public circleList = null;
  public communityList = null;
  isCommunityLoading = false;



  /**
   * Methods 
   */


  ngOnInit() {
    this.fetchAllDropdownData();
    this.getAutomationPriority();
    this.getRoleFamily();

  }

  setSkillValidation() {
    if (this.model.skills && this.model.skills.length == 0) {
      this.form.form.setErrors({ 'invalid': true });
    }
  }


  ngAfterViewInit(): void {
    // this.showRemoteLocation = false;
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.resetClicked && changes.resetClicked.currentValue) {
      this.form.reset();
      this.nextClicked = false;
      this.resetDataModel();
    }


    if (changes.mode) {

      if (changes.mode.currentValue == 'update') {

        let keys = Object.keys(this.model);
        let updateModel = this.sharedService.getFormData();
        this.updatedpriority = updateModel['updatedpriority'];

        /** code to show only 2 values based on rec type condition - starts
        this.recservice.getAutomationPriority().subscribe(
          (res) => {
            let response = JSON.parse(res._body)['response'];
            this.prioritylist = response ? response : [];
          });  **/


        keys.forEach(key => {
          if (updateModel[key] != null)
            this.model[key] = updateModel[key];
        });


        if (updateModel['msproject']) {
          this.isMsProject = updateModel['msproject'];
          this.msprojectidparam = updateModel['msprojectid'];
          this.getProjectDetailsById();

        }
        if (updateModel['description']){
          this.setEditorContent(updateModel['description']);
        }

        if ('statusreasonid' in updateModel){
          this.onReqStatusChanged({ status: "", id: updateModel.statusid, reason: updateModel.statusreasonid }, true);
        }

        if (updateModel.requisitiontypeid && updateModel.requisitionpriorityid) {
          let rectypeObj = { "id": updateModel.requisitiontypeid, "type": updateModel['requisitiontype'] };
          let priorityObj = { "requisitionpriorityid": updateModel.requisitionpriorityid, "prioritytype": updateModel['prioritytype'] };
        }
        this.isWorkflowInitiated = updateModel["isworkflowinitiated"];
        this.isGCCReqType = updateModel['requisitiontype'].toLocaleLowerCase().includes('gcc');
        if (this.isGCCReqType) {
          this.isGCCOpportunity = true;
          this.model.deliverymodelid = 2;
        }
        if (updateModel['ismultidescription']) {
          this.ismultidescription = true;
        } else
          this.ismultidescription = false;

        if (updateModel.skills && updateModel.skills.length >= 5) {
          this.showAddButton = false;
        }


        if (updateModel['circleid']) {
          this.getCommunityLists(updateModel['circleid'])

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
        if(this.model.numberofpositions>1)
        {
          this.form.controls['noofpos'].enable();
          this.form.form.setErrors({ 'invalid': true });
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
          if(updateModel['receiveddate'].split("T")[0]<'2025-01-01')
          {
            this.isreqFulfilmentReasonRquired=false;

            if(updateModel['reqfulfillmentreasonid']==null)
            this.model.reqfulfillmentreasonid=null;
          }

        }
       
        if (updateModel['deliverymodelid']) {
        this.model.deliverymodelid= updateModel['deliverymodelid'];
        }


        if (this.model.deliverymodelid != null && (this.model.deliverymodelid == 1 || this.model.deliverymodelid == 5)) {
          this.mandatoryFromDeliveryModel = true;

        } else {
          this.mandatoryFromDeliveryModel = false;

        }


      }

      this.getReqFulfillmentReason();
    }

    if (changes.enableAutomation) {
      this.model['enableAutomation'] = changes.enableAutomation.currentValue;
    }


    if (changes.msprojectidparam) {
      this.msprojectidparam = changes.msprojectidparam.currentValue;

      if (this.mode == 'add' && this.msprojectidparam>0) 
      {
         this.isMsProject=true;
         this.getProjectDetailsById()
      }
    }


  }

  ngOnDestroy(): void {
    // this.jobTitleItems$.unsubscribe();
    this.jobTitleinput$.complete();
    this.jobTitleinput$.unsubscribe();

    this.zipcodeinput$.complete();
    this.zipcodeinput$.unsubscribe();

    this.cityinput$.unsubscribe();

    this.stateinput$.unsubscribe();

    this.skillinput$.unsubscribe();

    //this.stdJobTitleInput$.complete();
    //this.stdJobTitleInput$.unsubscribe();

  }

  getProjectDetailsById() {
    this.recservice.getMSProjectDetailsById(this.msprojectidparam)
      .subscribe(
        (res) => {
          //handle response
          let response = JSON.parse(res._body).response[0];
          // debugger;
       
         /*  if (this.isMsProject === true && this.mode == 'add')
          {
            this.model.circleid = response['circleId'];
            this.getCommunityLists(this.model.circleid);
          }*/

          if (response['isGCCOpportunity']) {
            this.isGCCOpportunity = response['isGCCOpportunity']
            this.model.requisitiontypeid = 10;
            if(this.mode!="update"){
              this.model.deliverymodelid = 2;
              this.mandatoryFromDeliveryModel = false;
            }
            this.isGCCReqType = true;
          }


        },
        err => {
          console.error("Couldnt fetch Status List" + err);
        });
  }



  initializeTypeaheads(param?) {

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

    //this.stdJobTitleItems$ = this.stdJobTitleInput$.pipe(
    //filter(t => t && t.length > 1),
    //debounceTime(400),
    //distinctUntilChanged(),
    //switchMap((term) => this.searchStdJobtitle(term))
    //);

    //this.stdJobTitleItems$
    //.subscribe(response => {
    //this.standardJobTitleList = response;
    //}
    //);

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

  //searchStdJobtitle(term: string) {
  //if (!term)
  //return of([]);
  //this.isStdJobTitleLoading = true;
  //return this.recservice.getStdJobTitle(term).pipe(
  //map((res) => {
  //this.isStdJobTitleLoading = false;
  //let resP = JSON.parse(res._body);
  //return resP.response ? resP.response.standardjobtitles : []
  //}),
  //takeUntil(this.stdJobTitleInput$)
  //);
  //}

  resetDataModel() {

    this.model["gotowork"] = true;
    this.model["exclusive"] = false;
    //   this.model["isbulk"] = false;
    this.model["requisitiontypeid"] = null;
    this.model["zipcode"] = null;
    this.model["city"] = null;
    this.model["stateid"] = null;
    this.model["cityid"] = null;
    this.model["traveltype"] = null;
    this.model.primaryskills = [];
    this.model.desiredskills = [];
    this.model.description = "";
    this.model.skills = [];
    this.model.minexperience = null;
    this.model.maxexperience = null;
    this.model.musthave = "";
    this.model.nicetohave = "";
    this.model.daytodayactivity = "";
    this.model.deliverymodelid = null;
    this.model["hiredthroughredeployment"] = false;
    this.model.standardjobtitleid = null;
    this.editor.nativeElement = this.editor.nativeElement.innerText = "";
    this.musthave.nativeElement.innerText = "";
    this.pluses.nativeElement.innerText = "";
    this.d2d.nativeElement.innerText = "";
    this.model["enablenotification"] = false;
    this.model.redepledbyid = null;
    this.model.reqfulfillmentreasonid = null;

  }


  addSkillTag = (term) => ({ skill: term });

  /**
  
  onFocus(event, param) {
    this.initializeTypeaheads(param);
  } **/

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

  getReqFulfillmentReason(){
          // RedepLedBy
          this.recservice.getReqFulfillmentReason()
          .subscribe(res => {
            let response = JSON.parse(res._body)['response'];
            this.reqfulfillmentreasonlist = response ? response.reqfulfillmentreason : [];
  
              if(this.allowredeploymenthire===false  && this.mode === 'add')
              {        
                this.reqfulfillmentreasonlist = this.reqfulfillmentreasonlist.filter(item => item.reqfulfillmentreasonid !== 2);
              }
          },
            err => {
              console.error("Couldnt fetch travel Type List" + err);
            });
  }

  /**
   * Event Handlers and Emitters
   */

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


  onAdditionalInfoFocusOut(event) {
    let sourceEditorContent = event.srcElement.textContent.trim();
    let innerContent = event.srcElement.innerHTML.trim();
    if (!innerContent)
      return;
    if (innerContent.indexOf('<') === -1 || innerContent.indexOf('>') == -1) // if already in html format, dont add the p tags
    {
      innerContent = `<p> ${innerContent} </p>`;
    }
    this.model.additionaldetails = innerContent;
    if (!this.model.additionaldetails)
      return;
  }

  modelCheckboxChange(event, paramName) {
    // debugger;
    this.model["paramName"] = event;
  }

  //  onStateSearchToggled(booleanState: boolean) {
  //      this.stateWiseSearch = booleanState;
  //      this.zipcodeDataLoading = false;
  //     // this.citieslist = null;
  //      this.model.zipcode = null;
  //      this.model.city = null;
  //  }

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

  deleteFromRemoteList(zipcode) {
    if (zipcode) {
      let index = this.model.remotelocationdetails.findIndex(x => x.remotezipcode === zipcode);
      if (index != -1)
        this.model.remotelocationdetails.splice(index, 1);
    }
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

  positionsChanged(nop) {

    //if (nop && nop >= 5) {
    //this.model.isbulk = true;
    //}
    //else
    //this.model.isbulk = false;


    let nopos = this.form.control.noofpos;
    if (nop > 1) {
      // nopos.invalid = true;
      this.form.form.setErrors({ 'invalid': true });
    }
    else {
      //  nopos.invalid = false;
      this.form.form.setErrors(null);
    }

    if (this.model.hiredthroughredeployment) {
      if (nop > 1) {
        this.form.controls['noofpos'].enable();
        this.redeploymentHireError = true;
      }
      else {
        this.redeploymentHireError = false;
        this.model.numberofpositions = 1;
        //this.model.isbulk = false;
        this.form.controls['noofpos'].disable();
        //this.isvasbulk = true;
      }
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
          this.remotecity = this.remotecitieslist.length > 0 ? this.remotecitieslist[0].city : null;

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

  onDeliveryModelChange(deliveryModel) {
    this.model.zipcode = null;
    this.model.city = null;
    this.model.state= null;
    let deliveryModelID = deliveryModel.value;
    if (deliveryModelID == 1 || deliveryModelID == 5) {
      this.mandatoryFromDeliveryModel = true;
      this.form.form.setErrors({ 'invalid': true });
    } else {
      this.mandatoryFromDeliveryModel = false;
      this.form.form.setErrors(null);
    }

    this.deliveryModelUpdated.emit(deliveryModel.value);

    let keys = Object.keys(this.model);
    let updateModel = this.sharedService.getFormData();

    console.log(updateModel,"uodatemodel")
    keys.forEach(key => {
      if (key === 'deliverymodelid') {
        updateModel[key] = deliveryModel.value;
        this.sharedService.setFormData(updateModel[key]);

      }


    });

     keys = Object.keys(updateModel);

     keys.forEach(key => {
      if (key === 'hiringmanageremail' || key=='opportunityowner' || key=='hiringmanagerid' || key=='hiringmanagerphone' || key=='hiringmanagername' || key =='opportunityid' || key =='opportunityname') {
        updateModel[key] ="";
        this.sharedService.setFormData(updateModel[key]);

      }})

  

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

  onCityChanged(e) {
    this.model.city = e.city;
    this.model.cityid = e.cityid;
  }

  onTravelTypeChange(e: any) {
    this.model.traveltype = e.id;
  }
  //   onCityByStateChanged(obj) {

  //     let selectedCity = this.model.cityid;
  //       let selectedState = this.model.stateid;
  //       let selectedDeliveryModel = this.model.deliverymodelid;
  //     this.model.city = obj.city? obj.city : null;

  //   this.zipcodelist = null;
  //   if (selectedCity) {
  //     this.recservice.getZipcodeFromCityState(selectedState, selectedCity, selectedDeliveryModel).subscribe(
  //       (res) => {

  //         let response = JSON.parse(res._body)['response'];

  //         this.zipcodelist = response ? response.relatedstates : [];
  //         this.model.zipcode = this.zipcodelist[0].zipcode;
  //         // this.stateinput$.next('true');
  //       },
  //       err => {
  //         console.log("Couldnt fetch zipcode List" + err);
  //       });
  //   } else {
  //     this.model.zipcode = null;
  //     this.zipcodelist = [];

  //   }
  // }

  onRecTypeChanged(event, updatePriorityObj?, mode?) {
    this.prioritylist = null;
    if (mode == 'selection') {
      this.updatedpriority = null;
    }
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


            if (this.prioritylist) {
              this.model.requisitionpriorityid = this.prioritylist.length == 1 ? this.prioritylist[0].priorityid : null;
            }
            if (rectypeid == 10) {
              this.model.requisitionpriorityid = this.prioritylist.find(e => e.prioritytype === "Silver").priorityid;
            }
          },
          err => {
            console.log("Couldnt fetch priority List" + err);
          });
      }
      else {
        this.recservice.getReqPriority(rectypeid).subscribe(
          (res) => {
            let response = JSON.parse(res._body)['response'];

            this.prioritylist = response ? response : [];

            if (this.prioritylist) {
              this.model.requisitionpriorityid = this.prioritylist.length == 1 ? this.prioritylist[0].priorityid : null;
            }

          },
          err => {
            console.log("Couldnt fetch priority List" + err);
          });
      }
      if (rectypeid == 10 || rectypeid == 11) {
        this.model.deliverymodelid = 2;
        this.isGCCReqType = true;
        this.onDeliveryModelChange({ value: 2 });
      } else {
        this.isGCCReqType = false;
      }
      // above - preselect if there's only one value in teh dropdown, else clear the field. Preselect it to previous value for Edit mode below
      if (this.mode == "update" && updatePriorityObj) {
        this.model.requisitionpriorityid = updatePriorityObj.requisitionpriorityid;
      }

      if (rectypeid == 4) {
        this.model.reqfulfillmentreasonid = 10;
        this.model.redepledbyid=null;
      } else {
        this.model.reqfulfillmentreasonid = null;
        this.model.redepledbyid=null;
      }

    }

    else {
      this.prioritylist = [];
      this.model.requisitionpriorityid = null;
      return;
    }

  }
  reqfulfillmentreasonchange(event)
  {
   this.model.redepledbyid=null;

   if(event.reqfulfillmentreasonid==10)
   this.model.requisitiontypeid=4;
  
   if(event.reqfulfillmentreasonid==9)
    this.model.statusid=9;

if(event.reqfulfillmentreasonchange==6)
  this.ReqFulfillmentReasonProjectNBLChange.emit();

  }

  checkDescriptionValidation() {
      if (!this.model.description || this.model.description.length < 500) {
        this.form.form.setErrors({ 'invalid': true });
        return false;
      }
      else {
        this.form.form.setErrors(null);
        return true;
      }
  }

  // Update Methods

  setEditorContent(htmlContent) {

    /* to make editor focused during update req on page load if old req's have less than 500 characters
     * to validate not allow the next Button and make the editor touched (dirty)*/
    if (this.model.description.length < 500) {
      $("#red_description").focus();

    }

  }

  launchAutoCleanPopup(textcontent) {


    if ((this.model.requisitiontypeid === 9 || this.model.requisitiontypeid === 10) && this.empType === 2) {
      this.aiPayload.daytodayactivity = this.model.daytodayactivity;
      this.aiPayload.musthave = this.model.musthave;
      this.aiPayload.nicetohave = this.model.nicetohave;
      this.aiPayload.ismulti = true;
      this.aiPayload.reqID = this.reqid;
      this.aiPayload.textcontent = "";

    } else {
      this.aiPayload.textcontent = this.model[textcontent];
      this.aiPayload.daytodayactivity = "";
      this.aiPayload.musthave = "";
      this.aiPayload.nicetohave = "";
      this.aiPayload.ismulti = false;
      this.aiPayload.reqID = this.reqid;

    }

    let modalcloseResult = "cancel";
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",

    };

    const modalRef = this._modalService.open(
      ChatGPTComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.aiDescData = this.aiPayload;
    modalRef.result.then((result) => {

      modalcloseResult = `${result}`;
      if (result) {

        this.model[textcontent] = result.textcontent;
        if (this.ismultidescription || ((this.model.requisitiontypeid == 9 || this.model.requisitiontypeid == 10) && this.empType == 2)) {
          this.model.daytodayactivity = result.daytodayactivity;
          this.model.musthave = result.musthave;
          this.model.nicetohave = result.nicetohave;
        }
        this.model.chatgptrecommendationid = result.chatgptrecommendationid;
        //do nothing
        this.cleanupClicked = false;
      }
    });



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
           this.model.reqfulfillmentreasonid=9;
           this.model.redepledbyid=null;
          break;
        default: break;
      }
    }
    else
      return;

  }


  getAutomationPriority() {
    this.recservice.getAutomationPriority().subscribe(
      (res) => {
        let response = JSON.parse(res._body)['response'];
        this.prioritylist = response;

      },
      err => {
        console.log("Error in fetching auto prioirty list");
      }
    );

  }

  onGotoWorkToggled(booleanState: boolean) {
    if (!booleanState) {
      this.updatedpriority = null;
    }

  }

  onExclusiveToggled(booleanState: boolean) {
    if (!booleanState) {
      this.updatedpriority = null;

    }
  }

  onMultiDescFocusout(event, attribute) {


    let innerContent = event.srcElement.innerHTML.trim();

    switch (attribute) {
      case 'daytodayactivity': this.model["daytodayactivity"] = innerContent;
        if (!innerContent || innerContent.length < 200) {
          this.form.form.setErrors({ 'invalid': true });
          this.d2dLimiterror = true;
        } else {
          this.d2dLimiterror = false;
          this.form.form.setErrors(null);
        }


        break;
      case 'musthave': this.model["musthave"] = innerContent;
        if (!innerContent || innerContent.length < 200) {
          this.form.form.setErrors({ 'invalid': true });
          this.mustHaveLimiterror = true;
        } else {
          this.form.form.setErrors(null);
          this.mustHaveLimiterror = false;

        }

        break;
      case 'nicetohave': this.model["nicetohave"] = innerContent;

        break;
      default:
        break;
    }


  }

  onCircleChange(data: any) {
    if (data) {
      this.model.communityid = null;
      this.getCommunityLists(data.id);
    } else {
      this.model.circleid = null;
      this.model.communityid = null;

    }
  }


  getCommunityLists(circleid) {
    this.isCommunityLoading = true;
    this.recservice.getCommunityList(circleid).subscribe(
      (res) => {
        let response = JSON.parse(res._body)['response'];
        console.log(response)
        this.communityList = response ? response : [];
        this.isCommunityLoading = false;

      },
      err => {
        console.log("Error in fetching Community" + err);
        this.isCommunityLoading = false;
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



  onRedeploymentHireToggled(booleanState: boolean) {
    if (booleanState) {
      if (this.model.numberofpositions > 1) {
        this.form.controls['noofpos'].enable();
        this.redeploymentHireError = true;
        this.model.redepledbyid=null;
      }
      else {
        this.redeploymentHireError = false;
        this.model.numberofpositions = 1;
        //this.model.isbulk = false;
        this.form.controls['noofpos'].disable();
        this.model.redepledbyid=null;
        //this.isvasbulk = true;
      }
    }
    else {
      this.redeploymentHireError = false;
      this.form.controls['noofpos'].enable();
      this.model.redepledbyid=null;

      //this.isvasbulk = false;
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
   
      let keys = Object.keys(this.model);
      let updateModel = this.sharedService.getFormData();
      keys.forEach(key => {
        if (key === 'standardjobtitleid') {
          updateModel[key] =  event.jobtitleid;
          this.sharedService.setFormData(updateModel[key]);

        }

      });
    } else {
      if (this.mode == 'update') {
        this.jobtitleid = event;
    


      }
    }

    this.recservice.GetStandardSkillsMappingsAsync(this.jobtitleid,this.skillmappingId).subscribe(
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
      this.model.circleid = null;
      this.model.communityid = null;
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
    this.recservice.onCirclelistChange(event.id,this.jobtitleid).subscribe(
      (res) => {

        this.communityList = JSON.parse(res._body)['response'];
  


      },
      err => {
        console.log("Error in fetching skills");
      }
    );
  }
}
