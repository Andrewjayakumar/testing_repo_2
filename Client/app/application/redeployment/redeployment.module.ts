import {
  NgModule,
  ModuleWithProviders,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RedeploymentRoutingModule } from "./redeployment-routing.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BusyModule } from "angular2-busy";
import { CommonCustomPipeModule } from "../../forms/common-ui/common-custom.module";
import { ArchwizardModule } from "angular-archwizard";
import { SharedModule } from "../../shared/shared.module";
import { AngularDateTimePickerModule } from "angular2-datetimepicker";
import { TextMaskModule } from "angular2-text-mask";
import { JobboardsearchModule } from "../jobboardsearch/jobboardsearch.module";
import { DynamicFormsModule } from "../../forms/forms.module";
import { LocalStoreManager } from "../../core/authservice/local-store-manager.service";
import { DataService } from "../../core/services/data.service";
import { UtilityService } from "../../core/services/utility.service";
import { AuthService } from "../../core/authservice/auth.service";
import { SwiperModule } from 'angular2-useful-swiper';
import { RedeploymentComponent } from '../redeployment/redeployment.component';
import { CandidatetoReqComponent } from '../redeployment/candidatetoreq/candidatetoreq.component';
//import { ReqVerificationComponent } from '../redeployment/req-verification/req-verification.component';
//import { RedeploymentReqListComponent } from '../redeployment/redeployment-req-list/redeployment-req-list.component';
//import { RedeploymentClientSearchComponent } from '../redeployment/redeployment-client-search/redeployment-client-search.component';



@NgModule({
  imports: [
    CommonModule,
    RedeploymentRoutingModule,
    NgSelectModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonCustomPipeModule,
    AngularDateTimePickerModule,
    SharedModule,
    ArchwizardModule,
    TextMaskModule,
    BusyModule,
    JobboardsearchModule,
    DynamicFormsModule,
    SwiperModule
  ],
  entryComponents: [
    
  ],
  declarations: [
    RedeploymentComponent,
    CandidatetoReqComponent,
    //ReqVerificationComponent,
    //RedeploymentReqListComponent,
    //RedeploymentClientSearchComponent
  ],
  exports: [
    RedeploymentComponent,
    CandidatetoReqComponent,
    //ReqVerificationComponent,
    //RedeploymentReqListComponent,
    //RedeploymentClientSearchComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RedeploymentModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: RedeploymentModule,
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
