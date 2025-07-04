import { Component, OnInit,Input} from '@angular/core';
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ViewScAndTypeService } from '../view-sc-and-type/view-sc-and-type.service';
import {ActivatedRoute, RouterModule} from '@angular/router';

@Component({
  selector: 'app-view-sc-type-card.component',
  templateUrl: './view-sc-and-type.component.html',
  styleUrls: ['./view-sc-and-type.component.scss'],
  providers: [ViewScAndTypeService]
})
export class ViewScAndTypeComponent implements OnInit {

  @Input() candidateid;
  requisitionId: number;
  responseData: any;

  constructor(public _modalService: NgbModal,
    public modal: NgbActiveModal,
    private viewScAndTypeService: ViewScAndTypeService,
    private route: ActivatedRoute
  ){
    this.requisitionId = this.route.snapshot.queryParams['requisitionid'];
  }
  

  ngOnInit(){
    console.log(this.candidateid + ' ' + this.requisitionId);
    this.getCandidateSCandType();
  }

  getCandidateSCandType(){
    this.viewScAndTypeService
    .getSCAndType(this.candidateid, this.requisitionId)
    .subscribe((response) => {
      if (JSON.parse(response._body)['response']) {
        this.responseData = JSON.parse(response._body)['response'][0];
      }
    },
    error => {}
    );
  }
 }
