import {
    Component, Input, ViewChild, OnInit, OnDestroy, ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { FileUploader, FileDropDirective } from 'ng2-file-upload/ng2-file-upload';
import { FormGroup } from '@angular/forms';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs/Subject';
import { debounceTime } from 'rxjs/operator/debounceTime';
import { FormControlService } from '../form-control.service';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';
import { DataService } from '../../core/services/data.service';
import { Http, Headers, Response } from '@angular/http';
// import { AuthService } from "../../core/authservice/auth.service";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
    selector: 'app-fileupload-ui',
    templateUrl: './fileupload-ui.component.html',
    styleUrls: ['./fileupload-ui.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})

export class FileuploadUiComponent implements OnInit, OnDestroy {
    URL = '';
    @Input() public data: any;
    @Input() public control: any;
    @Input() public formGroup: FormGroup;
    @Input() public access: string = 'write';
    @Input() public AuthService: any;

    uploader: FileUploader = new FileUploader({
        url: this.URL,
        isHTML5: true
    });
    private _success = new Subject<string>();
    staticAlertClosed = false;
    successMessage: string;
    private options: NgbModalOptions = { size: 'lg', windowClass: 'model-cw', backdrop: 'static', keyboard: false };
    UploadedFile: any = { Name: "", Url: "" };
    PreviewFileName: string = null;
    previewDoc: any = { "html": "", "data": "" };
    busy: Subscription;

    errorMessage: string;
    filesToUpload: Array<File>;
    selectedFileNames: any;
    filelist: any;
    public isLoadingData: Boolean = false;
    @ViewChild('fileUpload') fileUploadVar: any;
    uploadResult: any;
    res: Array<string>;

    

    private unsubscribe: Subject<boolean> = new Subject<boolean>();
    constructor(private http: Http, private modalService: NgbModal,
        public _controlService: FormControlService,
        private _sanitizer: DomSanitizer,
        private _appService: DataService, private _router: Router, private cd: ChangeDetectorRef) {
        this.errorMessage = "";
        this.filesToUpload = [];
        this.selectedFileNames = [];
        this.uploadResult = "";

        this._controlService.fileuploadCalled$
            .takeUntil(this.unsubscribe)
            .subscribe(
                (data) => {
                    // debugger;
                    this.uploadMultipleFiles(data)
                }
            );
    }
    ngOnDestroy() {
        this.unsubscribe.next(true);
        this.unsubscribe.complete();
    }
    isDataAvailable: any;
    ngOnInit() {
      this.URL = this.control.apiurl;
      this.isDataAvailable = this.data[this.control.key];

      if (this.control.uploadtype == 'single') {

        this.GetFileInfo(this.data[this.control.key] ? this.data[this.control.key] : "")
      };
        setTimeout(() => this.staticAlertClosed = true, 20000);
        this._success.subscribe((message) => this.successMessage = message);
        debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);
        // debugger;
        if (this.data[this.control.key] && Array.isArray(this.data[this.control.key])) {
            this.filelist = this.data[this.control.key];
        }
       
        this.cd.detectChanges();
  }

     hasBaseDropZoneOver = false;
  public isFileDropped: boolean = false;

    fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    fileOverDropZone(e: any): void {
      this.isFileDropped = e;
     // this.UploadFile();
    }
  allowDrop(event: any): void {
    event.preventDefault();
  }

    isUploading: boolean = false;
    UploadFile() {
        // debugger;
        this.isUploading = true;
        this.cd.detectChanges();
        if (this.control.uploadtype != 'single') {
            this.data[this.control.key] = [];
        } else {
            this.data[this.control.key] = "";
        }


        for (var index = 0; index < this.uploader.queue.length; index++) {
            var element = this.uploader.queue[index];
            element.alias = "photo";

            element.url = this.control.apiurl;

            if (this.control.uploadtype != 'single') {
                element.headers = [{ name: 'Filename', value: element.file.name }];
            } else {
                //element.headers = [{ name: 'Filename', value: (this.PreviewFileName ? this.PreviewFileName : element.file.name) }];
                element.headers = [{ name: 'Filename', value: element.file.name }];
            }
            element.headers = [{ name: 'Authorization', value: 'Bearer ' + this.AuthService.accessToken }];
            element.headers = [{ name: 'api-key', value: this.AuthService.idToken }];
            if (this.control.Inputparamname) {
                element.headers.push({ name: this.control.Inputparamname, value: this.data[this.control.Inputparamvalue] });
            }

        }
        this.PreviewFileName = null;
        this.uploader.uploadAll();
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            // debugger;
            this.isUploading = false;
            this.cd.detectChanges();
            if (status === 200) {
                if (this.control.uploadtype != 'single') {
                    this.data[this.control.key].push(response);
                } else {
                    this.data[this.control.key] = response;
                    this.GetFileInfo(response);
                }
                this.changeSuccessMessage();
            } else {
                this._success.next("File Uploaded failed.");
            }
            this.previewDoc.html = "";
            this.getDocPreviewURL();
            this.previewSrc = "";
            this.IsPreviewComplete = false;
            //alert(JSON.stringify(this.data[this.control.key]));
        };

    }
  GetFileInfo(data) {
    if (typeof(data) === 'string') {
      var arr = data ? data.split("|") : "";
      this.UploadedFile.Name = arr.length > 0 ? arr[0] : "";
      this.UploadedFile.Url = arr.length > 1 ? arr[1] : "";
      }
    }
    IsFileInfoLoaded() {
        if (this.data[this.control.key] != '' && this.UploadedFile.Name != '')
            return true;
        else {
            this.GetFileInfo(this.data[this.control.key]);
            return false;
        }
    }
    DeleteFile(confirmation) {
        this.DeleteAttachedfile(null, false, true, confirmation);
    }
    Deleteconfirm: string = "NO";
    DeleteAttachedfile(file: any, islocal: boolean = false, isSignleUpload: boolean = false, confirmation) {
        this.modalService.open(confirmation).result.then((result) => {
            if (this.Deleteconfirm == "YES") {
                this.isDataAvailable = null;
              this.DeleteAttachedfileConfirm(file, islocal, isSignleUpload);

                if (!file) {
                    this.data[this.control.key] = "";
                    this.UploadedFile.Url = "";
                    this.UploadedFile.Name = "";
                    this.previewDoc.html = "";
                    if (document.getElementById("myElement"))
                        document.getElementById("myElement").innerHTML = '';

                    this.cd.detectChanges();
                }
            }
        });
    }
    public changeSuccessMessage(msg = null) {
        if (msg) {
            this._success.next(msg);
        } else {
            this._success.next("File Uploaded successfully.");
        }
    }
    cancelAll() {
        this.isUploading = false;
        this.previewSrc = "";
        this.uploader.cancelAll();
        this.cd.detectChanges();
    }
    clearQueue() {
        this.isUploading = false;
        this.previewSrc = "";
        this.IsPreviewComplete = false;
        this.uploader.clearQueue();
        this.cd.detectChanges();
    }
    public previewSrc: string = "";
    public IsPreviewComplete: boolean = false;
    callPreviewFromFile(file: any) {
        this.previewSrc == "" ? this.setPreviewFromFile(file) : false;
    }
    public setPreviewFromFile(file: File) {
        let reader = new FileReader();

        reader.onloadend = (e: any) => {
            if (this.previewSrc == "")
                this.previewSrc = e.target.result;
            this.IsPreviewComplete = true;
        };

        reader.readAsArrayBuffer(file);
    }
    isImage(type: string = "") {
        return type.split("/")[0] == "image" ? true : false;
    }
    isVideo(type: string = "") {
        return type.split("/")[0] == "video" ? true : false;
    }
    FileSelected(content) {
        this.modalService.open(content, this.options);
    }
    modalClose() {
        this.clearQueue();
    }
    viewerFile: string = "";
    Viewer(viewer) {
        this.viewerFile = "https://docs.google.com/viewer?url=" + this.UploadedFile.Url + "&embedded=true";
        this.modalService.open(viewer, this.options);
    }
    getThumbnail(fileName: string = "") {
        var lastIndex = fileName.lastIndexOf('.');
        var ext = lastIndex > 0 ? fileName.substr(lastIndex + 1).toLowerCase() : null;

        if (ext == "pdf")
            return "fa fa-file-pdf-o";
        else if (ext == "doc" || ext == "docx")
            return "fa fa-file-word-o";
        else if (ext == "jpeg" || ext == "png" || ext == "jpg" || ext == "tiff" || ext == "bmp")
            return "fa fa-file-image-o";
        else if (ext == "txt")
            return "fa fa-file-text-o";
        else if (ext == "xls" || ext == "xlsx")
            return "fa fa-file-excel-o";
        else if (ext == "mp4" || ext == "flv" || ext == "mkv" || ext == "avi" || ext == "gifv" || ext == "wmv" || ext == "mpg" || ext == "mpeg" || ext == "3gp")
            return "fa fa-file-video-o";
        else if (ext == "ppt")
            return "fa fa-file-powerpoint-o";
        else
            return "";
    }
    isImagebyExt(fileName: string = "") {
        this.IsFileInfoLoaded();
        fileName = this.UploadedFile.Name;
        var lastIndex = fileName.lastIndexOf('.');
        var ext = lastIndex > 0 ? fileName.substr(lastIndex + 1).toLowerCase() : null;
        if (ext == "jpeg" || ext == "png" || ext == "jpg" || ext == "tiff" || ext == "bmp")
            return true;
        else
            return false;
    }
    isVideobyExt(fileName: string = "") {
        var lastIndex = fileName.lastIndexOf('.');
        var ext = lastIndex > 0 ? fileName.substr(lastIndex + 1).toLowerCase() : null;
        if (ext == "mp4" || ext == "flv" || ext == "mkv" || ext == "avi" || ext == "gifv" || ext == "wmv" || ext == "mpg" || ext == "mpeg" || ext == "3gp")
            return true;
        else
            return false;
    }
    getBackground(image) {
        return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
    }
    getDocPreviewURL() {
        //if (this.UploadedFile.Url != "" && this.previewDoc.data != this.data[this.control.key]) {
        //    let url = "https://docs.google.com/viewer?url=" + this.UploadedFile.Url + "&embedded=true";
        //    this.previewDoc.html = this._sanitizer.bypassSecurityTrustHtml('<iframe width="100%" height="100%" src="' + url + '"></iframe>');
        //    this.previewDoc.data = this.data[this.control.key];
        //}
        this.GetFileInfo(this.data[this.control.key])
        return this.UploadedFile.Url;
        //return this.UploadedFile.Url != "" ? this._sanitizer.bypassSecurityTrustResourceUrl("https://docs.google.com/viewer?url=" + this._sanitizer.bypassSecurityTrustResourceUrl(this.UploadedFile.Url) + "&embedded=true") : "";
    }

    fileChangeEvent(fileInput: any) {
        debugger;
        //Clear Uploaded Files result message
        this.uploadResult = "";
      var file;
      if (fileInput.target.files && fileInput.target.files.length > 0) {
        file = fileInput.target.files[0];
      } else {
        let noOfFilesUploaded = this.uploader.queue.length;
        // always take the latest file drag and dropped 
        file = this.uploader.queue[noOfFilesUploaded - 1]._file;

        if (this.control.uploadtype == 'single' && (this.filesToUpload.length > 0 || this.isDataAvailable)) {
          this.errorMessage = 'To upload a new file, please delete the existing one and then try again.'
          return;
        }
      }
      var ext = null;
      if (file && file.name && file.name.lastIndexOf(".") > -1) {
        ext = file.name.substring(file.name.lastIndexOf(".") + 1, file.name.length)
      }
      if (ext && ext.trim().toLowerCase() != 'docx' && ext.trim().toLowerCase() != 'pdf') {
        this.errorMessage = 'You can only upload PDF or Docx Files.'
        return;
      }
        const fileSize = this.control.filesize ? this.control.filesize : 1;
      if (file.size <= (fileSize * 1048576)) {
            // commenting since Metal doesn't multiple File upload
           // for (let i = 0; i < fileInput.target.files.length; i++) {
            //    var file = fileInput.target.files[i];
         
                this.filesToUpload.push(file);
        //}
        
         

            this.selectedFileNames = [];
            for (let i = 0; i < this.filesToUpload.length; i++) {
                this.selectedFileNames.push(this.filesToUpload[i]);
            }
            if (this.control.require) {
                if (!this.data[this.control.key] && this.filesToUpload.length > 0) {
                    this.data[this.control.key] = "Attachment";
                } else if (this.data[this.control.key] == "Attachment") {
                    this.data[this.control.key] = ""
                }
          }
           // stop event propagation so that the file doesn't get attached twice
          fileInput.preventDefault();
          fileInput.stopPropagation();
        this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);
      
        this.CallResponseApi();
        } else {
            this.changeSuccessMessage('File must be smaller than ' + fileSize + 'MB.')
      }     
  }

    CallResponseApi() {
        debugger;
        if (this.control.responseapiurl) {
            var currentUrl = this._router.url ? this._router.url : "/";
            if (currentUrl.indexOf('?') > -1) {
                currentUrl = currentUrl.split('?')[0];
            }
            const menu = this.AuthService.Menu;
            const page = this._controlService.find(menu['Nav'], currentUrl.substring(1));

            this.isUploading = true;

            let formData: FormData = new FormData();
            const formDataParam = this.control.formDataParamResponseApi ? this.control.formDataParamResponseApi : 'uploadedFiles';
            for (var i = 0; i < this.filesToUpload.length; i++) {
                formData.append(formDataParam, this.filesToUpload[i], this.filesToUpload[i].name);
            }
            const activateParams = this._controlService.getQueryParams();
            let apiUrl = this.control.responseapiurl;
            var param: any = {};
            this.control.responseapiparam.forEach(item => {
                if (item.isdatamodel) {
                    param[item.key] = this.data[item.value];
                } else {
                    param[item.key] = item.value;
                }
                if (param[item.key] == item.value && page) {
                    const _param = page.Params.find(x => x.name == item.value)
                    if (_param) {
                        let activeParam = activateParams.find(x => x[_param.name]);
                        if (activeParam) {
                            param[item.key] = activeParam[_param.name];
                        } else {
                            param[item.key] = _param.value;
                        }
                    }
                }
            })
            //this._controlService.setPageVarible(this.control.ApiParam.filter(x => x.isuploadonsubmitparam != true), param);

            if (this.control.responseapiparam && this.control.responseapiparam.length > 0) {
                var QueryStr = Object.keys(param)
                    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(param[k]))
                    .join('&');
                apiUrl = apiUrl + '?' + QueryStr;
            }
            const headers = new Headers();
            headers.append('Authorization', 'bearer ' + this.AuthService.accessToken);
            this.busy = this.http.post(apiUrl, formData, { headers: headers })
                .subscribe((res: any) => {
                    debugger;
                    var data = res._body ? JSON.parse(res._body) : {};
                    if (typeof data == 'object' && Array.isArray(data[this.control.responsebindingfield])) {
                        if (Array.isArray(this.data[this.control.modelmappingfield]) && this.data[this.control.modelmappingfield].length > 0) {
                            if (data[this.control.responsebindingfield].length > 0) {
                                this.data[this.control.modelmappingfield] = data[this.control.responsebindingfield];
                                // this._controlService.RefreshComponent('dropdown');
                                this._controlService.RefreshDropdown({ controlkey: this.control.modelmappingfield, props: 'refresh' });
                            }
                        } else {
                            this.data[this.control.modelmappingfield] = data[this.control.responsebindingfield];
                            // this._controlService.RefreshComponent('dropdown');
                            this._controlService.RefreshDropdown({ controlkey: this.control.modelmappingfield, props: 'refresh' });
                        }
                    }
                },
                    err => {
                        console.log(err);
                    },
                    () => {
                        this.isUploading = false;
                        this.cd.detectChanges();
                    }
                );
        }
    }
    getFileName(file) {
        return file && file.length > 0 ? file.split('/').pop() : "Attachment";
    }
    cancelUpload() {
        this.filesToUpload = [];
        this.fileUploadVar.nativeElement.value = "";
        this.selectedFileNames = [];
        this.uploadResult = "";
      this.errorMessage = "";
      this.uploader.clearQueue();
    }

    DeleteAttachedfileConfirm(file: any, islocal: boolean = false, isSignleUpload: boolean = false) {
        var idx = -1;
        debugger;
        this.isUploading = true;
        if (islocal && file) {
            idx = this.selectedFileNames.indexOf(this.selectedFileNames.find(x => x.name == file.name));
            if (idx >= 0)
                this.selectedFileNames.splice(idx, 1);

            idx = this.filesToUpload.indexOf(this.filesToUpload.find(x => x.name == file.name));
            if (idx >= 0)
                this.filesToUpload.splice(idx, 1);

            this.fileUploadVar.nativeElement.value = '';
          this.isUploading = false;
          this.uploader.clearQueue();
            this.cd.detectChanges();
        } else {
            // const idx: number = this.data[this.control.key].indexOf(file);
            if (!isSignleUpload) {
                idx = this.data[this.control.key].indexOf(this.data[this.control.key].find(x => x == file))
            }
            if (this.control.deleteapiurl && (idx !== -1 || isSignleUpload)) {
                var params: any = {}
                this.control.DeleteApiParam.forEach(item => {
                    if (item.isdatamodel) {
                        params[item.key] = this.data[item.value];
                    } else if (file[item.value]) {
                        params[item.key] = file[item.value];
                    } else {
                        params[item.key] = item.value;
                    }
                })
                // this._controlService.setPageVarible(this.control.DeleteApiParam, params, this.AuthService);
                this.busy = this._appService.post(this.control.deleteapiurl, JSON.stringify(this.data), params)
                    .subscribe((res: any) => {
                      if (!isSignleUpload) {
                        this.data[this.control.key].splice(idx, 1);
                      }
                    },
                        err => {
                            console.log(err);
                        },
                        () => {
                            this.isUploading = false;
                            this.cd.detectChanges();
                            //this.msg = "Post shared successfully";
                            //console.log("done!")
                        }
                    );
            } else {
                this.isUploading = false;
                if (idx !== -1) {
                    this.data[this.control.key].splice(idx, 1);
                    //this.filelist.splice(idx, 1);
                }
                this.cd.detectChanges();
            }
        }
    }
    Deletefromuploadlistfile(file: any) {
        const idx: number = this.selectedFileNames.indexOf(file);

        if (idx !== -1) {
            this.selectedFileNames.splice(idx, 1);
            // this.filesToUpload.splice(idx, 1);
        }
        this.isUploading = false;
        this.cd.detectChanges();
    }
    safehtml(value) {
        return this._sanitizer.bypassSecurityTrustHtml(value);
    }
    uploadMultipleFiles(submitparams = null) {
        this.uploadResult = "";
        this.isUploading = true;
        this.cd.detectChanges();
        debugger;

        if (this.filesToUpload.length > 0) {
            var currentUrl = this._router.url ? this._router.url : "/";
            if (currentUrl.indexOf('?') > -1) {
                currentUrl = currentUrl.split('?')[0];
            }
            const menu = this.AuthService.Menu;
            const page = this._controlService.find(menu['Nav'], currentUrl.substring(1));

            this.isLoadingData = true;

            let formData: FormData = new FormData();
            const formDataParam = this.control.formDataParam ? this.control.formDataParam : 'uploadedFiles';
            for (var i = 0; i < this.filesToUpload.length; i++) {
                formData.append(formDataParam, this.filesToUpload[i], this.filesToUpload[i].name);
            }
            const activateParams = this._controlService.getQueryParams();
            let apiUrl = this.control.apiurl;
            var param: any = {};
            this.control.ApiParam.forEach(item => {
                if (item.isdatamodel) {
                    param[item.key] = this.data[item.value];
                } else if (item.isuploadonsubmitparam && submitparams && submitparams.formParams[item.value]) {
                    param[item.key] = submitparams.formParams[item.value];
                } else {
                    param[item.key] = item.value;
                }
                if (param[item.key] == item.value && page) {
                    const _param = page.Params.find(x => x.name == item.value)
                    if (_param) {
                        let activeParam = activateParams.find(x => x[_param.name]);
                        if (activeParam) {
                            param[item.key] = activeParam[_param.name];
                        } else {
                            param[item.key] = _param.value;
                        }
                    }
                }
            })
            //this._controlService.setPageVarible(this.control.ApiParam.filter(x => x.isuploadonsubmitparam != true), param);

            if (this.control.ApiParam && this.control.ApiParam.length > 0) {
                var QueryStr = Object.keys(param)
                    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(param[k]))
                    .join('&');
                apiUrl = apiUrl + '?' + QueryStr;
            }
            const headers = new Headers();
            headers.append('Authorization', 'bearer ' + this.AuthService.accessToken);
            this.busy = this.http.post(apiUrl, formData, { headers: headers })
                .map((res: Response) => res.json())
                .subscribe
                (
                    (data: any) => {
                        this.errorMessage = "";
                        this.isUploading = false;
                        // debugger;
                        if (submitparams) {
                            if (submitparams.refreshcomponentonclose == "") {
                                this._controlService.FilterRefresh(submitparams.sidebarcloseonsubmit ? false : true,
                                    submitparams.successmessage);
                            }

                            if (submitparams.refreshcomponentonclose) {
                                this._controlService.RefreshComponent(submitparams.refreshcomponentonclose,
                                    submitparams.successmessage, submitparams.controlkey);
                            }

                            if (this._controlService._opened && submitparams.sidebarcloseonsubmit)
                                this._controlService._toggleSidebar();

                            if (this._controlService._openedEditForm && submitparams.sidebarcloseonsubmit)
                                this._controlService._toggleEditFormSidebar();
                        }
                        this.cd.detectChanges();
                    },
                    err => {
                        this.isUploading = false;
                        this.errorMessage = "Attchment upload failed, plase try again";
                        this.isLoadingData = false;

                        if (submitparams) {
                            if (this.control.refreshcomponentonclose == "") {
                                this._controlService.FilterRefresh(submitparams.refreshcomponentonclose ? false : true,
                                    submitparams.successmessage);
                            }

                            if (this.control.refreshcomponentonclose) {
                                this._controlService.RefreshComponent(submitparams.refreshcomponentonclose,
                                    submitparams.successmessage, submitparams.controlkey);
                            }
                        }
                        this.cd.detectChanges();

                        console.error(err.message);
                    },
                    () => {
                        this.isUploading = false;
                        this.cd.detectChanges();
                        this.isLoadingData = false,
                            this.fileUploadVar.nativeElement.value = "";
                        // this.selectedFileNames = [];
                        this.filesToUpload = [];
                    }
                );
        } else {
            // debugger;
            this.isUploading = false;
            if (submitparams) {
                if (submitparams.refreshcomponentonclose == "") {
                    this._controlService.FilterRefresh(submitparams.sidebarcloseonsubmit ? false : true,
                        submitparams.successmessage);
                }

                if (submitparams.refreshcomponentonclose) {
                    this._controlService.RefreshComponent(submitparams.refreshcomponentonclose,
                        submitparams.successmessage, submitparams.controlkey);
                }

                if (this._controlService._opened && submitparams.sidebarcloseonsubmit)
                    this._controlService._toggleSidebar();

                if (this._controlService._openedEditForm && submitparams.sidebarcloseonsubmit)
                    this._controlService._toggleEditFormSidebar();
            }
            this.cd.detectChanges();
        }
    }
}

