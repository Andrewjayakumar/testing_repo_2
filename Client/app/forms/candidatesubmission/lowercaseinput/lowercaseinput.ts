import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appLowercaseInput]'
})
export class LowercaseInputDirective {
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const input = this.el.nativeElement as HTMLInputElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;

    input.value = input.value.toLowerCase();

    // Preserve cursor position
    console.log('Directive called');
    input.setSelectionRange(start, end);
  }
}
