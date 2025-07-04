import {
    Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges,
    SimpleChanges,
} from '@angular/core';

import { SubmitcandidateService } from '../submitcandidate.service';
import { Subject, Observable } from 'rxjs';
import { filter, map, distinctUntilChanged, catchError, switchMap, concat, tap, debounceTime, takeUntil } from 'rxjs/operators';
import { AddrecService } from '../../../application/requisitions/add-requisition/addrec.service';
import { of } from 'rxjs/observable/of';
import { Subscription } from 'rxjs';
import { ObservableInput } from 'rxjs/Observable';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { debug } from 'util';
declare var $: any;
const linkedinPattern = new RegExp('(https?://)?([a-z]{2}\\.)?(www\\.)?linkedin\\.com(/(in|pub)/[a-zA-Z0-9_-]+/?)?', 'i');



@Component({
    selector: 'app-candidateoutline-for-popup',
    templateUrl: './candidateoutline-for-popup.component.html',
    styleUrls: ['./candidateoutline-for-popup.component.scss'],
    providers: [AddrecService]
})
export class CandidateoutlineForPopupComponent implements OnInit, AfterViewInit, OnChanges {

    @Input() public isCoPopup: any;
    @Input('candidateid') public candidateid = "";
    @Input('requisitionid') public requisitionid = "";
    @Input('countryid') public countryid;

    @Output() COfillChange: EventEmitter<number> = new EventEmitter<number>();

    zipcodeDataItems$: Observable<any>;
    zipcodeinput$ = new Subject<string | null>();
    zipcodeDataLoading = false;

    jobTitleItems$: Observable<any>;
    jobTitleinput$ = new Subject<string | null>();
    isJobTitleLoading = false;

    desiredJobTitleItems$: Observable<any>;
    desiredJobTitleinput$ = new Subject<string | null>();
    isdesiredJobTitleLoading = false;

    hotBookItems$: Observable<any>;
    hotBookinput$ = new Subject<string | null>();
    hotBookLoading = false;

    myReqItems$: Observable<any>;
    myReqinput$ = new Subject<string | null>();
    myReqLoading = false;

    allReqItems$: Observable<any>;
    allReqinput$ = new Subject<string | null>();
    allReqLoading = false;

    contactItems$: Observable<any>;
    contactinput$ = new Subject<string | null>();
    contactLoading = false;

    stateItemsList$: Observable<any>;
    stateinput$ = new Subject<string | null>();
    isStateLoading: boolean = false;

    PrimarySkillItems$: Observable<any>;
    primaryskills$ = new Subject<string | null>();

    public primarykillsArray = new Array();

    allJobCategory: any;
    allContactTypes: any;
    regions: any;
    allCircle: any;
    allCommunity: any;
    allTagMembers: any;
    allDemandPlans: any;
    busy: Subscription;
    alltheCurrency: any;
    positionType: any;
    authorizationType: any;
    candidateOutlineDetails: any;
    currentUser: any;
    isTagUser: any = false;
    showCoSections: boolean = true;
    searchInAllReqs: boolean = false;
    standardJobTitleList:any;
    isSourcetoreqDisable:boolean= true;
    
    coChildForm: FormGroup;
    availableforrelocation = false;
    lookingopportunity = false;
    fillCandidateOutline = false;
    public availabilityDate: NgbDateStruct = <NgbDateStruct>{};
    public inHousedate: NgbDateStruct = null;

    public websitetype: FormArray;
    webSiteTypeDetails: any;

    availabilityDateVal; any;
    dateholder: any;
    inhouseDateVal: any;
    primarySkillsDetails: any;
    points = 0;

    zipcode: any;
    contactTypeVal: any;
    cityDetails: any;
    TotalWeightage = 100;
    myFavoritefolder: any;
    militaryStatus = [

        { "key": "Active Duty", "value": "Active Duty" },
        { "key": "Retired Military", "value": "Retired Military" },
        { "key": "Veteran/Prior Service", "value": "Veteran/Prior Service" },
        { "key": "Reservist (drilling)", "value": "Reservist (drilling)" },
        { "key": "National Guard", "value": "National Guard" },
        { "key": "Inactive Reserve/Guard (not drilling)", "value": "Inactive Reserve/ Guard(not drilling)" },
        { "key": "Service Academy", "value": "Service Academy" },
        { "key": "In Military Preparation", "value": "In Military Preparation" },
        { "key": "Other Military Program", "value": "Other Military Program" },
        { "key": "Government Employee", "value": "Government Employee" },
        { "key": "Defense Contractor", "value": "Defense Contractor" },
        { "key": "Considering Joining", "value": "Considering Joining" },
        { "key": "Military Spouse", "value": "Military Spouse" },
        { "key": "Spouse of a Veteran", "value": "Spouse of a Veteran" },
        { "key": "Other Military Family Member", "value": "Other Military Family Member" }

    ];

    sectors = [

        { "key": "RDPL", "value": "RDPL" },
        { "key": "RFRL", "value": "RFRL" },
        { "key": "TAG", "value": "TAG" },
        { "key": "H1B", "value": "H1B" },
        { "key": "EngageX", "value": "EngageX" },
        { "key": "Rehire", "value": "Rehire" },
        { "key": "JUMP RDPL", "value": "JUMP RDPL" },
        { "key": "Spark RDPL", "value": "Spark RDPL" },
        { "key": "Exclusivity Spark", "value": "Exclusivity Spark" },
        { "key": "Exclusivity RDPL", "value": "Exclusivity RDPL" }
       


    ];

    yearsOfExp = [
        { "key": 0, "value": "0" },
        { "key": 1, "value": "1" },
        { "key": 2, "value": "2" },
        { "key": 3, "value": "3" },
        { "key": 4, "value": "4" },
        { "key": 5, "value": "5" },
        { "key": 6, "value": "6" },
        { "key": 7, "value": "7" },
        { "key": 8, "value": "8" },
        { "key": 9, "value": "9" },
        { "key": 10, "value": "10" },
        { "key": 11, "value": "11" },
        { "key": 12, "value": "12" },
        { "key": 13, "value": "13" },
        { "key": 14, "value": "14" },
        { "key": 15, "value": "15" },
        { "key": 16, "value": "16" },
        { "key": 17, "value": "17" },
        { "key": 18, "value": "18" },
        { "key": 19, "value": "19" },
        { "key": 20, "value": "20" },
        { "key": 21, "value": "21" },
        { "key": 22, "value": "22" },
        { "key": 23, "value": "23" },
        { "key": 24, "value": "24" },
        { "key": 25, "value": "25" },
        { "key": 26, "value": "26" },
        { "key": 27, "value": "27" },
        { "key": 28, "value": "28" },
        { "key": 29, "value": "29" },
        { "key": 30, "value": "30+" }
    ];

    verticals = [
        { "key": 1, "value": "All Verticals" },
        { "key": 2, "value": "Traditional IT" },
        { "key": 3, "value": "Others" },
    ];

    practices = [
        { "key": 1, "value": "All Verticals" },
        { "key": 2, "value": "Traditional IT" },
        { "key": 3, "value": "Others" },
    ];

    commutablePreference = [
        { "key": "Hybrid", "value": "Hybrid" },
        { "key": "Remote", "value": "Remote" },
        { "key": "On-Site", "value": "On-Site" },
    ];

    employeeTypes = [
        { "key": "W2", "value": "W2" },
        { "key": "C2C", "value": "C2C" },
    ];


    percentageFilled = {
        "firstname": 0, //  1
        "lastname": 0, //1
        "emailid": 0, //1,
        "mobilephone": 0, //4,
        "availabilitydate": 0,//,
        "commutablepreferencetype": 0,
        "websitetype": 0,
        "currentemployername": 0,
        "jobcategoryid": 0,
        "jobtitle": 0,
        "primaryskill": 0,
        "expcompensationrange": 0,
        "position": 0,
        "inhouse": 0,
        "workauthorizationid": 0,
        "availableforrelocation": 5,
    }
    public mask = [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  todaysDate = new Date();
  radioVal: any;
  radioreq = true;
  enablecheckbox = true;
  linkedInPattern = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+$/;
  emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  linkedinPattern: string = '^(https?://)?(www\\.)?linkedin\\.com/in/[a-zA-Z0-9-]+/?$';
    constructor(private _service: SubmitcandidateService, private recservice: AddrecService, private fb: FormBuilder, private localStorage: LocalStoreManager) {
        let user = this.localStorage.getData('current_user');
        this.currentUser = user.email;
        this.initializeTypeaheads();
    }



    ngOnInit() {
        this.initchildForm();
        this.getCandidateOutline();

        this.getTagMembers();
        this.getJobCategory();
        this.getDemandPlans();
        this.getAllCurrency();
        this.getPositionType();
        this.getWebSiteTypes();
        this.getContactTypes();
        this.getRegions();
        this.getCircles();
        this.getWorkAuthorization();  
        this.getStandardjobTitleItems();  
        this.coChildForm.value['candidateid'] = this.candidateid;
        this.coChildForm.value['iscovalidation'] = true;

    }


    ngAfterViewInit() {
        this.coChildForm.value['candidateid'] = this.candidateid;
        this.coChildForm.value['iscovalidation'] = true;

        $(document).ready(function () {
            // Add minus icon for collapse element which is open by default
            $(".collapse.show").each(function () {
                $(this).prev(".card-header").find(".fa").addClass("fa-minus").removeClass("fa-plus");
            });

            // Toggle plus minus icon on show hide of collapse element
            $(".collapse").on('show.bs.collapse', function () {
                $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
            }).on('hide.bs.collapse', function () {
                $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
            });
        });
        this.coChildForm.value['candidateid'] = this.candidateid;
        this.coChildForm.value['iscovalidation'] = true;
    }

    ngOnChanges(changes: SimpleChanges) {
    }

    initchildForm() {
        this.coChildForm = this.fb.group({
            proactivemembers: '',
            isavailable: "true",
            sector: '',
            talentpoolid: 0,
            talentpoolname: '',
            tcuid: 0,
            tcu: '',
            regionid: null,
            regionname: null,
            isextendvalidity: true,
            isproactivelyclosed: true,
            desiredjobtitle: '',
            areaofexpertise: '',
            // towerid: 0,
            // subtowerid: 0,
            candidateid: 0,
            journaltypeid: 0,
            comments: [''],
            firstname: [''],
            lastname: [''],
            mobilephone: [''],
            workphone: [''],
            emailid: ['', [Validators.required, Validators.email]],
            availableforrelocation: [''],
            commutablepreferencetype: [''],
            // commutablepreferencetype: [''],
            commutablepreferencetypeother: [''],
            jobcategoryid: 0,
            primaryskill:['',[Validators.required]],
            workauthorizationid: 0,
            position: [[]],
            currentemployername: [''],
            daytodayresponsibilities: [''],
            availabilitydate: [''],
            inhouse: [''],
            currency: [''],
            expcompensationrange: [''],
            jobtitle: [''],
            entrystatus: '',
            tagid: [''],
            websitetype: this.fb.array([this.createSocialMedia()]),
            lookingopportunity: true,
            iscovalidation: true,
            requisitionid: [''],
            militarystatus: [''],
            demandplanId: [''],
            contacttype: [''],
            relocationstates: [[]],
            relocatereason: '',
            projectresponsibilities: '',
            cojobtitle : "",
            copayrate: null,
            cocity:"",
            costate:"",
            copreferredlocation:"",
            coyearsexperience: 0,
            coverticalsid: null,
            copracticesid: null,
            coemployeetype: null,
            circleid: 0,
          communityid: 0,
          issource:false,
          webUrl: new FormControl('', [Validators.required, Validators.pattern(linkedinPattern)]),
          standardjobtitleid:null,
          isCommutablepreferencetypeHybrid:false,
          isCommutablepreferencetypeRemote:false,
          isCommutablepreferencetypeOnSite:false,
        })
}


    // convenience getter for easy access to form fields
    get coFormControls() { return this.coChildForm.controls; }

    datamodel = {
        'lookingopportunity': false,
        'notes': null,
        'fillCandidateOutline': true,
        'availableforrelocation': false,
        'isproactivelyclosed': false,
    }


    createSocialMedia(): FormGroup {
        return this.fb.group({
            websiteid: null,
            weburl: '',
        });
    }

    get addressControls() {

        return this.coChildForm.get('websitetype')['controls'];
    }



    addSocialNetWork(): void {
        this.websitetype = this.coChildForm.get('websitetype') as FormArray;
        this.websitetype.push(this.createSocialMedia());
    }

    removeSocialNetWork(i: number, websiteArray) {
        // debugger;
        if (websiteArray.length == 1) {
            this.percentageFilled["websitetype"] = 0;
          //  this.calculateFilledPercentage();
        }

        (this.coChildForm.get('websitetype') as FormArray).removeAt(i);
    }

    getCandidateOutline() {
        let apiparam: any = {};
        this.busy = this._service.getCandidateOutline(this.candidateid)
            .subscribe(
                (res: any) => {
                    this.candidateOutlineDetails = JSON.parse(res._body)['response'];
                    if (this.candidateOutlineDetails[0].availableforrelocation) {
                        this.datamodel.availableforrelocation = this.candidateOutlineDetails[0].availableforrelocation;
                    }
                    if (this.candidateOutlineDetails[0].lookingopportunity) {
                        this.datamodel.lookingopportunity = this.candidateOutlineDetails[0].lookingopportunity;

                    }
                    if (this.candidateOutlineDetails[0].fillCandidateOutline) {
                        this.datamodel.fillCandidateOutline = this.candidateOutlineDetails[0].fillCandidateOutline;

                    }
                    if (this.candidateOutlineDetails[0].points) {
                        this.points = this.candidateOutlineDetails[0].points;
                        this.COfillChange.emit(this.candidateOutlineDetails[0].points);
                        // do to set % of Initial Progress bar
                    }

                  //  this.LoadTimePercentageFilled(this.candidateOutlineDetails[0]);

                    this.inHouseModelinUpdate(this.candidateOutlineDetails[0].inhouse);
                    this.setDateModelinUpdate(this.candidateOutlineDetails[0].availabilitydate);

                    this.updateModels();
                    this.coChildForm.updateValueAndValidity();

                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log("done");
                }
            );
    }

    LoadTimePercentageFilled(initialCOData) {

        let initial_percentage = 0;


        if (initialCOData["firstname"]) { this.percentageFilled["firstname"] = 1; }
        if (initialCOData["lastname"]) { this.percentageFilled["lastname"] = 1; }
        if (initialCOData["emailid"]) { this.percentageFilled["emailid"] = 1; }
        if (initialCOData["mobilephone"]) { this.percentageFilled["mobilephone"] = 4; }
        if (initialCOData["availabilitydate"]) { this.percentageFilled["availabilitydate"] = 10; }
        if (initialCOData["commutablepreferencetype"]) { this.percentageFilled["commutablepreferencetype"] = 5; }
        if (initialCOData["websitetype"] && initialCOData["websitetype"].length > 0) { this.percentageFilled["websitetype"] = 10; }
        if (initialCOData["jobcategoryid"]) { this.percentageFilled["jobcategoryid"] = 5; }
        if (initialCOData["jobtitle"]) { this.percentageFilled["jobtitle"] = 10; }
        if (initialCOData["primaryskill"] && initialCOData["primaryskill"].length > 0) { this.percentageFilled["primaryskill"] = 5; }
        if (initialCOData["expcompensationrange"]) { this.percentageFilled["expcompensationrange"] = 3; }
        if (initialCOData["position"] && initialCOData["position"].length > 0) { this.percentageFilled["position"] = 10; }
        if (initialCOData["inhouse"]) { this.percentageFilled["inhouse"] = 10; }
        if (initialCOData["workauthorizationid"]) { this.percentageFilled["workauthorizationid"] = 10; }
        if (initialCOData["availableforrelocation"]) { this.percentageFilled["availableforrelocation"] = 5; }
        if (initialCOData["currentemployername"]) { this.percentageFilled["currentemployername"] = 10; }

        this.calculateFilledPercentage();

    }

    setDateModelinUpdate(availabilitydate: any) {

        if (availabilitydate) {
            let dd = new Date(availabilitydate);

            this.availabilityDate = { "year": dd.getFullYear(), "month": dd.getMonth() + 1, "day": dd.getDate() };


        }

    }

    inHouseModelinUpdate(inHousedate: any) {

        if (inHousedate) {
            let ih = new Date(inHousedate);

            this.inHousedate = { "year": ih.getFullYear(), "month": ih.getMonth() + 1, "day": ih.getDate() };



        }

    }



    updateModels() {
        this.coChildForm = this.fb.group({
            proactivemembers: [this.candidateOutlineDetails[0].proactivemembers],
            sector: [this.candidateOutlineDetails[0].sector],
            talentpoolId: [this.candidateOutlineDetails[0].talentpoolId],
            talentpoolName: [this.candidateOutlineDetails[0].talentpoolName],
            tcuId: [this.candidateOutlineDetails[0].tcuId],
            tcu: [this.candidateOutlineDetails[0].tcu],
            regionid: [this.candidateOutlineDetails[0].regionid],
            regionname: [this.candidateOutlineDetails[0].regionname],
            desiredjobtitle: [this.candidateOutlineDetails[0].desiredjobtitle],
            areaofexpertise: [this.candidateOutlineDetails[0].areaofexpertise],
            // towerid: [this.candidateOutlineDetails[0].towerid],
            // subtowerid: [this.candidateOutlineDetails[0].subtowerid],
            candidateid: [this.candidateOutlineDetails[0].candidateid],
            journaltypeid: [this.candidateOutlineDetails[0].journaltypeid],
            entryStatus: '',
            firstname: [this.candidateOutlineDetails[0].firstname],
            lastname: [this.candidateOutlineDetails[0].lastname],
            emailid: [this.candidateOutlineDetails[0].emailid],
            mobilephone: [this.candidateOutlineDetails[0].mobilephone],
            workphone: [this.candidateOutlineDetails[0].workphone],
            currentemployername: [this.candidateOutlineDetails[0].currentemployername],
            expcompensationrange: [this.candidateOutlineDetails[0].expcompensationrange],
            workauthorizationid: [this.candidateOutlineDetails[0].workauthorizationid],
            jobcategoryid: [this.candidateOutlineDetails[0].jobcategoryid],
            jobtitle: [this.candidateOutlineDetails[0].jobtitle],
            primaryskill: [this.candidateOutlineDetails[0].primaryskill],
            position: [this.candidateOutlineDetails[0].position],
            availableforrelocation: [this.candidateOutlineDetails[0].availableforrelocation],
            availabilitydate: [this.availabilityDate],
            websitetype: this.fb.array(this.candidateOutlineDetails[0].websitetype.map(org => this.populateSocialMedia(org))),
            inhouse: [this.inHousedate],
            currency: [this.candidateOutlineDetails[0].currency],
            commutablepreferencetype: [this.candidateOutlineDetails[0].commutablepreferencetype],
            militarystatus: [this.candidateOutlineDetails[0].militarystatus],
            commutablepreferencetypeother: [this.candidateOutlineDetails[0].commutablepreferencetypeother],
            tagid: [''],
            demandplanId: [''],
            daytodayresponsibilities: [this.candidateOutlineDetails[0].daytodayresponsibilities],
            contacttype: [''],
            comments: [''],
            relocationstates: [this.candidateOutlineDetails[0].relocationstates],
            relocatereason: [this.candidateOutlineDetails[0].relocatereason],
            projectresponsibilities: [this.candidateOutlineDetails[0].projectresponsibilities],
            isavailable: [this.candidateOutlineDetails[0].isavailable],
            cojobtitle : [this.candidateOutlineDetails[0].cojobtitle],
            copayrate: [this.candidateOutlineDetails[0].copayrate],
            cocity: [this.candidateOutlineDetails[0].cocity],
            costate: [this.candidateOutlineDetails[0].costate],
            copreferredlocation: [this.candidateOutlineDetails[0].copreferredlocation],
            coyearsexperience: [this.candidateOutlineDetails[0].coyearsexperience],
            coverticalsid: [this.candidateOutlineDetails[0].coverticalsid],
            copracticesid: [this.candidateOutlineDetails[0].copracticesid],
            coemployeetype: [this.candidateOutlineDetails[0].coemployeetype],
            circleid: [this.candidateOutlineDetails[0].circleid],
            communityid: [this.candidateOutlineDetails[0].communityid],
          requisitionid: [''],
          issource:[''],
          webUrl:[this.candidateOutlineDetails[0].webUrl],
          standardjobtitleid:[this.candidateOutlineDetails[0].standardjobtitleid],
          isCommutablepreferencetypeHybrid:[this.candidateOutlineDetails[0].isCommutablepreferencetypeHybrid],
          isCommutablepreferencetypeRemote:[this.candidateOutlineDetails[0].isCommutablepreferencetypeRemote],
          isCommutablepreferencetypeOnSite:[this.candidateOutlineDetails[0].isCommutablepreferencetypeOnSite],
        })

        let circleId = this.candidateOutlineDetails[0].circleid;
        this.getCommunity(circleId);
        this.coChildForm.value['communityid'] = this.candidateOutlineDetails[0].communityid;
         console.log("control",this.coChildForm)
    }

    populateSocialMedia(org: any) {
        return new FormGroup({
            weburl: new FormControl(org.weburl),
            websiteid: new FormControl(org.websiteid)
        });
    }

    initializeTypeaheads(param?) {

 

        this.jobTitleItems$ = this.jobTitleinput$.pipe(
            filter(t => t && t.length > 1),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((term) => this.searchJobtitle(term))
        );

        this.desiredJobTitleItems$ = this.desiredJobTitleinput$.pipe(
            filter(t => t && t.length > 1),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((term) => this.searchDesiredJobtitle(term))
        );

        this.PrimarySkillItems$ = this.primaryskills$.pipe(
            //filter(t => t && t.length > 1),
            debounceTime(200),
            distinctUntilChanged(),
            switchMap((term) => this.searchSkills(term))
        );

        this.hotBookItems$ = this.hotBookinput$.pipe(
            //filter(t => t && t.length > 1),
            debounceTime(200),
            distinctUntilChanged(),
            switchMap((term) => this.searchhotBooks(term))
        );

        this.myReqItems$ = this.myReqinput$.pipe(
            //filter(t => t && t.length > 1),
            debounceTime(200),
            distinctUntilChanged(),
            switchMap((term) => this.searchMyReqs(term))
        );

        this.allReqItems$ = this.allReqinput$.pipe(
            //filter(t => t && t.length > 1),
            debounceTime(200),
            distinctUntilChanged(),
            switchMap((term) => this.searchAllReqs(term))
        );

        this.stateItemsList$ = this.stateinput$.pipe(
            //filter(t => t && t.length > 1),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((term) => this.searchState(term))
        );
    }

    searchState(term: string): ObservableInput<any> {
        if (!term)
            return of([]);

        this.isStateLoading = true;
        return this.recservice.getStates(term, 1).pipe(
            map((res: any) => {
                //debugger;
                this.isStateLoading = false;
                let resP = JSON.parse(res._body);
                return resP.response ? resP.response.relatedstates : []
            })

        );
    }

    searchhotBooks(term) {
        if (!term)
            return of([]);
        this.hotBookLoading = true;
        return this._service.getHotBooks(term).pipe(
            map((res) => {
                // debugger;
                this.hotBookLoading = false;
                let resP = JSON.parse(res._body);
                return resP.response ? resP.response : []
            }),
            takeUntil(this.hotBookinput$)
        );
    }

    searchMyReqs(term) {
        if (!term)
            return of([]);
        this.myReqLoading = true;
        return this._service.getMyReqs(term).pipe(
            map((res) => {
                // debugger;
                this.myReqLoading = false;
                let resP = JSON.parse(res._body);
                return resP.response ? resP.response : []
            }),
            takeUntil(this.myReqinput$)
        );
    }

    searchAllReqs(term) {
        if (!term)
            return of([]);
        this.allReqLoading = true;
        return this._service.getAllReqs(term).pipe(
            map((res) => {
                // debugger;
                this.allReqLoading = false;
                let resP = JSON.parse(res._body);
                return resP.response ? resP.response : []
            }),
            takeUntil(this.allReqinput$)
        );
    }




    searchJobtitle(term: string) {
        if (!term)
            return of([]);

        this.isJobTitleLoading = true;
        return this.recservice.getJobTitle(term).pipe(
            map((res) => {
                //debugger;
                this.isJobTitleLoading = false;
                let resP = JSON.parse(res._body);
                return resP.response ? resP.response.relatedjobtitles : []
            }),
            takeUntil(this.jobTitleinput$)

        );
    }

    searchDesiredJobtitle(term: string) {
        if (!term)
            return of([]);

        this.isdesiredJobTitleLoading = true;
        return this.recservice.getJobTitle(term).pipe(
            map((res) => {
                //debugger;
                this.isdesiredJobTitleLoading = false;
                let resP = JSON.parse(res._body);
                return resP.response ? resP.response.relatedjobtitles : []
            }),
            takeUntil(this.desiredJobTitleinput$)

        );
    }

    searchSkills(term: string): ObservableInput<any> {
        this.primarykillsArray = null;
        if (!term) {
            this.primarykillsArray = [];

            return this.primarykillsArray;
        }

        return this._service.getPrimarySkills(term).pipe(
            map((res: any) => {
                // debugger;
                this.primarykillsArray = [];
                let resP = JSON.parse(res._body);
                return resP.response ? resP.response.skills : [];

            })

        );
    }
    // get job category

    getJobCategory() {
        let apiparam: any = {};
        this.busy = this._service.getJobCategory(apiparam)
            .subscribe(
                (res: any) => {
                    this.allJobCategory = JSON.parse(res._body)['response'];

                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log("done");
                }
            );
    }

    getContactTypes() {
        this.busy = this._service.getContactTypes(false)
            .subscribe(
                (res: any) => {
                    this.allContactTypes = JSON.parse(res._body)['response'];
                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log("done");
                }
            );
    }

    getRegions() {
        this.busy = this._service.getRegions()
            .subscribe(
                (res: any) => {
                    this.regions = JSON.parse(res._body)['response'];
                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log("done");
                }
            );
    }

    getCircles() {
        this.busy = this.recservice.getCircleList()
            .subscribe(
                (res: any) => {
                    this.allCircle = JSON.parse(res._body)['response'];
                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log("done");
                }
            );
    }

    getStandardjobTitleItems() {
    //Standard jobtitle
    this.recservice.getStdJobTitle()
      .subscribe(res => {
        if (JSON.parse(res._body)) {
          let response = JSON.parse(res._body)['response'];
          this.standardJobTitleList = response ? response.standardjobtitles : [];
        }
      },
        err => {
          console.error("Couldnt fetch Standard Job Title List" + err);
        });
    }
    getCircleCode(value) {
        if (value.id) {
            this.getCommunity(value.id);
        }
    }

    // get the Community values
    getCommunity(circleid) {
        this.busy = this.recservice.getCommunityList(circleid).subscribe(
            (res: any) => {
                this.allCommunity = JSON.parse(res._body)["response"];
            },
            (err) => {
                console.log(err);
            },
            () => {
                //console.log("done");
            }
        );
    }

    getTagMembers() {
        this.busy = this._service.getTagMembers()
            .subscribe(
                (res: any) => {
                    let resp = JSON.parse(res._body)['response'];
                    this.allTagMembers = resp.proactivemembers;
                    this.checkTagUser();
                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log("done");
                }
            );
    }

    checkTagUser() {
        debugger;

        let currentUser = this.currentUser.slice(0, -14);

        for (let member of this.allTagMembers) {
            if (currentUser == member.userid) {

                this.isTagUser = true;

            }
        }
    }

    // get demand plans
    getDemandPlans() {
        let demandName = "";
        this.busy = this._service.getDemandPlans(demandName)
            .subscribe(
                (res: any) => {
                    this.allDemandPlans = JSON.parse(res._body)['response'];

                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log("done");
                }
            );
    }

    // Get all the currency

    getAllCurrency() {
        let apiparam: any = {};
        this.busy = this._service.getAllCurrency(apiparam)
            .subscribe(
                (res: any) => {
                    this.alltheCurrency = JSON.parse(res._body)['response'];

                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log("done");
                }
            );
    }

    //Get the position Type

    getPositionType() {
        let apiparam: any = {
            "portalcode": "col"
        };
        this.busy = this._service.getPositionType(apiparam)
            .subscribe(
                (res: any) => {
                    this.positionType = JSON.parse(res._body)['response'];

                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log("done");
                }
            );
    }



    // Get Web site Types

    getWebSiteTypes() {
        let apiparam: any = {};
        this.busy = this._service.getWebSiteTypes(apiparam)
            .subscribe(
                (res: any) => {
                    this.webSiteTypeDetails = JSON.parse(res._body)['response'];

                },
                err => {
                    console.log(err);
                },
                () => {
                }
            );
    }

    // get Primary Skills

    getPrimarySkills() {
        let apiparam: any = {};
        this.busy = this._service.getPrimarySkills(apiparam)
            .subscribe(
                (res: any) => {
                    this.primarySkillsDetails = JSON.parse(res._body)['response'];

                },
                err => {
                    console.log(err);
                },
                () => {
                }
            );
    }

    setPercentageonFocusOut(event, percentageVal, formfield) {
        //  debugger;


        if (Array.isArray(this.coChildForm.controls[formfield].value)) {
            if (this.coChildForm.controls[formfield].value.length > 0) {
                this.percentageFilled[formfield] = percentageVal;
                if (formfield === 'websitetype') { // add exception to check data inside  elements of website list
                    let websiteArray = this.coChildForm.controls[formfield].value;
                    // let size = websiteArray.length;
                    let weburls = websiteArray.filter(x => (x.weburl != "" && x.weburl != null));

                    if (weburls.length == 0) {
                        this.percentageFilled[formfield] = 0;
                    }
                }
            }
            else
                this.percentageFilled[formfield] = 0;

        }

        /* for handling the text fileds and Non array fields */
        else {

            if (this.coChildForm.controls[formfield].value) {
                this.percentageFilled[formfield] = percentageVal;
            }
            else
                this.percentageFilled[formfield] = 0;

        }

     //   this.calculateFilledPercentage();

    }

    calculateFilledPercentage() {

        let keys = Object.keys(this.percentageFilled);
        let sum = 0;
        keys.forEach(key => {
            sum = this.percentageFilled[key] + sum;
        });

        this.points = sum;
        if (this.points) {
            this.COfillChange.emit(this.points);

        }
    }

    getCOFilledValues() {
        if (this.availabilityDateVal) {
            this.coChildForm.value['availabilitydate'] = this.availabilityDateVal;
        }
        else {
            this.coChildForm.value['availabilitydate'] = this.candidateOutlineDetails[0].availabilitydate;

        }

        if (this.inhouseDateVal) {
            this.coChildForm.value['inhouse'] = this.inhouseDateVal;
        }
        else {
            this.coChildForm.value['inhouse'] = this.candidateOutlineDetails[0].inhouse;

        }

        this.coChildForm.value['lookingopportunity'] = this.datamodel.lookingopportunity;
        this.coChildForm.value['fillCandidateOutline'] = this.datamodel.fillCandidateOutline;
        this.coChildForm.value['availableforrelocation'] = this.datamodel.availableforrelocation;
        if (this.datamodel.availableforrelocation) {
            (this.coChildForm.get('relocationstates').value.length >= 1) ? this.coChildForm.get('relocationstates').setErrors(null) :
                this.coChildForm.get('relocationstates').setErrors({ "invalid": true });
        } else {
            this.coChildForm.get('relocationstates').setErrors(null);
        }
        this.coChildForm.value['candidateid'] = this.candidateid;
        this.coChildForm.value['iscovalidation'] = true;


        return this.coChildForm;
    }

    availabilityDateChanged(value, formControlName) {
        this.availabilityDateVal = '';

        if (value) {
            var tzoffset = (new Date()).getTimezoneOffset() * 60000;
            this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
            this.availabilityDateVal = (new Date(this.dateholder - tzoffset)).toISOString();

        }
        if (this.availabilityDateVal) {
            this.percentageFilled[formControlName] = 10;
        }
        else
            this.percentageFilled[formControlName] = 0;

      //  this.calculateFilledPercentage();

    }

    getinHousedate(value, formControlName) {
        this.inhouseDateVal = '';

        if (value) {
            var tzoffset = (new Date()).getTimezoneOffset() * 60000;
            this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
            this.inhouseDateVal = (new Date(this.dateholder - tzoffset)).toISOString();

        }
        if (this.inhouseDateVal) {
            this.percentageFilled[formControlName] = 5;
        }
        else
            this.percentageFilled[formControlName] = 0;

    //    this.calculateFilledPercentage();
    }

    CommutablePreferenceChanged(event, perval) {
        if (event.target.checked) {
            this.coChildForm.controls['commutablepreferencetype'].setValue(event.target.value);
            this.percentageFilled["commutablepreferencetype"] = perval;

         //   this.calculateFilledPercentage();
        }

    }

    onZipcodeChange(zip) {
        if (zip) {
            this.zipcode = zip.zipcode;
            this.getCityByZipCode(this.zipcode);
        }
    }

    onContactTypeChange(contactType) {
        if (contactType) {
            this.contactTypeVal = contactType.id;
        }
        if ((this.contactTypeVal == 59) || (this.contactTypeVal == 77) || (this.contactTypeVal == 1005) || (this.contactTypeVal == 1006) || (this.contactTypeVal == 1007)) {
            this.datamodel.fillCandidateOutline = false;
            this.showCoSections = false;
        }

    }


    onRequisionTypeChange(event)
    {
        console.log(event);

      if(event && event['requisitionid']>0)
        this.isSourcetoreqDisable=null;
      else
      this.isSourcetoreqDisable=true;  


    }
    getCityByZipCode(zipcode) {
        this.busy = this.recservice.getCityListByZipcode(zipcode, 1)
            .subscribe(
                (res: any) => {
                    this.cityDetails = JSON.parse(res._body)['response'];
                    this.coChildForm.controls['city'].setValue(this.cityDetails.locationdetails[0].city);


                },
                err => {
                    console.log(err);
                },
                () => {
                    //console.log("done");
                }
            );
    }

    onProactivelyCosed(booleanState: boolean) {
        if (booleanState) {
            this.coChildForm.controls['isavailable'].setValue("true");
        } else {
            this.coChildForm.controls['isavailable'].setValue("false");  
        }
      }

  availableChanged(booleanState) {
      if (booleanState == 'true') {
          this.coChildForm.controls['isavailable'].setValue("true");
          this.datamodel.isproactivelyclosed = true;
          this.coChildForm.controls['isproactivelyclosed'].setValue("true");
      }
  }

  unavailableChanged(booleanState) {
      if (booleanState == 'false') {
          this.coChildForm.controls['isavailable'].setValue("false");
          this.datamodel.isproactivelyclosed = false;
          this.coChildForm.controls['isproactivelyclosed'].setValue(false);
      }
  }

    onOpenRelocationToggled(booleanState: boolean, percentage) {
        if(booleanState) {
            this.percentageFilled["availableforrelocation"] = percentage;
          } else {
            this.percentageFilled["availableforrelocation"] = 0;
          }
        }

    // Get Work Authorization
    getWorkAuthorization() {
        this.busy = this._service.getWorkAuthorization()
            .subscribe(
                (res: any) => {
                    this.authorizationType = JSON.parse(res._body)['response']
                },
                err => {
                    console.log(err);
                },
                () => {
                }
            );
    }

  radioValues(val) {
    this.radioVal = false;
    this.radioreq = false;


    if (val == 1) {
      this.radioVal = true;
      this.enablecheckbox = null;

    } else {
      this.radioVal = false;

    }

    if (val == 2) {
      this.radioreq = true;
      this.enablecheckbox = true;

    } else {
      this.radioreq = false;

    }
  }

  onrequisitionSelection(val) {
    this.enablecheckbox = null;
    if (val.requisitionName) {
      this.enablecheckbox = null;

    } else {
      this.enablecheckbox = true;

    }
  }

}
