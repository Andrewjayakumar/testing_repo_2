import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  ViewChild,
} from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SubmitcandidateService } from "../submitcandidate.service";
import { Observable, Subject } from "rxjs";
import {
  filter,
  map,
  distinctUntilChanged,
  catchError,
  switchMap,
  concat,
  tap,
  debounceTime,
  takeUntil,
} from "rxjs/operators";
import { of } from "rxjs/observable/of";

@Component({
  selector: "app-checklist",
  templateUrl: "./checklist.component.html",
  styleUrls: [
    "../candidatesubmission.component.scss",
    "./checklist.component.scss",
  ],
})
export class ChecklistComponent implements OnInit {
  candidatecountry: string = "US";
  isofficeemployee: boolean = false;
  subtierItemsList$: Observable<any>;
    subtierinput$ = new Subject<string | null>();
    isbillrateskip: boolean = false;
  isSubtierLoading: boolean = false;
  isSubmitClicked = false;
 
  setSubmitClicked(value: boolean) {
    this.isSubmitClicked = value;
  }

  @ViewChild("ChecklistForm") ChecklistForm: any;

  @Input("requisitionid") public requisitionid: any = 0;
  @Input("candidateid") public candidateid: any = 0;
  @Input("pageerrors") public pageerrors = "";
  @Output() change: EventEmitter<any> = new EventEmitter<any>();
  @Output("officeEmpVal") public officeEmpVal: EventEmitter<any> = new EventEmitter<any>();
  @Output("country") public countryChanged: EventEmitter<string> =
    new EventEmitter();
  public stateChange = new EventEmitter();
  public state: boolean = true;

  datamodel = {
    drugtestcomplaince: false,
    collaberabenefits: false,
    accomodationneeded: false,
    candidatestatus: "InProcess",
    sourceid: null,
    employeejobtype: null,
    omc: null,
    employeejobtypeid: 1,
    employeecategoryid: null,
    employeecategory: null,
    payrateunittype: null,
    payrateunittypeid: null,
    payrateoffered: 1,
    billrate: null,
    subtierid: null,
    subtierfederalid: null,
    linktosubteir: null,
    countryid: null,

    markup: null,
    actualmarkup: null,
    isw3submission: false,
    IsShadowCandidate: false,
    isofficeemployee: false,
    minimumgp: null,
    minimumgpm: null,
    weeklyspread: null,
    maximummarkup: null,
    perdiem: null,
    subtierreferral: null,
    freebillinghours: null,
    otherdiscounts: null,
    resumeurl: "",
    candidateid: this.candidateid,
    requisitionid: this.requisitionid,
  };

  sourcelist: any = [];
  employeetypelist: any = [];
  categorylist = [];
  payratelist = [];
  fileslist = [];
  payrateinvalidMsg = null;
  billrateinvalidMsg = null;

  uploadComplete: boolean = false;

 
  constructor(public _service: SubmitcandidateService) {}

  ngOnInit() {
    this.getCategory();
    this.initializeTypeaheadsAndDropdowns();

    this._service
      .getSubmissionChecklistandType(this.candidateid, this.requisitionid)
      .subscribe((res: any) => {
        debugger;
        let response = res._body ? JSON.parse(res._body).response : [];
        let attributes = Object.keys(response[0]);
        attributes.forEach((attr) => {
          if (attr in this.datamodel) {
            if (response[0][attr]) this.datamodel[attr] = response[0][attr];
          }
        });

        this.candidatecountry = response[0].countryid;
        this.countryChanged.emit(
          response[0].countryid ? response[0].countryid : this.candidatecountry
        );

        this.isofficeemployee = response[0].isofficeemployee;
        this.officeEmpVal.emit(
          response[0].isofficeemployee ? response[0].isofficeemployee : this.isofficeemployee
        );
          this.isbillrateskip = response[0].isbillrateskip;

      });
  }

  initializeTypeaheadsAndDropdowns() {
    this._service.getCandidateSourceOptions().subscribe((res: any) => {
      let response = res._body ? JSON.parse(res._body).response : {};
      this.sourcelist = response.candidatesource;
      //candidatesource
    });
    this._service.getEmployeeType().subscribe((res: any) => {
      let response = res._body ? JSON.parse(res._body).response : {};

      this.employeetypelist = response ? response.employeejobtypes : [];
    });

    this.subtierItemsList$ = this.subtierinput$.pipe(
      filter((t) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchVendorName(term))
    );
  }

  searchVendorName(term: string) {
    if (!term) return of([]);

    this.isSubtierLoading = true;
    return this._service.getSubtierVendorNames(term).pipe(
      map((res: any) => {
        this.isSubtierLoading = false;
        let resP = JSON.parse(res._body).response;
        return resP ? resP : [];
      }),
      takeUntil(this.subtierinput$)
    );
  }

  OnEmployeeTypeChanged(event) {
    if (!event) {
      this.datamodel.employeecategoryid = null;
      this.datamodel.payrateunittypeid = null;
      return;
    }
    let id = event.employeejobtypeid;
    this.datamodel.employeejobtype = event.employeejobtype;
    this._service
      .getCategoryandPayRatebyEmployeeType(
        id,
        this.candidatecountry,
        this.requisitionid
      )
      .subscribe((res: any) => {
        let response = JSON.parse(res._body).response;
        this.categorylist = response.categorylist;
        this.payratelist = response.payratetypelist;
        if (this.categorylist.length == 1) {
          this.datamodel.employeecategoryid =
            this.categorylist[0].employeecategoryid;
          this.datamodel.employeecategory =
            this.categorylist[0].employeecategory;
        } else {
          //clear the field whenever the employee type changes
          this.datamodel.employeecategoryid = null;
        }
        if (this.payratelist.length == 1) {
          this.datamodel.payrateunittypeid =
            this.payratelist[0].payrateunittypeid;
          this.datamodel.payrateunittype = this.payratelist[0].payrateunittype;
        } else {
          this.datamodel.payrateunittypeid = null;
        }
      });
  }

  OnSubTierVendorChanged(event) {
    this.datamodel.subtierfederalid = event.subtierfederalid
      ? event.subtierfederalid
      : null;
    this.datamodel.linktosubteir = event.linktosubteir
      ? event.linktosubteir
      : null;
  }

  CalculateGPGPMMarkup(event) {
    if (
      this.datamodel.billrate &&
      this.datamodel.payrateoffered &&
      this.datamodel.employeejobtypeid
    ) {
      this._service
        .getGPGPMandMarkup(
          this.requisitionid,
          this.datamodel.billrate,
          this.datamodel.payrateoffered,
          this.datamodel.payrateunittypeid,
          this.datamodel.employeejobtypeid,
          this.datamodel.employeecategoryid,
          this.datamodel.perdiem,
          this.datamodel.subtierreferral,
          this.datamodel.freebillinghours,
          this.datamodel.otherdiscounts,
          this.datamodel.IsShadowCandidate
        )
        .subscribe((res: any) => {
          let response = JSON.parse(res._body).response;
          response = response[0];
          //  debugger;
          this.datamodel.minimumgp = response.gp;
          this.datamodel.minimumgpm = response.gpm;
          this.datamodel.actualmarkup = response.actualmarkup;
          this.datamodel.markup = response.ismarkup;
          this.datamodel.maximummarkup = response.maximummarkup;
          this.datamodel.weeklyspread = response.weeklyspread;
        });
    }
  }

  OnPayRateUnitTypeChanged(event, payrateunittypeid) {
    this.datamodel.payrateoffered = null;
    if(this.datamodel.isofficeemployee) {
      this.datamodel.billrate = null;
    }
    this.datamodel.payrateunittype = event.payrateunittype;
    if(this.datamodel.IsShadowCandidate) {
      this.CalculateGPGPMMarkup(event);
    }
    //this.datamodel.billrate = null;
  }

  ValidatePayRate(event, mode, record) {
    debugger;
    let pattern = null;
    let value = record.value;
    if (!value) return;
    if(!(this.datamodel.IsShadowCandidate)) {
    if (mode == "hourly") {
      pattern = /^\d{1,3}(\.\d{1,2})?$/;
      if (this.datamodel.billrate && this.datamodel.billrate <= value) {
        this.billrateinvalidMsg = "Bill Rate should be greater than Pay Rate";
        // return;
      } else this.billrateinvalidMsg = null;
    } else {
      pattern = /^\d{5,8}(\.\d{1,2})?$/;
    }

    if (pattern.test(value) && record.valid) {
      this.payrateinvalidMsg = null;

        this.CalculateGPGPMMarkup(event);

    } else {
      this.payrateinvalidMsg =
        mode == "hourly"
          ? "The Pay rate cannot be more than $999 and contain upto 2 decimal places "
          : "The Pay rate should be at least 5 digits and upto 2 decimal places";
    }
  }
  }

  ValidateBillRate(event, record) {
    debugger;
    let mode = this.datamodel.payrateunittype
      ? this.datamodel.payrateunittype.toLowerCase()
      : "hourly";
    let pattern = null;
    let value = record.value;
    if (!value) return;
    if(!(this.datamodel.IsShadowCandidate)) {
    if (mode == "hourly") {
      pattern = /^\d{1,3}(\.\d{1,2})?$/;
      if (
        this.datamodel.payrateoffered &&
        this.datamodel.payrateoffered >= value
      ) {
        this.billrateinvalidMsg = "Bill Rate should be greater than Pay Rate";

        return;
      } else {
        this.billrateinvalidMsg = null;
      }
    } else {
      pattern = /^\d{1,3}(\.\d{1,2})?$/;
      this.billrateinvalidMsg = null;
    }

    if (pattern.test(value) && record.valid) {

        this.CalculateGPGPMMarkup(event);

      this.billrateinvalidMsg = null;
    } else {
      this.billrateinvalidMsg =
        "The Bill Rate cannot be more than $999 and should be upto 2 decimal places";
    }
  }
  }

  uploadSubmissionResume(files) {
    this.fileslist = files;
    if (files.length === 0) {
      this.fileslist = []; // explicitly mark it to empty to show required message
      return;
    }
    this.uploadComplete = false;
    let fileToUpload = <File>files[0];
    let filename = fileToUpload.name;
    let extension = "";
    if (filename && filename.lastIndexOf(".") > -1) {
      extension = filename.substring(
        filename.lastIndexOf(".") + 1,
        filename.length
      );
    }

    if (!(extension == "pdf" || extension == "docx" || extension == "doc")) {
      this.fileslist = [];
      // explicitly mark the list to empty to show required message
      return;
    }
    const formData = new FormData();
    formData.append("file", fileToUpload, fileToUpload.name);
    formData.append("action", "submissionresume");
    formData.append("requisitionId", this.requisitionid);
    formData.append("candidateId", this.candidateid);

    this._service.uploadSubmissionResume(formData).subscribe((res) => {
      // debugger;
      let body = JSON.parse(res._body);
      this.datamodel.resumeurl = body.response ? body.response : "";
      this.uploadComplete = true;
    });
  }

  AddDecimalZeros() {
    //TODO
  }

  getCategory() {
    this._service
    .getCategoryandPayRatebyEmployeeType(
      this.datamodel.employeejobtypeid,
      this.candidatecountry,
      this.requisitionid
    )
    .subscribe((res: any) => {
      let response = JSON.parse(res._body).response;
      this.categorylist = response.categorylist;
      this.payratelist = response.payratetypelist;
      if (this.categorylist.length == 1) {
        this.datamodel.employeecategoryid =
          this.categorylist[0].employeecategoryid;
        this.datamodel.employeecategory =
          this.categorylist[0].employeecategory;
      } else {
        //clear the field whenever the employee type changes
        this.datamodel.employeecategoryid = null;
      }
    });
  }

  onStateChanged(e) {
    // // this.state = !(this.state);
    debugger;
    this.datamodel.IsShadowCandidate = !(this.datamodel.IsShadowCandidate);
    if(this.datamodel.IsShadowCandidate) {
      this.CalculateGPGPMMarkup(event);
    }
    // alert(this.datamodel.isshadowcandidate);
    this.change.emit(this.datamodel.IsShadowCandidate);
  }

  onChange(e) {
    debugger;
    this.datamodel.isofficeemployee = !(this.datamodel.isofficeemployee);
    this.officeEmpVal.emit(this.datamodel.isofficeemployee);
  }
}
