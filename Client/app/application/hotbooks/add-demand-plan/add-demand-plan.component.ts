import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbTooltip,
  NgbDateStruct,
  NgbDateParserFormatter,
} from "@ng-bootstrap/ng-bootstrap";
import { Subscription, Subject } from "rxjs";
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
import { of } from "rxjs/observable/of";
import { Observable, ObservableInput } from "rxjs/Observable";
import { RequisitionAdvancedSearchService } from "../../requisitions/req-adb-search/requisition-advanced-search.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { HotBooksService } from "../hotbooks.service";
import { isEmpty } from "lodash";
import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";
import { AddrecService } from "../../requisitions/add-requisition/addrec.service";

@Component({
  selector: "app-add-demand-plan",
  templateUrl: "./add-demand-plan.component.html",
  styleUrls: ["./add-demand-plan.component.scss"],
  providers: [RequisitionAdvancedSearchService, HotBooksService, AddrecService],
})
export class AddDemandPlanComponent implements OnInit {
  busy: Subscription;
  model: NgbDateStruct;
  demandNameClear: any;
  candidatesClear: any;
  skillsClear: any;
  recruitersClear: any;
  descriptionClear: any;
  regionClear: any;
  clientClear: any;
  region: any;
  tagType: string = "Personal";
  hotbooks = [];
  demandForm: FormGroup;
  successMessage: string = "";
  failureMessage: string = "";
  private _success = new Subject<string>();
  private _failure = new Subject<string>();
  @ViewChild("selfClosingAlert") selfClosingAlert: NgbAlert;
  clientNameDetails: Observable<any>;
  public clientdatainput$ = new Subject<string | null>();
  skillsList: Observable<any>;
  public skillinput$ = new Subject<string | null>();
  recruitersList: Observable<any>;
  public recruiterinput$ = new Subject<string | null>();
  isClientLoading = false;
  isSkillLoading = false;
  isRecruiterLoading = false;
  @Input() public isEdit;
  @Input() public tagId;
  @Input() public id;
  @Input() public mode;

  DpDetailsByID: any;
  dpEnddate: any;
  constructor(
    public modal: NgbActiveModal,
    private RequisitionAdvancedSearchService: RequisitionAdvancedSearchService,
    private hotbookservice: HotBooksService,
    private fb: FormBuilder,
    private recservice: AddrecService,
    private parserFormatter: NgbDateParserFormatter
  ) {
    this.initializeTypeAheads();
  }

  ngOnInit() {
    this.demandPlanForm();
    this.getRegion();
    this.getallDPDetailsById();
   

    this._success.subscribe((message) => (this.successMessage = message));
    this._success.pipe(debounceTime(3000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.modal.close(true);
      }
    });

    this._failure.subscribe((message) => (this.failureMessage = message));
    this._failure.pipe(debounceTime(3000)).subscribe(() => {
      if (this.selfClosingAlert) {
        // this.modal.close(true);
      }
    });
  }

  // get DP Details By ID
  getallDPDetailsById() {
  
    if (this.id) {
      let apiparam: any = {
        'demandplanid': this.id
      };
      this.busy = this.hotbookservice.getallDMDetailsById(
        apiparam
      ).subscribe(
        (res: any) => {
          this.DpDetailsByID = JSON.parse(res._body)["response"];
          this.enddateModelUpdate(this.DpDetailsByID[0].demandenddate);
          this.editDemandplanForm(this.DpDetailsByID);
         // this.mode = 'edit';

        },
        (err) => {
          console.log(err);
        },
        () => {
         
        }
      );
    }
   
  }

  enddateModelUpdate(dpenddate: any) {

    if (dpenddate) {
      let dpend = new Date(dpenddate);

      this.dpEnddate = { "year": dpend.getFullYear(), "month": dpend.getMonth() + 1, "day": dpend.getDate() };
}
}

  // pre populate the Demand Plan
  editDemandplanForm(DpDetails) {
    this.demandForm = this.fb.group({
      demandname: [DpDetails[0].demandname ? DpDetails[0].demandname  : null],
      maxcount: [DpDetails[0].maxcount],
      demandenddate: [this.dpEnddate],
      regionid: [DpDetails[0].regionid],
      clientid: [DpDetails[0].clientid],
      primaryskills: [DpDetails[0].primaryskills],
      recruiters: [DpDetails[0].recruitername],
      description: [DpDetails[0].description],
    });
    this.clientClear = DpDetails[0].clientname;
  }

  // initialize type heads for search
  initializeTypeAheads() {
    this.clientNameDetails = this.clientdatainput$.pipe(
      filter((t) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchClientName(term, ''))
    );

    this.skillsList = this.skillinput$.pipe(
      filter((t) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchSkills(term))
    );

    this.recruitersList = this.recruiterinput$.pipe(
      filter((t) => t && t.length > 2),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchRecruiter(term))
    );
  }

  // get client name based on search
  searchClientName(term: string, userid): ObservableInput<any> {
    if (!term) return of([]);
    this.isClientLoading = true;
    return this.recservice.getClientName(term, userid).pipe(
      map((res: any) => {
        this.isClientLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.clients : [];
      })
    );
  }

  // get skills based on search
  searchSkills(term: string): ObservableInput<any> {
    if (!term) return of([]);
    this.isSkillLoading = true;
    return this.recservice.getPrimarySkills(term).pipe(
      map((res: any) => {
        this.isSkillLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.relatedskills : [];
      })
    );
  }

  // get recruiters based on search
  searchRecruiter(term: string): ObservableInput<any> {
    if (!term) return of([]);
    this.isRecruiterLoading = true;
    return this.recservice.getRecruitersList(term, this.clientClear).pipe(
      map((res: any) => {
        this.isRecruiterLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response : [];
      })
    );
  }

  // form group
  demandPlanForm() {
    this.demandForm = new FormGroup({
      demandname: new FormControl(""),
      maxcount: new FormControl(""),
      demandenddate: new FormControl(""),
      regionid: new FormControl(""),
      clientid: new FormControl(""),
      primaryskills: new FormControl(""),
      recruiters: new FormControl(""),
      description: new FormControl(""),
    });
  }

  // get Region
  getRegion() {
    let apiparam: any = {};
    this.busy = this.RequisitionAdvancedSearchService.getregion(
      apiparam
    ).subscribe(
      (res: any) => {
        this.region = JSON.parse(res._body)["response"];
      },
      (err) => {
        console.log(err);
      },
      () => {
       
      }
    );
  }

  // reset form
  resetform() {
    this.demandForm.controls.maxcount.reset();
    this.demandForm.controls.demandenddate.reset();
    this.demandForm.controls.regionid.reset();
    this.demandForm.controls.clientid.reset();
    this.demandForm.controls.primaryskills.reset();
    this.demandForm.controls.recruiters.reset();
    this.demandForm.controls.description.reset();
    this.model = this.model;
   
  }

  // Add Demand Plan
  onClickSubmit(data) {
  
    if (this.mode == 'edit') {
      data.dpaction = 1;
      let enddate = this.parserFormatter.format(data.demandenddate);
      data.demandenddate = enddate;
      data.demandid = this.id;
    } else {
      data.dpaction = 0;
      let date = this.parserFormatter.format(this.model);
      data.demandenddate = date;
    }

    this.busy = this.hotbookservice.addDemandPlan(data).subscribe(
      (res: any) => {
        debugger;
        let response = JSON.parse(res._body)["response"];
        let responseMsg = JSON.parse(res._body)["message"];
        if (response) {
          if (this.mode == 'edit') {
            this._success.next("Demand Plan updated successfully!");

          } else {
            this._success.next("Demand Plan added successfully!");
          }

          setTimeout(() => {
            this.resetform();
            this.modal.close(true);
          }, 5000);
        } else {
          this._failure.next(responseMsg);
        }
      },
      (err) => {
        this._failure.next("Something went wrong! Please try again");
        console.log(err);
      },
      () => {
      
      }
    );
  }
}
