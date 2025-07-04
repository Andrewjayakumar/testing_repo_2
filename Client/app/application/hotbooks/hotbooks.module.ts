import {
  NgModule,
  ModuleWithProviders,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { LocalStoreManager } from "../../core/authservice/local-store-manager.service";
import { DataService } from "../../core/services/data.service";
import { UtilityService } from "../../core/services/utility.service";
import { AuthService } from "../../core/authservice/auth.service";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonCustomPipeModule } from "../../forms/common-ui/common-custom.module";
import { SwiperModule } from "angular2-useful-swiper";
//import { SliderModule } from 'ngx-rslide';
import { SharedModule } from "../../shared/shared.module";
import { DynamicFormsModule } from "../../forms/forms.module";
import { HotBooksComponent } from "../hotbooks/hotbooks.component";
import { CandidatelistHotbooksComponent } from "./candidatelist-hotbooks/candidatelist-hotbooks.component";
import { HotbooksDashboardComponent } from "./hotbooks-dashboard/hotbooks-dashboard.component";
import { HotbooksRoutingModule } from "./hotbooks-routing.module";
import { AddHotbookFolderComponent } from "./add-hotbook-folder/add-hotbook-folder.component";
import { HotbookActionPopupComponent } from "./hotbook-action-popup/hotbook-action-popup.component";
import { RecruiterDemandPlanComponent } from "./recruiter-demand-plan/recruiter-demand-plan.component";
import { OwnerDemandPlanComponent } from "./owner-demand-plan/owner-demand-plan.component";
import { DemandPlanningComponent } from "./demand-planning/demand-planning.component";
import { AddDemandPlanComponent } from "../hotbooks/add-demand-plan/add-demand-plan.component";

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonCustomPipeModule,
    SwiperModule,
    SharedModule,
    HotbooksRoutingModule,
    DynamicFormsModule.forRoot(),
  ],
  entryComponents: [
    AddHotbookFolderComponent,
    HotbookActionPopupComponent,
    AddDemandPlanComponent,
  ],
  declarations: [
    HotBooksComponent,
    CandidatelistHotbooksComponent,
    HotbooksDashboardComponent,
    AddHotbookFolderComponent,
    HotbookActionPopupComponent,
    RecruiterDemandPlanComponent,
    OwnerDemandPlanComponent,
    DemandPlanningComponent,
    AddDemandPlanComponent,
  ],
  exports: [HotbooksDashboardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HotbooksModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: HotbooksModule,
      providers: [
        // Providers
        LocalStoreManager,
        DataService,
        UtilityService,
        AuthService,
      ],
    };
  }
}
