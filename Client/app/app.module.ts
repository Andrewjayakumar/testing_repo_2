import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';
import { HttpModule } from '@angular/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
// import { HomeModule } from './home/home.module';
import { ApiTranslationLoader } from './shared/services/api-translation-loader.service';
import { routing } from './app.routes';
import { AppService } from './app.service';
import { appReducer } from './app-store';
import { AppComponent } from './app.component';
// import { EmbedVideo } from 'ngx-embed-video';
import { AuthCallbackComponent } from './auth-callback/auth-callback.component';
import { RolesComponent } from './roles/roles.component';
import { CommonCustomPipeModule } from './forms/common-ui/common-custom.module';
import { CandidateModule } from './application/candidate/candidate.module';


@NgModule({
  declarations: [AppComponent,AuthCallbackComponent, RolesComponent],
  imports: [

    BrowserAnimationsModule,
    BrowserModule,
    routing,
    HttpModule,
      CoreModule.forRoot(),
    CandidateModule,
    SharedModule.forRoot(),
    CommonCustomPipeModule,
    // HomeModule,
    StoreModule.provideStore(appReducer),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
    TranslateModule.forRoot({ loader: { provide: TranslateLoader, useClass: ApiTranslationLoader } })
  ],
  schemas: [NO_ERRORS_SCHEMA],
  providers: [
    AppService//, FormControlService, ChartService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
