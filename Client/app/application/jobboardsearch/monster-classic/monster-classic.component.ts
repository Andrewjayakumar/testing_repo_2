import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { JobboardsearchService } from '../../jobboardsearch/jobboardsearch.service';


@Component({
  selector: 'app-monster-classic',
  templateUrl: './monster-classic.component.html',
  styleUrls: ['./monster-classic.component.scss'],
  providers: [JobboardsearchService]
})
export class MonsterClassicComponent implements OnInit {
 
  @Input('requisitionid') requisitionid = null;
  @Input() aidrivenuser = false;
  busy: Subscription;
  monstersearchResults: any;
  pageindex = 1;
  pagesize = 20;
  showloader = false;
  languageDetails: any;
  stateDetails: any;
  resultsFound = false;
  errorMessage: any;
  noresultsFound = false;
  
  classicDownloadDetails = {
        "url": "api/Candidate/GetMonsterClassicCandidateByResumeIdAsync",
        "method": "post",
        "data": {
            "resumeId": "resumeid",
            "countryCode": "country",
            "lastUpdated": "updateddate"
        }
    };
  highlightskillsarray = [];
  totalprofilesfound: any;
    industryList: any = null;
    categoryList: any = null;
    advancedsearch = false;
   

    constructor(private JobboardsearchService: JobboardsearchService) { }


    searchType = [{ "name": "All Words", "value": "And" }, { "name": "Any Word", "value": "Or" }, { "name": "Boolean", "value": "Bool" }];

    public daysBack = [{ "name": "Today", "value": "1440" }, { "name": "1 day", "value": "2880" }, { "name": "2 days", "value": "4320" },
    { "name": "3 days", "value": "5760" }, { "name": "1 week", "value": "10080" },
    { "name": "2 weeks", "value": "20160" }, { "name": "1 month", "value": "43200" }, { "name": "3 months", "value": "129600" },
    { "name": "6 months", "value": "259200" }, { "name": "9 months", "value": "388800" }, { "name": "All Resumes", "value": "" }];


    public milesAway = [{ "name": "5 miles away", "value": "5" }, { "name": "10 miles away", "value": "10" },
    { "name": "20 miles away", "value": "20" }, { "name": "30 miles away", "value": "30" },
    { "name": "40 miles away", "value": "40" }, { "name": "50 miles away", "value": "50" }, { "name": "60 miles away", "value": "60" }, { "name": "75 miles away", "value": "75" },
    { "name": "100 miles away", "value": "100" }, { "name": "150 miles away", "value": "150" }, { "name": "200 miles away", "value": "200" }, { "name": "40 miles away", "value": "40" }];


    sortBy = [{ "name": "Keyword relevance", "value": "rank,distance,mdate" }, { "name": "Creation date", "value": "Cdate" }, { "name": "Modification date", "value": "Mdate" }, { "name": "Distance", "value": "Distance" }, { "name": "Title of the resume", "value": "Title" }];
    CountryCode = [{ "name": "United States", "value": "us" }, { "name": "Canada", "value": "ca" }];

  ngOnInit() {
    this.getlanguage();
  }

  onPageChanged(pageIndex) {
    if (pageIndex && pageIndex > 1) {
      this.pageindex = pageIndex;
      this.onSubmit('pagination');
    }
  }
  public advancedmodel = {

   "advancedsearch": false
}

  public model = {
    "keywords": "",
    "searchpattern": this.searchType[2].value,
    "freshnessindays": this.daysBack[8].value,
    "searchradiusinmiles": this.milesAway[5].value,
    "sortby": this.sortBy[0].value,
    "country": this.CountryCode[0].value,
    "candidateswillingtowork": false,
    // "will2workfalse": false,
    "state": [],
    "zipcode": "",
    "educationlevel": null,
    "schoolsattended": "",
    "salarynotincluded": false,
    "minsalary": null,
    "maxsalary": null,
    "units": null,
    "militarystatus": null,
    "language": null,
    "languageproficiency": null,
    "workauthorization": [],
    "jobtypes": [],
    "jobstatus": [],
    "careerlevel": [],
    "mostrecentemployer": "",
    "mostrecentjobtitle": "",
    "experience": [],
    "securityclearance": false,
    "industry": [],
    "category": [],
    "mostrecentjobdescription": "",
    "page": 1,
    "pagecode": "MCS01",
    "pageSize":20,
    // "city": "",
  }


  public educationlevel = [
    { "key": "Some High School Coursework", "value": "12" },
    { "key": "High School or equivalent", "value": "1" },
    { "key": "Certification", "value": "2" },
    { "key": "Vocational", "value": "3" },
    { "key": "Some College Coursework Completed", "value": "9" },
    { "key": "Associate Degree", "value": "4" },
    { "key": "Bachelor's Degree", "value": "5" },
    { "key": "Master's Degree", "value": "6" },
    { "key": "Doctorate", "value": "7" },
    { "key": "Professional", "value": "8" },
  ]

  public units = [
    { "key": "Per year", "value": "1" },
    { "key": "Per hour", "value": "2" },
    { "key": "Per week", "value": "3" },
    { "key": "Per month", "value": "4" },

  ];

  public militaryStatus = [
    { "key": "Active Duty", "value": "164-2" },
    { "key": "Retired Military", "value": "164-3" },
    { "key": "Veteran/Prior Service", "value": "164-4" },
    { "key": "Reservist (drilling)", "value": "164-5" },
    { "key": "National Guard", "value": "164-6" },
    { "key": "Inactive Reserve/Guard (not drilling)", "value": "164-7" },
    { "key": "Service Academy", "value": "164-8" },
    { "key": "In Military Preparation", "value": "164-9" },
    { "key": "Other Military Program", "value": "164-10" },
    { "key": "Government Employee", "value": "164-11" },
    { "key": "Defense Contractor", "value": "164-12" },
    { "key": "Considering Joining", "value": "164-13" },
    { "key": "Military Spouse", "value": "164-14" },
    { "key": "Spouse of a Veteran", "value": "164-15" },
    { "key": "Other Military Family Member", "value": "164-16" }

  ];

  public langProficiency = [
    { "key": "Beginner", "value": "1" },
    { "key": "Intermediate", "value": "3" },
    { "key": "Fluent", "value": "6" },
    { "key": "Unknown", "value": "0" }
];

  public Workauth = [
    { "key": "Authorized to work for any employer", "value": "164-1" },
    { "key": "Authorized to work for current employer only", "value": "164-2" },
    { "key": "Require sponsorship", "value": "164-3" }
  ];

  public jobTypes = [
    { "key": "Employee", "value": "tjtp" },
    { "key": "Intern", "value": "tjti" },
    { "key": "Temporary/Contract/Project", "value": "tjttc" },
    { "key": "Seasonal", "value": "tjts" },
    { "key": "Employee", "value": "tjtp" },


  ];

  public jobStatus = [
    { "key": "Full-Time", "value": "tjtft" },
    { "key": "Part-Time", "value": "tjtpt" },
    { "key": "Per Diem", "value": "tjtpd" },

  ];

  public careerLevel = [
    { "key": "Student (High School)", "value": "0" },
    { "key": "Student (Undergraduate/Graduate)", "value": "1" },
    { "key": "Entry Level", "value": "2" },
    { "key": "Experienced (Non-Manager)", "value": "3" },
    { "key": "Manager (Manager/Supervisor of Staff)", "value": "4" },
    { "key": "Executive (SVP, VP, Department Head, etc)", "value": "5" },
    { "key": "Senior Executive (President, CFO, etc)", "value": "6" }

  ];

    public Experience = [
        { "key": "Less than 1 Year", "value": "1" },
        { "key": "1+ to 2 Years", "value": "2" },
        { "key": "2+ to 5 Years", "value": "3" },
        { "key": "5+ to 7 Years", "value": "4" },
        { "key": "7+ to 10 Years", "value": "5" },
        { "key": "10+ to 15 Years", "value": "6" },
        { "key": "more than 15 Years", "value": "7" }

    ];

  resetModel() {
    this.model["keywords"] = null;
    this.model["searchpattern"] = "Bool";
    this.model["freshnessindays"] = "129600";
    this.model["searchradiusinmiles"] = "50";
    this.model["sortby"] = "rank, distance, mdate";
    this.model["country"] = "us";
    //reset the list of states if country is reset
    this.GetMonsterClassicSearchStateList(this.model.country);

    this.totalprofilesfound = null;
    this.monstersearchResults = null;
    this.advancedsearch = false;
    this.model.candidateswillingtowork = false;
    this.model.salarynotincluded = false;
    this.model.securityclearance = false;
    this.model.category = [];
    this.model.industry = [];
    this.model.industry = [];
    this.model.mostrecentjobtitle = "";
    this.model.experience = [];
    this.model.mostrecentemployer = "";
    this.model.careerlevel = [];
    this.model.jobstatus = [];
    this.model.jobtypes = [];
    this.model.workauthorization = [];
    this.model.languageproficiency = null;
    this.model.language = null;
    this.model.militarystatus = null;
    this.model.units = null;
    this.model.maxsalary = null;
    this.model.minsalary = null;
    this.model.schoolsattended = "";
    this.model.educationlevel = null;
    this.model.zipcode = "";
    this.model.state = [];
  }

  getlanguage() {
  
    this.busy = this.JobboardsearchService.getlanguages()
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

    GetMonsterClassicSearchStateList(countrySelected) {
       
        this.busy = this.JobboardsearchService.GetMonsterClassicSearchStateList(this.model.country)
      .subscribe(
        (res: any) => {
          this.stateDetails = JSON.parse(res._body)['response']['name'];
        },
        err => {
          console.log(err);

        },
        () => {
        }
      );
    }

    countryChanged(event) {
      
      this.GetMonsterClassicSearchStateList(this.model.country);

    }

  editorFocusOut(event) {
    let sourceEditorContent = event.srcElement.textContent.trim();
    let innerContent = event.srcElement.innerHTML.trim();
   /* if (innerContent.indexOf('<') === -1 || innerContent.indexOf('>') == -1) {
      innerContent = `<p> ${innerContent} </p>`;
    } */
    this.model.mostrecentjobdescription = innerContent;
    if (!this.model.mostrecentjobdescription)
      return;

  }

  onAdvancesearhToggled(booleanState: boolean) {
    
      //instantiate advance searc'h field's dropdowns when advanced search is enabled for the very first time
      if (!this.stateDetails || this.stateDetails.length == 0) {
          this.GetMonsterClassicSearchStateList(this.model.country);
      }
      if (!this.industryList || this.industryList.length == 0) {
          this.populateIndustryDropdown();
      }
      if (!this.categoryList || this.categoryList.length == 0) {
          this.populateCategoryDropdown();
      }

  }
  

  onSubmit(val) {
   // debugger;
    this.showloader = true;
    this.resultsFound = false;
    this.errorMessage = '';
    if (val == 'submit') {
      this.pagesize = 20;
      this.pageindex = 1;
      this.model['pageSize'] = this.pagesize;
      this.model['page'] = this.pageindex;
    } else {
      this.model['pageSize'] = this.pagesize;
      this.model['page'] = this.pageindex;
    }

  
    this.busy = this.JobboardsearchService.monsterClassicSearchAdvancedandNormal(this.model)
      .subscribe(
        (res: any) => {
          if (JSON.parse(res._body)['response']) {
            this.monstersearchResults = JSON.parse(res._body)['response']['monstersearch'];
            this.totalprofilesfound = JSON.parse(res._body)['response']['totalprofilesfound']
            this.highlightskillsarray = JSON.parse(res._body)['response']['highlightskills']

          }
          else {
            this.errorMessage = JSON.parse(res._body)['response']['message']
          }
          if (JSON.parse(res._body)['response']['monstersearch'].length > 1) {
            this.noresultsFound = false;
          }
          else {
            this.noresultsFound = true;

          }
         
        },
        err => {
          console.log(err);
        },
          () => {
              this.showloader = false;
        }
      );
  }

    populateCategoryDropdown() {
        this.busy = this.JobboardsearchService.GetMonsterClassicCategoryList()
            .subscribe(
                (res: any) => {
                    this.categoryList = JSON.parse(res._body)['response']['name'];
                },
                err => {
                    console.log(err);

                },
                () => {
                }
            );
    }
    populateIndustryDropdown() {
        this.busy = this.JobboardsearchService.GetMonsterClassicIndustryList()
            .subscribe(
                (res: any) => {
                    this.industryList = JSON.parse(res._body)['response']['name'];
                },
                err => {
                    console.log(err);

                },
                () => {
                }
            );
    }


}
