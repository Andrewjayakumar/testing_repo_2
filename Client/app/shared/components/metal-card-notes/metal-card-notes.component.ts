import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit, ChangeDetectorRef, TemplateRef,Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
declare var $: any;
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { CardactionsService } from './../../services/card-actions.service';
import { NgbAlert } from "@ng-bootstrap/ng-bootstrap";




@Component({
  selector: 'metal-card-notes',
  templateUrl: './metal-card-notes.component.html',
  styleUrls: ['./metal-card-notes.component.scss'],
  providers: [CardactionsService]

})
export class MetalCardNotesComponent implements OnInit {

  busy: Subscription;
  @Input() public id;
  loadingMessage: any;
  candidateNotesData: any;
  notes: any;
  @Input() public fullname;
  candidateNotes: any;
  @ViewChild('content') content: TemplateRef<any>;
  modalRef: any;
  ngbModalOptions: NgbModalOptions = {
    backdrop: 'static',
    keyboard: false
  };
  isnoteDelete = false;
  isNotesSaved = false;
  @ViewChild("selfClosingAlert") selfClosingAlert: NgbAlert;



  constructor(private router: Router, public modal: NgbActiveModal, private cardactionsservice: CardactionsService, private _modalService: NgbModal) { }

  ngOnInit() {
    this.getcandidateNotes();
  }
  getcandidateNotes() {
  
    debugger;

    this.busy = this.cardactionsservice.getcandidateNotes(this.id)
      .subscribe(
        (res: any) => {
          if (JSON.parse(res._body)['response'][0]) {
            this.notes = JSON.parse(res._body)['response'][0].notes;

          }
        
        },
        err => {
          console.log(err);

        },
        () => {
        }
      );
  }

  saveNotesData() {
    var apiparam = {
      'candidateid': this.id,
      'notes':this.notes
    }
    debugger;

    this.busy = this.cardactionsservice.saveNotesData(apiparam)
      .subscribe(
        (res: any) => {
          this.candidateNotesData = JSON.parse(res._body)['response'];
          if (this.candidateNotesData) {
            this.isNotesSaved = true;
            setTimeout(() => {
              this.isNotesSaved = false;
              this.modal.close(true);

            }, 5000);
          }
        },
        err => {
          console.log(err);

        },
        () => {
        }
      );
  }

  deleteNotes() {
    this.isnoteDelete = true;
    var apiparam = {
      'candidateid': this.id
    }

    this.busy = this.cardactionsservice.deleteNotes(apiparam)
      .subscribe(
        (res: any) => {
          this.candidateNotesData = JSON.parse(res._body)['response'];
          if (this.candidateNotesData) {
            setTimeout(() => {
              this.isnoteDelete = false;

              this.modal.close(true);

            }, 5000);
          }
        },
        err => {
          console.log(err);
          this.isnoteDelete = false;

        },
        () => {
        }
      );
  }

  openPopup(closePopup?: boolean) {

    this.modalRef = this._modalService.open(this.content, this.ngbModalOptions);
    console.log("  this.modalRef", this.modalRef);
    this.modalRef.result.then((result) => {
      if (result === 'Close click') {

      }
    }, (reason) => {
      if (reason === ModalDismissReasons.ESC ||
        reason === ModalDismissReasons.BACKDROP_CLICK) {

      }
    });


  }
}
