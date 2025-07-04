import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { JobboardsearchService } from '../../jobboardsearch/jobboardsearch.service';

@Component({
  selector: 'app-metal-dice',
  templateUrl: './metal-dice.component.html',
  styleUrls: ['./metal-dice.component.scss'],
  providers: [JobboardsearchService]

})
export class MetalDiceComponent implements OnInit {

  busy: Subscription;
  stateDetails: any;
  dicesearchResults: any[] = [];
  pageindex = 1;
  pagesize = 20;
  showloader = false;
  message: any;
  ishourly = false;

  @Input('requisitionid') requisitionid;
  highlightskillsarray = [];
  totalprofilesfound: number | undefined = undefined;
  searchInputDisabled: boolean = false;
  showEditButton: boolean = false;
  @Input('searchquery') searchquery: string = "";
  @Input('aidrivenuser') aidrivenuser: boolean = false;
  aigenerated: boolean = false;
  @Input() isCandidateDashboard: boolean = false;
  diceDownloadDetails = {
    url: "api/Candidate/GetDiceCandidateByIdAsync",
    method: "post",
    data: {
      id: "id",
      lastUpdated: "updateddate"
    }
  };
  searchType = [
    { name: "Boolean", value: "Integrated" },
    { name: "Resume", value: "Resume" },
    { name: "OpenWeb", value: "OpenWeb" }
  ];
  public daysBack = [
    ...Array.from([1, 2, 3, 7, 14, 21, 30, 60, 90, 120, 180, 365], day => ({
      name: day.toString(),
      value: day
    })),
    { name: "Passive", value: 7500 }
  ];
  sortBy = [
    { name: "Relevance", value: "relevancy" },
    { name: "Date Last Active", value: "activityDate" },
    { name: "Resume Last Updated", value: "dateResumeLastUpdated" }
  ];
  educationDegree = [
    { name: "Any", value: "" },
    { name: "High School", value: "high school" },
    { name: "Military Service", value: "military service" },
    { name: "Vocational School", value: "vocational school" },
    { name: "Associate", value: "associate" },
    { name: "Bachelors", value: "bachelors" },
    { name: "MBA", value: "mba" },
    { name: "Masters", value: "masters" }
  ];
  employmentType = [
    { name: "Contract - Corp-to-Corp", value: "contract - corp-to-corp" },
    { name: "Contract to Hire - Corp-to-Corp", value: "contract to hire - corp-to-corp" },
    { name: "Contract to Hire - Independent", value: "contract to hire - independent" },
    { name: "Contract to Hire - W2", value: "contract to hire - w2" },
    { name: "Contract - Independent", value: "contract - independent" },
    { name: "Contract - W2", value: "contract - w2" },
    { name: "Full-time", value: "full-time" },
    { name: "Part-time", value: "part-time" },
    { name: "Independent", value: "independent" },
    { name: "Corp to Corp", value: "corp-to-corp" },
    { name: "1099 Employee", value: "1099 employee" },
    { name: "Announced", value: "announced" },
    { name: "EB-1", value: "eb-1" },
    { name: "EB-2", value: "eb-2" },
    { name: "EB-3", value: "eb-3" },
    { name: "H-1B", value: "h1-b" },
    { name: "H-4", value: "h-4" },
    { name: "J-1", value: "j-1" },
    { name: "J-2", value: "j-2" },
    { name: "W-2", value: "w-2" },
    { name: "W2/1099", value: "w-2 / 1099" }
  ];
  public maxexpYears = Array.from({ length: 26 }, (_, i) => ({
    name: i.toString(),
    value: i.toString()
  }));
  workAuthorization = [
    { name: "U.S. Citizen", value: "us citizenship" },
    { name: "EAD", value: "employment auth document" },
    { name: "Green Card Holder", value: "green card" },
    { name: "Have H-1 Visa", value: "have h1" },
    { name: "Need H-1 Visa", value: "need h1" },
    { name: "TN Permit Holder", value: "tn permit holder" },
    { name: "Have J-1 Visa", value: "have j1" },
    { name: "Canadian Citizenship", value: "Canadian Citizenship" }
  ];
  public withInData = Array.from([5, 10, 20, 30, 40, 50, 75, 100], miles => ({
    name: `${miles} miles away`,
    value: miles
  }));
  countryDetails = [
    { name: "United States", value: "United States" },
    { name: "Canada", value: "Canada" }
  ];
  public TravelPreference = [
    { name: "No Travel", value: "0" },
    ...Array.from([25, 50, 75, 100], percent => ({
      name: `Up to ${percent}%`,
      value: percent.toString()
    }))
  ];
  public model: any;
  public yrsOfExperience: string[] = Array.from({ length: 26 }, (_, i) => i.toString());

  constructor(private JobboardsearchService: JobboardsearchService) { }

  ngOnInit() {
    this.checkForPreloadSearchQuery();
    this.disableSearchInput();
    this.model = this.startingModel();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.checkForPreloadSearchQuery();
    this.disableSearchInput();
    console.log('ngonchanges', this.model);
  }

  getStateDetails(event) {
    switch (event.value.toLowerCase()) {
      case 'united states':
      default:
        this.getStatesOnCountrySelection(1);
        break;
      case 'canada':
        this.getStatesOnCountrySelection(2);
        break;
    }
  }

  getStatesOnCountrySelection(countryId) {
    this.busy = this.JobboardsearchService.getStateDetails(countryId)
      .subscribe(
        (res: any) => {
          this.stateDetails = JSON.parse(res._body)['response']['states'];
        },
        err => {
          console.log(err);
        }
      );
  }

  resetModel() {
    this.model = this.startingModel(true);
    this.dicesearchResults = [];
    this.totalprofilesfound = undefined;
  }

  onSubmit() {
    this.showloader = true;
    this.message = null;
    this.model['pagesize'] = this.pagesize;
    this.model['page'] = this.pageindex;
    this.model['ishourly'] = (<HTMLInputElement>document.getElementById("diceishourly")).checked;
    this.busy = this.JobboardsearchService.diceSearch(this.model)
      .subscribe(
        (res: any) => {
          this.showloader = false;
          if (res.status === 200 && JSON.parse(res._body)['response']) {
            this.message = JSON.parse(res._body)['message'];
            this.dicesearchResults = JSON.parse(res._body)['response']['diceCandidates'];
            this.highlightskillsarray = JSON.parse(res._body)['response']['highlightskills'];
            this.totalprofilesfound = JSON.parse(res._body)['response']['totalprofilesfound'];
            this.aigenerated = JSON.parse(res._body)['response']['aigenerated'];
          }
          else {
            this.message = JSON.parse(res._body)['message'];
            this.dicesearchResults = this.highlightskillsarray = [];
            this.totalprofilesfound = 0;
          }
        }, err => {
          console.log(err);
          this.showloader = false;
        }
      );
  }

  onPayRateChange(e) {
    if (this.ishourly) {
      this.model.annualsalarymax = this.model.annualsalarymin = null;
    }
  }

  onPageChanged(pagenumber) {
    this.pageindex = pagenumber;
    this.onSubmit();
  }

  onEditClick() {
    this.searchInputDisabled = false;
  }

  disableSearchInput() {
    if (this.aidrivenuser && this.searchquery) {
      this.searchInputDisabled = true;
      this.showEditButton = true;
    }
  }

  checkForPreloadSearchQuery() {
    if (this.searchquery) {
      this.model.query = this.searchquery;
      this.model.ismanual = false;
      this.model.isedited = false;
      this.model['requisitionid'] = this.requisitionid;
      this.onSubmit();
    }
  }

  onKeywordSearchTyped() {
    this.model.isedited = true;
    this.model.ismanual = false;
    this.model.isedited = true;
    this.model['requisitionid'] = this.requisitionid;
  }

  startingModel(isResetClick: boolean = false) {
    return {
      searchtype: "Integrated",
      lastactive: 90,
      sortby: "relevancy",
      excludethirdparty: true,
      educationdegree: "",
      jobtitle: "",
      employmenttype: "",
      annualsalarymin: null,
      annualsalarymax: null,
      hourlyratemin: null,
      hourlyratemax: null,
      maxexperience: null,
      minexperience: null,
      currentcompany: "",
      workauthorization: "",
      zipcode: "",
      zipradius: !isResetClick ? this.withInData[5].value:null,
      country: this.countryDetails[0].value,
      city: "",
      stateorprovincelist: this.getStatesOnCountrySelection(1),
      willingtorelocate: false,
      travelpreference: null,
      language: "",
      query: "",
      pagecode: "MCS01",
      securityclearance: false,
      page: 1,
      pagesize: 20,
      isedited: false,
      ismanual: false,
      ishourly: false
    }
  }
}
