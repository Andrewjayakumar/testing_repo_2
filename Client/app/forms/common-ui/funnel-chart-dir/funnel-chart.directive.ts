declare var require;
import { Directive, ElementRef, OnInit, Input, AfterViewChecked, OnDestroy } from '@angular/core';
const D3Funnel = require('d3-funnel');

@Directive({
  selector: '[FunnelChart]'
})
export class FunnelChartDirective implements OnInit, AfterViewChecked, OnDestroy {
  @Input() data: any;
  constructor(private el?: ElementRef) { }
  ngOnInit() {

  }
  chart: any
  ngOnDestroy() {
    if (this.chart) {
      this.chart.destroy();
    }
  }
  ngAfterViewChecked() {
    // const isSafari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);
    const userAgent = typeof navigator !== 'undefined' && navigator.userAgent || '';
    const isSafari = /Safari\//.test(userAgent) && !/(Chrome\/|Android\s)/.test(userAgent);
    const options = {
      chart: {
        height: 130,
        width: 130,
        bottomWidth: 1 / 2,
        curve: {
          enabled: true,
          height: 10
        }
      },
      block: isSafari ? {
        // dynamicHeight: true,
        minHeight: 25,
        fill: {
          scale: ['#4385d0', '#a6c9ef', '#7dbe6b', '#c1dfb9']
        }
      } : {
          // dynamicHeight: true,
          minHeight: 25,
          fill: {
            type: 'gradient',
            scale: ['#4385d0', '#a6c9ef', '#7dbe6b', '#c1dfb9']
          }
        },
      label: {
        fontSize: '10px',
        fill: '#000',
        fontFamily: '"Reem Kufi", open sans',
      }
    };
    if (this.data && this.el.nativeElement.id) {
      this.chart = new D3Funnel('#' + this.el.nativeElement.id);
      this.chart.draw(this.data, options);
    }
  }
}
