import {
    Component, OnInit, Input, ChangeDetectionStrategy,
    ChangeDetectorRef, DoCheck
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../form-control.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
    selector: 'app-card-option-ui',
    templateUrl: './card-option-ui.component.html',
    styleUrls: ['./card-option-ui.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardOptionUiComponent implements OnInit, DoCheck {
    @Input() public index: any = 0;
    @Input() public control: any;
    @Input() public data: any;
    @Input() public params?: any = []
    @Input() public FormCardUI?: any;
    @Input() public CardformGroup?: FormGroup;
    @Input() public AuthService: any;
    @Input() public title: any = "";
    @Input() public image: any = "";
    @Input() public description: any = "";
    @Input() public mappingFields: any = [];
    @Input() public highlight: any = "";
    @Input() public highlighter: any = [];
    @Input() public skill: any = "";
    @Input() public html: any = {};

    constructor(public _controlservice: FormControlService, private _router: Router, private route: ActivatedRoute,
        private _sanitizer: DomSanitizer, private cd: ChangeDetectorRef) { }

    ngOnInit() {
        // debugger;
        if (this.control.enablecardfromfromui) {
            this.control.cardtype = null;
        }
    }
    model: any
    ngDoCheck() {
        if (JSON.stringify(this.model) != JSON.stringify(this.data)) {
            this.model = this.data[this.control.key];
            if (this.cd !== null &&
                this.cd !== undefined &&
                !(this.cd as any).destroyed) {
                this.cd.detectChanges();
            }
        }
    }
    redirect() {

        this._controlservice.formInput[this._controlservice.Id] = null;
        this._controlservice.formParams[this.control.redirectOptions.formid] = [];
        if (this.control.redirectOptions.redirecttype == 'sidebar')
            this._controlservice._toggleSidebar(this.control.id, this.data)
        else if (this.control.redirectOptions.redirecttype == 'form') {
            this.setRedirectParams();
            this._router.navigate([this._router.url, this.control.redirectOptions.formid], { relativeTo: this.route });//Open Form
        }
        else if (this.control.redirectOptions.redirecttype == 'conditional') {
            if (this.checkCondtion()) {
                this.setRedirectParams();
                this._router.navigate([this._router.url, this.control.redirectOptions.formid], { relativeTo: this.route });//Open Form
            }
            else {
                this._controlservice._toggleSidebar(this.control.id, this.data)
            }
        }
    }
    setRedirectParams() {
        var _List = [];
        this.params.forEach(param => {
            var _arr: any = {};
            _arr.key = param.value;
            _arr.value = this.data[param.key];
            _List.push(_arr);
        })
        this._controlservice.formParams[this.control.redirectOptions.formid] = _List;
    }
    checkCondtion() {
        if (this.control.redirectOptions.condition == '0')
            return this.data[this.control.redirectOptions.field] == this.control.redirectOptions.fieldvalue;
        else if (this.control.redirectOptions.condition == '1')
            return this.data[this.control.redirectOptions.field] > this.control.redirectOptions.fieldvalue;
        else if (this.control.redirectOptions.condition == '2')
            return this.data[this.control.redirectOptions.field] < this.control.redirectOptions.fieldvalue;
        else
            return false;
    }
    getActionIcon() {
        return this.control.actionicon ? this.control.actionicon : 'fa fa-chevron-right';
    }
    getBackground(image) {
        return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
    }
    getCardData() {
        return this._controlservice.deepcopy(this.data);
    }
    getNestedCardData(nestedcollectionfield: any) {
        if (nestedcollectionfield && this.data) {
            if (Array.isArray(this.data[nestedcollectionfield])) {
                return this._controlservice.deepcopy(this.data[nestedcollectionfield]);
            } else {
                return [];
            }
        } else {
            return [];
        }
    }
    trackByFn(index, item) {
        if(!item) return null;
        return index;
    }
    trackByFnC(index, item) {
        if(!item) return null;
        return index;
    }
}
