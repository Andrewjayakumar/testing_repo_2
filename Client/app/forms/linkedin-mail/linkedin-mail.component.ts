import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';
import { LinkedinService } from './linkedin.service';

@Component({
    selector: 'app-linkedin-mail',
    templateUrl: './linkedin-mail.component.html',
    styleUrls: ['./linkedin-mail.component.scss']
})
export class LinkedinMailComponent implements OnInit {
   
    @Input('candidateid')
    public candidateid;

    public additionaldata: any = [];
    isLoading = true;
    recruiter_pic: string = "";
    candidate_pic: string = "can";

    public mailhistory: any = [];
    constructor( private linkedinservice : LinkedinService, public modal: NgbActiveModal, private localStorage: LocalStoreManager, private sanitizer: DomSanitizer) {
      
    }

    ngOnInit() {

        this.linkedinservice.getInmailHistory(this.candidateid).subscribe(
            res => {
               debugger;
                this.isLoading = false;
                this.mailhistory = JSON.parse(res._body).response;
            },
            err => {
                this.isLoading = false;
            }
        );

        if (this.additionaldata)
            this.additionaldata.forEach(attribute => {
             
                if (attribute.fullname) {
                  
                    let full_name = attribute.fullname ? attribute.fullname.split(" ") : "Candidate ";
                    this.candidate_pic = full_name[0].charAt(0) + (full_name[1] ? full_name[1].charAt(0) : "");
                }
                    
            });


        this.linkedinservice.trackPageOpened("InMailHistory", this.candidateid).subscribe(res => { },
            err => {
                console.log("Linkedin In Mail history tracking call failed" + err);
            });
    }

  

    getSafeHtml(text) {
        return this.sanitizer.bypassSecurityTrustHtml(text);
    }
}
