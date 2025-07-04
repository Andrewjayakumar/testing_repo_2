import { Component, OnInit, EventEmitter, Output, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { setTimeout } from 'timers';

@Component({
  selector: 'app-clientdetail-right',
  templateUrl: './clientdetail-right.component.html',
  styleUrls: ['../../recdetails/recdetails.component.scss']
})
export class ClientdetailRightComponent implements OnInit {

  constructor() { }

    @ViewChild('clientRightForm') form: any;

  public model = {
      "interviewtimeslots": [],
      "managerinterviewslots" : []
  }
   

    @Output('onReset')
    resetClicked: EventEmitter<string> = new EventEmitter();

    @Output('onCancel')
    cancelClicked: EventEmitter<string> = new EventEmitter();

    eventsSubject: Subject<void> = new Subject<void>();


    @Output('createClicked')
    createClicked: EventEmitter<any> = new EventEmitter();

    @Output('onValidCheck')
    onValidCheck: EventEmitter<any> = new EventEmitter();
    // not mixing create req event emitter and is valid even because, create req can be triggered from ReC Page Also
  
  ngOnInit() {
   

    }
    ngOnChanges(changes: SimpleChanges) {

        if (!this.form.valid)
            this.onValidCheck.emit({ "isValid": false });
        else if (this.form.valid)
            this.onValidCheck.emit({ "isValid": true, "datamodel": this.model });
    }

    clearRecFormDetails(currentForm, name) {
        currentForm.form.reset();
        this.resetClicked.emit(name);

        this.eventsSubject.next();
    }

    onCancelClicked() {
        this.cancelClicked.emit('clientdetails');
    }

    createRequisition() {

        if (!this.form.valid)
            this.onValidCheck.emit({ "isValid": false });
        else if (this.form.valid)
            this.onValidCheck.emit({ "isValid": true, "datamodel": this.model });


        setTimeout(()=> {
            this.createClicked.emit(true);
        }, 1000);
    }

}
