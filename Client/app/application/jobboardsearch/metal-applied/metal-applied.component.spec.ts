import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalAppliedComponent } from './metal-applied.component';

describe('MetalAppliedComponent', () => {
  let component: MetalAppliedComponent;
  let fixture: ComponentFixture<MetalAppliedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetalAppliedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetalAppliedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
