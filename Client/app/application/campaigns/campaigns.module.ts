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
  import { CandidateAssignmentComponent } from "./candidate-assignment/candidate-assignment.component";
  import { CampaignsService } from "../campaigns/campaigns.service";
import { CampaignsRoutingModule } from "./campaigns-routing.module";
import { CampaignsComponent } from "./campaigns.component";

  
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
      CampaignsRoutingModule,
      DynamicFormsModule.forRoot(),
    ],
    entryComponents: [
        CandidateAssignmentComponent
    ],
    declarations: [
        CandidateAssignmentComponent,
        CampaignsComponent
    ],
    exports: [CandidateAssignmentComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  })
  export class CampaignsModule {
    public static forRoot(): ModuleWithProviders {
      return {
        ngModule: CampaignsModule,
        providers: [
          // Providers
          LocalStoreManager,
          DataService,
          UtilityService,
          AuthService,
          CampaignsService
        ],
      };
    }
  }
  