import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import {
  filter,
  distinctUntilChanged,
  switchMap,
  debounceTime,
  map,
} from "rxjs/operators";
import { of } from "rxjs/observable/of";
import { Observable, ObservableInput } from "rxjs/Observable";
import { Subscription, Subject } from "rxjs";
import { RedeploymentService } from "../../redeployment/redeployment.service";
@Component({
  selector: "app-candidatetoreq",
  templateUrl: "./candidatetoreq.component.html",
  styleUrls: ["./candidatetoreq.component.scss"],
  providers: [RedeploymentService],
})
export class CandidatetoReqComponent implements OnInit {
  cohertdetails: Observable<any>;
  public cohertinput$ = new Subject<string | null>();
  isCohertLoading = false;
  selectedCohert: any = null;
  busy: Subscription;
  allCohorts: any;
  candidates = [];
  minScore: any = null;
  reqAge: any = null;
  reqs: any; 
  recommendedreqs: any;
  errMsgforReqs: any;
  showLoader = false;
  showSpinner = false; 
  selectedCandidate = { id: null };
  candidateID: any;

  scoreValues = [
    { "scoreKey": "10", "scoreValue": 10 },
    { "scoreKey": "20", "scoreValue": 20 },
    { "scoreKey": "30", "scoreValue": 30 },
    { "scoreKey": "40", "scoreValue": 40 },
    { "scoreKey": "50", "scoreValue": 50 },
    { "scoreKey": "60", "scoreValue": 60 },
    { "scoreKey": "70", "scoreValue": 70 },
    { "scoreKey": "80", "scoreValue": 80 },
    { "scoreKey": "90", "scoreValue": 90 },
  ];

  reqAgeValues = [
    { "reqAgeKey": 1, "reqAgeValue": "1 Days" },
    { "reqAgeKey": 5, "reqAgeValue": "5 Days" },
    { "reqAgeKey": 15, "reqAgeValue": "15 Days" },
    { "reqAgeKey": 30, "reqAgeValue": "30 Days" },
    { "reqAgeKey": 45, "reqAgeValue": "45 Days" },
    { "reqAgeKey": 60, "reqAgeValue": "60 Days" },
    { "reqAgeKey": 90, "reqAgeValue": "90 Days" },
  ];

  filterPayload = {
    "candidateid": 0,
    "pageindex": 1,
    "pagesize": 20,
    "jobtitles": [],
    "country": "",
    "cities": [],
    "ismanual": true,
    "requisitiontypeid": 0,
    "ageBydays": 0,
    "zipcodes": [],
    "distance": 0,
    "qualificationid": [],
    "skills": [],
    "isremote": false,
    "state": [],
    "minbillrate": 0, 
    "maxbillrate": 0,
    "currencytype": "", 
    "isunattended": false, 
    "isredeploymatch": true, 
    "sovrenrelevance": 80,
    "issubtier":false
  }

  constructor(
    private router: Router,
    private currentroute: ActivatedRoute,
    private service: RedeploymentService

  ) {
    this.initializeTypeAheads();
  }

  ngOnInit() {
    this.minScore = 80;
    this.getAllCohorts();
  }

  // initialize type heads for search
  initializeTypeAheads() {
    this.cohertdetails = this.cohertinput$.pipe(
      filter((t) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchCohort(term))
    );
  }

  // get cohorts based on search
  searchCohort(term: string): ObservableInput<any> {
    if (!term) return of([]);
    this.isCohertLoading = true;
    return this.service.getCoherts(term).pipe(
      map((res: any) => {
        this.isCohertLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.cohortmaster : [];
      })
    );
  }

  // get All Cohotrs
  getAllCohorts() {
    this.busy = this.service.getCoherts(" ").subscribe(
      (res: any) => {
        this.allCohorts = JSON.parse(res._body)["response"];
        this.cohertdetails = this.allCohorts.cohortmaster;
        // this.selectedCohert = this.allCohorts.cohortmaster[0].passvalue;
      },
      (err) => {},
      () => {}
    );
  }

  // get the Cohort values
  getCohortBasedOnSearch(value) {
    this.selectedCohert = null;

    if (value) {
      this.selectedCohert = value.passvalue;
      this.getAllCandidates();
    }
  }

  // get All Candidates
  getAllCandidates() {
    let data = {
      "cohort": null,
      "redeployed": true
    }
    data.cohort = this.selectedCohert;
    this.showSpinner  = true;
    this.candidates = null;
    this.busy = this.service.getCandidates(data).subscribe(
      (res: any) => {
        if (JSON.parse(res._body)["response"]) {
          this.candidates = JSON.parse(res._body)["response"];
          this.showSpinner  = false;
        } else {
          this.showSpinner  = false;
        }
      },
      (err) => {},
      () => {}
    );
  }

  // method to reset filters
  resetFilter() {
    this.minScore = 80;
    this.reqAge = null;
    this.applyFilter();
  }

  // method to apply filters
  applyFilter() {
    this.filterPayload.sovrenrelevance = this.minScore;
    this.filterPayload.ageBydays = this.reqAge;
    this.showLoader = true;
    this.recommendedreqs = null;

    this.busy = this.service.getrecommendedRequisitions(this.filterPayload).subscribe(
      (res: any) => {
        if (JSON.parse(res._body)["response"]) {
          this.recommendedreqs = JSON.parse(res._body)['response']['results'];
          
          this.showLoader = false;
          if (this.recommendedreqs.length == 0) {
            setTimeout(() => {
              this.recommendedreqs = null;
            }, 3000);
          }
         

        } else {
          this.showLoader = false;

        }
      },
      (err) => {},
      () => {}
    );
  }

  // method to get reqisitions
  getrecommendedRecs(candidate) {
    this.recommendedreqs = null;
    if (candidate.candidateid) {
      this.filterPayload['candidateid'] = candidate.candidateid;
      this.selectedCandidate.id = candidate.candidateid;
      this.showLoader = true;
      this.candidateID = candidate.candidateid;
      this.filterPayload['issubtier'] = candidate.issubtier;

    }
 
    this.busy = this.service.getrecommendedRequisitions(this.filterPayload).subscribe(
      (res: any) => {
        if (JSON.parse(res._body)['response']) {
          this.recommendedreqs = JSON.parse(res._body)['response']['results'];
          this.showLoader = false;
        }
        else {
          this.errMsgforReqs = JSON.parse(res._body)['message'];
          this.showLoader = false;
          setTimeout(() => {
            this.errMsgforReqs = "";
          }, 3000);
        }
      },
      err => {

      }
    )
  }

  // method to see more of Requisitions
  seeMore() {
    sessionStorage.setItem("currentCandidateID", this.selectedCandidate.id);
    sessionStorage.setItem("reqAge", this.reqAge);
    sessionStorage.setItem("sovernScore", this.minScore);
    this.router.navigate(["/apps/requisitionspage/candidate-matching"]);
}


  redirectToRecPage(id, matchLink) {
    let urlRoute = "/apps/recoverview";
    let url = urlRoute + "?requisitionid=" + id;
    if (this.candidateID && id) {
      debugger;
      sessionStorage.setItem("currentCandidateID", this.candidateID);

    }

    if (matchLink) {
      this.router.navigate([]).then(result => { window.open(url, '_blank'); });
    } else {
      this.router.navigateByUrl(url);
    }
  }
}
