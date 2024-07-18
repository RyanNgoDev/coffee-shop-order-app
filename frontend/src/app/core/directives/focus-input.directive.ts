import {AfterContentInit, Directive,ElementRef} from '@angular/core'
  
@Directive({
    selector:'autofocus'
})
export class AutoFocus implements AfterContentInit{
  
    constructor(
        private elementRef: ElementRef
    ){}
  
    ngAfterContentInit(): void {
        this.elementRef.nativeElement.focus();
    }
}