import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicFormsModule } from '../../forms/forms.module';
import { NgbAlertModule } from '@ng-bootstrap/ng-bootstrap';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DashboardRoutingModule } from '../dashboard/dashboard-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { DddashboardComponent } from '../dashboard/dddashboard/dddashboard.component';
import { DmdashboardComponent } from '../dashboard/dmdashboard/dmdashboard.component';
import { RecruiterComponent } from '../dashboard/recruiter/recruiter.component';
import { CommonCustomPipeModule } from "../../forms/common-ui/common-custom.module";










// import { MasonryModule } from 'angular2-masonry';
@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,

    DynamicFormsModule.forRoot(),
    NgbAlertModule,
    SharedModule,
    CommonCustomPipeModule


  ],
  declarations: [DashboardComponent, DddashboardComponent, DmdashboardComponent, RecruiterComponent]
})

export class DashboardModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: DashboardModule
    };
  }
}
