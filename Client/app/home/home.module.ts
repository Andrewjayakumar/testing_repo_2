import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { routing } from './home.routes';

//import { FormsModule } from '../forms/forms.module';

@NgModule({
  imports: [CommonModule, routing,
   
  ],
    schemas: [NO_ERRORS_SCHEMA],
    declarations: [HomeComponent]
})
export class HomeModule {
        public static forRoot(): ModuleWithProviders {
            return {
                ngModule: HomeModule
            };
        }}
