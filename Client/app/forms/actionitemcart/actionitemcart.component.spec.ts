import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionitemcartComponent } from './actionitemcart.component';

describe('ActionitemcartComponent', () => {
  let component: ActionitemcartComponent;
  let fixture: ComponentFixture<ActionitemcartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActionitemcartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionitemcartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
