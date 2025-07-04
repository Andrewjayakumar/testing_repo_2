import { Component, OnInit, Input } from '@angular/core';
import { CandidateService } from '../candidate.service';
import { NgbActiveModal, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-tech-assessment',
  templateUrl: './tech-assessment.component.html',
  styleUrls: ['./tech-assessment.component.scss'],
  providers: [CandidateService]
})
export class TechAssessmentComponent implements OnInit {

  addedNewSkills = [];


  constructor(public candidateservice: CandidateService, public modal: NgbActiveModal, private _modalService: NgbModal) { }



  ngOnInit() {

  }
  items = [
  
  ];
  selectedItem: any;
  searchedSkillset: any;

  // Optional: Custom logic for adding a new tag
  onAddTag(event: string) {
   // const newItem = { id: this.items.length + 1, name: event };
    this.items.push(event);
    this.selectedItem = event;
    console.log("Uems", this.items);
  }

  OnSubmitClicked(form) {
    debugger;
    let reqObj = { "PageIndex": "1", "PageSize": "20", "OrderBy": "", "SortExpression": "", "response": "", "searchtext": this.items }

    this.candidateservice.searchTechAssessment(reqObj).subscribe(
      (res: any) => {
        let response = JSON.parse(res._body)['response'];
        if (response) {
          this.searchedSkillset = response;
        } else {
        
        }
      }
    );
  }
}
