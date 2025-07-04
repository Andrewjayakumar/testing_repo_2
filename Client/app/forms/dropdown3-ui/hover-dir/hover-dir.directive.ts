import { ContentChild, Directive, ElementRef, OnInit } from '@angular/core';
import { NgSelectComponent } from "@ng-select/ng-select";

@Directive({
selector: '[appHoverDir]'
})

export class HoverDirDirective implements OnInit {

@ContentChild(NgSelectComponent) select: NgSelectComponent;

@ContentChild(NgSelectComponent, { read: ElementRef }) selectNative: ElementRef;

/**
 * @inheritDoc
 */
ngOnInit() {
    if (!this.select) {
        return;
    }
    const nativeElement = this.selectNative.nativeElement;
    nativeElement.addEventListener("mouseover", function() {
        const listOfValueElements = nativeElement.querySelectorAll('.ng-value-label');
        const title = listOfValueElements.length > 0 ? listOfValueElements[0].innerText : "";
        const listOfPickedElements = nativeElement.querySelectorAll('.ng-input');
        listOfPickedElements.forEach((el) => {
            el.setAttribute('title', title ? title : el.innerText);
        })

        const listOfAvailableOptions = nativeElement.querySelectorAll('.ng-dropdown-panel-items.scroll-host .ng-option.ng-option-marked');
        listOfAvailableOptions.forEach((v) => {
            v.setAttribute('title', v.innerText)
        })

    })
}
}
