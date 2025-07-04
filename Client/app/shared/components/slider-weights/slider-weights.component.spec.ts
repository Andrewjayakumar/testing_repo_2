import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderWeightsComponent } from './slider-weights.component';

describe('SliderWeightsComponent', () => {
  let component: SliderWeightsComponent;
  let fixture: ComponentFixture<SliderWeightsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SliderWeightsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderWeightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
