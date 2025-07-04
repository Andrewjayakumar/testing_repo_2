import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartOptionsComponent } from './chart-options.component';

describe('ChartOptionsComponent', () => {
  let component: ChartOptionsComponent;
  let fixture: ComponentFixture<ChartOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
