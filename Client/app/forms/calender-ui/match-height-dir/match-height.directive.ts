import {
  Directive, ElementRef, AfterViewChecked,
  Input, HostListener
} from '@angular/core';

@Directive({
  selector: '[matchHeight]'
})
export class MatchHeightDirective implements AfterViewChecked {

  @Input()
  matchHeight: string;

  constructor(private el?: ElementRef) {
  }

  ngAfterViewChecked() {
    this.matchHeightfn(this.el.nativeElement, this.matchHeight);
  }

  matchHeightfn(parent: HTMLElement, className: string) {
    // match height logic here

    if (!parent) return;

   
    const children = parent.getElementsByClassName(className);

    if (!children) return;

   
    const itemHeights = Array.from(children)
      .map(x => x.getBoundingClientRect().height);

   
    const maxHeight = itemHeights.reduce((prev, curr) => {
      return curr > prev ? curr : prev;
    }, 0);

   
    //Array.from(children)
    //  .forEach((x: HTMLElement) => x.style.height = `${maxHeight}px`);

    this.el.nativeElement.style.minHeight = `${maxHeight+20}px`;
  }
  @HostListener('window:resize')
  onResize() {
    this.matchHeightfn(this.el.nativeElement, this.matchHeight);
  }
  
}
