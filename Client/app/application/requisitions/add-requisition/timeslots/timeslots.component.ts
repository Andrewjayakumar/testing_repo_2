import { Component, OnInit, EventEmitter, Output, AfterViewInit, Input, SimpleChanges } from '@angular/core';
import {AddrecService} from '../addrec.service';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
declare var $: any;
//import { disable } from 'quill';

@Component({
  selector: 'app-timeslots',
  templateUrl: './timeslots.component.html',
  styleUrls: ['./timeslots.component.scss', '../recdetails/recdetails.component.scss']
})
export class TimeslotsComponent implements OnInit, AfterViewInit {
   
    @Input('interviewtimeslots')
    interviewtimeslots: Array<any>;

    @Input()
    mode: string = 'add';

    @Output() interviewtimeslotsChange = new EventEmitter();

    @Input('managertimeslots')
    managertimeslots: Array<any>;
    @Output() managertimeslotsChange = new EventEmitter();

    public showTimeSlotForm = false;
     
  
  //	date: Date = new Date();
    settings = {
      bigBanner: true,
      timePicker: true,
      format: 'short',
      defaultOpen: false,
      closeOnSelect:true
  }
  
  interviewTypedetails:any;
  timezoneDetails:any;
  interviewForm: FormGroup;
  items: FormArray;
 // interviewtimeslots = [];
  datestring:any;
  disableadd:any;
  dateEndstring:any;
  interviewTypeDetailsMgr:any;
  manager = false;
    candidate = false;
    startdate: any;
//    managerinterviewslots = [];

private parentsEvent: Subscription;

@Input() reset: Observable<void>;


   
    constructor(private recservice: AddrecService, private formBuilder: FormBuilder) { }

    durationList = [
        { "duration": "30 minutes", "value": 30}, { "duration": "1 hour", "value": 60},
        { "duration": "1 hour 30 min", "value": 90}, { "duration": "2 hours", "value": 120},
        { "duration": "2 hours 30 min", "value": 150}, { "duration": "3 hours", "value": 180},
        { "duration": "3 hours 30 min", "value": 210 }, { "duration": "4 hours", "value": 240 },
        { "duration": "4 hours 30 min", "value": 270 }, { "duration": "5 hours", "value": 300 },
        { "duration": "5 hours 30 min", "value": 330 }, { "duration": "6 hours", "value": 360 },
        
    ];
  
  ngOnInit(){
    
    this.getinteviewType();
    this.getTimeZone();
    this.interviewForm = this.formBuilder.group({
        interviewtypeid: ['', Validators.required],
        timezone: ['', Validators.required],
        startdatetime: ['', Validators.required],
        interviewduration: ['', Validators.required],
        description: ''
    });

      this.parentsEvent = this.reset.subscribe(() => this.formReset());
  }

    ngAfterViewInit(): void {
        $(".wc-date-container > span").hide(1000);
    }
    ngOnDestroy() {
        this.parentsEvent.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.mode) {
            // whether clone or update set hte dates in readable format
            if (changes.mode.previousValue === 'add') {
                
                if (this.interviewtimeslots) {
                    
                    this.interviewtimeslots.forEach((slot) => {
                        let starttime = new Date(slot.startdatetime);
                        let datestring = ('0' + (starttime.getMonth() + 1)).slice(-2) + "/" + starttime.getDate() + "/" + starttime.getFullYear() + " " +
                            starttime.getHours() + ":" + ('0' + (starttime.getMinutes())).slice(-2);

                        //save abck the value to array for iteration
                        slot.startdatetime = datestring;
                        
                        let enddate = new Date(slot.enddatetime)
                        slot.enddatetime = ('0' + (enddate.getMonth() + 1)).slice(-2) + "/" + enddate.getDate() + "/" + enddate.getFullYear() + " " +
                            enddate.getHours() + ":" + ('0' + (enddate.getMinutes())).slice(-2);


                    });
                }
                else
                    this.interviewtimeslots = [];

                if (this.managertimeslots) {
                    
                    this.managertimeslots.forEach((slot) => {
                        debugger;
                        let starttime = new Date(slot.startdatetime);
                        let datestring = ('0' + (starttime.getMonth() + 1)).slice(-2) + "/" + starttime.getDate() + "/" + starttime.getFullYear() + " " +
                            starttime.getHours() + ":" + ('0' + (starttime.getMinutes())).slice(-2);

                        //save abck the value to array for iteration
                        slot.startdatetime = datestring;
                      
                        let enddate = new Date(slot.enddatetime);
                        slot.enddatetime = ('0' + (enddate.getMonth() + 1)).slice(-2) + "/" + enddate.getDate() + "/" + enddate.getFullYear() + " " +
                            enddate.getHours() + ":" + ('0' + (enddate.getMinutes())).slice(-2);


                    });
                }
                else
                    this.managertimeslots = [];
               
            }
        }
    }

  getinteviewType() {
  
    this.recservice.getInteviewType()
  .subscribe(
    (result:any) => {
      // Handle result
      let response = JSON.parse(result._body)['response'];
          this.interviewTypedetails = response.interviewtype;
  
    },
    error => {
      // this.errors = error;
    },
    () => {
      
    }
  );
  }
  
  getTimeZone(){

  
    this.recservice.getTimeZone()
  .subscribe(
    (result:any) => {
      // Handle result
      this.timezoneDetails = JSON.parse(result._body)['response'];
  
    },
    error => {
        console.log("ErrorFetching Timezone" + error);
    },
    () => {
      
    }
  );
  }
  onStartDateSelected(event){
    if(event){
      var d = new Date(event);
  
        this.datestring = ('0' + (d.getMonth() + 1)).slice(-2) + "/" + d.getDate() + "/" + d.getFullYear() + " " +
            d.getHours() + ":" + ('0' + (d.getMinutes())).slice(-2) ;
    }
      $(".wc-date-container > span").show(1000);
  }
  onEndDateSelected(event){
    if(event){
      var d = new Date(event);
  
        this.dateEndstring = ('0' + (d.getMonth() + 1)).slice(-2) + "/" + d.getDate() + "/" + d.getFullYear() + " " +
          d.getHours() + ":" + ('0' + (d.getMinutes())).slice(-2);
    }
  
  }


  add(){
  if(this.datestring){
    this.interviewForm.value['startdatetime'] = this.datestring;
  } 
  if(this.datestring){
    this.interviewForm.value['enddatetime'] = this.dateEndstring;
  }
  if(this.interviewtimeslots.length <= 4 && this.candidate){
      this.interviewtimeslots.push(this.interviewForm.value);
  }
  
      if (this.managertimeslots.length <= 4 && this.manager){
          this.managertimeslots.push(this.interviewForm.value);
          
      }

     
      //clearfields
      this.interviewForm.reset();
      $(".wc-date-container > span").hide(1000);
      this.interviewForm.value['startdatetime'] = null;
      this.interviewForm.value['enddatetime'] = null;

      this.interviewtimeslotsChange.emit(this.interviewtimeslots);
      this.managertimeslotsChange.emit(this.managertimeslots);
  }
  
  removeItem(index){
   
      this.interviewtimeslots.splice(index,1);
     
  }
  removeItemMgr(index){
    
      this.managertimeslots.splice(index,1);
    
  }
  formReset(){
    this.interviewForm.reset();
    this.interviewtimeslots = [];
      this.managertimeslots = [];
      //notify parent of change
  //    this.interviewtimeslotsChange.emit(this.interviewtimeslots);
   //   this.managertimeslotsChange.emit(this.managertimeslots);
      $(".wc-date-container > span").hide(1000);

      this.interviewForm.value['startdatetime'] = null;
      this.interviewForm.value['enddatetime'] = null;
      this.interviewForm.value['interviewduration'] = null;
  }
  
  getInterviewTypesManager(){
  
    this.recservice.getInterviewTypesManager()
  .subscribe(
    (result:any) => {
          // Handle result
          let res = JSON.parse(result._body)['response'];
          this.interviewTypeDetailsMgr = res.interviewtype;
    },
    error => {
      // this.errors = error;
    },
    () => {
      
    }
  );
  }

  onradioSelected(val){
    this.manager = false;
    this.candidate = false;
   // this.interviewtimeslots = [];
    //  this.managertimeslots = [];
  
    if(val == 'manager'){
      this.getInterviewTypesManager();
      this.manager = true;
    }
    else {
      this.candidate = true;
    }
  }

    onDurationSelected(event) {
        debugger;

        let startdate = new Date(this.startdate);
        let timeinseconds = startdate.getTime() + (event.value * 60000);

        let d = new Date(timeinseconds);
        this.dateEndstring = ('0' + (d.getMonth() + 1)).slice(-2) + "/" + d.getDate() + "/" + d.getFullYear() + " " +
            d.getHours() + ":" + ('0' + (d.getMinutes())).slice(-2);
        this.interviewForm.value['enddatetime'] = this.dateEndstring;
    }
 }
