import { Component, OnInit, ViewChildren, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, Input, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
//import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { Observable } from 'rxjs';
import { ItssService } from '../itss-list/itss.service';
import { ModalDismissReasons, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';




@Component({
  selector: 'itss-list',
  templateUrl: './itss-list.component.html',
  styleUrls: ['./itss-list.component.scss'],
  providers: [ItssService],


})
export class ItsslistComponent implements OnInit {

  busy: Subscription;
  itssprojectDetails: any;
  totalrecords: any;
  pagesize: number = 20;
  pageindex: number = 1;
  search: any;
  itssprojSearchDetails: any;
  errorMessage: any;
  @ViewChild('content') content: TemplateRef<any>;
  ngbModalOptions: NgbModalOptions = { backdrop: 'static', keyboard: false };
  public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true };
  modalRef: any;
  current_user_obj: any;
  showupaddprojbutton: any;
  constructor(private router: Router, private ItssService: ItssService, public _modalService: NgbModal, private localStorage: LocalStoreManager) { }

  ngOnInit() {
    this.getAlltheItssProjects();
    this.current_user_obj = this.localStorage.getData('current_user');
    this.current_user_obj.roles.forEach((element) => {
      if (this.current_user_obj.activerolename == element.rolename) {
        if (element.allowaddproject == "true") {

          this.showupaddprojbutton = true;
        } else {
          this.showupaddprojbutton = false;

        }
      }
    });
  }


  getAlltheItssProjects() {
    this.search = '';

    this.busy = this.ItssService.getAlltheItssProjects()
      .subscribe(
        (res: any) => {
          this.itssprojectDetails = JSON.parse(res._body)['response'];
          if (this.itssprojectDetails && this.itssprojectDetails.length > 0) {
            this.totalrecords = this.itssprojectDetails.length;

          }
          else {
            this.errorMessage = "No Results Found!";

            setTimeout(() => {
              this.errorMessage = "";
            }, 5000);
          }
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  getSearchResults() {

    this.errorMessage = '';
    this.totalrecords = null;
    this.busy = this.ItssService.getSearchResults(this.search)
      .subscribe(
        (res: any) => {
          this.itssprojectDetails = JSON.parse(res._body)['response'];
          if (this.itssprojectDetails && this.itssprojectDetails.length > 0) {
            this.totalrecords = this.itssprojectDetails.length;

          }
          else {
            this.errorMessage = "No Results Found!";

            setTimeout(() => {
              this.errorMessage = "";
            }, 5000);
          }
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  exporttoexcelResults() {

    var param = {
      "searchtext": this.search
    }
    this.busy = this.ItssService.exporttoexcelResults(param)
      .subscribe(
        (res: any) => {
          this.popupConfig.title = "Success !";
          this.popupConfig.message = "Successfully queued your request. A mail with result set would be delivered shortly.";
          this.popupConfig.type = "success";
          this.popupConfig.isConfirm = false;
          this.openPopup();
          setTimeout(() => {
            this.modalRef.close();
            }, 3000);

          

        },
        err => {
          this.popupConfig.title = "Sorry !";
          this.popupConfig.message = "Something went wrong. Please Try Again Later.";
          this.popupConfig.type = "error";
          this.popupConfig.isConfirm = false;
          this.openPopup();

       

          console.log(err);
        },
        () => {
        }
      );
  }

  openPopup(closePopup?: boolean) {

    this.modalRef = this._modalService.open(this.content, this.ngbModalOptions);

    this.modalRef.result.then((result) => {

        if (result === 'Close click') {

        }
    }, (reason) => {
        if (reason === ModalDismissReasons.ESC ||
            reason === ModalDismissReasons.BACKDROP_CLICK) {

        }
    });


}


  ngAfterViewInit(): void {

  }



}
