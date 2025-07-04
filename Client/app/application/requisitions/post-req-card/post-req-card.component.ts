import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { NgbActiveModal, NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs/observable/of';
import { Observable, ObservableInput } from 'rxjs/Observable';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { MyRequisitionsService } from '../my-requisitions/my-requisitions.service';


@Component({
  selector: 'post-req-card',
  templateUrl: './post-req-card.component.html',
  styleUrls: ['./post-req-card.component.scss'],
  providers: [MyRequisitionsService]

})
export class PostReqCardComponent implements OnInit {

  busy: Subscription;
  @Input() public id;
  rateCardDetails: any;

  constructor(private router: Router, public modal: NgbActiveModal, private fb: FormBuilder, private MyRequisitionsService: MyRequisitionsService) { }

  ngOnInit() {
    this.getRateCardDetails();
    console.log("RATE CARD", this.rateCardDetails);
    debugger;


  }

  getRateCardDetails() {

    this.busy = this.MyRequisitionsService.getRateCardDetails(this.id)
      .subscribe(
        (res: any) => {
          if (JSON.parse(res._body)['response']) {
            this.rateCardDetails = JSON.parse(res._body)['response'][0];
          }
          if (JSON.parse(res._body)['response'] == []) {
            setTimeout(() => this.rateCardDetails = '', 4000);
            this.modal.close(true);

          }

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

}


