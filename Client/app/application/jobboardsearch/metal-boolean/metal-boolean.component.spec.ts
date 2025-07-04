import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalBooleanComponent } from './metal-boolean.component';

describe('MetalBooleanComponent', () => {
  let component: MetalBooleanComponent;
  let fixture: ComponentFixture<MetalBooleanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetalBooleanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetalBooleanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
