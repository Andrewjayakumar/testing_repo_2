import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicformInitComponent } from './dynamicform-init.component';

describe('DynamicformInitComponent', () => {
  let component: DynamicformInitComponent;
  let fixture: ComponentFixture<DynamicformInitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynamicformInitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicformInitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
