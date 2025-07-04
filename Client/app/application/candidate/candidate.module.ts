import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CandidateComponent } from './candidate.component';
import { AdvancedsearchComponent } from './advancedsearch/advancedsearch.component'
import { AddCandidate } from '../candidate/add-candidate/add-candidate.component';
import { GoogleskysearchComponent } from "./googleskysearch/googleskysearch.component";
import { CandidateBotResponseComponent } from './candidate-bot-response/candidate-bot-response.component';
import { ViewScAndTypeComponent } from './view-sc-and-type/view-sc-and-type.component';
import { VendorAttestationComponent } from './vendor-attestation/vendor-attestation.component';
import { CandidateAttestationComponent } from './candidate-attestation/candidate-attestation.component';
import { RemoveSubmissionComponent } from '../candidate/remove-submission/remove-submission.component';
import { HireCandidateComponent } from '../candidate/hire-candidate/hire-candidate.component';
import { SubmitToClientActionComponent } from '../candidate/submit-to-client-action/submit-to-client-action.component';


import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';
import { DataService } from '../../core/services/data.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthService } from "../../core/authservice/auth.service";
import { FormControlService } from '../../forms/form-control.service';


import { NgSelectModule } from '@ng-select/ng-select';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonCustomPipeModule } from '../../forms/common-ui/common-custom.module';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { DynamicFormsModule } from '../../forms/forms.module';
import { SwiperModule } from 'angular2-useful-swiper';
import { NewCandidateSearchComponent } from './new-candidate-search/new-candidate-search.component';
import { JobboardsearchModule } from '../jobboardsearch/jobboardsearch.module';
import { CandidateRoutingModule } from './candidate-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { PipelineCardComponent } from './pipeline-card/pipeline-card.component';
import { CandidatePipelineComponent } from './candidate-pipeline/candidate-pipeline.component';
import { CandidatePipelineActionsComponent } from '../candidate/candidate-pipeline-actions/candidate-pipeline-actions.component';
import { RejectCandidateComponent } from '../candidate/reject-candidate/reject-candidate.component';
import { SecureCandidateComponent } from './secure-candidate/secure-candidate.component';
import { InitiateWorkflowComponent } from './initiate-workflow/initiate-workflow.component';
import { TechAssessmentComponent } from '../candidate/tech-assessment/tech-assessment.component';



@NgModule({
  imports: [
    CommonModule,
    CandidateRoutingModule,
    NgSelectModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    CommonCustomPipeModule,
    FileUploadModule,
    SwiperModule,
    SharedModule,
    JobboardsearchModule,
    TextMaskModule,
    DynamicFormsModule.forRoot()
  ],
    declarations: [
      CandidateComponent,
      AdvancedsearchComponent,
      AddCandidate,
      GoogleskysearchComponent,
      //PipelineCardComponent,
      //CandidatePipelineComponent,
     // NewCandidateSearchComponent
      CandidateBotResponseComponent,
      SecureCandidateComponent,
      PipelineCardComponent,
      CandidatePipelineComponent,
      NewCandidateSearchComponent,
      CandidateBotResponseComponent,
      SecureCandidateComponent,
      CandidatePipelineActionsComponent,
      RejectCandidateComponent,
      ViewScAndTypeComponent,
      VendorAttestationComponent,
      CandidateAttestationComponent,
      RemoveSubmissionComponent,
      HireCandidateComponent,
      SubmitToClientActionComponent,
      InitiateWorkflowComponent,
      TechAssessmentComponent
  ],
  entryComponents: [
      AddCandidate,
      SecureCandidateComponent,
    CandidateBotResponseComponent,
    CandidatePipelineActionsComponent,
    RejectCandidateComponent,
    ViewScAndTypeComponent,
    VendorAttestationComponent,
    CandidateAttestationComponent,
    RemoveSubmissionComponent,
    HireCandidateComponent,
    SubmitToClientActionComponent,
    InitiateWorkflowComponent,
    TechAssessmentComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    exports: [
     CandidateComponent,
     AdvancedsearchComponent,
     GoogleskysearchComponent,
      NewCandidateSearchComponent,
      CandidatePipelineComponent,
      PipelineCardComponent
    ]
})
export class CandidateModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: CandidateModule,
            providers: [
                // Providers
                LocalStoreManager,
                DataService,
                UtilityService,
                AuthService,
                FormControlService
              
            ]
        };
    }
}
