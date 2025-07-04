import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription, Subject } from "rxjs";
import { NgForm, NgModelGroup } from "@angular/forms";
import {
  filter,
  distinctUntilChanged,
  switchMap,
  tap,
  catchError,
  debounceTime,
  concat,
  map,
} from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, ObservableInput } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { JobboardsearchService } from "../jobboardsearch.service";
@Component({
  selector: "app-metal-filter",
  templateUrl: "./metal-filter.component.html",
  styleUrls: ["./metal-filter.component.scss"],
  providers: [JobboardsearchService],
})
export class MetalFilterComponent implements OnInit {
  @Input() public filters;
  public jobinput$ = new Subject<string | null>();
  jobList: Observable<any>;
  public cityinput$ = new Subject<string | null>();
  cityList: Observable<any>;
  public zipinput$ = new Subject<string | null>();
  zipList: Observable<any>;
  public stateinput$ = new Subject<string | null>();
  stateList: Observable<any>;
  isJobLoading = false;
  isCityLoading = false;
  isZipcodeLoading = false;
  busy: Subscription;
  Locations: any;
  selectedCountry: any;
  selectedSkills: any = "1";
  cities: any;
  jobTitleList: any;
  skillList: any;
  countryChosen: any;
  cityChosen: any;
  showSpecificSkills: boolean = false;
  minexperience: any = null;
  maxexperience: any = null;
  showSetButton: boolean = true;
  requisitionid: any;
  isZipAndRadius = false;
  zipcodeList: any;
  distance: any;
  statefilter = false;
  isStateLoading = false;
  statelist = [];
  isJump: boolean = false;
  LastUpdatedDaysBack: any;
  public LastUpdatedDaysback = [
    { "key": "Today", "value": 0 },
    { "key": "1 Day", "value": 1 },
    { "key": "2 Days", "value": 2 },
    { "key": "3 Days", "value": 3 },
    { "key": "1 Week", "value": 7 },
    { "key": "2 Weeks", "value": 14 },
    { "key": "1 Month", "value": 30 },
    { "key": "3 Months", "value": 90 },
    { "key": "6 Months", "value": 180 },
    { "key": "9 Months", "value": 270 },
    { "key": "All Resume", "value": "" },

  ];

  constructor(
    private currentRoute: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private jobboardsearchService: JobboardsearchService
  ) {
    this.currentRoute.queryParams.subscribe(params => {
      this.requisitionid = parseInt(params['requisitionid']);
    });
    this.initializeTypeAheads();
  }

  ngOnInit() {
    this.jobTitleList = this.filters.jobtitles;
    this.skillList = this.filters.skills;
    this.selectedCountry = this.filters.country;
    this.cityChosen = this.filters.cities;
    this.minexperience = this.filters.minexperience;
    this.maxexperience = this.filters.maxexperience;
    this.selectedSkills = "" + this.filters.skilltype;
    this.zipcodeList = this.filters.zipcodes;
    this.distance = this.filters.distance;
    this.statelist = this.filters.state;
    this.isJump = this.filters.isJump;
    this.LastUpdatedDaysBack = this.filters.LastUpdatedDaysBack;

    if (this.selectedSkills != "0" && this.selectedSkills != "1") {
      this.selectedSkills = "1";
    }
    if (this.skillList.length == 0 || this.selectedSkills == "1") {
      this.getDefaultSkills();
    }
    if (this.selectedSkills == "0") {
      this.showSpecificSkills = false;
    } else if (this.selectedSkills == "1") {
      this.showSpecificSkills = true;
    }
    if(this.selectedCountry || this.cityChosen){
      this.isZipAndRadius = false;
    } 
    if(this.zipcodeList || this.distance){
      this.isZipAndRadius = true;
    }

  }

  getDefaultSkills() {
    let id = this.requisitionid;
    this.busy = this.jobboardsearchService
      .getDefaultSkills(id)
      .subscribe(
        (res: any) => {
          let response = JSON.parse(res._body)["response"];
          this.skillList = response ? response[0].skills : [];
        },
        (err) => {
          console.log(err);
        },
        () => { }
      );
  }

  // initialize type heads for search
  initializeTypeAheads() {
    this.jobList = this.jobinput$.pipe(
      filter((t) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchJobTitles(term))
    );

    this.cityList = this.cityinput$.pipe(
      filter((t) => t && t.length > 2),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchCity(term))
    );

    this.zipList = this.zipinput$.pipe(
      filter((t) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchZipcode(term))
    );

    this.stateList = this.stateinput$.pipe(
      filter((t) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchState(term))
    );

  }

  onCountrySelected() {
    //debugger;
    this.cityChosen = "";
  }

  onSkillsSelected(e) {
    this.selectedSkills = e;
   // debugger;
    if (this.selectedSkills == "0") {
      this.showSpecificSkills = false;
    } else if (this.selectedSkills == "1") {
      this.showSpecificSkills = true;
    }
  }

  deleteSkillsAndExperience(skill, skilllevel) {
    if (skill || skilllevel) {
      let index1 = this.skillList.findIndex(x => x.skill === skill);
      let index2 = this.skillList.findIndex(x => x.skilllevel === skilllevel);
      if (index1 != -1) {
        this.skillList.splice(index1, 1);
      } else if (index2 != -1) {
        this.skillList.splice(index2, 1);
      }
    }
    if (this.skillList.length <= 0) {
      this.selectedSkills = "1";
    }
  }

  onExpChange(expValue) {
    if (expValue >= 0 && expValue != '') {
      if (this.minexperience != null && this.maxexperience != null) {
        this.showSetButton = true;
      } else {
        this.showSetButton = false;
      }
    } else {
      this.showSetButton = false;
    }
  }

  searchJobTitles(term: string) {
    if (!term) return of([]);
    this.isJobLoading = true;
    return this.jobboardsearchService.getJobTitles(term).pipe(
      map((res: any) => {
        this.isJobLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.relatedjobtitles : [];
      })
    );
  }

  searchCity(city: string) {
    if (!city) return of([]);
    this.isCityLoading = true;
    return this.jobboardsearchService.getCities(this.selectedCountry, city).pipe(
      map((res: any) => {
        this.isCityLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.city : [];
      })
    );
  }
  searchState(city: string) {
    if (!city) return of([]);
    this.isStateLoading = true;
    return this.jobboardsearchService.getStates(city).pipe(
      map((res: any) => {
        this.isStateLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.relatedstates : [];
      })
    );
  }
  searchZipcode(term: string) {
    if (!term) return of([]);
    this.isZipcodeLoading = true;
    return this.jobboardsearchService.getZipcodes(term).pipe(
      map((res: any) => {
        this.isZipcodeLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.zipcodes : [];
      })
    );
  }

  onStateChanged(e) {
    // // this.state = !(this.state);
    //debugger;
    this.isZipAndRadius = !(this.isZipAndRadius);
  }

  onAdvancesearhToggled(event) {
    this.statefilter = event;
  }

  onSubmit(form: NgForm) {
    this.filters.jobtitles = this.jobTitleList;
    this.filters.country = this.selectedCountry;
    this.filters.cities = this.cityChosen;
    this.filters.minexperience = this.minexperience;
    this.filters.maxexperience = this.maxexperience;
    this.filters.skilltype = +this.selectedSkills;
    this.filters.zipcodes = this.zipcodeList;
    this.filters.distance = this.distance;
    this.filters.isJump = this.isJump;
    this.filters.LastUpdatedDaysBack = this.LastUpdatedDaysBack;
    console.log("SET", this.LastUpdatedDaysBack);
    console.log("SET", this.filters.LastUpdatedDaysBack);


    if (this.selectedSkills == "0") {
      this.filters.skills = [];
    } else if (this.selectedSkills == "1") {
      this.filters.skills = this.skillList;
    }
    if (this.zipcodeList) {
      this.filters.zipcodes = this.zipcodeList;
    } else {
      this.filters.zipcodes = [];
    }
    if(this.isZipAndRadius){
      this.filters.zipcodes = this.zipcodeList;
      this.filters.distance = this.distance;
      this.filters.country = "";
      this.filters.cities = [];
    } else {
      this.filters.zipcodes = [];
      this.filters.distance = null;
      this.filters.country = this.selectedCountry;
      this.filters.cities = this.cityChosen;
    }
    if (this.statelist) {
      this.filters.state = this.statelist
    } else {
      this.filters.state = [];

    }
    this.activeModal.close(this.filters);
  }
}
