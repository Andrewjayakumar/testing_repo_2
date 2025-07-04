import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appPhoneMask]'
})
export class PhoneMaskDirective {
  @Input('appPhoneMask') hasValue: boolean;

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    if (this.hasValue) {
      const phoneValue = event.target.value.replace(/\D/g, '');
      
      if (phoneValue.length <= 3) {
        event.target.value = phoneValue.replace(/^(\d{0,3})/, '($1');
      } else if (phoneValue.length <= 6) {
        event.target.value = phoneValue.replace(/^(\d{0,3})(\d{0,3})/, '($1) $2');
      } else {
        event.target.value = phoneValue.replace(/^(\d{0,3})(\d{0,3})(.*)/, '($1) $2-$3');
      }
    }
  }
}


