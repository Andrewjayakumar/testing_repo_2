import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItsslistComponent } from './itss-list/itss-list.component';
import { itssprojectrouting } from './itss-project-routing.module';
import { ItssprojectComponent } from './itss-project.component';
import { ProjectdetailsComponent } from './add-project/project-details/project-details.component';
import { ClientdetailsComponent } from './add-project/client-details/client-details.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { AddprojectComponent } from './add-project/add-project.component';
import { ArchwizardModule } from 'angular-archwizard';
import { NgSelectModule } from '@ng-select/ng-select';
import { AddProjSharedService } from './add-project/addProj.shared.service';
import { BusyModule } from 'angular2-busy';
import { Projectsummarycomponent } from './project-summary/project-summary.component';








// import { MasonryModule } from 'angular2-masonry';
@NgModule({
  imports: [
    CommonModule,
    itssprojectrouting,
    NgbModule.forRoot(),
    FormsModule,
    ArchwizardModule,
    NgSelectModule,
    ReactiveFormsModule,
    BusyModule

  ],
  declarations: [
    ItsslistComponent, 
    ItssprojectComponent, 
    AddprojectComponent, 
    ProjectdetailsComponent,  
    ClientdetailsComponent,
    Projectsummarycomponent]
})

export class ItssprojectModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: ItssprojectModule,
      providers: [
        AddProjSharedService
      ]
    };
  }
}
