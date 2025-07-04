import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges,
  SimpleChanges, } from '@angular/core';

import { SubmitcandidateService } from '../submitcandidate.service';
import { Subject, Observable } from 'rxjs';
import { filter, map, distinctUntilChanged, catchError, switchMap, concat, tap, debounceTime, takeUntil } from 'rxjs/operators';
import { AddrecService } from '../../../application/requisitions/add-requisition/addrec.service';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs';
import { ObservableInput } from 'rxjs/Observable';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators, AbstractControl } from '@angular/forms';
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { debug } from 'util';
declare var $: any;
const linkedinPattern = new RegExp('(https?://)?([a-z]{2}\\.)?(www\\.)?linkedin\\.com(/(in|pub)/[a-zA-Z0-9_-]+/?)?', 'i');




@Component({
  selector: 'app-candidateoutline',
  templateUrl: './candidateoutline.component.html',
  styleUrls: ['./candidateoutline.component.scss', '../candidatesubmission.component.scss'],
  providers: [AddrecService]
})
export class CandidateoutlineComponent implements OnInit, AfterViewInit, OnChanges  {

  @Input('candidateid') public candidateid = "";
  @Input('requisitionid') public requisitionid = "";
  @Input('countryid') public countryid;
  @Input() public isShadow: any;
  @Input() public isOfficeEmployee: any;
  @Output() COfillChange: EventEmitter<number> = new EventEmitter<number>();

  zipcodeDataItems$: Observable<any>;
  zipcodeinput$ = new Subject<string | null>();
  zipcodeDataLoading = false;

  jobTitleItems$: Observable<any>;
  jobTitleinput$ = new Subject<string | null>();
  isJobTitleLoading = false;

  hotBookItems$: Observable<any>;
  hotBookinput$ = new Subject<string | null>();
  hotBookLoading = false;

  stateItemsList$: Observable<any>;
  stateinput$ = new Subject<string | null>();
  isStateLoading: boolean = false;

  PrimarySkillItems$: Observable<any>;
  primaryskills$ = new Subject<string | null>();

  public primarykillsArray = new Array();

  allJobCategory: any;
  allDemandPlans: any;
  busy: Subscription;
  alltheCurrency: any;
  positionType: any;
  authorizationType: any;
  candidateOutlineDetails: any;

  coChildForm: FormGroup;
  availableforrelocation = false;
  lookingopportunity = false;
  public availabilityDate: NgbDateStruct = <NgbDateStruct>{};
  public inHousedate: NgbDateStruct = null;

  public websitetype: FormArray;
  webSiteTypeDetails: any;
  standardJobTitleList:any;

  availabilityDateVal; any;
  dateholder: any;
  inhouseDateVal: any;
  primarySkillsDetails: any;
  points = 0;

  zipcode: any;
  cityDetails: any;
  TotalWeightage = 100;
  myFavoritefolder: any;
  militaryStatus = [

    { "key": "Active Duty", "value": "Active Duty" },
    { "key": "Retired Military", "value": "Retired Military" },
    { "key": "Veteran/Prior Service", "value": "Veteran/Prior Service" },
    { "key": "Reservist (drilling)", "value": "Reservist (drilling)" },
    { "key": "National Guard", "value": "National Guard" },
    { "key": "Inactive Reserve/Guard (not drilling)", "value": "Inactive Reserve/ Guard(not drilling)" },
    { "key": "Service Academy", "value": "Service Academy" },
    { "key": "In Military Preparation", "value": "In Military Preparation" },
    { "key": "Other Military Program", "value": "Other Military Program" },
    { "key": "Government Employee", "value": "Government Employee" },
    { "key": "Defense Contractor", "value": "Defense Contractor" },
    { "key": "Considering Joining", "value": "Considering Joining" },
    { "key": "Military Spouse", "value": "Military Spouse" },
    { "key": "Spouse of a Veteran", "value": "Spouse of a Veteran" },
    { "key": "Other Military Family Member", "value": "Other Military Family Member" }
  ];

  percentageFilled = {
    "firstname": 0, //  1
    "lastname": 0, //1
    "emailid": 0, //1,
    "mobilephone": 0, //4,
    "availabilitydate": 0,//,
    "commutablepreferencetype": 0,
    "websitetype": 0,
    "currentemployername": 0,
    "jobcategoryid": 0,
    "jobtitle": 0,
    "primaryskill": 0,
    "expcompensationrange": 0,
    "position": 0,
    "inhouse": 0,
    "workauthorizationid": 0,
    "availableforrelocation": 5,
  }
  commutablePreference = [
    { "key": "Hybrid", "value": "Hybrid" },
    { "key": "Remote", "value": "Remote" },
    { "key": "On-Site", "value": "On-Site" },
];
  public mask = [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  todaysDate = new Date();
  emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
 // linkedinPattern: string = '/^https:\/\/(www\.)?linkedin\.com(\/in\/[A-Za-z0-9_-]+)?\/?$/i';
 // linkedinPattern: string = '^(?i)(https?:\/\/)?([a-z]{2}\.)?(www\.)?linkedin\.com(\/(in|pub)\/[a-zA-Z0-9_-]+\/?)?$';
  invalidliked: any;





  constructor(private _service: SubmitcandidateService, private recservice: AddrecService, private fb: FormBuilder) {

    this.initializeTypeaheads();


  }



  ngOnInit() {
    this.initchildForm();
    this.getCandidateOutline();

    this.getJobCategory();
    this.getDemandPlans();
    this.getAllCurrency();
    this.getPositionType();
    this.getWebSiteTypes();
    this.getWorkAuthorization();
    this.getStandardjobTitleItems();
  }


  ngAfterViewInit() {
    $(document).ready(function () {
      // Add minus icon for collapse element which is open by default
      $(".collapse.show").each(function () {
        $(this).prev(".card-header").find(".fa").addClass("fa-minus").removeClass("fa-plus");
      });

            // Toggle plus minus icon on show hide of collapse element
            $(".collapse").on('show.bs.collapse', function () {
              $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
          }).on('hide.bs.collapse', function () {
              $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
          });
    });

  }

  ngOnChanges(changes: SimpleChanges) {

      this.isShadow =  changes.isShadow ? changes.isShadow.currentValue : null;
      this.isOfficeEmployee = changes.isOfficeEmployee ? changes.isOfficeEmployee.currentValue : null;
    
  }



  initchildForm() {

    debugger;

    this.coChildForm = this.fb.group({
      firstname: [''],
      lastname: [''],
      emailid: ['', [Validators.required, Validators.email]],
      mobilephone: [''],
      workphone: [''],
      zipcode: [''],

      currentemployername: [''],
      expcompensationrange: [''],
      workauthorizationid: [''],
      jobcategoryid: [''],
      jobtitle: [''],
      primaryskill: [[]],
      position: [[]],
      availableforrelocation: [''],
      availabilitydate: [''],
      websitetype: this.fb.array([this.createSocialMedia()]),
      inhouse: [''],
      currency: [''],
      commutablepreferencetype: [''],
      city: [''],

      militarystatus: [''],
      commutablepreferencetypeother: [''],
      tagid: [''],
      demandplanid: [''],
      daytodayresponsibilities: [''],
      relocationstates:[[]],
      projectresponsibilities: '',
      relocatereason: '',
      webUrl: new FormControl('', [Validators.required, Validators.pattern(linkedinPattern)]),

      standardjobtitleid: null,
      isCommutablepreferencetypeHybrid:false,
      isCommutablepreferencetypeRemote:false,
      isCommutablepreferencetypeOnSite:false,

    })

    console.log("Callled", this.coChildForm.get('webUrl')['controls']);

  }

  // convenience getter for easy access to form fields
  get coFormControls() { return this.coChildForm.controls; }

  datamodel = {
    'lookingopportunity': false,
    'availableforrelocation': false,
    'notes': null,
  }


  createSocialMedia(): FormGroup {
    return this.fb.group({
      websiteid: null,
      weburl: '',
    });
  }

  get addressControls() {

    return this.coChildForm.get('websitetype')['controls'];
  }



  addSocialNetWork(): void {
    this.websitetype = this.coChildForm.get('websitetype') as FormArray;
    this.websitetype.push(this.createSocialMedia());
  }

  removeSocialNetWork(i: number, websiteArray) {
    // debugger;
    if (websiteArray.length == 1) {
      this.percentageFilled["websitetype"] = 0;
      this.calculateFilledPercentage();
    }

    (this.coChildForm.get('websitetype') as FormArray).removeAt(i);
  }
  getCandidateOutline() {
    let apiparam: any = {};
    this.busy = this._service.getCandidateOutline(this.candidateid)
      .subscribe(
        (res: any) => {
          this.candidateOutlineDetails = JSON.parse(res._body)['response'];
          if (this.candidateOutlineDetails[0].availableforrelocation) {
            this.datamodel.availableforrelocation = this.candidateOutlineDetails[0].availableforrelocation;
          }
          if (this.candidateOutlineDetails[0].lookingopportunity) {
            this.datamodel.lookingopportunity = this.candidateOutlineDetails[0].lookingopportunity;
          }
          if (this.candidateOutlineDetails[0].points) {
            this.points = this.candidateOutlineDetails[0].points;
            this.COfillChange.emit(this.candidateOutlineDetails[0].points);
            // do to set % of Initial Progress bar
          }

          this.LoadTimePercentageFilled(this.candidateOutlineDetails[0]);

          this.inHouseModelinUpdate(this.candidateOutlineDetails[0].inhouse);
          this.setDateModelinUpdate(this.candidateOutlineDetails[0].availabilitydate);

          this.updateModels();
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  LoadTimePercentageFilled(initialCOData) {

    let initial_percentage = 0;


    if (initialCOData["firstname"]) { this.percentageFilled["firstname"] = 1; }
    if (initialCOData["lastname"]) { this.percentageFilled["lastname"] = 1; }
    if (initialCOData["emailid"]) { this.percentageFilled["emailid"] = 1; }
    if (initialCOData["mobilephone"]) { this.percentageFilled["mobilephone"] = 4; }
    if (initialCOData["availabilitydate"]) { this.percentageFilled["availabilitydate"] = 10; }
    if (initialCOData["commutablepreferencetype"]) { this.percentageFilled["commutablepreferencetype"] = 5; }
    if (initialCOData["websitetype"] && initialCOData["websitetype"].length > 0) { this.percentageFilled["websitetype"] = 10; }
    if (initialCOData["jobcategoryid"]) { this.percentageFilled["jobcategoryid"] = 5; }
    if (initialCOData["jobtitle"]) { this.percentageFilled["jobtitle"] = 10; }
    if (initialCOData["primaryskill"] && initialCOData["primaryskill"].length > 0) { this.percentageFilled["primaryskill"] = 5; }
    if (initialCOData["expcompensationrange"]) { this.percentageFilled["expcompensationrange"] = 3; }
    if (initialCOData["position"] && initialCOData["position"].length > 0) { this.percentageFilled["position"] = 10; }
    if (initialCOData["inhouse"]) { this.percentageFilled["inhouse"] = 10; }
    if (initialCOData["workauthorizationid"]) { this.percentageFilled["workauthorizationid"] = 10; }
    if (initialCOData["availableforrelocation"]) { this.percentageFilled["availableforrelocation"] = 5; }
    if (initialCOData["currentemployername"]) { this.percentageFilled["currentemployername"] = 10; }

    this.calculateFilledPercentage();

  }

  setDateModelinUpdate(availabilitydate: any) {

    if (availabilitydate) {
      let dd = new Date(availabilitydate);

      this.availabilityDate = { "year": dd.getFullYear(), "month": dd.getMonth() + 1, "day": dd.getDate() };


    }

  }

  inHouseModelinUpdate(inHousedate: any) {

    if (inHousedate) {
      let ih = new Date(inHousedate);

      this.inHousedate = { "year": ih.getFullYear(), "month": ih.getMonth() + 1, "day": ih.getDate() };



    }

  }

  updateModels() {
    this.coChildForm = this.fb.group({
      firstname: [this.candidateOutlineDetails[0].firstname],
      lastname: [this.candidateOutlineDetails[0].lastname],
      emailid: [this.candidateOutlineDetails[0].emailid],
      mobilephone: [this.candidateOutlineDetails[0].mobilephone],
      workphone: [this.candidateOutlineDetails[0].workphone],
      zipcode: [this.candidateOutlineDetails[0].zipcode],

      currentemployername: [this.candidateOutlineDetails[0].currentemployername],
      expcompensationrange: [this.candidateOutlineDetails[0].expcompensationrange],
      workauthorizationid: [this.candidateOutlineDetails[0].workauthorizationid],
      jobcategoryid: [this.candidateOutlineDetails[0].jobcategoryid],
      jobtitle: [this.candidateOutlineDetails[0].jobtitle],
      primaryskill: [this.candidateOutlineDetails[0].primaryskill],
      position: [this.candidateOutlineDetails[0].position],
      availableforrelocation: [this.candidateOutlineDetails[0].availableforrelocation],
      availabilitydate: [this.availabilityDate],
      websitetype: this.fb.array(this.candidateOutlineDetails[0].websitetype.map(org => this.populateSocialMedia(org))),
      inhouse: [this.inHousedate],
      currency: [this.candidateOutlineDetails[0].currency],
      commutablepreferencetype: [this.candidateOutlineDetails[0].commutablepreferencetype],
      militarystatus: [this.candidateOutlineDetails[0].militarystatus],
      commutablepreferencetypeother: [this.candidateOutlineDetails[0].commutablepreferencetypeother],
      city: [this.candidateOutlineDetails[0].city],

      tagid: [''],
      demandplanid: [''],
      daytodayresponsibilities: [this.candidateOutlineDetails[0].daytodayresponsibilities],
      relocationstates: [this.candidateOutlineDetails[0].relocationstates],
      projectresponsibilities: [this.candidateOutlineDetails[0].projectresponsibilities],
      relocatereason: [this.candidateOutlineDetails[0].relocatereason],
      webUrl:[this.candidateOutlineDetails[0].webUrl],
      standardjobtitleid:[this.candidateOutlineDetails[0].standardjobtitleid],
      isCommutablepreferencetypeHybrid:[this.candidateOutlineDetails[0].isCommutablepreferencetypeHybrid],
      isCommutablepreferencetypeRemote:[this.candidateOutlineDetails[0].isCommutablepreferencetypeRemote],
      isCommutablepreferencetypeOnSite:[this.candidateOutlineDetails[0].isCommutablepreferencetypeOnSite],

    })
  }

  populateSocialMedia(org: any) {
    return new FormGroup({
      weburl: new FormControl(org.weburl),
      websiteid: new FormControl(org.websiteid)
    });
  }

  initializeTypeaheads(param?) {

    this.zipcodeDataItems$ = this.zipcodeinput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchZipCode(term))
    );


    this.jobTitleItems$ = this.jobTitleinput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchJobtitle(term))

    );

    this.PrimarySkillItems$ = this.primaryskills$.pipe(
      //filter(t => t && t.length > 1),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchSkills(term))
    );


    this.hotBookItems$ = this.hotBookinput$.pipe(
      //filter(t => t && t.length > 1),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchhotBooks(term))
    );

    this.stateItemsList$ = this.stateinput$.pipe(
      //filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchState(term))
    );
  }

  searchState(term: string): ObservableInput<any> {
    if (!term)
      return of([]);

    this.isStateLoading = true;
    return this.recservice.getStates(term, 1).pipe(
      map((res: any) => {
        //debugger;
        this.isStateLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.relatedstates : []
      })

    );
  }

  searchhotBooks(term) {
    if (!term)
      return of([]);
    this.hotBookLoading = true;
    return this._service.getHotBooks(term).pipe(
      map((res) => {
        // debugger;
        this.hotBookLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response : []
      }),
      takeUntil(this.hotBookinput$)


    );

  }
  searchZipCode(term) {
    if (!term) //&& !this.model.clientid)
      return of([]);

    this.zipcodeDataLoading = true;
    return this.recservice.getZipCodeListByText(term, 1).pipe(
      map((res: any) => {
        // debugger;
        this.zipcodeDataLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.zipcodes : []
      }),
      takeUntil(this.zipcodeinput$)


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

  getStandardjobTitleItems() {
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
    }
  searchSkills(term: string): ObservableInput<any> {
    this.primarykillsArray = null;
    if (!term) {
      this.primarykillsArray = [];

      return this.primarykillsArray;
    }

    return this._service.getPrimarySkills(term).pipe(
      map((res: any) => {
        // debugger;
        this.primarykillsArray = [];
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.skills : [];

      })

    );
  }
  // get job category

  getJobCategory() {
    let apiparam: any = {};
    this.busy = this._service.getJobCategory(apiparam)
      .subscribe(
        (res: any) => {
          this.allJobCategory = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // get demand plans
  getDemandPlans() {
    let demandName = "";
    this.busy = this._service.getDemandPlans(demandName)
      .subscribe(
        (res: any) => {
          this.allDemandPlans = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // Get all the currency

  getAllCurrency() {
    let apiparam: any = {};
    this.busy = this._service.getAllCurrency(apiparam)
      .subscribe(
        (res: any) => {
          this.alltheCurrency = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  //Get the position Type

  getPositionType() {
    let apiparam: any = {
      "portalcode": "col"
    };
    this.busy = this._service.getPositionType(apiparam)
      .subscribe(
        (res: any) => {
          this.positionType = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }



  // Get Web site Types

  getWebSiteTypes() {
    let apiparam: any = {};
    this.busy = this._service.getWebSiteTypes(apiparam)
      .subscribe(
        (res: any) => {
          this.webSiteTypeDetails = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  // get Primary Skills

  getPrimarySkills() {
    let apiparam: any = {};
    this.busy = this._service.getPrimarySkills(apiparam)
      .subscribe(
        (res: any) => {
          this.primarySkillsDetails = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  setPercentageonFocusOut(event, percentageVal, formfield) {
    //  debugger;

    if (Array.isArray(this.coChildForm.controls[formfield].value)) {
      if (this.coChildForm.controls[formfield].value.length > 0) {
        this.percentageFilled[formfield] = percentageVal;
        if (formfield === 'websitetype') { // add exception to check data inside  elements of website list
          let websiteArray = this.coChildForm.controls[formfield].value;
          // let size = websiteArray.length;
          let weburls = websiteArray.filter(x => (x.weburl != "" && x.weburl != null));

          if (weburls.length == 0) {
            this.percentageFilled[formfield] = 0;
          }
        }
      }
      else
        this.percentageFilled[formfield] = 0;

    }

    /* for handling the text fileds and Non array fields */
    else {

      if (this.coChildForm.controls[formfield].value) {
        this.percentageFilled[formfield] = percentageVal;
      }
      else
        this.percentageFilled[formfield] = 0;

    }

    this.calculateFilledPercentage();

  }

  calculateFilledPercentage() {

    let keys = Object.keys(this.percentageFilled);
    let sum = 0;
    keys.forEach(key => {
      sum = this.percentageFilled[key] + sum;
    });

    this.points = sum;
    if (this.points) {
      this.COfillChange.emit(this.points);

    }
  }

  getCOFilledValues() {
    if (this.availabilityDateVal) {
      this.coChildForm.value['availabilitydate'] = this.availabilityDateVal;
    }
    else {
      this.coChildForm.value['availabilitydate'] = this.candidateOutlineDetails[0].availabilitydate;

    }

    if (this.inhouseDateVal) {
      this.coChildForm.value['inhouse'] = this.inhouseDateVal;
    }
    else {
      this.coChildForm.value['inhouse'] = this.candidateOutlineDetails[0].inhouse;

    }

      this.coChildForm.value['lookingopportunity'] = this.datamodel.lookingopportunity;
    
      this.coChildForm.value['availableforrelocation'] = this.datamodel.availableforrelocation;
      if (this.datamodel.availableforrelocation) {
        (this.coChildForm.get('relocationstates').value.length >= 1) ? this.coChildForm.get('relocationstates').setErrors(null) :
              this.coChildForm.get('relocationstates').setErrors({ "invalid": true });
      } else {
          this.coChildForm.get('relocationstates').setErrors(null);
      }
      
    return this.coChildForm;
  }

  availabilityDateChanged(value, formControlName) {
    this.availabilityDateVal = '';

    if (value) {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      this.availabilityDateVal = (new Date(this.dateholder - tzoffset)).toISOString();

    }
    if (this.availabilityDateVal) {
      this.percentageFilled[formControlName] = 10;
    }
    else
      this.percentageFilled[formControlName] = 0;

    this.calculateFilledPercentage();

  }

  getinHousedate(value, formControlName) {
    this.inhouseDateVal = '';

    if (value) {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      this.inhouseDateVal = (new Date(this.dateholder - tzoffset)).toISOString();

    }
    if (this.inhouseDateVal) {
      this.percentageFilled[formControlName] = 5;
    }
    else
      this.percentageFilled[formControlName] = 0;

    this.calculateFilledPercentage();
  }
  onZipcodeChange(zip) {
    if (zip) {
      this.zipcode = zip.zipcode;
      this.getCityByZipCode(this.zipcode);
    }

  }

  getCityByZipCode(zipcode) {
    this.busy = this._service.getCityByZipCode(zipcode)
      .subscribe(
        (res: any) => {
          this.cityDetails = JSON.parse(res._body)['response'];
          this.coChildForm.controls['city'].setValue(this.cityDetails.locationdetails[0].city);


        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }
  CommutablePreferenceChanged(event, perval) {
    if (event.target.checked) {
      this.coChildForm.controls['commutablepreferencetype'].setValue(event.target.value);
      this.percentageFilled["commutablepreferencetype"] = perval;
      // console.log("From select", this.coChildForm.controls['commutablepreferencetype'].value);
      this.calculateFilledPercentage();
    }

  }



  onAvailDateToggled(booleanState: boolean) {
    if (booleanState) {
      const now = new Date();

      let model = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };

      this.coChildForm.controls['availabilitydate'].setValue(model);

    }
  }

  onOpenRelocationToggled(booleanState: boolean, percentage) {
    if(booleanState) {
      this.percentageFilled["availableforrelocation"] = percentage;
    } else {
      this.percentageFilled["availableforrelocation"] = 0;
    }
  }
  // Get Work Authorization


  getWorkAuthorization() {


    this.busy = this._service.getWorkAuthorization()
      .subscribe(
        (res: any) => {
          this.authorizationType = JSON.parse(res._body)['response']
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

 
}



