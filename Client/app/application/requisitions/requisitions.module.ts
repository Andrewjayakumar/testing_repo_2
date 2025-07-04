import {
  NgModule,
  ModuleWithProviders,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { RequisitionsRoutingModule } from "./requisitions-routing.module";
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
import { CandidateModule } from '../candidate/candidate.module';

//import { HttpModule } from '@angular/http';
//import { HttpClientModule } from '@angular/common/http';
import { DynamicFormsModule } from "../../forms/forms.module";
import { RequisitionsComponent } from "./requisitions.component";
import { AddRequisitionComponent } from "./add-requisition/add-requisition.component";
import { RequisitionOverviewComponent } from "./requisition-overview/requisition-overview.component";
import { RecdetailDateComponent } from "./add-requisition/recdetails/recdetail-date/recdetail-date.component";
import { ClientDetailsComponent } from "./add-requisition/client-details/client-details.component";
import { RecdetailsComponent } from "./add-requisition/recdetails/recdetails.component";
import { TimeslotsComponent } from "./add-requisition/timeslots/timeslots.component";
import {
  NgbdModalConfirm,
  RecCreationConfirmation,
  ACALT270DaysDialog,
  ACAGT270DaysDialog,
  GPGPMGrid,
} from "./requisition-modals.component";
import { MyRequisitionsComponent } from "./my-requisitions/my-requisitions.component";
import { RequisitionCardComponent } from "./my-requisitions/requisition-card/requisition-card.component";
import { RequisitionListComponent } from "./my-requisitions/requisition-list/requisition-list.component";
import { ReqAssignmentComponent } from "./my-requisitions/req-assignment/req-assignment.component";
import { ReqQualificationComponent } from "./my-requisitions/req-qualification/req-qualification.component";
import { ReqSummaryComponent } from "./my-requisitions/req-summary/req-summary.component";
import { RequisitionAdvancedSearchComponent } from "./req-adb-search/requisition-advanced-search.component";
import { ClientSearchComponent } from "./req-adb-search/client-search/client-search.component";
import { ReqFilterSearchComponent } from "./my-requisitions/req-filter-search/req-filter-search.component";

import { LocalStoreManager } from "../../core/authservice/local-store-manager.service";
import { DataService } from "../../core/services/data.service";
import { UtilityService } from "../../core/services/utility.service";
import { AuthService } from "../../core/authservice/auth.service";
import { AddrecService } from "./add-requisition/addrec.service";
import { AddRecSharedService } from "./add-requisition/addrec.shared.service";
import { MyRequisitionsService } from "./my-requisitions/my-requisitions.service";
import { RequisitionsService } from "./requisitions.service";
import { CandidateMatchingComponent } from "./candidate-matching/candidate-matching.component";
import { CandidateMatchingFilterComponent } from './candidate-matching-filter/candidate-matching-filter.component';
import { SwiperModule } from 'angular2-useful-swiper';
//import { PostReqVendorComponent } from './post-req-vendor/post-req-vendor.component';
import { PostReqCardComponent } from './post-req-card/post-req-card.component';
import { BotResponseComponent } from './bot-response/bot-response.component';
import { AcaDocumentsComponent } from "./add-requisition/recdetails/aca-documents/aca-documents.component";
import { ChatGPTComponent } from './add-requisition/chat-gpt/chat-gpt.component';

import { CancelAirecommendationComponent } from './add-requisition/cancel-airecommendation/cancel-airecommendation.component';
import { PhoneMaskDirective } from "./add-requisition/client-details/appPhoneMask";
import { AiRequisitionMatchComponent } from './ai-requisition-match/ai-requisition-match.component';
import { UpdateDurationComponent } from '../requisitions/update-duration/update-duration.component';
import { RecDetailsNewComponent } from "./recdetails-new/recdetails-new.component";
import { JournalDetailsNewComponent } from "./journaldetails-new/journaldetails-new.component";
import { NewAddRequisitionComponent } from "../requisitions/new-add-requisition/new-add-requisition.component";

@NgModule({
  imports: [
    CommonModule,
    RequisitionsRoutingModule,
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
    SwiperModule,
    CandidateModule
  ],
  entryComponents: [
    NgbdModalConfirm,
    RecCreationConfirmation,

    GPGPMGrid,
    ReqAssignmentComponent,
    ReqQualificationComponent,
    ReqSummaryComponent,
    CandidateMatchingFilterComponent,
    //PostReqVendorComponent,
    PostReqCardComponent,
    BotResponseComponent,
    AcaDocumentsComponent,
    //AutoCleanupComponent,
    CancelAirecommendationComponent,
    UpdateDurationComponent,
    RecDetailsNewComponent,
    JournalDetailsNewComponent

  ],
  declarations: [
    AddRequisitionComponent,
    RequisitionOverviewComponent,
    RequisitionsComponent,
    RecdetailDateComponent,
    ClientDetailsComponent,
    RecdetailsComponent,
    TimeslotsComponent,
    NgbdModalConfirm,
    RecCreationConfirmation,
    GPGPMGrid,
    MyRequisitionsComponent,
    RequisitionCardComponent,
    RequisitionListComponent,
    ReqAssignmentComponent,
    ReqQualificationComponent,
    ReqSummaryComponent,
    RequisitionAdvancedSearchComponent,
    ClientSearchComponent,
    ReqFilterSearchComponent,
    CandidateMatchingComponent,
    CandidateMatchingFilterComponent,
  //  PostReqVendorComponent,
    PostReqCardComponent,
    BotResponseComponent,
    AcaDocumentsComponent,
    ChatGPTComponent,
    CancelAirecommendationComponent,
    PhoneMaskDirective,
    AiRequisitionMatchComponent,
    UpdateDurationComponent,
    RecDetailsNewComponent,
    JournalDetailsNewComponent,
    NewAddRequisitionComponent
    
  ],
  exports: [
    RequisitionsComponent,
    AddRequisitionComponent,
    RequisitionOverviewComponent,
    RecdetailDateComponent,
    ClientDetailsComponent,
    RecdetailsComponent,
    TimeslotsComponent,
    NgbdModalConfirm,
    RecCreationConfirmation,
    CandidateMatchingComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RequisitionsModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: RequisitionsModule,
      providers: [
        // Providers
        LocalStoreManager,
        DataService,
        UtilityService,
        AuthService,
        AddrecService,
        MyRequisitionsService,
        AddRecSharedService,
        RequisitionsService,
      ],
    };
  }
}
