import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientdetailRightComponent } from './clientdetail-right.component';

describe('ClientdetailRightComponent', () => {
  let component: ClientdetailRightComponent;
  let fixture: ComponentFixture<ClientdetailRightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientdetailRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientdetailRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
