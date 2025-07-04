import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormControlService } from '../form-control.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EmbedVideoService } from 'ngx-embed-video';

@Component({
    selector: 'app-website-ui',
    templateUrl: './website-ui.component.html',
    styleUrls: ['./website-ui.component.scss']
})
export class WebsiteUiComponent implements OnInit {
    @Input() public data: any;
    @Input() public control: any;
    @Input() public formGroup: FormGroup;
    @Input() public access: string = 'write';

    public control_id = null;
    videoUrl: any = { html: "", data: "" };
    InvalidVideoMsg: string = "";
    constructor(public _controlService: FormControlService, public embedService: EmbedVideoService, private sanitizer: DomSanitizer) { }

    ngOnInit() {
        this.parseVideo(this.data[this.control.key]);
        this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
    }
    isImagebyExt(fileName: string = "") {
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
    parseVideo(url: string) {
       //this.videoUrl = null;
        var type = null;
        if (!url || url == '')
            return type;

        var match = url.match(/(http:\/\/|https:\/\/|)(player.|www.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com))\/(video\/|embed\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/);
        if (match && Array.isArray(match)) {
            if (match[3].indexOf('youtu') > -1) {
                //let videoid = _url.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/);
                //if (videoid != null)
                //    this.videoUrl = "http://youtube.com/embed/" + videoid[1] + "?rel=0";
                type = "youtube";
                if (this.videoUrl.data != this.data[this.control.key]) {
                    var data = this.data[this.control.key] ? this.data[this.control.key].split('&')[0] : "";
                    this.getHtml(data);
                }
            } else if (match[3].indexOf('vimeo') > -1) {
                //let videoid = _url.match(/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_\-]+)?/i);
                //if (videoid)
                //    this.videoUrl = "http://player.vimeo.com/video/" + videoid[1] + "?rel=0";
                type = "vimeo";
                if (this.videoUrl.data != this.data[this.control.key])
                    this.getHtml(this.data[this.control.key]);
            }
        }
        return type;
    }
    getHtml(data) {
        try {
            this.InvalidVideoMsg = "";
            this.videoUrl.data = this.data[this.control.key]
            this.videoUrl.html = this.data[this.control.key] != '' ? this.sanitizer.bypassSecurityTrustHtml(this.embedService.embed(data)) : "";
        }
        catch (ex) {
            this.InvalidVideoMsg = "Invalid video link."
            this.videoUrl.html = "";
        }
    }
}
