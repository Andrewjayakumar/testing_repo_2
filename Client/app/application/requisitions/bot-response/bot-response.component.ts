import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { RequisitionsService } from '../requisitions.service';
import { NgbActiveModal, NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-bot-response',
  templateUrl: './bot-response.component.html',
  styleUrls: ['./bot-response.component.scss'],
  providers: [RequisitionsService]
})
export class BotResponseComponent implements OnInit {
  busy: Subscription;
  @Input() public id;
  botResponseDetails: any;
  constructor(private RequisitionsService: RequisitionsService, public modal: NgbActiveModal) { }

  ngOnInit() {
    this.getbotResponseDetails();
  }


  getbotResponseDetails() {

    this.busy = this.RequisitionsService.getBotResonsesDetails(this.id)
      .subscribe(
        (res: any) => {
          this.botResponseDetails = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }
}
