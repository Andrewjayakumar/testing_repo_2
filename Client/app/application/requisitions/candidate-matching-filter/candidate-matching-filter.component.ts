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
import { JobboardsearchService } from "../../jobboardsearch/jobboardsearch.service";
import { AddrecService } from '.././add-requisition/addrec.service';
@Component({
  selector: "app-candidate-matching-filter",
  templateUrl: "./candidate-matching-filter.component.html",
  styleUrls: ["./candidate-matching-filter.component.scss"],
  providers: [JobboardsearchService, AddrecService],
})
export class CandidateMatchingFilterComponent implements OnInit {
  @Input() public filters;
  public jobinput$ = new Subject<string | null>();
  jobList: Observable<any>;
  public cityinput$ = new Subject<string | null>();
  cityList: Observable<any>;
  public zipinput$ = new Subject<string | null>();
  zipList: Observable<any>;
  isJobLoading = false;
  isCityLoading = false;
  isZipcodeLoading = false;
  busy: Subscription;
  Locations: any;
  selectedCountry: any;
  isZipAndRadius = false;
  isremote = false;
  unattendedReq = false;
  minBill: number = null;
  maxBill: number = null;
  selectedCurrency: String = "USD";

  cities: any;
  jobTitleList: any;
  skillList: any;
  reqType: any;
  selectedReqType: any;
  ageByDays: any;
  selectedAge: any;
  zipcodeList: any;
  distance: any;

  countryChosen: any;
  cityChosen: any;
  qualification: any;

  showSetButton: boolean = true;
  requisitionid: any;
  allReqTypes: any;
  qualificationList: any;

  skillItems$: Observable<any>;
  skillinput$ = new Subject<string | null>();
  skillLoading = false;

  statefilter = false;
  isStateLoading = false;
  statelist = [];
  public stateinput$ = new Subject<string | null>();
  stateList: Observable<any>;

  public ageDays = [
    { key: "01 day", value: 1 },
    { key: "05 days", value: 5 },
    { key: "15 days", value: 15 },
    { key: "30 days", value: 30 },
    { key: "45 days", value: 45 },
    { key: "60 days", value: 60 },
    { key: "90 days", value: 90 },
  ];

  constructor(
    private currentRoute: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private jobboardsearchService: JobboardsearchService,
    private recservice: AddrecService,
  ) {
    this.currentRoute.queryParams.subscribe((params) => {
      this.requisitionid = parseInt(params["requisitionid"]);
    });
    this.initializeTypeAheads();
  }

  ngOnInit() {
    this.selectedReqType = this.filters.allReqTypes;
    this.selectedAge = this.filters.ageByDays;
    this.jobTitleList = this.filters.jobtitles;
    this.skillList = this.filters.skills;
    this.selectedCountry = this.filters.country;
    this.cityChosen = this.filters.cities;
    this.qualification = this.filters.qualification;
    this.zipcodeList = this.filters.zipcodes;
    this.distance = this.filters.distance;
    this.isremote = this.filters.remote;
    this.unattendedReq = this.filters.unattendedReq;
    this.statelist = this.filters.state;
    this.minBill = this.filters.minBill;
    this.maxBill = this.filters.maxBill;
    this.selectedCurrency = this.filters.selectedCurrency;

    if(this.selectedCountry || this.cityChosen){
      this.isZipAndRadius = false;
    } 
    if(this.zipcodeList || this.distance){
      this.isZipAndRadius = true;
    }

    this.getReqTypes();
    this.getQualificationList();
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

    this.skillItems$ = this.skillinput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchSkill(term))
    );

    this.stateList = this.stateinput$.pipe(
      filter((t) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchState(term))
    );
  }

  // get All the Tower Details
  getReqTypes() {
    this.busy = this.jobboardsearchService.getAllReqTypes().subscribe(
      (res: any) => {
        let response = JSON.parse(res._body)["response"];
        let reqTypes = response ? response["requisitiontype"] : [];
        let idToRemove = [7,8];
        this.allReqTypes = reqTypes.filter(item => !idToRemove.includes(item.id));

      },
      (err) => {},
      () => {}
    );
  }

    // get All the Qualification list
    getQualificationList() {
      this.busy = this.jobboardsearchService.getQualificationList().subscribe(
        (res: any) => {
          let response = JSON.parse(res._body)["response"];
          this.qualificationList = response ? response["qualifications"] : [];
        },
        (err) => {},
        () => {}
      );
    }

  onCountrySelected() {
    debugger;
    this.cityChosen = "";
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
    return this.jobboardsearchService
      .getCities(this.selectedCountry, city)
      .pipe(
        map((res: any) => {
          this.isCityLoading = false;
          let resP = JSON.parse(res._body);
          return resP.response ? resP.response.city : [];
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

  searchSkill(term) {
    if (!term) return of([]);
    this.skillLoading = true;
    return this.recservice.getSkillsByText(term).pipe(
      map((res) => {
        // debugger;
        this.skillLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.skills : []
      }),
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
  onStateChanged(e) {
    this.isZipAndRadius = !(this.isZipAndRadius);
  }

  onRemoteChange(e) {
    this.isremote = !(this.isremote);
  }

  onUnattendedReqChange(e) {
    this.unattendedReq = !(this.unattendedReq);
  }

  onAdvancesearhToggled(event) {
    this.statefilter = event;
  }
  onSubmit(form: NgForm) {
    this.filters.allReqTypes = this.selectedReqType;
    this.filters.ageByDays = this.selectedAge;
    this.filters.jobtitles = this.jobTitleList;
    this.filters.skills = this.skillList;
    this.filters.country = this.selectedCountry;
    this.filters.cities = this.cityChosen;
    this.filters.qualification = this.qualification;
    this.filters.zipcodes = this.zipcodeList;
    this.filters.distance = this.distance;
    this.filters.remote = this.isremote;
    this.filters.unattendedReq = this.unattendedReq;
    this.filters.state = this.statelist;
    this.filters.minBill = this.minBill;
    this.filters.maxBill = this.maxBill;
    this.filters.selectedCurrency = this.selectedCurrency;

    debugger;
    if (this.jobTitleList) {
      this.filters.jobtitles = this.jobTitleList;
    } else {
      this.filters.jobtitles = [];
    }
    if (this.skillList) {
      this.filters.skills = this.skillList;
    } else {
      this.filters.skills = [];
    }
    if (this.cityChosen) {
      this.filters.cities = this.cityChosen;
    } else {
      this.filters.cities = [];
    }
    if(this.qualification) {
      this.filters.qualification = this.qualification;
    } else {
      this.filters.qualification = [];
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
