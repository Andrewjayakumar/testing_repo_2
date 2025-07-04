import { Directive, ElementRef } from '@angular/core';
declare var $: any;
@Directive({
  selector: '.shSliderDri'
})
export class SwipeSliderDirective {

  constructor(private elementRef?: ElementRef) { }

  ngOnInit() {
    const el = this.elementRef.nativeElement;
    $(document).ready(function () {
      var balt = $(el).children('.shSliderRow');
      var slideOuter = $(el).children();
      var slide = $(el).children().children('.shSlide');
      var noOfDot = slide.length / 4;
      //if (noOfDot % 4 != 0) {
      //  noOfDot = (noOfDot/4) + 1;
      //} else {
        //noOfDot = noOfDot/4
      //}
      //noOfDot = Math.round(noOfDot);
      $(el).prepend('<div class="dots d-flex justify-content-center"></div>');
      for (var i = 0; i < noOfDot; i++) {
        $(el).children('.dots').append('<span data-id="' + i + '"></span>');
      }
      $(el).children('.dots').children('span').eq(0).addClass('active');
      $(el).children('.dots').children('span').click(function () {
        var width = balt.width();
        var slideNo = $(this).data('id');
        var slideOffset = width * slideNo;
        $(el).children('.dots').children('span').removeClass('active');
        $(this).addClass('active');
        slideOuter.css('left', -slideOffset);
      });
    });    
  }

}
