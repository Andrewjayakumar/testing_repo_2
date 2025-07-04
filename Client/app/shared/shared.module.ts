import {
  NgModule,
  ModuleWithProviders,
  CUSTOM_ELEMENTS_SCHEMA,
} from "@angular/core";
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SliderModule } from 'ngx-rslide';


import { HeaderWithSidebarComponent } from './layout/header-with-sidebar/header-with-sidebar.component';
import { FooterComponent } from './layout/footer.component';
import { AuthService } from "../core/authservice/auth.service";
import { ConfigurationService } from '../core/authservice/configuration.service';
import { LocalStoreManager } from '../core/authservice/local-store-manager.service';
import { AppTranslationService } from '../core/authservice/app-translation.service';
import { EndpointFactory } from '../core/authservice/endpoint-factory.service';
import { AccountEndpoint } from '../core/authservice/account-endpoint.service';
import { AuthGuard } from '../core/authservice/auth-guard.service';
import { AccountService } from '../core/authservice/account.service';
import { ContentService } from './services/content.service';
import { NavigationComponent } from './layout/navigation/navigation.component';

import { ActivityLogComponent } from '../forms/activity-log/activity-log.component';
import { ActivityService } from '../forms/activity.service';
import { ActivitySearchComponent } from '../forms/activity-search/activity-search.component';
import { CommonCustomPipeModule } from '../forms/common-ui/common-custom.module';
import { CheckboxGroupComponent } from './components/checkbox-group/checkbox-group.component';
import { MetalSwitchComponent } from './components/metal-switch/metal-switch.component';
import { SliderWeightsComponent } from './components/slider-weights/slider-weights.component';
import { CandidateCardComponent } from './components/metal-card/candidate-card.component';
import { MetalCardResumeComponent } from './components/metal-card-resume/metal-card-resume.component';
import { MetalCardNotesComponent } from './components/metal-card-notes/metal-card-notes.component';

@NgModule({
    imports: [
    CommonCustomPipeModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
        RouterModule,
        SliderModule,
    NgbModalModule,
    NgbModule.forRoot(),
        NgSelectModule
    ],
    entryComponents: [
      ActivitySearchComponent,
      MetalCardResumeComponent,
      MetalCardNotesComponent
    ],
  declarations: [
    FooterComponent,
    HeaderWithSidebarComponent,
      NavigationComponent,
      ActivityLogComponent,
      ActivitySearchComponent,
      CheckboxGroupComponent,
      MetalSwitchComponent,
     SliderWeightsComponent,
    CandidateCardComponent,
    MetalCardResumeComponent,
    MetalCardNotesComponent
  ],
  exports: [
    FooterComponent,
    // HeaderComponent,
    NavigationComponent,
      HeaderWithSidebarComponent,
      ActivityLogComponent,
      ActivitySearchComponent,
      CheckboxGroupComponent,
      MetalSwitchComponent,
      CandidateCardComponent,
      SliderWeightsComponent,
  ]

})
export class SharedModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [AuthService,
        ContentService,
        ConfigurationService,
        LocalStoreManager,
        AppTranslationService,
        EndpointFactory,
        AccountEndpoint,
        AuthGuard,
        AccountService,
        ActivityService
      ]
    };
  }
}
