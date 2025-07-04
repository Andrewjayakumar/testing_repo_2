import { Component, OnInit, ViewChildren, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
//import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { NgbActiveModal, NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';



@Component({
  selector: 'itss-project',
  templateUrl: './itss-project.component.html',
  styleUrls: ['./itss-project.component.scss'],

})
export class ItssprojectComponent implements OnInit {




  constructor(private router: Router,public modal: NgbActiveModal) { }

  ngOnInit() {

  }




  ngAfterViewInit(): void {

  }


}
