import {
    Component, OnInit, Input, OnChanges, OnDestroy, DoCheck, ChangeDetectionStrategy,
    ChangeDetectorRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';
// import { Observable } from 'rxjs/Observable';
// import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
// import { DataService } from '../../core/services/data.service';
// import { Subject } from 'rxjs/Subject';
// import { debounceTime } from 'rxjs/operator/debounceTime';
// import { ISubscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/timer';
const _ = require('lodash');
@Component({
    selector: 'app-rating-ui',
    templateUrl: './rating-ui.component.html',
    styleUrls: ['./rating-ui.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingUiComponent implements OnInit, OnChanges, OnDestroy, DoCheck {
    @Input() public control: any = [];
    @Input() public data: any = {};
    @Input() public formGroup: FormGroup;
    // @Input() public access: string = 'write';
    // @Input() public appid: string;

    // private subscription: ISubscription;
    // _data = {
    //     Reviewername: "",
    //     Email: "",
    //     Status: "",
    //     Updatedate: "NULL",
    //     Createdate: new Date(),
    //     Review: {
    //         Detailreview: [],
    //         Overallreview: {
    //             Title: "Overall Score",
    //             Weightage: "",
    //             Value: 0,
    //             Comment: ""
    //         }

    //     }
    // }
    // isReadOnly: boolean = false;
    // private _success = new Subject<string>();
    // staticAlertClosed = false;
    // successMessage: string = "";
    // Submitconfirm: string = "NO";
    modal: any = "{}";
    Noofstar: any = [];
    // private options: NgbModalOptions = { size: 'lg', windowClass: 'model-cw' };
    constructor(private cd: ChangeDetectorRef) {

    }
    ngDoCheck() {
        if (this.control.ShowOverallScore && this.modal != JSON.stringify(this.data)) {
            this.modal = JSON.stringify(this.data);
            this.calculateScore();
        }
    }
    isFloat(num) {
        return !isNaN(num) && num % 1 !== 0;
    }
    isChecked(num) {
        return num <= this.data[this.control.key];
    }
    ngOnDestroy() {
        // if (this.subscription && !this.subscription.closed)
        //     this.subscription.unsubscribe();
    }
    ngOnInit() {
        if (this.control.customstarvalues) {
            this.Noofstar = this.control.customstarvalues.split(',');
        } else {
            this.Noofstar = _.range(this.control.Noofstar);
        }
        // if (this.data[this.control.key].Status == 'completed' || this.access != 'write')
        //     this.isReadOnly = true;

        // setTimeout(() => this.staticAlertClosed = true, 20000);
        // this._success.subscribe((message) => this.successMessage = message);
        // debounceTime.call(this._success, 5000).subscribe(() => this.successMessage = null);

        // if (this.control.ShowOverallScore == true) {
        //     let timer = Observable.timer(2000, 1000);
        //     this.subscription = timer.subscribe(t => this.calculateScore());
        // }
    }
    ngOnChanges() {

        // if (typeof this.data[this.control.key] == "object" && this.data[this.control.key].Review.Detailreview.length == 0) {

        //     this.control.ratingdata.forEach(item => {
        //         var _data: any = {};
        //         _data.Title = item.title;
        //         _data.Weightage = item.weightage;
        //         _data.Value = 0;
        //         _data.Comment = "";

        //         this.data[this.control.key].Review.Detailreview.push(_data);
        //     })
        //     this.data[this.control.key].Review.Overallreview.Weightage = this.control.Noofstar;
        //     this.data[this.control.key].Review.Overallreview.Value = 0;
        // } else if (typeof this.data[this.control.key] != "object") {
        //     this.data[this.control.key] = JSON.parse(JSON.stringify(this._data));

        //     this.control.ratingdata.forEach(item => {
        //         var _data: any = {};
        //         _data.Title = item.title;
        //         _data.Weightage = item.weightage;
        //         _data.Value = 0;
        //         if (item.allowcomment == true) {
        //             _data.Comment = "";
        //         }

        //         this.data[this.control.key].Review.Detailreview.push(_data);
        //     })
        //     this.data[this.control.key].Review.Overallreview.Weightage = this.control.Noofstar;
        //     this.data[this.control.key].Review.Overallreview.Value = 0;
        // }
    }
    calculateScore() {
        var finalScore = 0;
        this.control.ratingdata.forEach(item => {
            const val = !isNaN(this.data[item.key]) ? this.data[item.key] : 0;
            finalScore = finalScore + ((item.weightage / 100) * val)
        })
        this.data[this.control.key] = finalScore.toFixed(1);
        this.cd.markForCheck();
    }
    save() {
        // let apiparam: any = {};

        // this.control.saveapiparams.forEach(option => {
        //     if (option.key == 'appid')
        //         apiparam[option.key] = this.appid;
        //     else
        //         apiparam[option.key] = option.value;
        // })
        // this._appService.post(this.control.saveapi, JSON.stringify(this.data[this.control.key]), apiparam)
        //     .subscribe((res: any) => {
        //         this.changeSuccessMessage('saved');
        //         this.data[this.control.key].Status = "in progress";
        //     },
        //         err => {
        //             console.log(err);
        //         },
        //         () => {
        //             //this.msg = "Post shared successfully";
        //             //console.log("done!")
        //         }
        //     );
    }
    submit(content) {
        // let url = this.control.submitapi;
        // this.modalService.open(content, this.options).result.then((result) => {
        //     if (this.Submitconfirm == "YES") {
        //         let apiparam: any = {};

        //         this.control.submitapiparams.forEach(option => {
        //             if (option.key == 'appid')
        //                 apiparam[option.key] = this.appid;
        //             else
        //                 apiparam[option.key] = option.value;
        //         })
        //         this._appService.post(url, JSON.stringify(this.data[this.control.key]), apiparam)
        //             .subscribe((res: any) => {
        //                 this.isReadOnly = true;
        //                 this.data[this.control.key].Status = "completed";
        //                 this.changeSuccessMessage('submitted');
        //             },
        //                 err => {
        //                     console.log(err);
        //                 },
        //                 () => {
        //                     //this.msg = "Post shared successfully";
        //                     //console.log("done!")
        //                 }
        //             );
        //     }
        //     else {
        //         this.Submitconfirm == "NO";
        //     }
        // });
    }
    changeSuccessMessage(text: string) {
        // this._success.next("Rating " + text + " Successfully.");
    }
    buttonState() {
        // var NoRate = this.data[this.control.key].Review.Detailreview.filter(x => x.Value == 0);
        // return NoRate.length > 0 ? true : false;
    }
}
