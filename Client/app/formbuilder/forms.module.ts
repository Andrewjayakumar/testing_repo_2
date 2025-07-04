import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsComponent } from './forms.component';
import { routing } from './forms.routes';
import { DynamicFormsModule } from '../forms/forms.module';
import { UpdateComponent } from './update/update.component';
@NgModule({
  imports: [
    CommonModule, routing, DynamicFormsModule.forRoot()
  ],
  declarations: [FormsComponent, UpdateComponent]
})
export class FormsModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: FormsModule
    };
  }
}
