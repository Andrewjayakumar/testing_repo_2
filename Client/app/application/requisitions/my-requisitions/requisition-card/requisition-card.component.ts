import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { NgbTooltip } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "metal-requisition-card",
  templateUrl: "./requisition-card.component.html",
  styleUrls: ["./requisition-card.component.scss"],
})
export class RequisitionCardComponent implements OnInit {
  @Input("requisition")
  requisition: any;
  @Input("userrole") current_user_role: number = 8;
  @Input("isCandidateMatchLink") isCandidateMatchLink: boolean = false;
  @Output("actionClicked") actionClicked: EventEmitter<any> =
    new EventEmitter();
  @Output("actionchecked") actionchecked: EventEmitter<any> =
    new EventEmitter();
  @Input("showCheckbox") showCheckbox: boolean = false;

  constructor() {}

  ngOnInit() {}

  gotoReqPage() {
    let event = { "actiontype": "hyperlink", "id": this.requisition.requisitionid, "matchLink": this.isCandidateMatchLink};
    this.actionClicked.emit(event);
  }

  openQuickView() {
    let event = { "actiontype": "quickview", "id": this.requisition.requisitionid };
    this.actionClicked.emit(event);
  }

  assignReq() {
    let event = { "actiontype": "assign", "id": this.requisition };
    this.actionClicked.emit(event);
  }

  setQualification() {
    let event = {
      "actiontype": "qualification",
      "id": this.requisition.requisitionid,
    };
    this.actionClicked.emit(event);
  }

  cloneRequisition() {
    let event = { "actiontype": "clone", "id": this.requisition.requisitionid };
    this.actionClicked.emit(event);
  }

  onReqSelected(requisitionid, isChecked) {
    let event = { "requisitionid": requisitionid, "isChecked": isChecked };
    this.actionchecked.emit(event);
    }
    //candidate id is present at the parent level near the match therefore not sending it in params along with reqid
    launchScorePopup(requisitionid) {

        let event = { "actiontype": "candidatescore", "requisition": this.requisition };
        this.actionClicked.emit(event);
    }
    
}
