import { Component, OnInit, ViewChildren, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MyRequisitionsService } from '../../my-requisitions/my-requisitions.service';
import { Subscription, Subject } from 'rxjs';
//import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { NgbActiveModal, NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'req-summary',
  templateUrl: './req-summary.component.html',
  styleUrls: ['./req-summary.component.scss'],
  providers: [MyRequisitionsService]

})
export class ReqSummaryComponent implements OnInit {

  @Input() public id;
  busy: Subscription;
  summary: any = null;
  Skills: any;
  DesiredSkills: any = [];
  showLoading: boolean = true;
  currentURL: any;


  constructor(private router: Router, private recservice: MyRequisitionsService, public modal: NgbActiveModal) { }

  ngOnInit() {
    let id = this.id;
    this.getreqSummaryById();
    this.currentURL = this.router.url.split('?');
  }


  getreqSummaryById() {

    this.busy = this.recservice.getreqSummaryById(this.id)
      .subscribe(
        (res: any) => {
              let response = JSON.parse(res._body)['response'];
              this.showLoading = false;
              if (response && response[0]) {
                this.summary = response[0];
                debugger;
              }
          if (this.summary && this.summary.Skills) {
                this.Skills = this.summary.Skills;
                }
              if (this.summary && this.summary.desiredskills) {
                this.DesiredSkills = this.summary.desiredskills;
              }
                    

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }
  private getElementTag(tag: keyof HTMLElementTagNameMap): string {
    const html: string[] = [];
    const elements = document.getElementsByTagName(tag);
    for (let index = 0; index < elements.length; index++) {
      html.push(elements[index].outerHTML);
    }
    return html.join('\r\n');
  }
  printView() {
    var printContents = document.getElementById("printdata").innerHTML;
    console.log("Data", printContents);
    if (printContents) {
      var styles = this.getElementTag('style');
      var links = this.getElementTag('link');
      var title = 'Testing the Title';
      if (window) {
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
          var popup = window.open('', '_blank',
            'width=1100,height=650,top=120,left=120,scrollbars=no,menubar=no,toolbar=no,'
            + 'location=no,status=no,titlebar=no');

          popup.window.focus();
          popup.document.write('<!DOCTYPE html><html><head><title>' + title + '</title>  '
            + styles
            + ' '
            + links
            + ' </head><body class="container" onload="window.print();window.close()"><div class="row">'
            + printContents + '</div></html>');
          popup.onbeforeunload = function (event) {
            popup.close();
            return '.\n';
          };
          popup.onabort = function (event) {
            popup.document.close();
            popup.close();
          }
        } else {
          var popup = window.open('', '_blank', 'width=1100,height=650,top=120,left=120');
          //popup.document.open();
          popup.document.write('<html><head><title>' + title + '</title> ' +
            + styles
            + ' '
            + links
            + '</head><body onload="window.print();window.close()">' + printContents + '</html>');
          popup.document.close();
        }

        popup.document.close();
      }
      return true;
    }

  }
}
