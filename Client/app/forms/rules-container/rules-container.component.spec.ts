import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesContainerComponent } from './rules-container.component';

describe('RulesContainerComponent', () => {
  let component: RulesContainerComponent;
  let fixture: ComponentFixture<RulesContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
