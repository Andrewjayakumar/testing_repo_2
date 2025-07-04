import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationComponent } from './application.component';
import { Applicationrouting } from './application-routing.module';
import { DynamicFormsModule } from '../forms/forms.module';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { AppsComponent } from './apps/apps.component';
import { CandidateModule } from './candidate/candidate.module';
import { RequisitionsModule } from './requisitions/requisitions.module';
import { HotbooksModule } from './hotbooks/hotbooks.module';
import { JobboardsearchModule } from './jobboardsearch/jobboardsearch.module';
// import { CandidateAssignmentComponent } from './campaigns/candidate-assignment/candidate-assignment.component';
import { CampaignsModule } from "./campaigns/campaigns.module";
import { TagModule } from './taguser/tag.module';
import { RedeploymentModule } from "./redeployment/redeployment.module";
import { InterviewModule } from './interview/interview.module';
import { DashboardModule } from '../../app/application/dashboard/dashboard.module';




// import { MasonryModule } from 'angular2-masonry';
@NgModule({
  imports: [
    CommonModule,
    Applicationrouting,
    DynamicFormsModule.forRoot(),
    NgbAlertModule,
    CandidateModule,
    RequisitionsModule,
    HotbooksModule,
    JobboardsearchModule,
    CampaignsModule,
    TagModule,
    RedeploymentModule,
    InterviewModule,
    DashboardModule

  ],
    declarations: [ApplicationComponent, AppsComponent]
})

export class ApplicationModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ApplicationModule
    };
  }
}
