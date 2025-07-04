import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
  OnDestroy,
  TemplateRef,
} from "@angular/core";
import { JobboardsearchService } from "../jobboardsearch.service";
import { Subscription } from "rxjs";
import { SliderWeightsComponent } from "../../../shared/components/slider-weights/slider-weights.component";

import { Router, ActivatedRoute } from "@angular/router";
import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { MetalFilterComponent } from "../metal-filter/metal-filter.component";
import {
  NgbModal,
  NgbModalOptions,
  NgbTooltip,
} from "@ng-bootstrap/ng-bootstrap";
import { MatchReasonComponent } from '../match-reason/match-reason.component';


@Component({
  selector: "app-metal-match",
  templateUrl: "./metal-match.component.html",
  styleUrls: ["./metal-match.component.scss"],
  providers: [JobboardsearchService]
})
export class MetalMatchComponent implements OnInit, AfterViewInit, OnDestroy {

  busy: Subscription;
  candidateResponse: any;
  matchingCandidates: any = [];
  totalrecords: number = 0;
  reqMessage;
  pagesize: number = 20;
  pageindex: number = 1;
  showNotifyBadge: boolean = false;
  @Input("data") data;
  @Input() isCandidateDashboard: boolean = false;
  @Input('aidrivenuser') aidrivenuser = false;
  aigenerated = true;
  popupConfig: any;
  @ViewChild('content') content: TemplateRef<any>;
  requisitionid: any;
  istopmatch: boolean = true;
  public locationcheck: boolean = false;
  weightageproperties = {
    education: 0.4,
    jobtitles: 0,
    skills: 0.3,
    industries: 0,
    languages: 0,
    certifications: 0.3,
    executivetype: 0,
    managementlevel: 0,
  };

  apiParam = {
    requisitionid: 0,
    pageindex: 0,
    pagesize: 0,
    weightlevelid: 7,
    weightageproperties: {},
    skills: [],
    jobtitles: [],
    country: "",
    cities: [],
    minexperience: 0,
    maxexperience: 0,
    skilltype: 1,
    ismanual: false,
    zipcodes: [],
    distance: 0,
      state: [],
    isJump: false,
    LastUpdatedDaysBack:null
  };
  showLoader: boolean;
  filterData = {
    skills: [],
    jobtitles: [],
    country: "",
    cities: [],
    minexperience: 0,
    maxexperience: 0,
    skilltype: 1,
    ismanual: true,
    zipcodes: [],
    distance: 0,
      state: [],
    isJump: false,
    LastUpdatedDaysBack:null
  };
  sourceCandidatesResp: any;

  // @ViewChild("sliderComponent")
  //public sliderComponent: SliderWeightsComponent;
  candidateidArray = [];
  constructor(
    private currentRoute: ActivatedRoute,
    private jobboardsearchService: JobboardsearchService,
    private router: Router,
    public _modalService: NgbModal,

  ) {
    this.currentRoute.queryParams.subscribe(params => {
      this.requisitionid = parseInt(params['requisitionid']);
    });
    this.showLoader = false;
    this.popupConfig = { "title": "", "message": "", "type": "", "isConfirm": false };

  }

  ngOnInit() {
    this.getDefaultSkillsAndExp();
  }

  ngAfterViewInit() {
    this.getMatchingCandidates();
  }

  onPageChanged(event) {
    this.pageindex = event;
    this.getMatchingCandidates();
  }

  getDefaultSkillsAndExp() { 
    debugger;
    let id = this.requisitionid;
    this.busy = this.jobboardsearchService
      .getDefaultSkills(id)
      .subscribe(
        (res: any) => {
          let response = JSON.parse(res._body)["response"];
          this.filterData.skills = response ? response[0].skills : [];
          this.filterData.minexperience = response ? response[0].minexperience : null;
          this.filterData.maxexperience = response ? response[0].maxexperience : null;
          this.filterData.country = response ? response[0].country : null;
        },
        (err) => {
          console.log(err);
        },
        () => { }
      );
  }

  // get matching cnadidates
  getMatchingCandidates() {
    this.matchingCandidates = [];
    this.showLoader = true;

    this.apiParam.requisitionid = this.requisitionid;
    this.apiParam.pageindex = this.pageindex;
    this.apiParam.pagesize = this.pagesize;
    if (this.apiParam.skills.length < 1) {
      this.apiParam.skills = [];
    }
    if (this.apiParam.jobtitles.length < 1) {
      this.apiParam.jobtitles = [];
    }
    if (this.apiParam.cities.length < 1) {
      this.apiParam.cities = [];
    }
    if (this.apiParam.zipcodes.length < 1) {
      this.apiParam.zipcodes = [];
    }

    this.busy = this.jobboardsearchService
      .getMatchingCandidates(this.apiParam)
      .subscribe(
        (res: any) => {
          debugger;
          this.candidateResponse = JSON.parse(res._body)["response"];
          this.reqMessage = JSON.parse(res._body)["message"];
          this.matchingCandidates = this.candidateResponse ? this.candidateResponse.metalcandidates : [];
          this.totalrecords = this.candidateResponse.totalprofilesfound;
          this.istopmatch = this.candidateResponse.istopmatch;
          this.showLoader = false;
        },
        (err) => {
          console.log(err);
        },
        () => {
          this.showLoader = false;
        }
      );
  }

  //
  OnSearchClicked() {
    /*  let weightage = this.sliderComponent.getWeightageDistribution();  //temporaraliy commenting until sliderweights are added
      let keys = Object.keys(weightage);
      keys.forEach((key) => {
        this.weightageproperties[key] = weightage[key];
      }); */

    this.getMatchingCandidates();
  }

  actionchecked(event) {
    if (event.isChecked) {
      this.candidateidArray.push(event.candidateid);
    } else {
      const index = this.candidateidArray.indexOf(event.candidateid);
      if (index > -1) {
        this.candidateidArray.splice(index, 1);
      }
    }
  }

  // source the candidates

  sourceCandidates() {
    let apiparam: any = {
      requisitionid: parseInt(this.requisitionid),
      candidateid: this.candidateidArray,
      sourcefrom: "Sovren",
    };
    this.busy = this.jobboardsearchService
      .sourceMatchingCandidates(apiparam)
      .subscribe(
        (res: any) => {
          debugger;

          if (JSON.parse(res._body)["response"]) {
            this.candidateidArray = [];
            this.getMatchingCandidates();

            this.popupConfig.title = "Success!";
            this.popupConfig.message = "Successfully Sourced Candidates " ;
            this.popupConfig.type = "success";
            //  this.popupConfig.isConfirm = true;
            this.openPopup();
          } else {
            window.scrollTo(0, 0);
            this.sourceCandidatesResp = JSON.parse(res._body)["message"];
            this.candidateidArray = [];

            this.popupConfig.title = "Error Occurred !";
            this.popupConfig.message = "Failed to Source Candidates -" + this.sourceCandidatesResp.message;
            this.popupConfig.type = "error";
            //  this.popupConfig.isConfirm = true;
            this.openPopup();

           setTimeout(() => {
              this.sourceCandidatesResp = '';
            }, 5000);

          }

        },
        (err) => {

          let sourceCandidatesResp = JSON.parse(err._body)["response"];
          this.popupConfig.title = "Error Occurred !";
          this.popupConfig.message = "Failed to Source Candidates -" + sourceCandidatesResp.message;
          this.popupConfig.type = "error";
        //  this.popupConfig.isConfirm = true;
          this.openPopup();
          console.log(err);

        },
        () => {
        }
      );
  }
  openPopup(closePopup?: boolean) {
    let ngbModalOptions: NgbModalOptions = {
         backdrop: 'static',
         keyboard: false
     };

    let modalRef = this._modalService.open(this.content, ngbModalOptions);

 }
  openFilters() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",
      windowClass: "overrides",
    };

    const modalRef = this._modalService.open(
      MetalFilterComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.filters = this.filterData;
    modalRef.result.then((result) => {
      if (result) {
        this.apiParam.skills = result.skills;
        this.apiParam.jobtitles = result.jobtitles;
        this.apiParam.country = result.country;
        this.apiParam.cities = result.cities;
        this.apiParam.minexperience = result.minexperience;
        this.apiParam.maxexperience = result.maxexperience;
        this.apiParam.skilltype = result.skilltype;
        this.apiParam.zipcodes = result.zipcodes;
        this.apiParam.distance = result.distance;
        this.apiParam.state = result.state;
        this.apiParam.LastUpdatedDaysBack = result.LastUpdatedDaysBack;



        this.filterData.skills = result.skills;
        this.filterData.jobtitles = result.jobtitles;
        this.filterData.country = result.country;
        this.filterData.cities = result.cities;
        this.filterData.minexperience = result.minexperience;
        this.filterData.maxexperience = result.maxexperience;
        this.filterData.skilltype = result.skilltype;
        this.filterData.zipcodes = result.zipcodes;
        this.filterData.distance = result.distance;
        this.filterData.state = result.state;
        this.filterData.LastUpdatedDaysBack = result.LastUpdatedDaysBack;



        if (this.filterData.skills.length > 0 || this.filterData.jobtitles.length > 0 || this.filterData.cities.length > 0 || this.filterData.country != "" || (this.filterData.minexperience >= 0 && this.filterData.maxexperience >= 0) || this.filterData.zipcodes.length > 0 || this.filterData.distance) {
          this.showNotifyBadge = true;

          this.apiParam.ismanual = true;
        } else {
          this.showNotifyBadge = false;
          this.apiParam.ismanual = false;
        }
      }
    });
  }

  WeightLevelChanged(event) {

  }

  onSkillRangeSelected() {
    this.apiParam.ismanual = true;
  }

  launchMatchReasonPopup(event) {
    // debugger;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",
      windowClass: "matchreasons",
    };

    const modalRef = this._modalService.open(MatchReasonComponent, ngbModalOptions);
    modalRef.componentInstance.candidateId = event.id;
    modalRef.componentInstance.candidateFullName = event.name;
    modalRef.componentInstance.requisitionId = this.requisitionid;

  }

  ngOnDestroy(): void {

    if (this.busy)
      this.busy.unsubscribe();
  }

}
