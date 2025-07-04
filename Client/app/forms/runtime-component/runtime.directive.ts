import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appRuntime]'
})
export class RuntimeDirective {

    constructor(public viewcontainerRef: ViewContainerRef) {

    }

}
