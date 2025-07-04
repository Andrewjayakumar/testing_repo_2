import { PipeTransform, Pipe } from '@angular/core';
const _ = require('lodash');
import { FormControlService } from '../../../forms/form-control.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Pipe({ name: 'highlight' })
export class HighlightPipe implements PipeTransform {
  constructor(private _formservice: FormControlService, private _sanitizer: DomSanitizer) {

  }

  transform(_data: any, args: any): any {
    debugger;
      _data = _data.changingThisBreaksApplicationSecurity;

    var _data = !Array.isArray(_data) ? this._formservice.deepcopy(_data.toString().trim()) : _.map(_data).join(', ');


    if (args) {
      args.forEach((item) => {
        if (typeof item === "string" && item && item.trim() !== '' && _data) {
          item = item.replace('”', '');
          item = item.replace('“', '');
          item = item.replace(/"/g, '');
          // item = item.replace('*', '');
          if (item.indexOf("*") > -1) {
            try {
              var matched = _data.match(new RegExp("\\b(" + item.trim().replace("*", "\\w*)\\b"), 'gi'));
              if (matched && matched.length > 0) {
                matched = _.uniqBy(matched);
                matched.forEach(_match => {
                  _data = _data.replace(new RegExp("\\b(" + _match.trim() + ")\\b", 'gi'), match => {
                    return '<mark>' + match.trim() + '</mark>';
                  });
                })
              }
            } catch (e) {

            }
          } else {
            try {
              if (item.trim() !== '' && _data.match(new RegExp("\\b(" + item.trim() + ")\\b", 'gi'))) {
                _data = _data.replace(new RegExp("\\b(" + item.trim() + ")\\b", 'gi'), match => {
                  return '<mark>' + match.trim() + '</mark>';
                });
              } else if (item.trim() !== '' && _data.match(new RegExp(item.trim() + "(?:$|\W)", 'gi'))) {
                _data = _data.replace(new RegExp(item.trim() + "(?:$|\W)", 'gi'), match => {
                  return '<mark>' + match.trim() + '</mark>';
                });
              } else if (item.trim() !== '' && _data.match(new RegExp('(?:^|)' + item.trim() + '(?:$|)', 'gi'))) {
                _data = _data.replace(new RegExp('(?:^|\\W)' + item.trim() + '(?:$|\\W)', 'gi'), match => {
                  return '<mark>' + match.trim() + '</mark>';
                });
              }
            } catch (e) {
              try {
                if (item.trim() !== '' && _data.match(new RegExp(item.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "gi"))) {
                  _data = _data.replace(new RegExp(item.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), "gi"), match => {
                    return '<mark>' + match.trim() + '</mark>';
                  });
                }
              } catch (e) {
              }
            }
          }
        } else if (item.value && item.value.trim() !== '' && _data) {
          try {
            _data = _data.replace(new RegExp("\\b(" + item.value.trim() + ")\\b", 'gi'), match => {
              return '<mark>' + match.trim() + '</mark>';
            });
          } catch (e) {

          }
        }
      })
    }
    
    if (_data && typeof _data == "string" && _data.indexOf("<style") > 0 && _data.indexOf("<style") < _data.indexOf("</style>")) {
      _data = _data.replace(_data.substring(_data.indexOf("<style"), _data.indexOf("</style>") + 8), "");
    }
   
    return this._sanitizer.bypassSecurityTrustHtml(_data);

  }
}
