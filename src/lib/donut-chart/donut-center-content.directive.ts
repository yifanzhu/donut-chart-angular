import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ngDonutCenterContent]'
})
export class DonutCenterContentDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
