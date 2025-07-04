import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SubmitcandidateService } from './../submitcandidate.service';
import { Subscription } from 'rxjs';
import { FileUploader } from 'ng2-file-upload';
import { forkJoin } from 'rxjs/observable/forkJoin';


@Component({
  selector: 'candidate-resumeupload',
  templateUrl: './candidate-resumeupload.component.html',
  styleUrls: ['./candidate-resumeupload.component.scss'],
})
export class CandidateResumeUploadComponent implements OnInit {

  public candidateid;
  busy: Subscription;
  candidateDetails: any;
  public requisitionid;
  isUploading: boolean;
  fileslist = [];
  uploadForm: FormGroup;
  public inputdata;
  public displaymesg;
  public errorMessage;
  public resumeuploaded = false;
  sourcelist: any;
  isSubmitClicked: boolean;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  datafromDragndrop = false;
  public isFileDropped: boolean = false;
  fileName: any;
  public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true, "negativebtnText": "Cancel", "positivebtnText": "OK" };
  confirmModal: any;
  @ViewChild('content') content: TemplateRef<any>;
  attachments: any = [];
  public resumeWrongFormat = false;
  public action;
  labelsList: any;
  constructor(public modal: NgbActiveModal, private service: SubmitcandidateService, private formBuilder: FormBuilder, private _modalService: NgbModal) {
    this.uploader = new FileUploader({
      url: '',
      disableMultipart: true,

    });
    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
  }

  ngOnInit() {

    if (Array.isArray(this.inputdata)) {
      this.inputdata.forEach(x => {
        if (x.key == 'candidateid') {

          this.candidateid = x.value;
        }
        else if (x.key == 'id' || 'requisitionid') {

          this.requisitionid = x.value;
        }
      });
    }

    this.uploadForm = this.formBuilder.group({
      profile: [''],
      emailid: [''],
      mobilephone: [''],
      homephone: [''],
      labels: [[]],
      SourceId: ['']
    });
    this.loadData();
  }
  loadData() {
    const sourceOptions$ = this.service.getCandidateSourceOptions();
    const labels$ = this.service.getlabels();

    this.busy = forkJoin([sourceOptions$, labels$]).subscribe(
      ([sourceRes, labelsRes]: any) => {
        this.sourcelist = JSON.parse(sourceRes._body)['response']['candidatesource'];

        const labelsResponse = JSON.parse(labelsRes._body)['response']['labels'];
        this.labelsList = labelsResponse ? labelsResponse : [];
        this.getCandidateDetailsById();
      },
      err => {
        console.error("Error loading data", err);
      }
    );
  }

  getCandidateDetailsById() {
    this.busy = this.service.getCandidateDetailsById(this.candidateid)
      .subscribe(
        (res: any) => {
          this.candidateDetails = JSON.parse(res._body)['response'];
          this.updateModeldata(this.candidateDetails[0]);
        },
        err => {
          console.log(err);
        }
      );
  }
  updateModeldata(modeldata) {
    const homePhone = (modeldata.homePhone !== "null") ? modeldata.homePhone :"";
    const mobilePhone = (modeldata.mobilephone !== "null") ? modeldata.mobilephone :"";
    this.uploadForm = this.formBuilder.group({
      profile: [''],
      emailid: [modeldata.emailid],
      mobilephone: [mobilePhone || ''],
      homephone: [homePhone || ''],
      SourceId: [modeldata.candidaetsource && modeldata.candidaetsource.sourceid > 0 ? modeldata.candidaetsource.sourceid : null],
      labels: [modeldata.labels.map(e => e.labelid)],
    });
  }
  resetParaentWidnow() {
    if (document.getElementsByClassName("modal") && document.getElementsByClassName("modal").length > 0) {
      document.body.className = "modal-open";
    }
  }
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  onFileDrop(fileList: File[]) {
    this.uploadForm.get('profile').setValue(fileList[0]);
    this.datafromDragndrop = true;
    this.fileName = '';
  }

  fileOverDropZone(e: any): void {
    this.isFileDropped = e;
  }
  clearResume() {
    this.attachments = [];
    this.fileslist = [];

    this.fileName = '';
    this.uploadForm.controls['profile'].setValue("");

    if (this.uploader) {
      this.uploader.queue[0].file.name = null;
    }

  }
  uploadSubmissionResume(files) {
    this.fileslist = files;
    if (files.length === 0) {
      this.fileslist = []; // explicitly mark it to empty to show required message
      return;
    }
    let fileToUpload = <File>files[0];
    this.uploadForm.get('profile').setValue(fileToUpload);

    let filename = fileToUpload.name;
    let extension = '';
    if (filename && filename.lastIndexOf(".") > -1) {
      extension = filename.substring(filename.lastIndexOf(".") + 1, filename.length)
    }
    this.fileName = filename;
    this.resumeWrongFormat = false;
    this.datafromDragndrop = false;
    if (extension != 'pdf' && extension != 'docx' && extension != 'doc') {
      this.fileslist = [];
      // explicitly mark the list to empty to show required message
      this.resumeuploaded = true;
      this.resumeWrongFormat = true;

      return;
    }
  }


  OnSubmitClicked() {
    this.isUploading = true;
    this.isSubmitClicked = true;
    const formData = new FormData();
    formData.append('file', this.uploadForm.get('profile').value);
    formData.append('candidateemail', this.uploadForm.value.emailid);
    const mobilePhone = this.uploadForm.value.mobilephone;
    if (mobilePhone !== null && mobilePhone !== undefined && mobilePhone !== '') {
      formData.append('mobilephone', mobilePhone);
    } else {
      formData.append('mobilephone', '');
    }

    const homePhone = this.uploadForm.value.homephone;
    if (homePhone !== null && homePhone !== undefined && homePhone !== '') {
      formData.append('homephone', homePhone);
    } else {
      formData.append('homephone', '');
    }
    if (this.uploadForm.value.labels.length >= 1) {
      for (const index in this.uploadForm.value.labels) {
        formData.append(`labels`, this.uploadForm.value.labels[index]);
      }
    }
    if (this.action == 'profileresume') {
      formData.append('action', "profileresume");
    }
    else {
      formData.append('action', "latestresume");

    }
    formData.append('candidateId', this.candidateid);
    formData.append('SourceId', this.uploadForm.value.SourceId);

    this.service.uploadSubmissionResume(formData).subscribe(
      (res) => {
        //debugger;
        let body = JSON.parse(res._body);
        if (body.response) {
          this.isUploading = false;
          this.displaymesg = body.message ? body.message : "";
          setTimeout(() => {
            this.displaymesg = "";
            this.modal.close("success");

          }, 5000);
        }
        else {
          this.errorMessage = body.message ? body.message : "";
          this.isUploading = false;
          setTimeout(() => {
            this.errorMessage = "";

          }, 5000);

        }



      }
    );

  }

  removeFile() {

    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };


    this.popupConfig.title = "Alert !";
    this.popupConfig.message = `Are you sure you want to  remove this File ?`;
    this.popupConfig.type = "";
    this.popupConfig.isConfirm = true;
    this.popupConfig.negativebtnText = "No";
    this.popupConfig.positivebtnText = "Yes";

    this.confirmModal = this._modalService.open(this.content, ngbModalOptions);

    this.confirmModal.result.then((result) => {

      if (result == 'cancel') {
      }
    }, (approvereason) => {

      if (approvereason == 'ok') {


      }

    });
  }
}
