import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Input, Output, SimpleChanges, EventEmitter, ElementRef } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { filter, map, distinctUntilChanged, catchError, switchMap, concat, tap, debounceTime, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ObservableInput } from 'rxjs/Observable';
import { JobboardsearchService } from '../jobboardsearch.service';

@Component({
  selector: 'app-monster-power',
  templateUrl: './monster-power.component.html',
  styleUrls: ['./monster-power.component.scss'],
  providers: [JobboardsearchService]
})
export class MonsterPowerComponent  {

  @Input('requisitionid') requisitionid = null;
  RelatedSkillItems$: Observable<any>;
  relatedskills$ = new Subject<string | null>();
  public relatedskillsArray = new Array();
  locationItems$: Observable<any>;
  locations$ = new Subject<string | null>();
    public location = new Array();

  @Input() aidrivenuser = false;
  monstersearchResults: any;
  pageindex = 1;
  pagesize = 20;
  showloader = false;
  errorMessage: any = null;

  busy: Subscription;
  advancedsearch = false;
  noresultsFound = false;
  totalprofilesfound: any;
  highlightskillsarray = [];
  statesbyCountry: any = [];
  searchInputDisabled: boolean = false;
  showEditButton: boolean = false;
  @Input('searchquery') searchquery: string = "";
  @Input() isCandidateDashboard: boolean = false;
  aigenerated: boolean = false;


  powerDownloadDetails = {
        "url": "api/Candidate/GetMonsterCandidateByResumeIdAsync",
        "method": "post",
        "data": {
            "resumeId": "resumeid",
            "lastUpdated": "updateddate"
        }
  };

    countryList = [
        { "key": "United States", "value": "US" },
        { "key": "Canada", "value": "CA" }

    ];


  zipRadius = [{ "name": "5 Miles Away", "value": "5" }, { "name": "10 Miles Away", "value": "10" }, { "name": "20 Miles Away", "value": "20" },
  { "name": "30 Miles Away", "value": "30" }, { "name": "40 Miles Away", "value": "40" }, { "name": "50 Miles Away", "value": "50" },
  { "name": "60 Miles Away", "value": "60" }, { "name": "75 Miles Away", "value": "75" }, { "name": "100 Miles Away", "value": "100" },
    { "name": "150 Miles Away", "value": "150" }, { "name": "200 Miles Away", "value": "200" }];

  careerLevel = [{ "name": "President", "value": 1 },
  { "name": "President", "value": 1 },
  { "name": "Executive Level", "value": 2 },
  { "name": "General Manager", "value": 3 },
  { "name": "Vice President", "value": 4 },
  { "name": "Director", "value": 5 },
  { "name": "Head", "value": 6 },
  { "name": "Manager", "value": 7 },
  { "name": "Lead", "value": 8 },
  { "name": "Other", "value": 9 },
  { "name": "Analyst", "value": 10 },
  { "name": "Representative", "value": 11 },
  { "name": "Specialist", "value": 12 },
  { "name": "Clerk", "value": 13 },
  { "name": "Coordinator", "value": 14 },
  { "name": "Assistant", "value": 15 },

  ];

  candidatewillingtoTravel = [
    { "name": "No willing to travel", "value": 1 },
    { "name": "25% willing to travel", "value": 2 },
    { "name": "50% willing to travel", "value": 3 },
    { "name": "75% willing to travel", "value": 4 },
    { "name": "100% willing to travel", "value": 5 }
  ];

  jobTenure = [
    { "name": "less than 3 years", "value": "<3" },
    { "name": "greater than 3 years", "value": ">3" },
    { "name": "less than 10 years", "value": "<10" },
    { "name": "10 to 20 years", "value": "10-20" },
    { "name": "20 or more years", "value": "20+" },
  ];

  jobType = [
    { "name": "Full Time", "value": 1 },
    { "name": "Part Time", "value": 2 },
    { "name": "Intern", "value": 3 },
    { "name": "Temp/Contract/Seasonal", "value": 4 },
]

  educationLevel = [
    { "name": "High School or equivalent", "value": 1 },
    { "name": "Certification", "value": 2 },
    { "name": "Vocational", "value": 3 },
    { "name": "Associate Degree", "value": 4 },
    { "name": "Bachelors Degree", "value": 5 },
    { "name": "Masters Degree", "value": 6 },
    { "name": "Doctorate", "value": 7 },
    { "name": "Professional", "value": 8 },
    { "name": "Some College Coursework Completed", "value": 9 },
    { "name": "Some High School Coursework", "value": 12 },
  ];

  salaryCurrency = [
    { "name": "USD", "value": "USD" },
    { "name": "CAD", "value": "CAD" },
  ];

  workauthorization = [
    { "name": "US - Authorized to work for any employer", "value": "164-1" },
    { "name": "US - Authorized to work for current employer only", "value": "164-2" },
    { "name": "US - Require sponsorship", "value": "164-3" },
    { "name": "Canada - Authorized to work for any employer", "value": "30-1" },
    { "name": "Canada - Authorized to work for current employer only", "value": "30-2" },
    { "name": "Canada - Require sponsorship", "value": "30-3" },
  ];

  legalStatus = [
    { "name": "US - Citizen", "value": "164-1" },
    { "name": "US - Permanent Resident", "value": "164-2" },
    { "name": "US - Other", "value": "164-3" },
    { "name": "Canada - Citizen", "value": "30-1" },
    { "name": "Canada - Permanent Resident", "value": "30-2" },
    { "name": "Canada - Other", "value": "30-3" }
  ];

    maxmodifieddateSet = [
        { "name": "1 Day", "value": "1440" },
        { "name": "3 Day", "value": "4320" },
        { "name": "7 Days", "value": "10080" },
        { "name": "15 Days", "value": "21600" },
        { "name": "1 Month", "value": "43200" },
        { "name": "2 Months", "value": "86400" },
        { "name": "3 Months", "value": "129600" },
        { "name": "6 Months", "value": "259200" },
        { "name": "9 Months", "value": "388800" },
        { "name": "1 Year", "value": "525600" },
        { "name": "2 Years", "value": "1051200" },

    ];

  constructor(private JobboardsearchService: JobboardsearchService) {
    this.initializeTypeaheads();

  }
  ngOnit() {
    this.checkForPreloadSearchQuery();
    this.disableSearchInput();
  }
  ngOnChanges(changes: SimpleChanges): void {

    this.checkForPreloadSearchQuery();
    this.disableSearchInput();
  }

  OnAdvancedSearchToggled(togglestate) {
    if (togglestate == false) {
      this.resetModel();

    }
    else {
      this.advancedsearch = true;
      if (this.model.isedited) {
        this.model.isedited = true;

      } else {
        this.model.isedited = false;

      }
      this.model.ismanual = true;
      this.model['requisitionid'] = this.requisitionid;
    }
  }
  public model = {
    "jobtitle": "",
    "skill": [],
    "location": [],
    "zipradius": null,
    "careerlevelid": null,
    "willingtotravel": null,
    "relocate": false,
    "jobtenure": null,
    "targetjobtypeid": null,
    "yearsofexperience": null,
    "mineducationlevelid": null,
    "educationmajors": "",
    "schoolname": "",
    "mintargetsalary": "",
    "maxtargetsalary": "",
    "targetsalarycurrency": null,
    "candidatename": "",
    "workauthorization": null,
    "legalstatus": [],
    "maxmodifieddate": null,
    "veteran": false,
    "page": 1,
    "pagesize": 20,
    "pagecode": "MCS01",
      "companyname": "",
      "booleanquery": null,
      "country": null,
    "statelist": [],
    "isedited": false,
    "ismanual": false
  }


  initializeTypeaheads(param?) {
    this.RelatedSkillItems$ = this.relatedskills$.pipe(
      //filter(t => t && t.length > 1),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchSkills(term))
    );

    this.locationItems$ = this.locations$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchLocations(term))
    );
  }

  searchSkills(term: string): ObservableInput<any> {
    this.relatedskillsArray = null;
    if (!term) {
      this.relatedskillsArray = [];

      return this.relatedskillsArray;
    }

    return this.JobboardsearchService.getPrimarySkills(term).pipe(
      map((res: any) => {
        this.relatedskillsArray = [];
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.relatedskills : [];
       
      })

    );
  }

  searchLocations(term: string): ObservableInput<any> {
    this.location = null;
    if (!term) {
      this.location = [];

      return this.location;
    }

    return this.JobboardsearchService.getcityFromStates(term).pipe(
      map((res: any) => {
        this.location = [];
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.cities : [];

      })

    );
  }

    resetModel() {
    this.advancedsearch = false;
    this.model["jobtitle"] = null;
    this.model["skill"] = null;
    this.model["location"] = null;
    this.model["zipradius"] = null;
    this.monstersearchResults = [];
    this.model.ismanual = false;


  }

  onPageChanged(pageIndex) {
    if (pageIndex && pageIndex >= 1) {
      this.pageindex = pageIndex;
      this.onSubmit('pagination');
    }
  }
  onSubmit(val?) {
    this.showloader = true;
 
      if (val == 'submit') {
          this.model['pagesize'] = this.pagesize;
          this.model['page'] = 1;
          this.pageindex = 1;
      }
      else {
          this.model['pagesize'] = this.pagesize;
          this.model['page'] = this.pageindex;
      }
 
    
    this.busy = this.JobboardsearchService.monsterPowerSearch(this.model)
      .subscribe(
        (res: any) => {
         
          this.monstersearchResults = JSON.parse(res._body)['response']['monstersearch'];
          this.totalprofilesfound = JSON.parse(res._body)['response']['totalprofilesfound'];
          this.highlightskillsarray = JSON.parse(res._body)['response']['highlightskills'];
          this.aigenerated = JSON.parse(res._body)['response']['aigenerated'];


         if (this.monstersearchResults && this.monstersearchResults.length > 1) {
             this.noresultsFound = false;
           
          }
          else {
             this.noresultsFound = true;
             this.errorMessage = JSON.parse(res._body)['response']['message'] ? JSON.parse(res._body)['response']['message'] : "No Results Found. Try Modifying the search filters";

          }
         this.showloader = false;
        },
        err => {
          console.log(err);
          this.showloader = false;

        },
          () => {
              this.showloader = false;
        }
      );
  }


    loadStatesbyCountry() {
        if (!this.model.country)
            return;

        let countrycode = this.model.country == "CA" ? 2 : 1;
        this.JobboardsearchService.getStatesbyCountry(countrycode).subscribe(
            (res) => {
                let resP = JSON.parse(res._body);
                this.statesbyCountry = resP.response ? resP.response.states : [];
            },
            () => {

            }
        );

    }

    onSearchByStateChange(event) {
        if (event == false) {

            this.model["statelist"] = [];

        } else if (event == true) {
            this.model["location"] = null;

        }

    }
  onEditClick() {
    this.searchInputDisabled = false;
    this.model.isedited = true;
  }

  disableSearchInput() {
    if (this.aidrivenuser && this.searchquery) {
      this.searchInputDisabled = true;
      this.showEditButton = true;
    }
  }

  checkForPreloadSearchQuery() {
    if (this.searchquery) {
      this.model.booleanquery = this.searchquery;
      this.model.ismanual = false;
      this.model.isedited = false;
      this.model['requisitionid'] = this.requisitionid;
      this.onSubmit();
    }
  }

  onKeywordSearchTyped() {
    this.searchquery = null;
    if (this.model.ismanual) {
      this.model.ismanual = true;

    } else {
      this.model.ismanual = false;

    }
    this.model.isedited = true;
    this.model['requisitionid'] = this.requisitionid;
  }
}
