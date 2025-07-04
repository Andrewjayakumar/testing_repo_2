import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MetalSwitchComponent } from './metal-switch.component';

describe('MetalSwitchComponent', () => {
  let component: MetalSwitchComponent;
  let fixture: ComponentFixture<MetalSwitchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MetalSwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MetalSwitchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
