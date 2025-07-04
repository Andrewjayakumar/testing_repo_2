import { Component, Input, OnInit, ViewChild } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbTooltip,
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
  selector: "app-add-hotbook-folder",
  templateUrl: "./add-hotbook-folder.component.html",
  styleUrls: ["./add-hotbook-folder.component.scss"],
  providers: [RequisitionAdvancedSearchService, HotBooksService, AddrecService],
})
export class AddHotbookFolderComponent implements OnInit {
  busy: Subscription;
  //towerDetails: any;
  //towerid: any;
  //subtowerid: any;
  //towerClear: any;
  //subtowerClear: any;
  jobTitleClear: any;
  //subTowerDetails: any;
  regionClear: any;
  cityClear: any;
  clientClear: any;
  region: any;
  tagType: string = "Personal";
  hotbooks = [];
  rForm: FormGroup;
  successMessage: string = "";
  failureMessage: string = "";
  private _success = new Subject<string>();
  private _failure = new Subject<string>();
  @ViewChild("selfClosingAlert") selfClosingAlert: NgbAlert;
  clientNameDetails: Observable<any>;
  public clientdatainput$ = new Subject<string | null>();
  jobtitledetails: Observable<any>;
  public jobtitleinput$ = new Subject<string | null>();
  isClientLoading = false;
  isJobTitleLoading = false;
  @Input() public isEdit;
  @Input() public tagId;

  constructor(
    public modal: NgbActiveModal,
    private RequisitionAdvancedSearchService: RequisitionAdvancedSearchService,
    private hotbookservice: HotBooksService,
    private fb: FormBuilder,
    private recservice: AddrecService
  ) {
    this.initializeTypeAheads();
  }

  ngOnInit() {
    this.searchForm();
    //this.getAlltheTower();
    this.getRegion();

    if (this.isEdit) {
      this.getHotbookData(this.tagId);
    }

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

  // get hot book data for a specific ID
  getHotbookData(tagId) {
    this.busy = this.hotbookservice.getMyHotbooksData(tagId).subscribe(
      (res: any) => {
        let hotbookDetails = JSON.parse(res._body)["response"];

        if(hotbookDetails.tagid==tagId)
        {
          this.jobTitleClear = hotbookDetails.jobtitle;
          //this.towerClear = hotbookDetails.tower;
          // this.towerid = hotbookDetails.towerid;
          //this.subtowerClear = hotbookDetails.subtower;
          // this.subtowerid = hotbookDetails.subtowerid;
          this.regionClear = hotbookDetails.region;
          this.cityClear = hotbookDetails.city;
          this.clientClear = hotbookDetails.clientname;
  
          if (hotbookDetails.jobtitle != null) {
            this.rForm.controls["jobtitle"].disable();
          }
          //if (hotbookDetails.tower != null) {
            //this.rForm.controls["towerid"].disable();
          //}
          //if (hotbookDetails.subtower != null) {
            //this.rForm.controls["subtowerid"].disable();
          //}
        }
        else
        {
          this._failure.next("Something went wrong! Please try again");
        }

      },
      (err) => {},
      () => {}
    );
  }

  // initialize type heads for search
  initializeTypeAheads() {
    this.clientNameDetails = this.clientdatainput$.pipe(
      filter((t) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchClientName(term,""))
    );

    this.jobtitledetails = this.jobtitleinput$.pipe(
      filter((t) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchJobTitle(term))
    );
  }

  // get client name based on search
  searchClientName(term: string,userid): ObservableInput<any> {
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

  // get job title based on search
  searchJobTitle(term: string): ObservableInput<any> {
    if (!term) return of([]);
    this.isJobTitleLoading = true;
    return this.recservice.getJobTitle(term).pipe(
      map((res: any) => {
        this.isJobTitleLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.relatedjobtitles : [];
      })
    );
  }

  // form group
  searchForm() {
    this.rForm = new FormGroup({
      jobtitle: new FormControl(""),
      //towerid: new FormControl(null),
      //subtowerid: new FormControl(null),
      region: new FormControl(""),
      city: new FormControl(""),
      clientname: new FormControl(""),
    });
  }

  // get All the Tower Details
  //getAlltheTower() {
    //this.busy =
     // this.RequisitionAdvancedSearchService.getAlltheTower().subscribe(
       // (res: any) => {
       //   this.towerDetails = JSON.parse(res._body)["response"];
      //  },
      //  (err) => {},
     //   () => {}
     // );
  //}

  // get the Tower values
  //getTowerCode(value) {
   // this.towerid = "";
   // this.subtowerClear = "";
   // if (value.towerid) {
   //   this.towerid = value.towerid;
   //   this.gettheSubTower();
   // }
  //}

  // get the SubTower values
  //gettheSubTower() {
   // this.busy = this.RequisitionAdvancedSearchService.gettheSubTower(
   //   this.towerid
   // ).subscribe(
    //  (res: any) => {
    //    this.subTowerDetails = JSON.parse(res._body)["response"];
    //  },
    //  (err) => {
     //   console.log(err);
     // },
      //() => {
        //console.log("done");
      //}
    //);
  //}

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
        //console.log("done");
      }
    );
  }

  // reset form
  resetform() {
    this.rForm.reset();
    this.jobTitleClear = "";
    //this.towerClear = "";
    //this.subtowerClear = "";
    this.regionClear = "";
    this.cityClear = "";
    this.clientClear = "";
  }

  // add/edit folder submit
  onClickSubmit(data) {
    let isEdited = this.isEdit;
    if (isEdited == true) {
      data.tagid = this.tagId;
      data.jobtitle = this.jobTitleClear;
      // data.towerid = this.towerid;
      // data.subtowerid = this.subtowerid;
    }

    this.busy = this.hotbookservice.addFolder(data).subscribe(
      (res: any) => {
        debugger;
        let response = JSON.parse(res._body)["response"];
        let responseMsg = JSON.parse(res._body)["message"];
        if (response) {
          if (isEdited == true) {
            this._success.next("Hotbook edited successfully!");
          } else {
            this._success.next("Hotbook added successfully!");
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
        //console.log("done");
      }
    );
  }
}
