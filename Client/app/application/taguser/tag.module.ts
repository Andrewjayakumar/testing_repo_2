import { NgModule, ModuleWithProviders, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from "../../shared/shared.module";
import { NgSelectModule } from "@ng-select/ng-select";
import { NgbModule, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { TagdashboardComponent } from '../taguser/tagdashboard/tagdashboard.component';
import { MypoolComponent } from '../taguser/mypool/mypool.component';
import { TaguserComponent } from '../taguser/taguser.component';
import { TagdashboardService } from './tagdashboard.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TagRoutingModule } from './tag-routing.module';

@NgModule({
  imports: [
        CommonModule,
        TagRoutingModule,
        NgSelectModule,
        NgbModule.forRoot(),
        FormsModule,
        ReactiveFormsModule,
       
        SharedModule,
      
  ],
    declarations: [
        
        TagdashboardComponent,
        MypoolComponent,
        TaguserComponent
    ],
    exports: [
        TagdashboardComponent,
        MypoolComponent,
        TaguserComponent
    ]
})
export class TagModule {
    public static forRoot(): ModuleWithProviders {
        return {
            ngModule: TagModule,
            providers: [
                // Providers
                TagdashboardService
            ]
        };
    }
}
