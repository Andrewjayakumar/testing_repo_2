import { Component, OnInit, AfterViewInit, Renderer2, Input, ViewChild, ElementRef, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { LinkedinService } from '../linkedin-mail/linkedin.service';
//declare var document: any;
declare var $: any;

@Component({
    selector: 'app-linkedinpopup',
    templateUrl: './linkedinpopup.component.html',
    styleUrls: ['./linkedinpopup.component.scss'],
    providers: [LinkedinService]
})
export class LinkedInpopupComponent implements OnInit, AfterViewInit, OnDestroy{
    
    @Input('candidateid')
    public candidateid;
    isIframeLoading = true;


    @ViewChild('linkedinprofile') linkedinprofile: ElementRef;
    linkpopElement: any;

    ngAfterViewInit(): void {
   
      

        setTimeout(() => {
            this.isIframeLoading = false;
        }, 3000);

        let modalHeader = $('.modal-header');
        modalHeader.addClass('cursor-all-scroll');

      
    }

    constructor(public service: LinkedinService, public modal: NgbActiveModal, private renderer: Renderer2, public cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.loadInIframe();

        // add tracking call for linkedin
       
        this.service.trackPageOpened("LinkedInProfile", this.candidateid).subscribe(res => { },
            err => {
                console.log("Linkedin Profile tracking call failed" + err);
            });

    }

    public loadInIframe() {

        this.linkpopElement = this.linkedinprofile.nativeElement;

        var iframe = document.createElement('iframe');
        var html =
            '<html>' +
            '<head></head>' +
            '<body>' +
            '<scr' + 'ipt src="https://platform.linkedin.com/xdoor/scripts/in.js">' +
            'api_key: 86oy2bvydh4thi' + "\n" +
            'extensions:HcmWidget@https://www.linkedin.com/talent/widgets/assets/javascripts/profile-widget.js'
            + '</scr' + 'ipt>' +

            '<scr' + 'ipt type="IN/HcmWidget" id="profileWidget" data-widget-type="ATS"' +
            'data-ats-candidate-id="' + this.candidateid + '"' +
            'data-integration-context="urn:li:organization:86694680" data-integration-contract="urn:li:contract:351831131"' +
            'data-show-unlink-url="true" data-confirm-unlink="true" data-onlink="link" data-onunlink="unlink" data-width="650px"  >'
            + '</scr' + 'ipt>'
            + '</body></html>';

        // iframe.src = 'data:text/html;charset=utf-8,' + html;
     //   iframe.height = "520px";
        iframe.width = "100%";
      //  iframe.height= '100%';

        iframe.classList.add('resp-height');
        iframe.frameBorder = "0";

        this.renderer.appendChild(this.linkpopElement, iframe);
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(html);
        iframe.contentWindow.document.close();

        /** iframe.contentWindow.onload = function () {
           
          } */
    }

    ngOnDestroy(): void {
        this.service.syncUserProfilewithLinkedin(this.candidateid).subscribe(
    res=>{
       // console.log("in response")
        },
            error => {
                console.log(" Error in syncing profile ")
            }
);
    }

}
