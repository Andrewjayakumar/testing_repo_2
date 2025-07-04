import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routingvalues } from './approval.routes';
import { SubmissionRejectComponent } from './submission-reject/submission-reject.component';
import { SubmissionApproveComponent } from './submission-approve/submission-approve.component';
import { BusyModule } from 'angular2-busy';

@NgModule({
  imports: [
        CommonModule,
        routingvalues, BusyModule
  ],
  declarations: [SubmissionRejectComponent, SubmissionApproveComponent]
})
export class ApprovalModule { }
