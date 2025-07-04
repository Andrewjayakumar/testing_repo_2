import { Component, OnInit } from "@angular/core";
import { SlicePipe } from "@angular/common";
import { Subscription, Subject } from "rxjs";
import { FormBuilder } from "@angular/forms";
import { HotBooksService } from "../hotbooks.service";
import { AuthService } from "../../../core/authservice/auth.service";
import {
  NgbModal,
  NgbModalOptions,
  NgbTooltip,
} from "@ng-bootstrap/ng-bootstrap";
import { AddDemandPlanComponent } from "../add-demand-plan/add-demand-plan.component";

@Component({
  selector: "app-recruiter-demand-plan",
  templateUrl: "./recruiter-demand-plan.component.html",
  styleUrls: ["./recruiter-demand-plan.component.scss"],
})
export class RecruiterDemandPlanComponent implements OnInit {
  busy: Subscription;
  listofHotbooks = [];
  demandPlans = [];
  sharedhotbooks = [];
  candidatesList: any;
  selectedhotbook = { id: null, name: null };
  showLoader: boolean = false;
  PinArray = [];
  isPersonal: boolean = true;
  isShared: boolean;
  tagType: string = "Personal";
  pageindex = 1;
  pagesize = 20;
  searchText;
  isactiveFocus: boolean;
  ispassiveFocus: boolean;
  tagid: any;
  querystring: any;
  errormesg = false;
  activeFocusCount = 0;
  passiveFocusCount = 0;
  isActionShared: boolean = true;
  pagename: string = "Demand planning";
  candidateidArray = [];

  constructor(
    private fb: FormBuilder,
    private hotbookservice: HotBooksService,
    private _authservice: AuthService,
    public _modalService: NgbModal
  ) { }

  ngOnInit() {
    this.hotbookservice.trackActivityPageOpened({
      pagename: "Demand planning",
    });
    this.getDemandPlansList();
  }

  getDemandPlansList() {
    this.demandPlans = [];
    if (this.demandPlans.length <= 0) {
      this.showLoader = true;
    }
    this.hotbookservice.getRecruiterDemandPlansList().subscribe((res) => {
      debugger;
      let response = JSON.parse(res._body)["response"];
      this.demandPlans = response;
      if (this.demandPlans.length >= 0) {
        this.showLoader = false;
      }
    });
  }

  searchInDemandPlans() {
    this.hotbookservice
      .searchInHotbook(this.tagType, this.searchText)
      .subscribe((res) => {
        let response = JSON.parse(res._body)["response"];
        this.demandPlans = response;
      });
  }
}
