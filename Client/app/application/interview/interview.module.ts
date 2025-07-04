
import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';
import { DataService } from '../../core/services/data.service';
import { UtilityService } from '../../core/services/utility.service';
import { AuthService } from "../../core/authservice/auth.service";
import { BusyModule } from "angular2-busy";
import { NgSelectModule } from '@ng-select/ng-select';
import { TextMaskModule } from 'angular2-text-mask';
import { NgbActiveModal, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonCustomPipeModule } from '../../forms/common-ui/common-custom.module';
import { SharedModule } from "../../shared/shared.module";
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';

import { InterviewComponent } from './interview.component';
import { InterviewService } from './interview.service';
import { ScheduleInterviewComponent } from './schedule-interview/schedule-interview.component';
import { InterviewHistoryComponent } from './interview-history/interview-history.component';
import { InterviewRoundCardComponent } from './interview-history/interview-round-card/interview-round-card.component';
import { RouterModule } from '@angular/router';
import { DateTimePickerComponent } from './schedule-interview/date-time-picker-modal/date-time-picker.component';
import { SubmitToClientComponent } from './submit-to-client/submit-to-client.component';


    





@NgModule({
  imports: [
        CommonModule,
        SharedModule,
        CommonCustomPipeModule,
        FormsModule,
        ReactiveFormsModule,
        CommonCustomPipeModule,
        NgbModule.forRoot(),
        NgSelectModule,
        RouterModule,
        NgbModalModule,
    BusyModule,
    FileUploadModule
        
        
        
        
        
  ],
    declarations: [
        InterviewComponent,
        ScheduleInterviewComponent,
        InterviewHistoryComponent,
        InterviewRoundCardComponent,
        DateTimePickerComponent,
        SubmitToClientComponent
    ],
    entryComponents: [ScheduleInterviewComponent],
    exports: [
        InterviewComponent,
        ScheduleInterviewComponent
    ]
})
export class InterviewModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: InterviewModule,
            providers: [
                NgbActiveModal,
               
                InterviewService,
                InterviewHistoryComponent,
                ScheduleInterviewComponent
            ]
        };
    }
}
