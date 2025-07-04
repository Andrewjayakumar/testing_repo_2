import { Component, OnInit, AfterViewInit, Renderer2, Input, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareMultipleUserService } from '../share-multiple-user/share-multiple-user.service';
import { Observable, ObservableInput } from 'rxjs/Observable';
import { Subscription, Subject } from 'rxjs';
import { filter, distinctUntilChanged, switchMap, tap, catchError, debounceTime, concat, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
declare var $: any;


@Component({
  selector: 'app-sharemultipleuser',
  templateUrl: './share-multiple-user.component.html',
  styleUrls: ['./share-multiple-user.component.scss'],
  providers: [ShareMultipleUserService]
})
export class ShareMultipleUserComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input('candidateid')
  public candidateid;
  busy: Subscription;
  alltheUsersForSend: any;
  alltheUsersForSendResp: any;
  objshareandsend = {
    sendshare: "",
  }
  copylink: any;
  urllinktoShare: any;
  addloader = false;
  public recruiterList$: Observable<any>;
  public recruiterinput$ = new Subject<string | null>();
  isRecruiterNameLoading = false;

  ngAfterViewInit(): void {
  }

  constructor(public service: ShareMultipleUserService, public modal: NgbActiveModal, private renderer: Renderer2, public cd: ChangeDetectorRef) {
    this.initializeTypeAheads();

  }

  public model = {
    "userid": [],
    "comments":""
  }
  ngOnInit() {
 this.objshareandsend.sendshare = 'send';

    this.gettheURLLink();
  }

  initializeTypeAheads() {

    this.recruiterList$ = this.recruiterinput$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchRecruiters(term))

    );


  }

  searchRecruiters(term: string): ObservableInput<any> {

    if (!term)
      return of([]);

    this.isRecruiterNameLoading = true;
    return this.service.getRecruitersList(term).pipe(
      map((res: any) => {
        //debugger;
        this.isRecruiterNameLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response : [];
      })

    );
  }
  gettheURLLink() {
    this.busy = this.service.getcopylinkUrl(this.candidateid)
      .subscribe(
        (res: any) => {
          this.urllinktoShare = JSON.parse(res._body)['response'];
          if (this.urllinktoShare.candidateurl) {
            this.copylink = this.urllinktoShare.candidateurl;
          }
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }
  onChange(e) {
    debugger;
    console.log("Valyes is", e);
    let a = e.target.value;
    if (a === 'send') {
      this.objshareandsend.sendshare = 'send';

    } else {
      this.objshareandsend.sendshare = 'share';

    }
  }

  sendAllProfiles() {
    if (this.model.userid.length > 0) {
      this.addloader = true;
      this.model['candidateid'] = this.candidateid;
      this.busy = this.service.sendAllProfiles(this.model)
        .subscribe(
          (res: any) => {
            this.alltheUsersForSendResp = JSON.parse(res._body)['response'];
            setTimeout(() => {
              this.addloader = false;

              this.modal.close(true);
            }, 5000);
          },
          err => {
            console.log(err);
            this.addloader = false;

          },
          () => {
          }
        );
    }
   
  }

  copyUrl(copylink) {
    $('#candidadatelink').val(copylink);
    $('#candidadatelink').select();
    document.execCommand('copy');
  }
  ngOnDestroy(): void {
   
  }

}
