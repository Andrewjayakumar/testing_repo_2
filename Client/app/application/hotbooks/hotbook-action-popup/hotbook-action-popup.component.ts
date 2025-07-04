import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { of } from "rxjs/observable/of";
import { Observable, ObservableInput } from "rxjs/Observable";
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
import { HotBooksService } from "../hotbooks.service";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import {
  NgbActiveModal,
  NgbModal,
  NgbTooltip,
} from "@ng-bootstrap/ng-bootstrap";
import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-hotbook-action-popup",
  templateUrl: "./hotbook-action-popup.component.html",
  styleUrls: ["./hotbook-action-popup.component.scss"],
  providers: [HotBooksService],
})
export class HotbookActionPopupComponent implements OnInit {
  @Input() public isShared;
  @Input() public clientid;
  public tagId;
  recruiterdetails: Observable<any>;
  public recruiterinput$ = new Subject<string | null>();
  isJobTitleLoading = false;
  rForm: FormGroup;
  recruiterClear: any;
  sharedData: object = {};
  deleteData: object = {};
  private _success = new Subject<string>();
  private _failure = new Subject<string>();
  successMessage: string = "";
  failureMessage: string = "";
  @ViewChild("selfClosingAlert") selfClosingAlert: NgbAlert;
  busy: Subscription;
  sharedHotBook: boolean = false;

  constructor(
    private hotbookService: HotBooksService,
    public modal: NgbActiveModal
  ) {
    this.initializeTypeAheads();
  }

  ngOnInit() {
    this.requisitionsearchForm();

    this._success.subscribe((message) => (this.successMessage = message));
    this._success.pipe(debounceTime(3000)).subscribe(() => {
      if (this.selfClosingAlert) {
        this.modal.close(true);
      }
    });

    this._failure.subscribe((message) => (this.failureMessage = message));
    this._failure.pipe(debounceTime(3000)).subscribe(() => {
      if (this.selfClosingAlert) {
      //  this.modal.close(true);
      }
    });
  }

  // initialize type heads for search
  initializeTypeAheads() {
    this.recruiterdetails = this.recruiterinput$.pipe(
      filter((t) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchRecruiter("", term))
    );
  }

  // get Recruiter based on search
  searchRecruiter(clientid: any, name: any): ObservableInput<any> {
    clientid = "";
    if (!name) return of([]);
    this.isJobTitleLoading = true;
    return this.hotbookService.getRecruiter(clientid, name).pipe(
      map((res: any) => {
        this.isJobTitleLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response : [];
      })
    );
  }

  // form group
  requisitionsearchForm() {
    this.rForm = new FormGroup({
      recruiter: new FormControl(""),
    });
  }

  // share submit
  onClickSubmit(data) {
    if (this.isShared) {
      let recruitersData = this.recruiterClear.toString();
      this.sharedData["tagid"] = this.tagId;
      this.sharedData["recruiters"] = recruitersData.split(",");
      this.busy = this.hotbookService.shareHotbook(this.sharedData).subscribe(
        (res: any) => {
          let response = JSON.parse(res._body)["response"];
          if (response) {
            this._success.next("Shared successfully!");
            setTimeout(() => {
              this.modal.close(true);
            }, 5000);
          } else {
            this._failure.next("Something went wrong! Please try again");
          }
        },
        (err) => {
          this._failure.next("Something went wrong! Please try again");
          console.log(err);
        }
      );
    } else {
        this.busy = this.hotbookService.deleteHotbook(this.tagId, this.sharedHotBook).subscribe(
        (res: any) => {
          let response = JSON.parse(res._body)["response"];
          if (response) {
            this._success.next("Deleted successfully!");
            setTimeout(() => {
              this.modal.close(true);
            }, 5000);
          } else {
            this._failure.next("Something went wrong! Please try again");
          }
        },
        (err) => {
          this._failure.next("Something went wrong! Please try again");
          console.log(err);
        }
      );
    }
  }
}
