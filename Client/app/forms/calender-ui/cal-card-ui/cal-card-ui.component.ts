declare var require;
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeStyle } from '@angular/platform-browser';
import { FormControlService } from '../../form-control.service';
import { Router, ActivatedRoute } from '@angular/router';
const _ = require('lodash');
// import { AuthService } from '../../../core/authservice/auth.service';
import { UUID } from "angular2-uuid";
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { DBkeys } from '../../../core/authservice/db-Keys';

@Component({
    selector: 'app-cal-card-ui',
    templateUrl: './cal-card-ui.component.html',
    styleUrls: ['./cal-card-ui.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalCardUiComponent implements OnInit {
    @Input() public index: any = 0;
    @Input() public data: any = {};
    @Input() public title: any = "";
    @Input() public image: any = "";
    @Input() public description: any = "";
    @Input() public mappingFields: any = [];
    @Input() public highlight: any = "";
    @Input() public highlighter: any = [];
    @Input() public skill: any = "";
    //@Input() public showheader: any = false;
    @Input() public sidebar: any = true;
    @Input() public control: any = {};
    @Input() public html: any = {};
    @Input() public AuthService: any;
    @Input() public ResultDisplayField: any = [];
    hide: false;
    _opened: boolean = false;
    isReadOnly: boolean = false;
    chartData: any
    metalCardField: any = {}

    BookmarkAction: any;
    InfoHighlighterClass: any;
    titleInitials: any
    constructor(
        private _sanitizer: DomSanitizer,
        public _controlService: FormControlService,
        private _router: Router,
        private route: ActivatedRoute,
        private localStorage: LocalStoreManager) {

    }
    ngOnInit() {
        if (this.control.cardtype === 'metalcard') {
          this.ResultDisplayField.forEach(item => {
                var arr:any = {};
                arr.key = item.DisplayName;
                arr.value = item.BindingField;
                arr.fieldtype = item.fieldtype;
                arr.webnametype = item.webnametype;
                arr.webicon = item.WebIcon;
                arr.oneline = item.oneline;
                if (item.BindingField) {
                  this.metalCardField[item.BindingField] = arr;
                 // console.log("Item 1", item.BindingField);
                 // console.log("Item 2", arr);

                }
            });
        } else {
            this.chartData = this.getchartData();
            this.BookmarkAction = this.getBookmarkAction();
            if (this.highlight) {
                this.InfoHighlighterClass = this.getInfoHighlighterClass();
            }
            this.titleInitials = this.getInitials(this.data[this.title.value], '');
        }
      //  debugger;
    }
    truncateStr(str, len) {
        if (!str) {
            return '-';
        } else if (str.length > len) {
            return str.substring(0, len) + '..';
        } else {
            return str;
        }
    }
    getchartData() {
        var chartData = []
        if (Array.isArray(this.control.chartapimapping) && this.control.enablechart) {
            this.control.chartapimapping.forEach(item => {
                var arr: any = {};
                if (item.label && item.bindingfield) {
                    arr.label = item.label;
                    arr.value = this.data[item.bindingfield] && typeof this.data[item.bindingfield] !== 'string' ? this.data[item.bindingfield] : 0;
                    chartData.push(arr);
                }
            })
        }
        return chartData;
    }
    getBackground(image) {
        if (image && this.data[image.value] && this.data[image.value] != '') {
            return this._sanitizer.bypassSecurityTrustStyle(`url(${this.data[image.value]})`);
        }
        else if (this.control.defaultcardimage) {
            return this._sanitizer.bypassSecurityTrustStyle(`url(` + this.control.defaultcardimage + `)`);
        }
        else {
            return '';
        }
    }
    getInitials(name, delimeter) {
        // debugger;
        if (name) {

            var array = name.toString().split(" ");

            switch (array.length) {

                case 1:
                    return array[0].charAt(0).toUpperCase();

                default:

                    return array[0].charAt(0).toUpperCase() + array[1].charAt(0).toUpperCase();
            }

        } else {
            return name;
        }

    }
    redirect(redirect) {

        this._router.navigate([redirect.redirecturl, this.data[redirect.redirectparam]], { relativeTo: this.route });//Open Form
    }
    redirectfromlink(event: any = null) {

        this._router.navigate([this.control.editcardurl, this.data[this.control.paramforredirect]], { relativeTo: this.route });//Open Form
    }
    deepcopy<T>(o: T): T {
        return JSON.parse(JSON.stringify(o));
    }
    safehtml(value) {
        return this._sanitizer.bypassSecurityTrustHtml(value);
    }
    PinDataModel() {
        if (this.control.enableactionlink) {
          //  debugger;
            var _dataModel: any = {}
            // this.control.advancesearchoutputfield.forEach(item => {
            //   _dataModel[item.outputfield] = this.data[item.outputfield];
            // });
            if (this._controlService.dataModel.filter(item => JSON.stringify(item) == JSON.stringify(this.data)).length == 0) {
                this._controlService.dataModel.push(this.data)
                //this.SavePinnedModel(_dataModel);
            } else {
                var _data = this.data;
                _.remove(this._controlService.dataModel, function (child) {
                    return child === _data;
                });
            }

            if (this.control.selectedarray) {
                let currentUrl = this._router.url ? this._router.url : "/";
                var menu = this.AuthService.Menu;
                var page = this._controlService.find(menu['Nav'], currentUrl.substring(1).split('?')[0]);
                let selectedItemsCopy = [];
                if (this.control.filterkey) {
                    selectedItemsCopy = this._controlService.dataModel.map(item => item[this.control.filterkey]);
                   
                } else
                    Object.assign(selectedItemsCopy, this._controlService.dataModel);

                //copy array into page variable
                if (page) {
                    page.Params.forEach(pagevariableObj => {
                        if (pagevariableObj.name == this.control.selectedarray) {
                            debugger;
                            pagevariableObj.value = selectedItemsCopy;
                        }
                    });

                    this.localStorage.saveSyncedSessionData(menu, DBkeys.Menu);
                }
            }
        }
    }
    isPinned() {
        var _dataModel: any = {}
        if (this._controlService.dataModel.length > 0) {
            //this.control.advancesearchoutputfield.forEach(item => {
            //  _dataModel[item.outputfield] = this.data[item.outputfield];
            //});
            return this._controlService.dataModel.filter(item => JSON.stringify(item) == JSON.stringify(this.data)).length > 0;
        } else {
            return false;
        }
    }
    isHighlighterTitleonHover(highlighter: any) {
        const value = this.data[highlighter.value] ? this.data[highlighter.value] : 0; //3,0,2
        var Title: boolean = true;
        highlighter.highlighterprop.forEach(item => {
            if (Title === true) {
                switch (item.condition) {
                    case '=':
                        if (value.toString() == item.value.toString())
                            Title = item.showtitleonhover;
                        break;
                    case '<>':
                        if (value.toString() != item.value.toString())
                            Title = item.showtitleonhover;
                        break;
                    case '>':
                        if (parseFloat(value) > parseFloat(item.value))
                            Title = item.showtitleonhover;
                        break;
                    case '>=':
                        if (parseFloat(value) >= parseFloat(item.value))
                            Title = item.showtitleonhover;
                        break;
                    case '<':
                        if (parseFloat(value) < parseFloat(item.value))
                            Title = item.showtitleonhover;
                        break;
                    case '<=':
                        if (parseFloat(value) <= parseFloat(item.value))
                            Title = item.showtitleonhover;
                        break;
                    case 'between':
                        if (this.isBetween(parseFloat(value), item.value))
                            Title = item.showtitleonhover;
                        break;
                }
            }
        })
        return Title;
    }
    getHighlighterTitle(highlighter: any) {
        const value = this.data[highlighter.value] ? this.data[highlighter.value] : 0; //3,0,2
        var Title: any = null;
        highlighter.highlighterprop.forEach(item => {
            // console.log(highlighter.webnametype + " - " + this.data[this.title.value] + " - " + value + " " + item.value + " " + item.condition + " " + item.Title);
            if (!Title) {
                switch (item.condition) {
                    case '=':
                        if (value.toString() == item.value.toString())
                            Title = item.title;
                        break;
                    case '<>':
                        if (value.toString() != item.value.toString())
                            Title = item.title;
                        break;
                    case '>':
                        if (parseFloat(value) > parseFloat(item.value))
                            Title = item.title;
                        break;
                    case '>=':
                        if (parseFloat(value) >= parseFloat(item.value))
                            Title = item.title;
                        break;
                    case '<':
                        if (parseFloat(value) < parseFloat(item.value))
                            Title = item.title;
                        break;
                    case '<=':
                        if (parseFloat(value) <= parseFloat(item.value))
                            Title = item.title;
                        break;
                    case 'between':
                        if (this.isBetween(parseFloat(value), item.value))
                            Title = item.title;
                        break;
                }
            }
        })
        return Title;
    }
    getHighlighterClass(highlighter: any) {
        const value = this.data[highlighter.value] ? this.data[highlighter.value] : 0; //3,0,2
        var classname = 'text-light';
        highlighter.highlighterprop.forEach(item => {
            // console.log(highlighter.webnametype + " - " + this.data[this.title.value] + " - " + value + " " + item.value + " " + item.condition);
            if (classname == 'text-light') {
                switch (item.condition) {
                    case '=':
                        if (value.toString() == item.value.toString())
                            classname = item.classname;
                        break;
                    case '<>':
                        if (value.toString() != item.value.toString())
                            classname = item.classname;
                        break;
                    case '>':
                        if (parseFloat(value) > parseFloat(item.value))
                            classname = item.classname;
                        break;
                    case '>=':
                        if (parseFloat(value) >= parseFloat(item.value))
                            classname = item.classname;
                        break;
                    case '<':
                        if (parseFloat(value) < parseFloat(item.value))
                            classname = item.classname;
                        break;
                    case '<=':
                        if (parseFloat(value) <= parseFloat(item.value))
                            classname = item.classname;
                        break;
                    case 'between':
                        if (this.isBetween(parseFloat(value), item.value))
                            classname = item.classname;
                        break;
                }
            }
        })
        return classname;
    }
    getInfoHighlighterClass() {
        const value = this.data[this.highlight.value] ? this.data[this.highlight.value] : 0; //3,0,2
        var classname = '';
        if (this.highlight.infohighlighterprop) {
            this.highlight.infohighlighterprop.forEach(item => {
                if (classname == 'bg-primary') {
                    switch (item.condition) {
                        case '=':
                            if (value == item.value)
                                classname = item.classname;
                            break;
                        case '<>':
                            if (value != item.value)
                                classname = item.classname;
                            break;
                        case '>':
                            if (value > item.value)
                                classname = item.classname;
                            break;
                        case '>=':
                            if (value >= item.value)
                                classname = item.classname;
                            break;
                        case '<':
                            if (value < item.value)
                                classname = item.classname;
                            break;
                        case '<=':
                            if (value <= item.value)
                                classname = item.classname;
                            break;
                        case 'between':
                            if (this.isBetween(value, item.value))
                                classname = item.classname;
                            break;
                    }
                }
            })
        }
        return classname;
    }
    isBetween(value, condition) {
        var val = condition.split('-');
        if (val.length == 2) {
            if (val[0] < value && val[1] > value) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
    getCustomAction() {
        return this.control.CustomAction.length > 0 ? this.control.CustomAction.filter(item => item.ActionType != 'bookmark') : null;
    }
    getBookmarkAction() {
        return this.control.CustomAction.length > 0 ? this.control.CustomAction.filter(item => item.ActionType == 'bookmark') : null;
    }
    addbookmark(action) {
        // debugger;
        let currentUrl = action.RedirectUrl;
        var menu = this.AuthService.Menu;

        var page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
        if (page) {
            page.Params.forEach(item => {
                if (item.name == action.PrimaryKey) {
                    item.value = this.data[action.PrimaryKey];
                }
            })

            var item = {
                "id": UUID.UUID(),
                "url": page.Url,
                "title": this.data[action.titlebinding] ? this.data[action.titlebinding] : page.Title,
                "subtitle": this.data[action.subtitlebinding] != 'undefined' && this.data[action.subtitlebinding] != null ? this.data[action.subtitlebinding] : action.subtitlebinding,
                "icon": action.WebIcon ? action.WebIcon : "",
                "params": page.Params
            };

            this.AuthService.AddtoBookmark(item);
        }
    }
    removebookmark(action) {
        // debugger;
        var itembookmarked;
        const currentUrl = action.RedirectUrl;
        // const menu = this.auth.Menu;
        // const bookmark = this.localStorage.getDataObject<any>(DBkeys.BookMarklist);
        // const page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
        if (this.AuthService.bookmark) {
            this.AuthService.bookmark.forEach(item => {
                const param = item.params.find(x => x.name === action.PrimaryKey && x.value === this.data[action.PrimaryKey]);
                if (param) {
                    itembookmarked = item;
                }
            })
        }
        if (itembookmarked) {
            this.AuthService.RemoveBookmark(itembookmarked);
        }
    }
    isbookmarked(action) {
        var isbookmarked = false;
        const currentUrl = action.RedirectUrl;
        // const menu = this.auth.Menu;
        const bookmark = this.AuthService.bookmark ? this.AuthService.bookmark.filter(x => x.url == currentUrl.substring(1)) : [];
        // const page = this._controlService.find(menu['Nav'], currentUrl.substring(1));
        if (bookmark) {
            bookmark.forEach(item => {
                const param = item.params.find(x => x.name === action.PrimaryKey && x.value == this.data[action.PrimaryKey]);
                if (param) {
                    isbookmarked = true;
                }
            })
        }
        return isbookmarked;
    }
}
