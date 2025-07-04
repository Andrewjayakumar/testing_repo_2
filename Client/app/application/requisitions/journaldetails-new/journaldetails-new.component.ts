
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RequisitionsService } from "../requisitions.service"

@Component({
  selector: 'app-journaldetails-new',
  templateUrl: './journaldetails-new.component.html',
  styleUrls: ['./journaldetails-new.component.scss'],
  providers: [RequisitionsService]
})

export class JournalDetailsNewComponent implements OnInit {
   @Input() journalDetails = {};
   @Input() totalrecords = 0;
   pagesize: number = 10;
   pageindex: number = 1;
   errorMessage: any = 'No Results Found!';

  constructor(public rcservice : RequisitionsService)
  {}

  ngOnInit() { 

   }

}
