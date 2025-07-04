import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MetalMatchComponent } from "./metal-match/metal-match.component";
import { SharedModule } from "../../shared/shared.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { JobboardParentComponent } from './jobboard-parent/jobboard-parent.component';
import { MonsterClassicComponent } from './monster-classic/monster-classic.component';
import { MonsterPowerComponent } from './monster-power/monster-power.component';
import { MetalBooleanComponent } from './metal-boolean/metal-boolean.component';
import { MetalDiceComponent } from './metal-dice/metal-dice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BusyModule } from 'angular2-busy';
import { ChartsModule } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts';
import { NgSelectModule } from '@ng-select/ng-select';
import { CareerBuilderComponent } from "./career-builder/career-builder.component";
import { MetalFilterComponent } from "../jobboardsearch/metal-filter/metal-filter.component";
import { MatchReasonComponent } from './match-reason/match-reason.component';
import { JobboardsearchService } from './jobboardsearch.service';
import { MetalCeComponent } from './metal-ce/metal-ce.component';
import { CommonCustomPipeModule } from "../../forms/common-ui/common-custom.module";
import { MetalAppliedComponent } from './metal-applied/metal-applied.component';
import { AidrivenJobboardComponent } from './aidriven-jobboard/aidriven-jobboard.component';

@NgModule({
    imports: [
    CommonModule,
    SharedModule,
    NgbModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    BusyModule,
    ChartsModule,
    CommonCustomPipeModule
   
  ],
  declarations: [
    MetalMatchComponent,
    CareerBuilderComponent,
    JobboardParentComponent,
    MonsterClassicComponent,
    MonsterPowerComponent,
    MetalBooleanComponent,
    MetalFilterComponent,
    MatchReasonComponent,
    MetalDiceComponent,
    MetalAppliedComponent,
    MetalCeComponent,
    AidrivenJobboardComponent,

  ],
//  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [
   // MetalMatchComponent,
    //CareerBuilderComponent,
      MetalFilterComponent,
      MatchReasonComponent
  ],
    exports: [
        MetalMatchComponent,
        JobboardParentComponent,
        AidrivenJobboardComponent
    ],
})
export class JobboardsearchModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: JobboardsearchModule,
            providers: [
                // Providers
                JobboardsearchService
            ]
        };
    }
}
