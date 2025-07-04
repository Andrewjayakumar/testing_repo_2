import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrls: ['./checkbox-group.component.scss']
})
export class CheckboxGroupComponent implements OnInit {

    @Input() checkboxlist = Array<CheckboxItem>();
    @Output() checkboxlistChange = new EventEmitter();
   /* public checkboxlist1 = [
        {
            "journaltypeid": 16,
            "journaltype": "Candidate Created"
        },
        {
            "journaltypeid": 4,
            "journaltype": "Requisition Creation"
        }, {
            "journaltypeid": 1017,
            "journaltype": "CB Search"
        }
    ];*/

    @Output() selectedCategory = new EventEmitter<any[]>();


    public checkboxmodel = [];
    
  constructor() { }

    ngOnInit() {

    }

  /**
    * 
    * @param event
    * @param id
    *  recordCheck(event, id) {
        debugger;
        let checkedstate = event.target.checked;
        if (checkedstate) {
            this.checkboxmodel.push(id);
            this.selectedCategory.emit(this.checkboxmodel);
        }
        else {
            let indexfound = this.checkboxmodel.indexOf(id);
            if (indexfound > -1) {
                this.checkboxmodel.splice(indexfound, 1);
                this.selectedCategory.emit(this.checkboxmodel);
            }
        }
    } **/

}


export class CheckboxItem {
    journaltypeid: string;
    journaltype: string;
    checked: boolean;
    constructor(value: any, label: any, checked?: boolean) {
        this.journaltypeid = value;
        this.journaltype = label;
        this.checked = checked ? checked : false;
    }
}
