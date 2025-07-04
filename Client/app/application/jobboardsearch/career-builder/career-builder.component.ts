import { Component, OnInit, Input, AfterViewInit, TemplateRef, ViewChild, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Subscription, Subject } from "rxjs";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { JobboardsearchService } from "../jobboardsearch.service";

@Component({
  selector: "app-career-builder",
  templateUrl: "./career-builder.component.html",
  styleUrls: ["./career-builder.component.scss"],
  providers: [JobboardsearchService],
})
export class CareerBuilderComponent implements OnInit {
  busy: Subscription;
  countryList = [
      { "key": "United States", "value": "US" }
    //  {"key" : "Canada" , "value" : "CA"}

  ];
  freshnessList = [
    { "key": "Midnight EST-Present", "value": "0" },
    { "key": "Since yesterday", "value": "1" },
    { "key": "Last 7 days", "value": "7" },
    { "key": "Last 30 days", "value": "30" },
    { "key": "Last 90 days", "value": "90" },
    { "key": "Last 180 days", "value": "80"},
    { "key": "Last 270 days", "value": "270"},
    { "key": "Last year", "value": "365"}

  ];
  patternList = [
    { "key": "Boolean", "value": "Boo" },
    { "key": "All", "value": "All" },
    { "key": "Any", "value": "Any" },
    { "key": "Exact", "value": "Exact" },

  ];
 
  showLoader: boolean = false;
  matchingCandidates: any = [];
  @Input("data") data;
  candidateidArray = [];
  pagesize: number = 20;
  pageindex: number = 1;
  totalCandidatesFound;
  noCandidates: boolean = false;
   cbDownloadDetails = {
        "url": "api/Candidate/GetCBCandidateByResumeIdAsync",
        "method": "post",
        "data": {
            "resumeId": "resumeid",
            "countryCode": "countrycode",
            "lastUpdated": "updateddate"
        }
    };

  demandForm: FormGroup;
  languageDetails: any;
  highlightskillsarray = [];
  advancedsearch: boolean = false;
  searchInputDisabled: boolean = false;
  showEditButton: boolean = false;
  @Input('searchquery') searchquery: string = "";
  @Input('aidrivenuser') aidrivenuser: boolean = false;
  @Input('requisitionid') requisitionid: any;
  @Input() isCandidateDashboard: boolean = false;
  aigenerated: boolean = false;


  constructor(public JobboardsearchService: JobboardsearchService) { }

  ngOnInit() {
    // debugger;
    this.careerbuilderform();
    // console.log("redID", this.data);
    this.getlanguageDetails();
    this.advancedsearch = false;
    this.checkForPreloadSearchQuery();
    this.disableSearchInput();

  }

  ngOnChanges(changes: SimpleChanges): void {

    this.checkForPreloadSearchQuery();
    this.disableSearchInput();
  }


  OnAdvancedSearchToggled(togglestate) {
    if (togglestate == false) {
      this.resetform();

    }
    else {
      this.advancedsearch = true;
      this.model.ismanual = true;
      if (this.model.isedited) {
        this.model.isedited = true;

      } else {
        this.model.isedited = false;

      }      this.model['requisitionid'] = this.requisitionid;
    }
  }
  // form group
  careerbuilderform() {
    this.demandForm = new FormGroup({
      keywordSearch: new FormControl(""),
      country: new FormControl(""),
      freshness: new FormControl(""),
      searchPattern: new FormControl(""),
    });
  }

 
  minimumDegree = [
    { "key": "High School", "value": "CE31" },
    { "key": "2 year degree", "value": "CE32" },
    { "key": "4 year degree", "value": "CE321" },
    { "key": "Graduate degree", "value": "CE3210" }

  ];
  empType = [
    { "key": "All combinations", "value": "All" },
    { "key": "Full-Time Employee", "value": "ETFE" },
    { "key": "Part-Time Employee", "value": "ETPE" },
    { "key": "Contractor", "value": "ETCT" },
    { "key": "Intern", "value": "ETIN" },

  ];

  jobCategories = [
    { "key": "Accounting", "value": "JN001" },
    { "key": "Admin - Clerical", "value": "JN002" },
    { "key": "Automotive", "value": "JN054" },
    { "key": "Banking", "value": "JN038" },
    { "key": "Biotech", "value": "JN053" },
    { "key": "Business Development", "value": "JN019" },
    { "key": "Business Opportunity", "value": "JN059" },
    { "key": "Construction", "value": "JN043" },
    { "key": "Consultant", "value": "JN020" },
    { "key": "Customer Service", "value": "JN003" },
    { "key": "Design", "value": "JN021" },
    { "key": "Distribution - Shipping", "value": "JN027" },
    { "key": "Education", "value": "JN031" },
    { "key": "Engineering", "value": "JN004" },
    { "key": "Entry Level", "value": "JN022" },
    { "key": "Government", "value": "JN046" },
    { "key": "Executive", "value": "JN018" }, { "key": "Facilities", "value": "JN017" }, { "key": "Finance", "value": "JN005" },
    { "key": "Franchise", "value": "JN060" }, { "key": "General Business", "value": "JN006" }, { "key": "General Labor", "value": "JN051" },
    { "key": "Government - Federal", "value": "JN070" }, { "key": "Grocery", "value": "JN055" }, { "key": "Health Care", "value": "JN023" },
    { "key": "Hospitality - Hotel", "value": "JN040" }, { "key": "Human Resources", "value": "JN007" }, { "key": "Information Technology", "value": "JN008" },
    { "key": "Installation - Maint - Repair", "value": "JN056" },
    { "key": "Insurance", "value": "JN034" },
    { "key": "Inventory", "value": "JN015" },
    { "key": "Legal", "value": "JN030" },
    { "key": "Management", "value": "JN037" },
    { "key": "Manufacturing", "value": "JN029" },
    { "key": "Marketing", "value": "JN009" },
    { "key": "Media - Journalism - Newspaper", "value": "JN047" },
    { "key": "Nonprofit - Social Services", "value": "JN058" },
    { "key": "Nurse", "value": "JN050" },
    { "key": "Other", "value": "JN010" },
    { "key": "Pharmaceutical", "value": "JN049" },
    { "key": "Professional Services", "value": "JN024" },
    { "key": "Purchasing - Procurement", "value": "JN016" },
    { "key": "QA - Quality Control", "value": "JN025" },
    { "key": "Real Estate", "value": "JN057" },
    { "key": "Research", "value": "JN026" },
    { "key": "Retail", "value": "JN033" },
    { "key": "Science", "value": "JN012" },
    { "key": "Restaurant - Food Service", "value": "JN035" },
    { "key": "Skilled Labor - Trades", "value": "JN013" },
    { "key": "Strategy - Planning", "value": "JN028" },
    { "key": "Supply Chain", "value": "JN014" },
    { "key": "Telecommunications", "value": "JN048" },
    { "key": "Training", "value": "JN032" },
    { "key": "Veterinary Services", "value": "JN069" },
    { "key": "Warehouse", "value": "JN045" },

  ];

  availability = [
    { "key": "3 months notice", "value": "0" },
    { "key": "Available now", "value": "1" },
    { "key": "6 months notice", "value": "2" },
    { "key": "Standby", "value": "3"}

  ];
  searchinMiles = [
     "0" , "1" , "2", "3", "4" , "5" , "10" ,"15" ,"20" ,
     "25" ,
     "30" ,
     "40" ,
      "50" ,
      "75" ,
      "100" ,
    "125" ,
     "150"
  ];

  workStatus = [
    { "key": "US or Canada Citizen ", "value": "CTCT" },
    { "key": "US - Have H1 Visa", "value": "CTEM" },
    { "key": "Green Card Holder", "value": "CTGR" },
    { "key": "Seeking work authorization (Canada) or H1 (US)", "value": "CTNO" },
    { "key": "Not specified", "value": "CTNS" },
    { "key": "TN Permit Holder", "value": "EATN" },
    { "key": "Employment Authorization Document", "value": "EAEA" },
    { "key": "Canada - Can Work for Current Employer", "value": "CTEM" },
    { "key": "Canada - Can work for any Employer", "value": "CTAY" },
  ];

  relocationfilter = [
    { "key": "Willing to relocate to state specified in search", "value": "RS" },
    { "key": "Willing to relocate to city specified in search", "value": "RC" },
    { "key": "Willing to relocate to nation specified in search", "value": "RN" },
    { "key": "Willing to relocate to all of the above", "value": "RA" },

  ];

  orderBy = [
    { "key": "Sort by ‘Most Recent Pay’ ascending", "value": "+RECENTYEARLYPAY" },
    { "key": "Sort by ‘Most Recent Pay’ descending", "value": "-RECENTYEARLYPAY" },
    { "key": "Sort by ‘Freshness’ ascending", "value": "+MODIFIEDINT" },
    { "key": "Sort by ‘Relevance’ ascending", "value": "+RELV" },
    { "key": "Sort by ‘Relevance’ descending", "value": "-RELV" },
  ];

  compensationType = [
    { "key": "Salary", "value": "SALR" },
    { "key": "Hourly", "value": "HOUR" },
  ];

  minExperience = [
    { "key": "Not Specified", "value": "RENS" },
    { "key": "More Than 5 years", "value": "RE3" },
    { "key": "At least 3 years", "value": "RE32" },
    { "key": "At least 1 Year", "value": "RE321" },
    { "key": "Less Than 1 year", "value": "RE3210" },
    { "key": "College", "value": "RE32100" },
    { "key": "None", "value": "RENONE" }
  ];
  public model = {
    "minimumdegree": null,
    "keywords": "",
    "searchpattern": this.patternList[0].value,
    "jobcategories": [],
    "freshnessindays": this.freshnessList[4].value,
    "currentlyemployed": "",
    "employmenttype": [],
    "minimumsalary": null,
    "maximumsalary": null,
    "compensationtype": null,
    "availability": null,
    "searchradiusinmiles": null,
    "relocationfilter": null,
    "workstatus": [],
    "languagespoken": [],
    "maximumcommute": null,
    "zipcode": "",
    "city": "",
    "state": "",
    "country": this.countryList[0].value,
    "jobtitle": "",
    "orderby": null,
    "applylastactivity": true,
    "removeduplicates": false,
    "excludeivrresumes": "",
    "pagecode": "MCS01",
    "pagenumber": 1,
    "rowsperpage": 20,
    "excluderesumeswithnosalary": "No",
    "company": "",
    "minimumexperience": null,
    "securityClearance": "",
    "isedited": false,
    "ismanual": false

  }

  resetform() {
      this.model["keywords"] = "";
    this.model["minimumdegree"] = null;
   
    this.model["country"] = this.countryList[0].value;
    this.model["freshnessindays"] = this.freshnessList[4].value;
    this.model["searchpattern"] = this.patternList[0].value;
    this.model["currentlyemployed"] = "",
    this.model["employmenttype"] = [];
    this.model["jobcategories"] = [];
    this.model["minimumsalary"] = null;
    this.model["maximumsalary"] = null;
    this.model["compensationtype"] = null;
    this.model["availability"] = null;
    this.model["searchradiusinmiles"] = "30";
    this.model["relocationfilter"] = null;
    this.model["workstatus"] = [];
    this.model["languagespoken"] = [];
    this.model["maximumcommute"] = null;
    this.model["zipcode"] = "";
    this.model["city"] = "";
    this.model["jobtitle"] = "";
    this.model["orderby"] = null;
    this.model["applylastactivity"] = true;
    this.model["removeduplicates"] = false;
    this.model["excludeivrresumes"] = "";
    this.model["pagecode"] = "MCS01";
    this.model["pagenumber"] = 1,
    this.model["rowsperpage"] = 20;
    this.model["excluderesumeswithnosalary"] = "No";
    this.model["company"] = "";
    this.model["minimumexperience"] = "";
    this.model["securityClearance"] = "";
    this.model["state"] = "";
    this.model.ismanual = false;

    this.totalCandidatesFound = null;
    this.matchingCandidates = null;
  }

    resetAdvancedSearchFields() {

    }
 
   getlanguageDetails() {
    this.busy = this.JobboardsearchService.getlanguageDetails()
      .subscribe(
        (res: any) => {
          this.languageDetails = JSON.parse(res._body)['response']['name'];
        },
        err => {
          console.log(err);

        },
        () => {
        }
      );
  }

  OnSearchClicked() {
   
    this.showLoader = true;
    this.model['pagenumber'] = this.pageindex;
  
    this.busy = this.JobboardsearchService.searchCareerBuilder(
      this.model
    ).subscribe(
      (res: any) => {
        this.showLoader = false;
        let response = JSON.parse(res._body)["response"];
        let responseMsg = JSON.parse(res._body)["message"];
        this.highlightskillsarray = JSON.parse(res._body)['response']['highlightskills'];
        this.aigenerated = JSON.parse(res._body)['response']['aigenerated'];


        if (response) {
          this.matchingCandidates = response.resumeresultitem_v3;
          this.totalCandidatesFound = response.totalprofilesfound;
          if (this.totalCandidatesFound <= 0) {
            this.noCandidates = true;
          } else {
            this.noCandidates = false;
          }
          this.showLoader = false;
        } else {
          this.showLoader = false;
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

 
  onPageChanged(event) {
    
    this.pageindex = event;
    this.OnSearchClicked();
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
      this.model.keywords = this.searchquery;
      this.model.ismanual = false;
      this.model.isedited = false;
      this.model['requisitionid'] = this.requisitionid;
      this.OnSearchClicked();
    }
  }

  onKeywordSearchTyped() {
    this.model.isedited = true;
    //this.searchquery = null;
    this.model.ismanual = false;
    if (this.model.ismanual) {
      this.model.ismanual = true;

    } else {
      this.model.ismanual = false;

    }    this.model['requisitionid'] = this.requisitionid;
  }
}
