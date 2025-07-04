import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../form-control.service';


@Component({
    selector: 'app-phonenumber-ui',
    templateUrl: './phonenumber-ui.component.html',
    styleUrls: ['./phonenumber-ui.component.scss']
})
export class PhonenumberUiComponent implements OnInit, OnChanges {
    @Input() public data: any;
    @Input() public control: any;
    @Input() public formGroup: FormGroup;
    @Input() public access: string = 'write';
    @Input() public disabled: boolean = false;
    
    public control_id = null;
    public mask = [/[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    constructor(public _controlService: FormControlService) { }

    ngOnInit() {
        debugger;
        this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
    }
    ngOnChanges() {
        if (this.data[this.control.key] && isNaN(this.data[this.control.key])) {
            var _numbers: any = this.data[this.control.key].split("");
            this.data[this.control.key] = "";
            _numbers.forEach(element => {
                if (!isNaN(element) && element.trim() !== '') {
                    this.data[this.control.key] = this.data[this.control.key] + element;
                }
            });
        }

        if (this.data[this.control.key] && this.data[this.control.key].length > 10) {
            this.data[this.control.key] = this.data[this.control.key].substr(this.data[this.control.key].length - 10, 10);
        }
    }
    //ngAfterViewInit() {
    //  $('.date').mask('11/11/1111');
    //  $('.time').mask('00:00:00');
    //  $('.date_time').mask('00/00/0000 00:00:00');
    //  $('.cep').mask('00000-000');
    //  $('.phone').mask('0000-0000');
    //  $('.phone_with_ddd').mask('(00) 0000-0000');
    //  $('.phone_us').mask('(000) 000-0000');
    //  $('.mixed').mask('AAA 000-S0S');
    //  $('.cpf').mask('000.000.000-00', { reverse: true });
    //  $('.money').mask('000.000.000.000.000,00', { reverse: true });
    //};
}
