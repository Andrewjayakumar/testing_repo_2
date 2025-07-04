import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { RequisitionsService } from '../../../requisitions.service';
import { AddrecService } from '../../addrec.service';

@Component({
    selector: 'app-aca-documents',
    templateUrl: './aca-documents.component.html',
    styleUrls: ['./aca-documents.scss'],
    providers: [AddrecService, RequisitionsService]
})

export class AcaDocumentsComponent implements OnInit {

    startDate: Date;
    endDate: Date;
    differenceInDays: number;
    requisitionid: any;
    requisitionDetails: any;
    showLoader = false;
    errorMessage:any;


  documentList: any;
  deliverymodelid: any;


    constructor(public modal: NgbActiveModal, private _addrecService: AddrecService, private _requisitionsService: RequisitionsService,) {

    }

    ngOnInit(): void {
        if(!this.startDate){
            this._requisitionsService.getallreqDetails(this.requisitionid)
                .subscribe(
                    (res: any) => {
                        this.requisitionDetails = JSON.parse(res._body)['response'];
                        this.startDate = this.requisitionDetails.startdate;
                    this.endDate = this.requisitionDetails.projectenddate;

                        this.difDays();
                        this.getAcaDocuments();
                        

                    },
                   
                    )
                }else{
                    
                    this.getAcaDocuments();
                  

                }


    }

    getAcaDocuments() {
      this.showLoader = true;
      this._addrecService.getAcaDocumentList(this.requisitionid, this.startDate, this.endDate, this.deliverymodelid)
            .subscribe((res: any) => {
                let resP = JSON.parse(res._body);
                this.documentList = resP.response;
                this.showLoader = false;


            },
                (err) => {
                    
                    this.modal.close(true)
                    console.log('Error in Fetching Data', err);
                    window.alert("Something Went Wrong!! Please Try Later")

                }


            )

    }
    
    difDays() {
        let endingDate = new Date(this.endDate);
        let startingDate = new Date(this.startDate);
        startingDate.setDate(startingDate.getDate());
        let differenceInTime = endingDate.getTime() - startingDate.getTime();
        this.differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));

    }



}

