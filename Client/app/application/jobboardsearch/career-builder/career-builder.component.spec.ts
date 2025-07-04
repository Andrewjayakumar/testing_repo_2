import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerBuilderComponent } from './career-builder.component';

describe('CareerBuilderComponent', () => {
  let component: CareerBuilderComponent;
  let fixture: ComponentFixture<CareerBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareerBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
