import { Directive, ElementRef, Input, Renderer, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: 'video[vidpreview]'
})
export class VidPreviewDirective {

  @Input() video: any;

    constructor(private el?: ElementRef, private renderer?: Renderer) { }

    ngOnChanges(changes: SimpleChanges) {
        let reader = new FileReader();
        let el = this.el;

        reader.onloadend = function (e) {
            el.nativeElement.src = reader.result;
        };

        if (this.video) {
            return reader.readAsDataURL(this.video);
        }

    }

}
