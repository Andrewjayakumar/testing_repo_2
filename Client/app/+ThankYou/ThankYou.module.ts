import { NgModule, ModuleWithProviders } from '@angular/core';
import { routing } from './ThankYou.routes';
import { ThankyouComponent } from './thank-you/thankyou.component';
import { BusyModule } from 'angular2-busy';

@NgModule({
    imports: [routing,BusyModule],
    declarations: [ThankyouComponent]
})
export class ThankyouModule {
    // public static forRoot(): ModuleWithProviders {
    //     return {
    //         ngModule: ThankyouModule
    //     };
    // }
}
