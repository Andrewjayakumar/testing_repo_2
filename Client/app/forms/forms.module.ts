import { BusyModule } from 'angular2-busy';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
// import { YoutubePlayerModule } from 'ng2-youtube-player';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
// import { EasyPieChartModule } from 'ng2modules-easypiechart';
import { routing } from './forms.routes';
// import { FormeditorComponent } from './formeditor/formeditor.component';
import { DynamicformcontrollsComponent } from './dynamicformcontrolls/dynamicformcontrolls.component';
import { DynamicformComponent } from './dynamicform/dynamicform.component';
// import { TreeModule } from 'angular-tree-component';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';
import { FileUploadModule } from 'ng2-file-upload/ng2-file-upload';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TinyEditorComponent } from './tiny-editor.component';
import { FormControlService } from './form-control.service';
import { Autocomplete2UiComponent } from './autocomplete2-ui/autocomplete2-ui.component';
// import { DropdownUiComponent } from './dropdown-ui/dropdown-ui.component';
import { TextboxUiComponent } from './textbox-ui/textbox-ui.component';
import { TextareaUiComponent } from './textarea-ui/textarea-ui.component';
import { PhonenumberUiComponent } from './phonenumber-ui/phonenumber-ui.component';
import { CheckboxUiComponent } from './checkbox-ui/checkbox-ui.component';
import { GridUiComponent } from './grid-ui/grid-ui.component';
import { TabUiComponent } from './tab-ui/tab-ui.component';
// import { PasswordUiComponent } from './password-ui/password-ui.component';
import { DatepickerUiComponent } from './datepicker-ui/datepicker-ui.component';
import { EmailUiComponent } from './email-ui/email-ui.component';
import { NumberUiComponent } from './number-ui/number-ui.component';
import { RadiolistUiComponent } from './radiolist-ui/radiolist-ui.component';
import { RichtexteditorUiComponent } from './richtexteditor-ui/richtexteditor-ui.component';
import { PanelUiComponent } from './panel-ui/panel-ui.component';
// import { TypeformUiComponent } from './typeform-ui/typeform-ui.component';
import { FormWizardUiComponent } from './form-wizard-ui/form-wizard-ui.component';
import { FileuploadUiComponent } from './fileupload-ui/fileupload-ui.component';
// import { UpdateComponent } from './update/update.component';
// import { CardUiComponent } from './card-ui/card-ui.component';
// import { SearchUiComponent } from './search-ui/search-ui.component';
// import { DragListUiComponent } from './drag-list-ui/drag-list-ui.component';
// import { SidebarUiComponent } from './sidebar-ui/sidebar-ui.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartUiComponent } from './chart-ui/chart-ui.component';
import { ChartOptionsComponent } from './chart-ui/chart-options/chart-options.component';
import { SidebarModule } from 'ng-sidebar';
import { CardGridUiComponent } from './card-grid-ui/card-grid-ui.component';
import { CardOptionUiComponent } from './card-option-ui/card-option-ui.component';
import { LabelUiComponent } from './label-ui/label-ui.component';
// import { LinkUiComponent } from './link-ui/link-ui.component';
import { LabelOptionUiComponent } from './label-ui/label-option-ui/label-option-ui.component';
import { MultiselectUiComponent, FilterPipe } from './multiselect-ui/multiselect-ui.component';
// import { RedirectOptionComponent } from './card-option-ui/redirect-option/redirect-option.component';
// import { OpenFormUiComponent } from './open-form-ui/open-form-ui.component';
// import { SocialFacebookComponent } from './social-facebook/social-facebook.component';
// import { SocialGoogleComponent } from './social-google/social-google.component';
// import { SocialInstagramComponent } from './social-instagram/social-instagram.component';
// import { SocialLinkedinComponent } from './social-linkedin/social-linkedin.component';
// import { SocialTwitterComponent } from './social-twitter/social-twitter.component';
import { CheckboxlistUiComponent } from './checkboxlist-ui/checkboxlist-ui.component';
import { GooglePlaceModule } from 'ng2-google-place-autocomplete';
import { GooglePlacesUiComponent } from './google-places-ui/google-places-ui.component';
import { ImgPreviewDirective } from './fileupload-ui/img-preview/img-preview.directive';
import { PdfViewerComponent } from 'ng2-pdf-viewer';
import { VidPreviewDirective } from './fileupload-ui/vid-preview/vid-preview.directive';
import { NumberFormatComponent } from './number-ui/number-format/number-format.component';
import { NgbAlertModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ButtonUiComponent } from './button-ui/button-ui.component';
import { WebsiteUiComponent } from './website-ui/website-ui.component';
// import { PrintPageUiComponent } from './print-page-ui/print-page-ui.component';
import { RatingModule } from 'ngx-rating';
import { RatingUiComponent } from './rating-ui/rating-ui.component';
import { CalenderUiComponent } from './calender-ui/calender-ui.component';
// import { MediumEditorDirective } from './common-ui/medium-editor-dir/medium-editor.directive';
import { CalendarDatePipe } from './calender-ui/pipes/calendar-date.pipe';
import { CalendarEventTitlePipe } from './calender-ui/pipes/calendar-event-title.pipe';
import { CalCardUiComponent } from './calender-ui/cal-card-ui/cal-card-ui.component';
import { KanbanUiComponent } from './kanban-ui/kanban-ui.component';
import { CardComponent } from './kanban-ui/card/card.component';
import { ListComponent } from './kanban-ui/list/list.component';

import {
  DragAndDropModule
} from 'angular-draggable-droppable';
// import { TimelineUiComponent } from './timeline-ui/timeline-ui.component';
// import { VerticalTimelineModule } from 'angular-vertical-timeline';
import { MasonryModule } from 'angular2-masonry';
import { MatchHeightDirective } from './calender-ui/match-height-dir/match-height.directive';
// import { HtmlEditorUiComponent } from './html-editor-ui/html-editor-ui.component';
// import { ColorPickerModule } from 'ngx-color-picker/dist';
import { DropzoneConfigInterface } from 'ngx-dropzone-wrapper';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { DROPZONE_CONFIG } from 'ngx-dropzone-wrapper';
import { ImageUiComponent } from './image-ui/image-ui.component';
// import { AgmCoreOverrideModule } from './AgmCoreOverrideModule';
// import { GoggleMapUiComponent } from './goggle-map-ui/goggle-map-ui.component';
import { StatisticCardUiComponent } from './statistic-card-ui/statistic-card-ui.component';
import { ExpressionCalcUiComponent } from './expression-calc-ui/expression-calc-ui.component';
import { GroupCalcUiComponent } from './group-calc-ui/group-calc-ui.component';
import { CalculatorUiComponent } from './expression-calc-ui/calculator-ui/calculator-ui.component';
// import { ArchwizardModule } from 'ng2-archwizard';
// import { ImportUiComponent } from './import-ui/import-ui.component';
// import { SettingComponent } from './setting/setting.component';
// import { TreeViewComponent } from './tree-view/tree-view.component';
import { DynamicformInitComponent } from './dynamicform-init/dynamicform-init.component';
import { AdvanceGridUiComponent } from './advance-grid-ui/advance-grid-ui.component';
import { RulesContainerComponent } from './rules-container/rules-container.component';
import { RulesComponent } from './rules-container/rules/rules.component';
import { RuleComponent } from './rules-container/rules/rules/rules.component';
import { SparklineComponent } from './chart-ui/sparkline/sparkline.component';
import { ScrollToModule } from '@nicky-lenaers/ngx-scroll-to';
import { SwiperModule } from 'angular2-useful-swiper';
import { CustomActionComponent } from './common-ui/custom-action/custom-action.component';
import { LoadersCssModule } from 'angular2-loaders-css';
import { FunnelChartDirective } from './common-ui/funnel-chart-dir/funnel-chart.directive';
import { TextMaskModule } from 'angular2-text-mask';
import { HiddenUiComponent } from './hidden-ui/hidden-ui.component';
import { ProgressBarUiComponent } from './progress-bar-ui/progress-bar-ui.component';

import { ActionitemcartComponent } from './actionitemcart/actionitemcart.component';
import { BookmarkComponent } from './bookmark/bookmark.component';

import { Dropdown3UiComponent } from './dropdown3-ui/dropdown3-ui.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { AmazingTimePickerModule } from 'amazing-time-picker'; // this line you need
import { NestedUiComponent } from './nested-ui/nested-ui.component';
import { NestedChildUiComponent } from './nested-ui/nested-child-ui/nested-child-ui.component';
import { IframeUiComponent } from './iframe-ui/iframe-ui.component';
import { QuillModule } from 'ngx-quill'
import { ChartService } from './chart-ui/chart-ref/chart.service';
import { DataService } from '../core/services/data.service';
import { UtilityService } from '../core/services/utility.service';
import { LocalStoreManager } from '../core/authservice/local-store-manager.service';
import { DisableControlDirective } from './common-ui/disable-control/disable-control.directive';
import { HoverDirDirective } from './dropdown3-ui/hover-dir/hover-dir.directive';
import { CommonCustomPipeModule } from './common-ui/common-custom.module';
import { LinkedInpopupComponent } from './linkedinpopup/linkedinpopup.component';
import { LinkedinMailComponent } from './linkedin-mail/linkedin-mail.component';
import { LinkedinService } from './linkedin-mail/linkedin.service';
import { CandidatesubmissionComponent } from './candidatesubmission/candidatesubmission.component';
import { CandidateoutlineComponent } from './candidatesubmission/candidateoutline/candidateoutline.component';
import { SubmitcandidateService } from './candidatesubmission/submitcandidate.service';
import { ChecklistComponent } from './candidatesubmission/checklist/checklist.component';
import { SharedModule } from '../shared/shared.module';
import { CandidateResumeUploadComponent } from './candidatesubmission/candidate-resumeupload/candidate-resumeupload.component';
import { RuntimeDirective } from './runtime-component/runtime.directive';
import { RuntimeService } from './runtime-component/runtime.service';
import { ShareMultipleUserComponent } from './share-multiple-user/share-multiple-user.component';
import { UploadRecordingComponent } from "../application/requisitions/upload-recording/upload-recording.component";
import { UpdateClientComponent } from "../application/requisitions/update-client/update-client.component";
import { AddToHotbooksPopupComponent } from './candidatesubmission/add-to-hotbooks-popup/add-to-hotbooks-popup.component';
import { DncPopupComponent } from './candidatesubmission/dnc-popup/dnc-popup.component';
import { PinToReqPopupComponent } from './candidatesubmission/pin-to-req-popup/pin-to-req-popup.component';
import { SendSmsComponent } from './candidatesubmission/send-sms/send-sms.component';
import { CoPopupComponent } from './candidatesubmission/co-popup/co-popup.component';
import { CandidateoutlineForPopupComponent } from './candidatesubmission/candidateoutline-for-popup/candidateoutline-for-popup.component';
import { ResumesJournalsComponent } from './candidatesubmission/resumes-journals/resumes-journals.component';
import { FormatResumeComponent } from '../forms/format-resume/format-resume.component';
import { LowercaseInputDirective } from './candidatesubmission/lowercaseinput/lowercaseinput';
import { NewCandidateProfileComponent } from './new-candidate-profile/new-candidate-profile.component';



// import { WindowsInjetor,WindowBackdrop, BootstrapWindowContainer } from './common-ui/ng-window';
const DEFAULT_DROPZONE_CONFIG: DropzoneConfigInterface = {
  // Change this to your upload POST address:
  url: 'api/story/upload',
  maxFilesize: 50,
  acceptedFiles: 'image/*'
};


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule.forRoot(),
    // YoutubePlayerModule,
    BusyModule,
    // TreeModule,
    SidebarModule.forRoot(),
    FileUploadModule,
    NgxDatatableModule,
    NgxPaginationModule,
    DragulaModule,
    routing,
    SharedModule,
    NgxChartsModule,
    MultiselectDropdownModule,
    // EasyPieChartModule,
    GooglePlaceModule,
    NgbAlertModule,
    RatingModule,
    DragAndDropModule.forRoot(),
    // VerticalTimelineModule,
    MasonryModule,
    // ColorPickerModule,
    DropzoneModule,
    // AngularMultiSelectModule,
    // AngularDateTimePickerModule,
    // AgmCoreOverrideModule.forRoot({
    //   apiKey: '<key>'  // Not really needed.
    // }),
    // ArchwizardModule,
    ScrollToModule.forRoot(),
    SwiperModule,
    LoadersCssModule,
    TextMaskModule,
    NgSelectModule,
    NgCircleProgressModule.forRoot({
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    AmazingTimePickerModule,
    // NgxEditorModule,
        QuillModule,
        CommonCustomPipeModule
  ],
  providers: [
    {
      provide: DROPZONE_CONFIG,
      useValue: DEFAULT_DROPZONE_CONFIG
    }
  ],
  entryComponents: [
      LinkedInpopupComponent,
      LinkedinMailComponent,
    CandidatesubmissionComponent,
    UploadRecordingComponent,
    UpdateClientComponent,
    CandidateResumeUploadComponent,
    ShareMultipleUserComponent,
    PinToReqPopupComponent,
    AddToHotbooksPopupComponent,
    DncPopupComponent,
    SendSmsComponent,
    CoPopupComponent,
    FormatResumeComponent,


  ],
  declarations: [
    // FormeditorComponent,
    DynamicformcontrollsComponent,
    DynamicformComponent,
    Autocomplete2UiComponent,
    TextboxUiComponent,
    // DropdownUiComponent,
    PhonenumberUiComponent,
    CheckboxUiComponent,
    GridUiComponent,
    TabUiComponent,
    // PasswordUiComponent,
    DatepickerUiComponent,
    EmailUiComponent,
    NumberUiComponent,
    RadiolistUiComponent,
    RichtexteditorUiComponent,
    PanelUiComponent,
    FormWizardUiComponent,
    TinyEditorComponent,
    FileuploadUiComponent,
    // UpdateComponent,
    // CardUiComponent,
    // SearchUiComponent,
    // DragListUiComponent,
    // SidebarUiComponent,
    ChartUiComponent,
    ChartOptionsComponent,
    CardGridUiComponent,
    CardOptionUiComponent,
    LabelUiComponent,
    // LinkUiComponent,
    LabelOptionUiComponent,
    // ShareBoxUiComponent,
    // TableUiComponent,
    // CarouselUiComponent,
    TextareaUiComponent,
    MultiselectUiComponent,
    FilterPipe,
    // SocialGoogleComponent,
    // SocialInstagramComponent,
    // SocialLinkedinComponent,
    // SocialFacebookComponent,
    // SocialTwitterComponent,
    // RedirectOptionComponent,
    // OpenFormUiComponent,
    CheckboxlistUiComponent,
    GooglePlacesUiComponent,
    ImgPreviewDirective,
    PdfViewerComponent,
    VidPreviewDirective,
    NumberFormatComponent,
    ButtonUiComponent,
    WebsiteUiComponent,
    // PrintPageUiComponent,
    RatingUiComponent,
    CalenderUiComponent,
    CalendarDatePipe,
    CalendarEventTitlePipe,
    CalCardUiComponent,
    KanbanUiComponent,
    CardComponent,
    ListComponent,
    // TimelineUiComponent,
    // MediumEditorDirective,
    MatchHeightDirective,
    // HtmlEditorUiComponent,
    ImageUiComponent,
    // GoggleMapUiComponent,
    StatisticCardUiComponent,
    ExpressionCalcUiComponent,
    GroupCalcUiComponent,
    CalculatorUiComponent,
    // ImportUiComponent,
    // SettingComponent,
    // TreeViewComponent,
    DynamicformInitComponent,
    AdvanceGridUiComponent,
    RulesContainerComponent,
    RulesComponent,
    RuleComponent,
    SparklineComponent,
    CustomActionComponent,
    FunnelChartDirective,
    HiddenUiComponent,
    ProgressBarUiComponent,

    ActionitemcartComponent,
    BookmarkComponent,

    Dropdown3UiComponent,
    NestedUiComponent,
    NestedChildUiComponent,
    IframeUiComponent,
    DisableControlDirective,

    HoverDirDirective,

    LinkedInpopupComponent,

    LinkedinMailComponent,

   

    CandidatesubmissionComponent,
    UploadRecordingComponent,
    UpdateClientComponent,
    CandidateoutlineComponent,

    ChecklistComponent,
    CandidateResumeUploadComponent,
    RuntimeDirective,
    ShareMultipleUserComponent,
    AddToHotbooksPopupComponent,
    DncPopupComponent,
    PinToReqPopupComponent,
    SendSmsComponent,
    CoPopupComponent,
    CandidateoutlineForPopupComponent,
    ResumesJournalsComponent,
    FormatResumeComponent,
    LowercaseInputDirective,
    NewCandidateProfileComponent,

    //  WindowBackdrop,
    //  BootstrapWindowContainer
  ],
  exports: [
    // FormeditorComponent,
    DynamicformcontrollsComponent,
    DynamicformComponent,
    Autocomplete2UiComponent,
    TextboxUiComponent,
    // DropdownUiComponent,
    PhonenumberUiComponent,
    CheckboxUiComponent,
    GridUiComponent,
    TabUiComponent,
    // PasswordUiComponent,
    DatepickerUiComponent,
    EmailUiComponent,
    NumberUiComponent,
    RadiolistUiComponent,
    RichtexteditorUiComponent,
    PanelUiComponent,
    // TypeformUiComponent,
    FormWizardUiComponent,
    FileuploadUiComponent,
    // UpdateComponent,
    // CardUiComponent,
    // SearchUiComponent,
    // DragListUiComponent,
    // SidebarUiComponent,
    ChartUiComponent,
    ChartOptionsComponent,
    // ChartDashboardUiComponent,
    CardGridUiComponent,
    CardOptionUiComponent,
    LabelUiComponent,
    // LinkUiComponent,
    LabelOptionUiComponent,
    TextareaUiComponent,
    MultiselectUiComponent,
    FilterPipe,
    // SocialGoogleComponent,
    // SocialInstagramComponent,
    // SocialLinkedinComponent,
    // SocialFacebookComponent,
    // SocialTwitterComponent,
    // RedirectOptionComponent,
    // OpenFormUiComponent,
    CheckboxlistUiComponent,
    GooglePlacesUiComponent,
    ImgPreviewDirective,
    PdfViewerComponent,
    VidPreviewDirective,
    NumberFormatComponent,
    ButtonUiComponent,
    WebsiteUiComponent,
    // PrintPageUiComponent,
    RatingUiComponent,
    CalenderUiComponent,
    CalendarDatePipe,
    CalendarEventTitlePipe,
    CalCardUiComponent,
    KanbanUiComponent,
    CardComponent,
    ListComponent,
    // TimelineUiComponent,
    MatchHeightDirective,
    ImageUiComponent,
    StatisticCardUiComponent,
    ExpressionCalcUiComponent,
    GroupCalcUiComponent,
    CalculatorUiComponent,
    // ImportUiComponent,
    // SettingComponent,
    // TreeViewComponent,
    DynamicformInitComponent,
    AdvanceGridUiComponent,
    RulesContainerComponent,
    RulesComponent,
    RuleComponent,
    SparklineComponent,
    CustomActionComponent,
    FunnelChartDirective,
    HiddenUiComponent,
    ProgressBarUiComponent,
    ActionitemcartComponent,
    BookmarkComponent,
    Dropdown3UiComponent,
    ReactiveFormsModule,
    NestedUiComponent,
    NestedChildUiComponent,
      IframeUiComponent,
      LinkedInpopupComponent,
      LinkedinMailComponent,
      CandidateoutlineComponent,
    ChecklistComponent,
      CandidateResumeUploadComponent,
      RuntimeDirective,
      PinToReqPopupComponent,
      AddToHotbooksPopupComponent,
      DncPopupComponent,
      SendSmsComponent,
      CoPopupComponent,
      CandidateoutlineForPopupComponent,
      ResumesJournalsComponent
    // DatetimepickerDirective
  ]
})
export class DynamicFormsModule {
  public static forRoot(): ModuleWithProviders {
    return {
      ngModule: DynamicFormsModule,
      providers: [
        FormControlService,
        // Providers
        LocalStoreManager,
        DataService,
        UtilityService,
          ChartService,
          LinkedinService,
          SubmitcandidateService,
          RuntimeService
      ]
    };
  }
}
