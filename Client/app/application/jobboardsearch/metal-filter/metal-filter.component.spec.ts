import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalFilterComponent } from './metal-filter.component';

describe('MetalFilterComponent', () => {
  let component: MetalFilterComponent;
  let fixture: ComponentFixture<MetalFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetalFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetalFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
