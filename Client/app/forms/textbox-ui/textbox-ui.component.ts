import {
    Component, OnInit, Input, Output, EventEmitter, OnChanges, ChangeDetectionStrategy,
    ChangeDetectorRef, DoCheck
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../form-control.service';
import { Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';
import { DBkeys } from '../../core/authservice/db-Keys';
//MetaData
/*{
   "id": "1",
   "key": "Attributes",
   "Name": "Textbox",
   "label": "",
   "placeholder": "",
   "icon": "fa fa-text-width",
   "type": "textbox",
   "width": 6,
   "order": 1,
   "require": false,
   "showinlist": true,
   "addinfilter": false,
   "filterheader": "",
   "haschildren": false,
   "isTableView": false,
   "hasdatasource": false
 }*/
/*
CreatedBy:Arun
ModifiedBy:Arun,
Modify Date:03/11/2017
*/
@Component({
    selector: 'app-textbox-ui',
    templateUrl: './textbox-ui.component.html',
    styleUrls: ['./textbox-ui.component.scss'],
    providers: [LocalStoreManager, DBkeys],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextboxUiComponent implements OnInit, OnChanges, DoCheck {
    @Input() public data: any;
    @Input() public control: any;
    @Input() public formGroup: FormGroup;
    @Input() public access: string = 'write';
    @Input() public filterdata: any = [];
    @Input() public AuthService;
    @Input() public disabled: boolean = false;
    @Output() public controlEvent = new EventEmitter<any>();

    public control_id = null;
    public IsSpace = true;
    typingTimer: any
    isExist: boolean = false;
    existedvalue: string = "";
    restictedWord: string;
    constructor(private _controlService: FormControlService,
        private _Router: Router,
        private _appService: DataService,
        private localStorage: LocalStoreManager, private cd: ChangeDetectorRef) { }

    ngOnInit() {
        this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
        //alert(JSON.stringify(this.data));

        if (this.control.AutoValidateOnLoad) {
            this.keyup(null);
        }
        this._controlService.getCssforMandatory(this.control, this.control.data ? this.control.data[this.control.key] : {});
    }
    ngOnChanges() {
        this.updatePageVarible();
    }
    model: any
    ngDoCheck() {
        if (this.model != this.data[this.control.key]) {
            this.model = this.data[this.control.key];
            this.markForCheck();
        }
        if (this.control.require && this.formGroup.controls[this.control_id] && this.formGroup.controls[this.control_id].touched) {
            if (this.cd !== null &&
                this.cd !== undefined &&
                !(this.cd as any).destroyed) {
                this.cd.detectChanges();
            }
        }
    }

    ngOnDestroy() {
        if (this.control.require) {
            this._controlService.removeValidationOnDestroy(this.control);
        }
    }

    disablecopypaste() {
        return this.control.disablecopypaste ? false : true;
    }
    keyup(e: KeyboardEvent) {
        const doneTypingInterval = 500;
        const inputElement = e && e.target ? (e.target as HTMLInputElement) : null;
        if (inputElement) {
            const sanitizedValue = inputElement.value.replace(/[<>()?=]|&lt;|&gt;/g, '');
            if (sanitizedValue !== inputElement.value) {
                inputElement.value = sanitizedValue;
            }
            this.data[this.control.key] = inputElement.value;
        }

        if (this.typingTimer) {
            clearTimeout(this.typingTimer);
        }
        if (this.control.apiurl) {
            this.typingTimer = setTimeout(this.doneTyping(this), doneTypingInterval);
        }
    }

    keypress(e: KeyboardEvent) {
        const invalidChars = ['<', '>', '(', ')', '?', '=', '&lt;', '&gt;'];
        if (invalidChars.includes(e.key)) {
            e.preventDefault();
            return false;
        }

        if (this.typingTimer) {
            clearTimeout(this.typingTimer);
        }
        if (this.control.textonly) {
            return /^[a-zA-Z\s]*$/.test(e.key);
        } else if (this.control.charlimit) {
            return (
                this.data[this.control.key] &&
                this.data[this.control.key].length < this.control.charlimit
            );
        } else {
            return true;
        }
    }


    doneTyping(event) {
        const apiparam: any = {};
        const url = event.control.apiurl;

        if (event.control.apiparam) {
            event.control.apiparam.forEach(option => {
                apiparam[option.key] = option.value;
            })
        }
        apiparam[event.control.queryfield] = event.data[event.control.key];

        this._controlService.setPageVarible(event.control.apiparam, apiparam, this.AuthService);
        if (url) {
            event._appService.get(url, apiparam)
                .subscribe(
                    (data: any) => {
                        var _data = null;
                        if (Array.isArray(data) && data.length > 0)
                            _data = data[0];
                        else if (typeof data == "object")
                            _data = data;
                        if (_data) {
                            event.isExist = _data[event.control.outputfield];
                            // if (event.isExist) {
                            //     event.existedvalue = event._controlService.deepcopy(event.data[event.control.key]);
                            //     //event.data[event.control.key] = "";
                            // }
                        }
                        this.markForCheck()
                    },
                    err => {
                        console.log(err);
                    },
                    () => {
                        //console.log("done")
                    }
                );
        }
    }
    updatePageVarible() {
        // debugger
        if (this.control.islinkpagevarible) {
            let menu: any = this.localStorage.getDataObject(DBkeys.Menu);
            var currentUrl = this._Router.url ? this._Router.url : "/";
            if (currentUrl.indexOf('?') > -1) {
                currentUrl = currentUrl.split('?')[0];
            }
            var currentPage: any = menu.Nav.find(x => x.Url == currentUrl.substring(1));
            if (currentPage) {
                currentPage.Params.forEach(_item => {
                    if (_item.name === this.control.pagevariblelink && _item.value !== "&") {
                        _item.value = this.data[this.control.key];
                    }
                });
            }
            this.localStorage.saveSyncedSessionData(menu, DBkeys.Menu);
            this.markForCheck();
        }
        if (this.control.storeaspagesearch) {
            this._controlService.setPageSearchVarible(this.data[this.control.key] ? this.data[this.control.key].split(",") : [], this.control.key)
        }

        if (this.control.restrictedword && this.control.restrictedword.length > 0 && this.data[this.control.key]) {
            if (this.control.restrictedword.find(x => x.toLowerCase().trim() === this.data[this.control.key].toLowerCase().trim())) {
                this.restictedWord = this.control.restrictedword.find(x => x.toLowerCase().trim() === this.data[this.control.key].toLowerCase().trim());
                this.data[this.control.key] = "";
                this._controlService.getCssforMandatory(this.control, this.data[this.control.key]);
            } else {
                this.restictedWord = null;
            }
            this.markForCheck();
        }
    }
    onvaluechange() {
        var regex = /^$|\s+/
        if (this.control.allowspace == false) {
            this.IsSpace = !regex.test(this.data[this.control.key]);
            this.markForCheck();
        }
        else {
            this.IsSpace = true;
        }
        if (this.data[this.control.key] && this.restictedWord) {
            this.restictedWord = null;
            this.markForCheck();
        }
    }
    triggerEvent() {
        this.controlEvent.emit();
    }
    markForCheck() {
        if (this.cd !== null &&
            this.cd !== undefined &&
            !(this.cd as any).destroyed) {
            this.cd.markForCheck();
        }
    }
}

