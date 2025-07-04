
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { RequisitionsService } from "../requisitions.service"

@Component({
  selector: 'app-recdetails-new',
  templateUrl: './recdetails-new.component.html',
  styleUrls: ['./recdetails-new.component.scss'],
  providers: [RequisitionsService]
})

export class RecDetailsNewComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Input() details = {};
  @Input() allReqDetails = {};

  closeSidebar() {
    this.close.emit();
  }

  constructor(public rcsrvice: RequisitionsService)
  {}
    
  
 
  ngOnInit() { 
   //  console.log("Details",this.details);
    // console.log("oks",this.allReqDetails);
   }


}
