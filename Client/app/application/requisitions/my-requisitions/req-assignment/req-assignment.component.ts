import { Component, OnInit,  Input } from '@angular/core';
import { Router } from '@angular/router';
import { MyRequisitionsService } from '../../my-requisitions/my-requisitions.service';
import { Subscription, Subject } from 'rxjs';
import { NgbActiveModal, NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs/observable/of';
import { Observable, ObservableInput } from 'rxjs/Observable';
import { filter, distinctUntilChanged, switchMap, tap, catchError, debounceTime, concat, map } from 'rxjs/operators';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'req-assignment',
  templateUrl: './req-assignment.component.html',
  styleUrls: ['./req-assignment.component.scss'],
  providers: [MyRequisitionsService]

})
export class ReqAssignmentComponent implements OnInit {

  @Input() public id;
  @Input() public recruiter;

  reqAssignment: any = [];
  pagesize: number = 5;
  pageindex: number = 1;
  totalrecords: number = 10;
  noRecordMsg: string = null;
  busy: Subscription;
  searching = false;
  searchFailed = false;
  Message: any;
  clickedItem: any;
  successMessage = false;
  recruiterName: any;
  public recruiterdatainput$ = new Subject<string | null>();
  public recruiterdata$: Observable<any>;
  isRecruiterisLoading = false;
  recAssignForm: FormGroup;



  constructor(private router: Router, private recservice: MyRequisitionsService, public modal: NgbActiveModal, private fb: FormBuilder) { }

  ngOnInit() {
    let id = this.id;
    this.recruiterName = this.recruiter;
    this.getAllAssignments(id, 1, 10);
    this.initchildForm();
    this.initializeTypeAheads();
    this.populateRecruiterNames();


  }

  initchildForm() {
    this.recAssignForm = this.fb.group({
      recruiter: [[]],
 
    })
  }

  populateRecruiterNames() {
    if (this.recruiterName) {
      this.recruiterName = this.recruiterName.split(',');

    }
    this.recAssignForm = this.fb.group({
      recruiter: [this.recruiterName],

    })
  }
  initializeTypeAheads() {

    this.recruiterdata$ = this.recruiterdatainput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchRecruiterName(term))

    );

  }


  searchRecruiterName(term: string): ObservableInput<any> {
    if (!term)
      return of([]);

    this.isRecruiterisLoading = true;
    return this.recservice.getRecruiter(term).pipe(
      map((res: any) => {
        this.isRecruiterisLoading = false;
       // let resP = JSON.parse(res);
        debugger;

        return res ? res : []
      })

    );
  }
  getAllAssignments(id?,pageIndex?, size?) {
    if (!size)
      size = this.pagesize;
    this.noRecordMsg = null;
    this.busy = this.recservice.getAllAssignments(id,pageIndex, size).subscribe(

      (res: any) => {
        //  debugger;
        let response = JSON.parse(res._body)['response'];
        //JSON.parse(res._body)['response'];
        this.reqAssignment = response;
        
        if (this.reqAssignment && this.reqAssignment.length > 0) {
          this.totalrecords = this.reqAssignment.length;
          
        } else {

          this.noRecordMsg = "No Assignees Found !! ";
          this.totalrecords = 0;
        }


      },
      err => {

        this.noRecordMsg = "No Assignees Found !! ";
        this.totalrecords = 0;

      }
    );

  }

 // formatsubmitMatches = (value: any) => value.recruiter || '';

  /*
  assignedto = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>

        this.recservice.getRecruiter(term)
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching = false);

*/
  ngAfterViewInit(): void {

  }

  onPageChanged(event) {
    this.pageindex = event;
    this.getAllAssignments(this.id,this.pageindex,10);
   // this.scrollToTop();
  }


  // submit the Assignment

  recruiterAssignment() {
    if (this.id) {
      this.recAssignForm.value['requisitionid'] = this.id;
    }
    this.busy = this.recservice.recruiterAssignment(this.recAssignForm.value)
      .subscribe(
        (res: any) => {
          if (JSON.parse(res._body)['response']) {
            this.Message = JSON.parse(res._body)['response'];
            this.successMessage = true;
            this.modal.close('ok');
          }
          else {
            this.modal.close(JSON.parse(res._body)['message']);

          }


        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }


  // for selecting Submitted Value
  selectedItem(item) {
    this.clickedItem = '';
    if (item) {
      this.clickedItem = item.recruiter;

    }
  }

  closeModal() {
    this.modal.close(true);
}
}
