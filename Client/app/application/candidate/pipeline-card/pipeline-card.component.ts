import { Component, OnInit, Input, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
declare var $: any;
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CandidatePipelineActionsComponent } from '../candidate-pipeline-actions/candidate-pipeline-actions.component';
import { CandidatepipelineService } from '../candidatepipeline.service';
import { Subscription, Subject } from 'rxjs';




@Component({
  selector: 'app-pipeline-card',
  templateUrl: './pipeline-card.component.html',
  styleUrls: ['./pipeline-card.component.scss'],
  providers: [CandidatepipelineService]
})
export class PipelineCardComponent implements OnInit {

  constructor(public _modalService: NgbModal, private cpservice: CandidatepipelineService) { }
  requisitionid: any;
  busy: Subscription;
  allpipelineCandidates: any;
  @Input('candidate') candidate: any;
  @Input('requisitionDetails') requisitionDetails: any;
  @ViewChild('candidatecard') candidatecard: ElementRef;
  @Output() refreshCandList: EventEmitter<string> = new EventEmitter<string>();

  isApproved: boolean;
  candidateStatus: string;
  isCardSelected: boolean;
  cardDisplayRight: boolean;
  displayDateAndTime: string;
  statusLabel: string;
  statusValue: string;
  isPending: boolean;

  ngOnInit() {
    this.isApproved = this.candidate.submissionapproval;
    this.candidateStatus = this.candidate.candidatestatus;

    this.setDisplayDateAndTime();
    this.setStatusDisplay();

    if (this.candidateStatus == 'Sourced'
      || this.candidateStatus == 'In Process'
      || this.candidateStatus == 'Interview'
    ) {
      this.cardDisplayRight = true;
    }
  }

  setDisplayDateAndTime() {
    if (this.candidateStatus == 'Sourced') {
      this.displayDateAndTime = this.candidate.sourcedon;
    }
    else if (this.candidateStatus == 'In Process') {
      this.displayDateAndTime = this.candidate.submittedon;
    }
    else if (this.candidateStatus == 'Interview') {
      this.displayDateAndTime = this.candidate.interviewedon;
    }
    else if (this.candidateStatus == 'Rejected') {
      this.displayDateAndTime = this.candidate.rejectedon;
    }
    else if (this.candidateStatus == 'Hired') {
      this.displayDateAndTime = this.candidate.offeredon;
    }
  }

  setStatusDisplay() {
    if (this.candidateStatus == 'In Process' || this.candidateStatus == 'Interview') {
      this.statusLabel = 'Approval Status';
      this.statusValue = this.candidate.submissionapproval ? 'Approved' : 'Pending';
    }
    else if (this.candidateStatus == 'Hired') {
      this.statusLabel = 'Offer Status';
      this.statusValue = this.candidate.offeredstatus;
    }
    if (this.statusValue == 'Pending') {
      this.isPending = true;
    }
  }

  refreshList() {
    this.refreshCandList.emit('');
  }

  CollapsedIcon() {
    $(document).ready(function () {
      $('.fa-caret-down').on('click', function () {
        if ($(this).hasClass('fa-caret-down')) {
          $(this).removeClass('fa-caret-down').addClass('fa-caret-up');
        } else {
          $(this).removeClass('fa-caret-up').addClass('fa-caret-down');
        }
      });
    });
  }

  pipelineActions(event: MouseEvent) {
    this.isCardSelected = true;
    let ngbModalOptions: NgbModalOptions = {
      backdrop: true,
      size: 'sm',
      windowClass: 'candiate-pipeline-actions'
    };

    let modalRef = this._modalService.open(CandidatePipelineActionsComponent, ngbModalOptions);
    modalRef.componentInstance.candidateid = this.candidate.candidateid;
    modalRef.componentInstance.fullname = this.candidate.fullname;
    modalRef.componentInstance.candidate = this.candidate;
    modalRef.componentInstance.cardDisplayRight = this.cardDisplayRight;
    modalRef.componentInstance.requisitionDetails = this.requisitionDetails;

    modalRef.componentInstance.actionCompleted.subscribe((message: string) => {
      this.refreshList();
    });

    const divRect = this.candidatecard.nativeElement.getBoundingClientRect();
    let divTop = divRect.top;
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (this.cardDisplayRight) {
      if (divTop < 120) {
        divTop = 120;
      }
      if (vh - divTop < 170) {
        divTop = vh - 170;
      }
      modalRef.componentInstance.position = {
        top: `${divTop - 105}px`,
        left: `${divRect.right - (vw/2) + 180}px`
      };
    }
    else {
      if (divTop < 120) {
        divTop = 120;
      }
      if (vh - divTop < 170) {
        divTop = vh - 170;
      }
      modalRef.componentInstance.position = {
        top: `${divTop - 105}px`,
        left: `${divRect.left - (vw / 2) - 163}px`
      };
    }

    modalRef.componentInstance.candDiv = {
      top: `${divRect.top - divTop + 105}px`
    };

    modalRef.result.then(
      (result) => {
        this.handleModalClose(result);
      },
      (reason) => {
        this.handleModalClose(reason);
      }
    );
  }

  handleModalClose(result: any) {
    this.isCardSelected = false;
  }

}
