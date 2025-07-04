import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicformcontrollsComponent } from './dynamicformcontrolls.component';

describe('DynamicformcontrollsComponent', () => {
  let component: DynamicformcontrollsComponent;
  let fixture: ComponentFixture<DynamicformcontrollsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicformcontrollsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicformcontrollsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
