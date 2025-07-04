import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FormControlService } from '../form-control.service';
//MetaData
/*{
    "id": "1",
    "key": "Attributes",
    "Name": "Textarea",
    "label": "",
    "placeholder": "",
    "icon": "fa fa-file-text-o",
    "type": "textarea",
    "width": 6,
    "Textlimit": 3000,
    "order": 1,
    "require": false,
    "showinlist": true,
    "haschildren": false,
    "isTableView": false,
    "hasdatasource": false,
    "isPanel": false
  }*/
/*
CreatedBy:Kanti
ModifiedBy:Kanti,
Modify Date:04/12/2017
*/
@Component({
    selector: 'app-textarea-ui',
    templateUrl: './textarea-ui.component.html',
    styleUrls: ['./textarea-ui.component.scss']
})
export class TextareaUiComponent implements OnInit {
    @Input() public data: any;
    @Input() public control: any;
    @Input() public formGroup: FormGroup;
    @Input() public access: string = 'write';
    @Input() public disabled: boolean = false;

    public control_id = null;
    public IsSpace = true;
    public hide = true;
    textRemaining = 300;
    constructor(private _sanitizer: DomSanitizer, public _controlService: FormControlService) { }

    ngOnInit() {

        this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
        if (this.control.Textlimit) {
            this.textRemaining = this.control.Textlimit;
        } else {
            this.textRemaining = 4000;
        }
        if (this.data[this.control.key]) {
            let Textlimit = 0;
            if (this.control.Textlimit) {
                Textlimit = this.control.Textlimit;
            } else {
                Textlimit = 4000;
            }
            // @ts-ignore
            this.textRemaining = Textlimit - this.data[this.control.key].length;

        } else {
            this.textRemaining = 4000;
        }

    }

    safehtml(value) {
        return value ? this._sanitizer.bypassSecurityTrustHtml(value) : "";
    }

    onTextChange(event) {
        let Textlimit = this.control.Textlimit || 4000;

        const typedValue = event;
        const sanitizedValue = typedValue.replace(/[<>()?=]|&lt;|&gt;/g, '');

        this.data[this.control.key] = sanitizedValue;
        this.textRemaining = Textlimit - (sanitizedValue.length);

        if (this.data[this.control.key]) {
            this.textRemaining = Textlimit - (this.data[this.control.key] ? this.data[this.control.key].length : 0);
        }
    }
    preventHTML(event: KeyboardEvent) {
        const invalidChars = ['<', '>', '(', ')', '?', '=', '&lt;', '&gt;'];

        if (invalidChars.includes(event.key)) {
            event.preventDefault();
        }
    }
}

